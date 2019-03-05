import { ISchema } from '../interfaces';

export interface IServiceCall {
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IServiceCallArgs {
  handler?: any;
  schema?: any;
}

export class ServiceCall implements IServiceCall {
  schema: any = {};

  async handler(): Promise<any> {}

  constructor(args?: IServiceCallArgs) {
    if (args && args.handler !== undefined) {
      this.handler = args.handler;
    }
    if (args && args.schema !== undefined) {
      this.schema = args.schema;
    }
  }
}
