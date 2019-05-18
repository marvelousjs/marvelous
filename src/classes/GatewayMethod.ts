import { IGatewaySchema } from '../interfaces';

export interface IGatewayMethod {
  handler: () => Promise<any>;
  schema: IGatewaySchema;
}

export interface IGatewayMethodArgs {
  handler?: () => Promise<any>;
  schema?: IGatewaySchema;
}

export class GatewayMethod implements IGatewayMethod {
  schema: IGatewaySchema = {};

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
