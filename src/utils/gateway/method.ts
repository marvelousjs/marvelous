import { ISchema } from '../../interfaces';

export interface IGatewayMethod {
  context: any;
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IGatewayMethodArgs {
  context?: any;
  handler?: any;
  schema?: any;
}

export class GatewayMethod implements IGatewayMethod {
  context: any = {};
  schema: any = {};

  async handler(): Promise<any> {}

  constructor(args?: IGatewayMethodArgs) {
    if (args && args.context !== undefined) {
      this.context = args.context;
    }
    if (args && args.handler !== undefined) {
      this.handler = args.handler;
    }
    if (args && args.schema !== undefined) {
      this.schema = args.schema;
    }
  }
}
