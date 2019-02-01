import { ISchema } from '../interfaces';

export interface IAction {
  context: any;
  handler: Function;
  schema: {
    request: ISchema;
    response: ISchema;
  };
}

export interface IActionArgs {
  context?: any;
  handler?: any;
  schema?: any;
}

export class Action implements IAction {
  context: any = {};
  schema: any = {};

  async handler(): Promise<any> {}

  constructor(args?: IActionArgs) {
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
