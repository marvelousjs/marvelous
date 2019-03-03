import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Express } from 'express';
import * as http from 'http';
import * as url from 'url';

import { configs } from '../../configs';
import { loadHandler } from '..';

interface IRpcServerOpts {
  actions?: any;
  environment?: string;
  enableLogging?: boolean;
  knownErrors?: { new(): Error }[];
  onLoad?: Function;
  onStart?: Function;
  onStop?: Function;
  schemas?: any;
  url?: string;
}

export class RpcServer {
  actions: any = {};
  context: any = {};
  express: Express;
  listener: http.Server;

  onLoad: Function;
  onStart: Function;
  onStop: Function;

  environment = process.env.NODE_ENV;
  enableLogging = false;
  knownErrors: { new(): Error }[] = [];
  schemas: any = {};
  url = configs.url || 'http://localhost:5000';

  constructor(opts?: IRpcServerOpts) {
    if (opts && opts.actions !== undefined) {
      this.actions = opts.actions;
    }
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
    if (opts && opts.schemas !== undefined) {
      this.schemas = opts.schemas;
    }
    if (opts && opts.knownErrors !== undefined) {
      this.knownErrors = opts.knownErrors;
    }
    if (opts && opts.url !== undefined) {
      this.url = opts.url;
    }
  }

  setContext(context: any) {
    this.context = context;
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
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,PUT,DELETE,POST,OPTIONS');
        res.setHeader('Content-Type', 'application/json');
        next();
      });

      this.express.get('/', (req, res) => {
        res.status(200).send({});
      });

      Object.keys(this.actions).forEach(functionName => {
        const action = this.actions[functionName];

        this.express.post(
          `/${functionName}`,
          async (req: express.Request, res: express.Response) => {
            let response: any;
            let statusCode: number;

            try {
              const handler = loadHandler(action);
              response = await handler(req.body);
              statusCode = 200;

            } catch (error) {
              // known error
              if (this.knownErrors.find(knownError => error instanceof knownError)) {
                response = {
                  name: error.name,
                  message: error.message
                };
                statusCode = 400;
              // unknown error
              } else {
                response = {
                  name: 'UnknownError',
                  message: 'Server encountered an unexpected error'
                };
                statusCode = 500;

                console.log('INTERNAL ERROR -', error);
              }
            }

            res.status(statusCode).send(response);
          }
        );
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
