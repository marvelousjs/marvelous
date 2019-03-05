import { ServiceError } from '../classes/ServiceError';

export class ValidationServiceError extends ServiceError {
  name = 'ValidationServiceError';
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
