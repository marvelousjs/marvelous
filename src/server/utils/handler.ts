import * as validator from 'is-my-json-valid';
import { Request, Response } from 'express';

export interface IHandlerOpts {
  enableLogging?: boolean;
  onComplete?: Function;
}

export function handler(fn: Function, schemas: any, opts: IHandlerOpts) {
  return async (req: Request, res: Response) => {
    try {
      const functionName = req.url.slice(1);

      // get request
      const request = req.body;

      // validate request
      if (schemas && schemas.request) {
        const validateRequest = validator(schemas.request);
        const requestIsValid = validateRequest(request);
        if (!requestIsValid) {
          const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
            validateRequest.errors[0].message
          }`;
          throw new Error(`Invalid Request for ${functionName}: ${errorMessage}`);
        }
      }

      // get reponse
      const response = await fn(request);

      if (opts.enableLogging) {
        console.log(response);
      }

      // validate response
      if (schemas && schemas.response) {
        const validateResponse = validator(schemas.response);
        const responseIsValid = validateResponse(response);
        if (!responseIsValid) {
          const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
            validateResponse.errors[0].message
          }`;
          throw new Error(`Invalid Response for ${functionName}: ${errorMessage}`);
        }
      }

      // handle successful response
      res.status(200).send(response);
    } catch (error) {
      const code = error.code || 500;
      const message = error.message || 'Internal server error';

      // get response
      const response = {
        type: error.type,
        message
      };

      if (opts.enableLogging) {
        console.log(response);
      }

      // handle error response
      res.status(code).send(response);
    }

    if (opts.onComplete) {
      await opts.onComplete();
    }
  };
}
