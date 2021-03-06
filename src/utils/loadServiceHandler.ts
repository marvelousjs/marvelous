import * as validator from 'is-my-json-valid';

import { ValidationServiceError } from '../errors';
import { PhoneFormat, UuidFormat } from '../formats';
import { removeEmpty } from './removeEmpty';

export interface ILoadServiceHandlerOpts {
  enableLogging?: boolean;
}

export function loadServiceHandler(callClass: any, opts: ILoadServiceHandlerOpts = {}) {
  const call = typeof callClass === 'function' ? new callClass() : callClass;

  return async (request: any = {}) => {
    if (opts.enableLogging) {
      console.log('REQUEST - ', request);
    }

    // validate request
    if (call.schema && call.schema.request) {
      const validateRequest = validator(call.schema.request as any, {
        formats: { phone: PhoneFormat, uuid: UuidFormat },
      });
      const requestIsValid = validateRequest(request);
      if (!requestIsValid) {
        const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
          validateRequest.errors[0].message
        }`;
        throw new ValidationServiceError(`Invalid Request: ${errorMessage}`);
      }
    }

    // get reponse
    const response = removeEmpty(await call.handler(request));

    if (opts.enableLogging) {
      console.log('RESPONSE - ', response);
    }

    // validate response
    if (call.schema && call.schema.response) {
      const validateResponse = validator(call.schema.response as any, {
        formats: { phone: PhoneFormat, uuid: UuidFormat },
      });
      const responseIsValid = validateResponse(response);
      if (!responseIsValid) {
        const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
          validateResponse.errors[0].message
        }`;
        throw new ValidationServiceError(`Invalid Response: ${errorMessage}`);
      }
    }

    return response;
  };
}
