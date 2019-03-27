import { GatewayError } from '../classes/GatewayError';

export class ValidationGatewayError extends GatewayError {
  name = 'ValidationGatewayError';
  message = 'Validation failed.';
  statusCode = 400;
  constructor(message?: string) {
    super(message);
    if (message) {
      this.message = message;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
