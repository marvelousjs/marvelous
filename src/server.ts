import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Express } from 'express';
import * as http from 'http';
import * as url from 'url';

import { configs } from './configs';

import { IHandlerOpts, handler } from './utils';

interface IServerOpts {
  environment?: string;
  enableLogging?: boolean;
  functions?: any;
  onLoad?: Function;
  onStart?: Function;
  onStop?: Function;
  schemas?: any;
  url?: string;
}

export * from './interfaces';

export class Server {
  context: any = {};
  express: Express;
  listener: http.Server;

  onLoad: Function;
  onStart: Function;
  onStop: Function;

  environment = process.env.NODE_ENV;
  enableLogging = false;
  schemas: any = {};
  url = configs.url || 'http://localhost:5000';

  functions: any = {};

  constructor(opts?: IServerOpts) {
    if (opts && opts.environment !== undefined) {
      this.environment = opts.environment;
    }
    if (opts && opts.enableLogging !== undefined) {
      this.enableLogging = opts.enableLogging;
    }
    if (opts && opts.functions !== undefined) {
      this.functions = opts.functions;
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
    if (opts && opts.url !== undefined) {
      this.url = opts.url;
    }
  }

  setContext(context: any) {
    this.context = context;
    
    // check if functions have been added to handlers
    Object.keys(this.functions).forEach(functionName => {
      const self = this as any;
      if (!self[functionName] === undefined) {
        throw new Error(`${functionName} has not been added to "Server" class`);
      }
      // bind handler to function
      self.functions[functionName] = self.functions[functionName].bind(this);
    });
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

      const handlerOpts: IHandlerOpts = {
        enableLogging: this.enableLogging
      };

      Object.keys(this.functions).forEach(functionName => {
        const self = this as any;
        this.express.post(
          `/${functionName}`,
          handler(self.functions[functionName], self.schemas[functionName], handlerOpts)
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
