import * as validator from 'is-my-json-valid';

export interface IHandler {
  (
    callback: Function,
    schemas: any,
    context: any,
    opts?: IHandlerRequestOpts,
  ): IHandlerResponse;
}

export interface IHandlerRequest {
  callback: Function;
  schemas: any;
  context: any;
  opts?: IHandlerRequestOpts;
}

export interface IHandlerRequestOpts {
  context?: any;
  enableLogging?: boolean;
  onComplete?: Function;
}

export interface IHandlerResponse {
  (request: any): Promise<any>;
}

export const handler: IHandler = (
  callback = async () => {},
  schemas = {},
  context = {},
  opts = {}
) => {
  return async (request: any = {}) => {
    if (opts.enableLogging) {
      console.log('REQUEST - ', request);
    }

    // validate request
    if (schemas && schemas.request) {
      const validateRequest = validator(schemas.request);
      const requestIsValid = validateRequest(request);
      if (!requestIsValid) {
        const errorMessage = `"${validateRequest.errors[0].field.replace(/^data\./, '')}" ${
          validateRequest.errors[0].message
        }`;
        throw new Error(`Invalid Request: ${errorMessage}`);
      }
    }

    // get reponse
    const response = await callback({
      context,
      request
    });

    if (opts.enableLogging) {
      console.log('RESPONSE - ', response);
    }

    // validate response
    if (schemas && schemas.response) {
      const validateResponse = validator(schemas.response);
      const responseIsValid = validateResponse(response);
      if (!responseIsValid) {
        const errorMessage = `"${validateResponse.errors[0].field.replace(/^data\./, '')}" ${
          validateResponse.errors[0].message
        }`;
        throw new Error(`Invalid Response: ${errorMessage}`);
      }
    }

    return response;
  };
}
