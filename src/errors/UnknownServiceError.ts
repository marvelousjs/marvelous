import { ServiceError } from '../classes/ServiceError';

export class UnknownServiceError extends ServiceError {
  name = 'UnknownServiceError';
  message = 'Unknown error.';
  constructor(message?: string) {
    super(message);
    if (message) {
      this.message = message;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
