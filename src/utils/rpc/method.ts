import { ISchema } from '../../interfaces';

export interface IRpcMethod {
  context: any;
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IRpcMethodArgs {
  context?: any;
  handler?: any;
  schema?: any;
}

export class RpcMethod implements IRpcMethod {
  context: any = {};
  schema: any = {};

  async handler(): Promise<any> {}

  constructor(args?: IRpcMethodArgs) {
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
