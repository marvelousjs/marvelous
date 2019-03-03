export class AuthError extends Error {
  code = 'auth';
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
