import { GatewayError, NotFoundGatewayError } from '@marvelousjs/gateway-errors';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Express, Request, Response } from 'express';
import * as http from 'http';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { AddressInfo } from 'net';
import * as path from 'path';
import * as url from 'url';
import { v4 as uuidv4 } from 'uuid';

import { configs } from '../configs';
import { getCurl } from '../functions';
import { loadGatewayHandler } from '../utils';

import { GatewayContentType } from './GatewayContentType';
import { GatewayRoute, IGatewayRoute } from './GatewayRoute';

interface IGatewayOpts {
  environment?: string;
  enableLogging?: boolean;
  onLoad?: Function;
  onLog?: (res: IGatewayOnLog) => Promise<void>;
  onStart?: Function;
  onStop?: Function;
  routes?: ({ new (): GatewayRoute } | IGatewayRoute)[];
  tokenExpiresIn?: number;
  tokenSecret?: string;
  url?: string;
}

interface IGatewayOnLog {
  curl: string;
  duration: number;
  errorMessage?: string;
  httpVersion: string;
  method: string;
  path: string;
  port: number;
  query: string;
  requestBody: string;
  requestHeaders: string[];
  responseBody: string;
  responseHeaders: string[];
  statusCode: number;
  statusMessage: string;
}

interface IRequest extends Request {
  token: string;
  user: any;
}

export class Gateway {
  environment = process.env.NODE_ENV;
  express: Express;
  listener: http.Server;
  routes: ({ new (): GatewayRoute } | IGatewayRoute)[] = [];
  tokenExpiresIn = 15 * 60;
  tokenSecret =
    this.environment === 'test' || this.environment === 'development'
      ? 'faec406e-e5e3-49de-b497-fd531cb05045'
      : process.env.MARVELOUS_JWT_SECRET
      ? process.env.MARVELOUS_JWT_SECRET
      : uuidv4();
  user: any = {};

  onLoad: Function;
  onLog: (res: IGatewayOnLog) => Promise<void>;
  onStart: Function;
  onStop: Function;

  enableLogging = false;
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
    if (opts && opts.onLog !== undefined) {
      this.onLog = opts.onLog;
    }
    if (opts && opts.onStart !== undefined) {
      this.onStart = opts.onStart;
    }
    if (opts && opts.onStop !== undefined) {
      this.onStop = opts.onStop;
    }
    if (opts && opts.tokenExpiresIn !== undefined) {
      this.tokenExpiresIn = opts.tokenExpiresIn;
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
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,PUT,DELETE,POST,OPTIONS,HEAD');
        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Content-Type', GatewayContentType.Json);

        Object.defineProperty(req, 'user', {
          get: () => {
            return this.user;
          },
          set: (payload = {}) => {
            const jwtOpts: jwt.SignOptions = {};
            if (!payload.exp && this.tokenExpiresIn) {
              jwtOpts.expiresIn = this.tokenExpiresIn;
            }
            req.token = jwt.sign(payload, this.tokenSecret, jwtOpts);
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
          (this.express as any)[method](route.uri, async (req: IRequest, res: Response) => {
            const startTime = +new Date;

            let errorMessage: string;
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
              errorMessage = error.message;

              // known error
              if (error instanceof GatewayError) {
                response = {
                  body: {
                    name: error.name,
                    message: error.message,
                    description: error.description
                  }
                };
                statusCode = error.statusCode;
              } else {
                response = {
                  body: {
                    name: 'InternalServerError',
                    message: 'Internal Server Error. Please try again.',
                    description: `The server has encountered a situation it doesn't know how to handle.`
                  }
                };
                statusCode = 500;

                console.log('INTERNAL GATEWAY ERROR -', error);
              }
            }

            res.status(statusCode).send(response.body);

            if (this.onLog) {
              const addressInfo = this.listener.address() as AddressInfo;

              this.onLog({
                curl: getCurl(req, addressInfo),
                duration: +new Date - startTime,
                errorMessage,
                httpVersion: req.httpVersion,
                method: req.method,
                path: req.path,
                port: (this.listener.address() as AddressInfo).port,
                query: Object.entries(req.query).map(([key, value]) => `${key}=${value}`).join('&'),
                requestBody: JSON.stringify(req.body),
                requestHeaders: Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`),
                responseBody: JSON.stringify(response.body),
                responseHeaders: Object.entries(res.getHeaders()).map(([key, value]) => `${key}: ${value}`),
                statusCode,
                statusMessage: res.statusMessage
              });
            }
          });
        });
      });

      this.express.use((req, res, next) => {
        const startTime = +new Date;

        const statusCode = 404;
        const notFoundGatewayError = new NotFoundGatewayError();
        const responseBody = {
          name: notFoundGatewayError.name,
          message: notFoundGatewayError.message,
          description: notFoundGatewayError.description
        };

        res.status(404).send(responseBody);

        if (this.onLog) {
          const addressInfo = this.listener.address() as AddressInfo;

          this.onLog({
            curl: getCurl(req, addressInfo),
            duration: +new Date - startTime,
            errorMessage: notFoundGatewayError.message,
            httpVersion: req.httpVersion,
            method: req.method,
            path: req.path,
            port: (this.listener.address() as AddressInfo).port,
            query: Object.entries(req.query).map(([key, value]) => `${key}=${value}`).join('&'),
            requestBody: JSON.stringify(req.body),
            requestHeaders: Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`),
            responseBody: JSON.stringify(responseBody),
            responseHeaders: Object.entries(res.getHeaders()).map(([key, value]) => `${key}: ${value}`),
            statusCode,
            statusMessage: res.statusMessage
          });
        }
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
