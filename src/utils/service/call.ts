import { ISchema } from '../../interfaces';

export interface IServiceCall {
  context: any;
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IServiceCallArgs {
  context?: any;
  handler?: any;
  schema?: any;
}

export class ServiceCall implements IServiceCall {
  context: any = {};
  schema: any = {};

  async handler(): Promise<any> {}

  constructor(args?: IServiceCallArgs) {
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
