import * as validator from 'is-my-json-valid';

import { ValidationError } from '../../errors';

export interface ILoadGatewayHandlerOpts {
  enableLogging?: boolean;
}

export function loadGatewayHandler(operationClass: any, opts: ILoadGatewayHandlerOpts = {}) {
  const operation = new operationClass();

  return async (request: any = {}) => {
    if (opts.enableLogging) {
      console.log('REQUEST - ', request);
    }

    // validate request
    if (operation.schema && operation.schema.request) {
      const validateRequest = validator(operation.schema.request as any);
      const requestIsValid = validateRequest(request.body);
      if (!requestIsValid) {
        const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
          validateRequest.errors[0].message
        }`;
        throw new ValidationError(`Invalid Request: ${errorMessage}`);
      }
    }

    // get reponse
    const response = await operation.handler(request);

    if (opts.enableLogging) {
      console.log('RESPONSE - ', response);
    }

    // validate response
    if (operation.schema && operation.schema.response) {
      const validateResponse = validator(operation.schema.response as any);
      const responseIsValid = validateResponse(response.body);
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
