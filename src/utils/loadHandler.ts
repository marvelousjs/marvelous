import * as validator from 'is-my-json-valid';

import { ValidationError } from '../errors';

export interface ILoadHandlerOpts {
  enableLogging?: boolean;
}

export function loadHandler(callClass: any, opts: ILoadHandlerOpts = {}) {
  const call = new callClass();

  return async (request: any = {}) => {
    if (opts.enableLogging) {
      console.log('REQUEST - ', request);
    }

    // validate request
    if (call.schema && call.schema.request) {
      const validateRequest = validator(call.schema.request as any);
      const requestIsValid = validateRequest(request);
      if (!requestIsValid) {
        const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
          validateRequest.errors[0].message
        }`;
        throw new ValidationError(`Invalid Request: ${errorMessage}`);
      }
    }

    // get reponse
    const response = await call.handler(request);

    if (opts.enableLogging) {
      console.log('RESPONSE - ', response);
    }

    // validate response
    if (call.schema && call.schema.response) {
      const validateResponse = validator(call.schema.response as any);
      const responseIsValid = validateResponse(response);
      if (!responseIsValid) {
        const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
          validateResponse.errors[0].message
        }`;
        throw new ValidationError(`Invalid Response: ${errorMessage}`);
      }
    }

    return response;
  };
}
