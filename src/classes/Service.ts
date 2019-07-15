import * as bodyParser from 'body-parser';
import { CronJob } from 'cron';
import * as express from 'express';
import { Express } from 'express';
import * as http from 'http';
import * as url from 'url';

import { configs } from '../configs';
import { loadServiceHandler } from '../utils';
import { ServiceJob } from './ServiceJob';

interface IServiceOpts {
  calls?: any;
  environment?: string;
  enableLogging?: boolean;
  jobs?: { new(): ServiceJob }[];
  onLoad?: Function;
  onStart?: Function;
  onStop?: Function;
  url?: string;
}

export class Service {
  calls: any = {};
  jobs: { new(): ServiceJob }[] = [];
  express: Express;

  jobListeners: CronJob[];
  listener: http.Server;

  onLoad: Function;
  onStart: Function;
  onStop: Function;

  environment = process.env.NODE_ENV;
  enableLogging = false;
  url = configs.url || 'http://localhost:5000';

  constructor(opts?: IServiceOpts) {
    if (opts && opts.calls !== undefined) {
      this.calls = opts.calls;
    }
    if (opts && opts.environment !== undefined) {
      this.environment = opts.environment;
    }
    if (opts && opts.enableLogging !== undefined) {
      this.enableLogging = opts.enableLogging;
    }
    if (opts && opts.jobs !== undefined) {
      this.jobs = opts.jobs;
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
        res.setHeader('Content-Type', 'application/json');
        if ('OPTIONS' === req.method) {
          res.status(200).send();
        } else {
          next();
        }
      });

      this.express.get('/', (req, res) => {
        res.status(200).send({});
      });

      Object.keys(this.calls).forEach(functionName => {
        const call = this.calls[functionName];

        this.express.post(
          `/${functionName}`,
          async (req: express.Request, res: express.Response) => {
            let response: any;
            let statusCode: number;

            try {
              const handler = loadServiceHandler(call);
              response = await handler(req.body);
              statusCode = 200;

            } catch (error) {
              response = {
                name: error.name,
                message: error.message
              };
              statusCode = 400;
            }

            res.status(statusCode).send(response);
          }
        );
      });

      this.express.use((req, res, next) => {
        res.status(400).send({
          name: 'NotFoundServiceError',
          message: 'Call not found.'
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

      // create jobs
      const jobs = this.jobs.map(Job => new Job());
      
      // add job listeners if cron is defined
      this.jobListeners = jobs
        .filter(job => !!job.cron)
        .map(job => new CronJob(job.cron, job.handler, null, true, 'America/Chicago'));

      // fire some jobs immediately
      jobs
        .filter(job => job.shouldFireImmediately)
        .forEach(job => job.handler());
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

      this.jobListeners.forEach((cronJob) => {
        cronJob.stop();
      });
    });
  }
}
