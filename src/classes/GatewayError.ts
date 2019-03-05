export class GatewayError extends Error {
  code = 500;
  name = 'GatewayError';
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
