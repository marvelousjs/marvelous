export class ServiceError extends Error {
  name = 'ServiceError';
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
