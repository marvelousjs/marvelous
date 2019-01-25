export interface ISchema {
  [key: string]: ISchemaProperty;
}

export interface ISchemaProperty {
  async?: boolean;
  pattern?: string;
  required?: boolean;
  return?: string;
  type?: string;
  properties?: {
    [key: string]: ISchemaProperty;
  };
  additionalProperties?: ISchemaProperty | boolean;
  items?: ISchemaProperty | boolean;
  anyOf?: ISchemaProperty[];
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
}
