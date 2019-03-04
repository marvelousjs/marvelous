import { ISchema } from '../../interfaces';

export interface IGatewayPath {
  context: any;
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IGatewayPathArgs {
  context?: any;
  handler?: any;
  schema?: any;
}

export class GatewayPath implements IGatewayPath {
  context: any = {};
  schema: any = {};

  async handler(): Promise<any> {}

  constructor(args?: IGatewayPathArgs) {
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
