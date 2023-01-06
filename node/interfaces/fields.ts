export interface fields {
  fieldName: string;
  fieldLabel: string;
  fieldNameBackend: string;
  lengthOfField: string;
  typeOfField: string;
  validation: string[];
}
export interface requestFields {
  parentModuleName: string;
  newModuleName: string;
  componentName: string;
  fields: fields[];
  serviceMethodName: string;
  tableName: string;
  tableNameForTransaction: string;
}
