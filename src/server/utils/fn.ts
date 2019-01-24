interface IFnOpts {
    data: any;
    validators: IValidator;
}

interface IValidator {
    request?: any;
    response?: any;
}

export class Fn {
    data: any = {};
    validators: IValidator = {};

    constructor(opts?: IFnOpts) {
        if (opts && opts.data !== undefined) {
            this.data = opts.data;
        }
    }

    async handler(req?: any): Promise<any> {
        return new Promise(resolve => resolve);
    }
}