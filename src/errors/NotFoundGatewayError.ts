import { GatewayError } from '../classes/GatewayError';

export class NotFoundGatewayError extends GatewayError {
  name = 'NotFoundGatewayError';
  message = 'Not found.';
  statusCode = 404;
  constructor(message?: string) {
    super(message);
    if (message) {
      this.message = message;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
