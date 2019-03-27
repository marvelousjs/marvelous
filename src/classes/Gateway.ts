import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Express } from 'express';
import * as http from 'http';
import * as session from 'express-session';
import * as url from 'url';

import { configs } from '../configs';
import { loadGatewayHandler } from '../utils';

import { GatewayRoute } from './GatewayRoute';
import { GatewayContentType } from './GatewayContentType';

interface IGatewayOpts {
  environment?: string;
  enableLogging?: boolean;
  knownErrors?: { new(): Error }[];
  onLoad?: Function;
  onStart?: Function;
  onStop?: Function;
  routes?: { new(): GatewayRoute }[];
  url?: string;
}

export class Gateway {
  express: Express;
  listener: http.Server;
  routes: { new(): GatewayRoute }[] = [];

  onLoad: Function;
  onStart: Function;
  onStop: Function;

  environment = process.env.NODE_ENV;
  enableLogging = false;
  knownErrors: { new(): Error }[] = [];
  url = configs.url || 'http://localhost:5000';

  constructor(opts?: IGatewayOpts) {
    if (opts && opts.environment !== undefined) {
      this.environment = opts.environment;
    }
    if (opts && opts.enableLogging !== undefined) {
      this.enableLogging = opts.enableLogging;
    }
    if (opts && opts.onLoad !== undefined) {
      this.onLoad = opts.onLoad;
    }
    if (opts && opts.onStart !== undefined) {
      this.onStart = opts.onStart;
    }
    if (opts && opts.onStop !== undefined) {
      this.onStop = opts.onStop;
    }
    if (opts && opts.knownErrors !== undefined) {
      this.knownErrors = opts.knownErrors;
    }
    if (opts && opts.url !== undefined) {
      this.url = opts.url;
    }
  }

  async load(cb?: Function) {
    if (cb) {
      await cb();
    }
    if (this.onLoad) {
      await this.onLoad();
    }
  }

  async start(cb?: Function) {
    return new Promise(resolve => {
      this.express = express();

      this.express.use(bodyParser.json({ limit: '50mb' }));
      this.express.use((req, res, next) => {
        const origin = req.get('origin');
        if (origin) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,PUT,DELETE,POST,OPTIONS,HEAD');
        next();
      });
      this.express.use(session({
        secret: '6ff70bff-aed3-42c1-acf5-74a63ea5e008',
        resave: false,
        saveUninitialized: true
      }));

      this.express.get('/', (req, res) => {
        res.status(200).send({});
      });

      this.routes.forEach((Route: any) => {
        const route: GatewayRoute = new Route();
        Object.keys(route.methods).forEach(method => {
          const operation = (route.methods as any)[method];
          (this.express as any)[method](
            route.uri,
            async (req: express.Request, res: express.Response) => {
              let response: any;
              let statusCode: number;
              
              try {
                const handler = loadGatewayHandler(operation);
                response = await handler(req);
                statusCode = response.statusCode || 200;
                if (response.contentType) {
                  res.setHeader('Content-Type', response.contentType);
                } else {
                  res.setHeader('Content-Type', GatewayContentType.Json);
                }

              } catch (error) {
                // known error
                if (this.knownErrors.find(knownError => error instanceof knownError)) {
                  response = {
                    body: {
                      name: error.name,
                      message: error.message
                    }
                  };
                  statusCode = error.statusCode || 400;
                // unknown error
                } else {
                  response = {
                    body: {
                      name: 'UnknownGatewayError',
                      message: 'Server encountered an unexpected error'
                    }
                  };
                  statusCode = 500;

                  console.log('INTERNAL GATEWAY ERROR -', error);
                }
              }

              res.status(statusCode).send(response.body);
            }
          );
        });
      });

      this.express.use((req, res, next) => {
        res.status(404).send({
          name: 'NotFoundGatewayError',
          message: 'Call not found'
        });
      });

      const serverUrl = url.parse(this.url);

      this.listener = this.express.listen(
        parseInt(serverUrl.port, 10),
        serverUrl.hostname,
        async (...args: any[]) => {
          resolve.apply(args);
          if (cb) {
            await cb.apply(args);
          }
          if (this.onStart) {
            await this.onStart.apply(args);
          }
        }
      );
    });
  }

  async stop(cb?: Function) {
    return new Promise(resolve => {
      this.listener.close(async (...args: any[]) => {
        resolve.apply(args);
        if (cb) {
          await cb.apply(args);
        }
        if (this.onStop) {
          await this.onStop.apply(args);
        }
      });
    });
  }
}
