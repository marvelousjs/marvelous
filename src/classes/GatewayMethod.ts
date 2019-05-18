import { IGatewaySchema } from '../interfaces';

export interface IGatewayMethod {
  handler: () => Promise<any>;
  schema: IGatewayMethodSchema;
}

interface IGatewayMethodSchema {
  request?: IGatewaySchema;
  response?: IGatewaySchema;
}

export interface IGatewayMethodArgs {
  handler?: () => Promise<any>;
  schema?: IGatewayMethodSchema;
}

export class GatewayMethod implements IGatewayMethod {
  schema: IGatewayMethodSchema = {};

  async handler(): Promise<any> {}

  constructor(args?: IGatewayMethodArgs) {
    if (args && args.handler !== undefined) {
      this.handler = args.handler;
    }
    if (args && args.schema !== undefined) {
      this.schema = args.schema;
    }
  }
}
