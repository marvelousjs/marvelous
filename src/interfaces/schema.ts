export interface ISchema {
  async?: boolean;
  pattern?: string;
  required?: boolean | string[];
  return?: string;
  enum?: any[];
  type: 'array' | 'boolean' | 'null' | 'number' | 'object' | 'string';
  properties?: {
    [key: string]: ISchema;
  };
  additionalProperties?: ISchema | boolean;
  items?: ISchema | boolean;
  anyOf?: ISchema[];
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
  format?:
    | 'alpha'
    | 'alphanumeric'
    | 'color'
    | 'date'
    | 'date-time'
    | 'email'
    | 'hostname'
    | 'ip-address'
    | 'ipv6'
    | 'phone'
    | 'style'
    | 'time'
    | 'uri'
    | 'utc-millisec'
    | 'uuid';
}

export interface IGatewaySchema {
  request?: IGatewayRequestSchema;
  response?: IGatewayResponseSchema;
}

export interface IGatewayRequestSchema {
  body?: ISchema;
  headers?: ISchema;
  params?: ISchema;
  query?: ISchema;
}

export interface IGatewayResponseSchema {
  body?: ISchema;
  headers?: ISchema;
}

export interface IServiceSchema {
  request?: ISchema;
  response?: ISchema;
}

export interface IServiceRequestSchema extends ISchema {}

export interface IServiceResponseSchema extends ISchema {}