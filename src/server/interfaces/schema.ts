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
}
