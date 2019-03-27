import { GatewayError } from '../classes/GatewayError';

export class UnknownGatewayError extends GatewayError {
  name = 'UnknownGatewayError';
  message = 'Unknown error.';
  statusCode = 500;
  constructor(message?: string) {
    super(message);
    if (message) {
      this.message = message;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
