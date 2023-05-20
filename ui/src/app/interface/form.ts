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
export interface IFormData {
  fetTech: string;
  backTech: string;
  component: IModule[];
  selectedOption: string;
}
