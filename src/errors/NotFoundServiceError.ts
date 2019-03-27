import { ServiceError } from '../classes/ServiceError';

export class NotFoundServiceError extends ServiceError {
  name = 'NotFoundServiceError';
  message = 'Not found.';
  constructor(message?: string) {
    super(message);
    if (message) {
      this.message = message;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
