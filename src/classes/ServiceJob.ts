export interface IServiceJob {
  cron?: string;
  handler: Function;
}

export interface IServiceJobArgs {
  cron?: string;
  handler?: any;
}

export class ServiceJob implements IServiceJob {
  cron: string;

  async handler(): Promise<any> {}

  constructor(args?: IServiceJobArgs) {
    if (args && args.cron !== undefined) {
      this.cron = args.cron;
    }
    if (args && args.handler !== undefined) {
      this.handler = args.handler;
    }
  }
}
