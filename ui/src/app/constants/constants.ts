export const frontendFramework = [
  { id: 1, frameworkName: 'Angular' },
  { id: 2, frameworkName: 'React' },
  { id: 3, frameworkName: 'Vue' },
];

export const backendFramework = [
  { id: 1, frameworkName: 'NodeJS' },
  { id: 2, frameworkName: 'Php' },
  { id: 3, frameworkName: 'Java Spring Boot' },
  { id: 4, frameworkName: 'Python' },
  { id: 5, frameworkName: '.Net' },
];

export const frontendValidations = [
  { id: 1, validationName: 'required' },
  { id: 2, validationName: 'email' },
  { id: 3, validationName: 'maxLength' },
  { id: 4, validationName: 'onlyNumberAllowed' },
  { id: 5, validationName: 'spacesNotAllowed' },
  { id: 6, validationName: 'maxLengthForDecimalNo' },
  { id: 7, validationName: 'onlyPositiveNumbers' },
];

export const componentTypes = [
  { id: 1, type: 'ADD' },
  { id: 2, type: 'EDIT' },
  { id: 3, type: 'LIST' },
  { id: 4, type: 'HOME' },
  { id: 5, type: 'LOGIN' },
];

export interface IFieldDetails {
  id?: number;
  fieldNameFET: string;
  fieldNameBackend: string;
  lengthOfField: number;
  typeOfField: string;
  validation: number[];
}
export interface IApplicationDetails {
  frontendFramework: number;
  backendFramework: number;
  moduleName: string;
  componentName: string;
  componentType: number;
  fieldDetails: IFieldDetails[];
}
