// import * as validator from 'is-my-json-valid';
import { Request, Response } from 'express';

// import { Fn } from '.';

export interface IHandlerOpts {
  enableLogging?: boolean;
  onComplete?: Function;
}

export function handler(fn: Function, opts: IHandlerOpts) {
  return async (req: Request, res: Response) => {
    try {
      // const functionName = req.url.slice(1);

      // get request
      const request = req.body;

      // validate request
      // if (fn.validators && fn.validators.request) {
      //   const validateRequest = validator(fn.validators.request);
      //   const requestIsValid = validateRequest(request);
      //   if (!requestIsValid) {
      //     const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
      //       validateRequest.errors[0].message
      //     }`;
      //     throw new Error(`Invalid Request for ${functionName}: ${errorMessage}`);
      //   }
      // }

      // get reponse
      const response = await fn(request);

      if (opts.enableLogging) {
        console.log(response);
      }

      // validate response
      // if (fn.validators && fn.validators.response) {
      //   const validateResponse = validator(fn.validators.response);
      //   const responseIsValid = validateResponse(response);
      //   if (!responseIsValid) {
      //     const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
      //       validateResponse.errors[0].message
      //     }`;
      //     throw new Error(`Invalid Response for ${functionName}: ${errorMessage}`);
      //   }
      // }

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
