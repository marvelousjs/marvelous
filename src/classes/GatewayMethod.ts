import { ISchema } from '../interfaces';

export interface IGatewayMethod {
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IGatewayMethodArgs {
  handler?: any;
  schema?: any;
}

export class GatewayMethod implements IGatewayMethod {
  schema: any = {};

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
