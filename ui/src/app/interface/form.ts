export interface IField {
  fieldName: string;
  fieldLabel: string;
  fieldNameBackend: string;
  lengthOfField: number;
  typeOfField: string;
  validation: string[];
}
export interface IModule {
  parentModuleName: string;
  newModuleName: string;
  componentName: string;
  serviceMethodName: string;
  tableName: string;
  typeOfOpration: string;
  tableNameForTransaction: string;
  fields: IField[];
}
