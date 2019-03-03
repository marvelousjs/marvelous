import { ISchema } from '../../interfaces';

export interface IRpcAction {
  context: any;
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IRpcActionArgs {
  context?: any;
  handler?: any;
  schema?: any;
}

export class RpcAction implements IRpcAction {
  context: any = {};
  schema: any = {};

  async handler(): Promise<any> {}

  constructor(args?: IRpcActionArgs) {
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
