import { ServiceError } from '../classes/ServiceError';

export class ValidationServiceError extends ServiceError {
  name = 'ValidationServiceError';
  message = 'Validation failed.';
  constructor(message?: string) {
    super(message);
    if (message) {
      this.message = message;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
