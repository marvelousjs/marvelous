export class ValidationError extends Error {
  code = 'ValidationError';
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
