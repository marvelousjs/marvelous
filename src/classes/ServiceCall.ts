import { IServiceSchema } from '../interfaces';

export interface IServiceCall {
  handler: () => Promise<any>;
  schema: IServiceSchema;
}

export interface IServiceCallArgs {
  handler?: () => Promise<any>;
  schema?: IServiceSchema;
}

export class ServiceCall implements IServiceCall {
  schema: IServiceSchema = {};

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
