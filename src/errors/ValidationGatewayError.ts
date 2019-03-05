import { GatewayError } from '../classes/GatewayError';

export class ValidationGatewayError extends GatewayError {
  code = 400;
  name = 'ValidationGatewayError';
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
