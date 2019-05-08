export interface ISchema {
  async?: boolean;
  pattern?: string;
  required?: boolean;
  return?: string;
  type?: string;
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
}

export interface IGatewaySchema {
  body?: ISchema;
  headers?: ISchema;
  params?: ISchema;
}

export interface IServiceSchema extends ISchema {
}