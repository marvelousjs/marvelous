import { UnprocessableEntityGatewayError } from '@marvelousjs/gateway-errors';
import * as validator from 'is-my-json-valid';
import { path } from 'ramda';

import { UuidFormat } from '../formats';

export interface ILoadGatewayHandlerOpts {
  enableLogging?: boolean;
}

export function loadGatewayHandler(operationClass: any, opts: ILoadGatewayHandlerOpts = {}) {
  const operation = typeof operationClass === 'function' ? new operationClass() : operationClass;

  return async (request: any = {}) => {
    if (opts.enableLogging) {
      console.log('REQUEST - ', request);
    }

    // validate request
    if (operation.schema && operation.schema.request) {
      if (operation.schema.request.body) {
        const validateRequest = validator(operation.schema.request.body as any, {
          formats: { uuid: UuidFormat },
          verbose: true
        });
        const requestIsValid = validateRequest(request.body);
        if (!requestIsValid) {
          const field = validateRequest.errors[0].field.replace(/^data\./, '');
          const message =
            validateRequest.errors[0].message === 'must be an enum value'
              ? `must be one of the following: ${path<any>(
                  (validateRequest.errors[0] as any).schemaPath,
                  operation.schema.request.body
                ).enum.join(', ')}`
              : validateRequest.errors[0].message === 'has less length than allowed'
              ? `should be at least ${
                  path<any>(
                    (validateRequest.errors[0] as any).schemaPath,
                    operation.schema.request.body
                  ).minLength
                } characters`
              : validateRequest.errors[0].message === 'has longer length than allowed'
              ? `should be no longer than ${
                  path<any>(
                    (validateRequest.errors[0] as any).schemaPath,
                    operation.schema.request.body
                  ).maxLength
                } characters`
              : validateRequest.errors[0].message;
          const errorMessage = `"${field}" ${message}`;
          throw new UnprocessableEntityGatewayError(errorMessage);
        }
      }

      if (operation.schema.request.headers) {
        const validateRequest = validator(operation.schema.request.headers as any, {
          formats: { uuid: UuidFormat }
        });
        const requestIsValid = validateRequest(request.headers);
        if (!requestIsValid) {
          const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
            validateRequest.errors[0].message
          }`;
          throw new UnprocessableEntityGatewayError(`Invalid Request Headers: ${errorMessage}`);
        }
      }

      if (operation.schema.request.params) {
        const validateRequest = validator(operation.schema.request.params as any, {
          formats: { uuid: UuidFormat }
        });
        const requestIsValid = validateRequest(request.params);
        if (!requestIsValid) {
          const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
            validateRequest.errors[0].message
          }`;
          throw new UnprocessableEntityGatewayError(`Invalid Request Params: ${errorMessage}`);
        }
      }

      if (operation.schema.request.query) {
        const validateRequest = validator(operation.schema.request.query as any, {
          formats: { uuid: UuidFormat }
        });
        const requestIsValid = validateRequest(request.query);
        if (!requestIsValid) {
          const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
            validateRequest.errors[0].message
          }`;
          throw new UnprocessableEntityGatewayError(`Invalid Request Query: ${errorMessage}`);
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
        const validateResponse = validator(operation.schema.response.body as any, {
          formats: { uuid: UuidFormat }
        });
        const responseIsValid = validateResponse(response.body);
        if (!responseIsValid) {
          const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
            validateResponse.errors[0].message
          }`;
          throw new Error(`Invalid Response Body: ${errorMessage}`);
        }
      }

      if (operation.schema.response.headers) {
        const validateResponse = validator(operation.schema.response.headers as any, {
          formats: { uuid: UuidFormat }
        });
        const responseIsValid = validateResponse(response.headers);
        if (!responseIsValid) {
          const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
            validateResponse.errors[0].message
          }`;
          throw new Error(`Invalid Response Headers: ${errorMessage}`);
        }
      }

      if (operation.schema.response.params) {
        const validateResponse = validator(operation.schema.response.params as any, {
          formats: { uuid: UuidFormat }
        });
        const responseIsValid = validateResponse(response.params);
        if (!responseIsValid) {
          const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
            validateResponse.errors[0].message
          }`;
          throw new Error(`Invalid Response Params: ${errorMessage}`);
        }
      }

      if (operation.schema.response.query) {
        const validateResponse = validator(operation.schema.response.query as any, {
          formats: { uuid: UuidFormat }
        });
        const responseIsValid = validateResponse(response.query);
        if (!responseIsValid) {
          const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
            validateResponse.errors[0].message
          }`;
          throw new Error(`Invalid Response Query: ${errorMessage}`);
        }
      }
    }

    return response;
  };
}
