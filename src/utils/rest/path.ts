import { ISchema } from '../../interfaces';

export interface IRestPath {
  context: any;
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IRestPathArgs {
  context?: any;
  handler?: any;
  schema?: any;
}

export class RestPath implements IRestPath {
  context: any = {};
  schema: any = {};

  async handler(): Promise<any> {}

  constructor(args?: IRestPathArgs) {
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
