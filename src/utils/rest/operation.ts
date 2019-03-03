import { ISchema } from '../../interfaces';

export interface IRestOperation {
  context: any;
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IRestOperationArgs {
  context?: any;
  handler?: any;
  schema?: any;
}

export class RestOperation implements IRestOperation {
  context: any = {};
  schema: any = {};

  async handler(): Promise<any> {}

  constructor(args?: IRestOperationArgs) {
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
