import { ISchema } from '../../interfaces';

export interface IGatewayOperation {
  context: any;
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IGatewayOperationArgs {
  context?: any;
  handler?: any;
  schema?: any;
}

export class GatewayOperation implements IGatewayOperation {
  context: any = {};
  schema: any = {};

  async handler(): Promise<any> {}

  constructor(args?: IGatewayOperationArgs) {
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
