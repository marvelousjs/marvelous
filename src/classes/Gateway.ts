import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Express, Request, Response } from 'express';
import * as http from 'http';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import * as url from 'url';
import { v4 as uuid } from 'uuid';

import { configs } from '../configs';
import { loadGatewayHandler } from '../utils';

import { GatewayRoute, IGatewayRoute } from './GatewayRoute';
import { GatewayContentType } from './GatewayContentType';

interface IGatewayOpts {
  environment?: string;
  enableLogging?: boolean;
  knownErrors?: { new(): Error }[];
  onLoad?: Function;
  onStart?: Function;
  onStop?: Function;
  routes?: ({ new(): GatewayRoute } | IGatewayRoute)[];
  tokenSecret?: string;
  url?: string;
}

interface IRequest extends Request {
  token: string;
  user: any;
}

export class Gateway {
  environment = process.env.NODE_ENV;
  express: Express;
  listener: http.Server;
  routes: ({ new(): GatewayRoute } | IGatewayRoute)[] = [];
  tokenSecret = this.environment === 'test' || this.environment === 'development'
    ? 'faec406e-e5e3-49de-b497-fd531cb05045'
    : uuid();
  user: any = {};

  onLoad: Function;
  onStart: Function;
  onStop: Function;

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
    if (opts && opts.tokenSecret !== undefined) {
      this.tokenSecret = opts.tokenSecret;
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
      this.express.use(bodyParser.urlencoded({ extended: false }));
      this.express.use((req: IRequest, res, next) => {
        const origin = req.get('origin');
        if (origin) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,PUT,DELETE,POST,OPTIONS,HEAD');
        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Content-Type', GatewayContentType.Json);

        Object.defineProperty(req, 'user', {
          get: () => {
            return this.user;
          },
          set: (payload = {}) => {
            req.token = jwt.sign(payload, this.tokenSecret);
            this.user = payload;
          }
        });

        if (req.headers && req.headers.authorization) {
          try {
            req.user = jwt.verify(req.headers.authorization.split(' ')[1], this.tokenSecret);
          } catch (error) {
            req.user = {};
          }
        } else {
          req.user = {};
        }

        if ('OPTIONS' === req.method) {
          res.status(200).send();
        } else {
          next();
        }
      });

      this.express.get('/', (req, res) => {
        res.status(200).send({});
      });

      const swaggerFile = path.join(process.cwd(), 'swagger.json');
      if (fs.existsSync(swaggerFile)) {
        this.express.get('/swagger.json', (req, res) => {
          res.status(200).send(fs.readFileSync(swaggerFile, 'utf8'));
        });
      }

      this.routes.forEach((Route: any) => {
        const route: GatewayRoute = typeof Route === 'function' ? new Route() : Route;
        Object.keys(route.methods).forEach(method => {
          const operation = (route.methods as any)[method];
          (this.express as any)[method](
            route.uri,
            async (req: IRequest, res: Response) => {
              let response: any;
              let statusCode: number;
              
              try {
                const handler = loadGatewayHandler(operation);
                response = await handler(req);
                statusCode = response.statusCode || 200;
                if (response.headers) {
                  if (response.headers.contentType) {
                    res.setHeader('Content-Type', response.headers.contentType);
                  }
                }
                if (req.token) {
                  res.setHeader('Authorization', `Bearer ${req.token}`);
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
          message: 'Method not found.'
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
