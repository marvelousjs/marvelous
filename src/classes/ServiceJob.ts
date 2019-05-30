export interface IServiceJob {
  cron?: string;
  handler: Function;
  shouldFireImmediately: boolean;
}

export interface IServiceJobArgs {
  cron?: string;
  handler?: any;
  shouldFireImmediately?: boolean;
}

export class ServiceJob implements IServiceJob {
  cron: string;
  shouldFireImmediately = false;

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
