import * as validator from 'is-my-json-valid';

import { ValidationGatewayError } from '../errors';

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
      if (operation.schema.request.body) {
        const validateRequest = validator(operation.schema.request.body as any);
        const requestIsValid = validateRequest(request.body);
        if (!requestIsValid) {
          const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
            validateRequest.errors[0].message
          }`;
          throw new ValidationGatewayError(`Invalid Request Body: ${errorMessage}`);
        }
      }

      if (operation.schema.request.headers) {
        const validateRequest = validator(operation.schema.request.headers as any);
        const requestIsValid = validateRequest(request.headers);
        if (!requestIsValid) {
          const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
            validateRequest.errors[0].message
          }`;
          throw new ValidationGatewayError(`Invalid Request Headers: ${errorMessage}`);
        }
      }

      if (operation.schema.request.params) {
        const validateRequest = validator(operation.schema.request.params as any);
        const requestIsValid = validateRequest(request.params);
        if (!requestIsValid) {
          const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
            validateRequest.errors[0].message
          }`;
          throw new ValidationGatewayError(`Invalid Request Params: ${errorMessage}`);
        }
      }

      if (operation.schema.request.query) {
        const validateRequest = validator(operation.schema.request.query as any);
        const requestIsValid = validateRequest(request.query);
        if (!requestIsValid) {
          const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
            validateRequest.errors[0].message
          }`;
          throw new ValidationGatewayError(`Invalid Request Query: ${errorMessage}`);
        }
      }
    }

    // get reponse
    const response = await operation.handler(request);

    if (opts.enableLogging) {
      console.log('RESPONSE - ', response);
    }

    // validate response
    if (operation.schema && operation.schema.response) {
      if (operation.schema.response.body) {
        const validateResponse = validator(operation.schema.response.body as any);
        const responseIsValid = validateResponse(response.body);
        if (!responseIsValid) {
          const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
            validateResponse.errors[0].message
          }`;
          throw new ValidationGatewayError(`Invalid Response Body: ${errorMessage}`);
        }
      }

      if (operation.schema.response.headers) {
        const validateResponse = validator(operation.schema.response.headers as any);
        const responseIsValid = validateResponse(response.headers);
        if (!responseIsValid) {
          const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
            validateResponse.errors[0].message
          }`;
          throw new ValidationGatewayError(`Invalid Response Headers: ${errorMessage}`);
        }
      }

      if (operation.schema.response.params) {
        const validateResponse = validator(operation.schema.response.params as any);
        const responseIsValid = validateResponse(response.params);
        if (!responseIsValid) {
          const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
            validateResponse.errors[0].message
          }`;
          throw new ValidationGatewayError(`Invalid Response Params: ${errorMessage}`);
        }
      }

      if (operation.schema.response.query) {
        const validateResponse = validator(operation.schema.response.query as any);
        const responseIsValid = validateResponse(response.query);
        if (!responseIsValid) {
          const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
            validateResponse.errors[0].message
          }`;
          throw new ValidationGatewayError(`Invalid Response Query: ${errorMessage}`);
        }
      }
    }

    return response;
  };
}
