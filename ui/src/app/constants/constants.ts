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
  { id: 1, validationName: 'Required' },
  { id: 2, validationName: 'Email' },
  { id: 3, validationName: 'Max-Length' },
  { id: 4, validationName: 'Only Number Allowed' },
  { id: 5, validationName: 'Spaces Not Allowed' },
  { id: 6, validationName: 'Max-Length For Decimal No' },
  { id: 7, validationName: 'Only Positive Numbers' },
];

export const componentTypes = [
  { id: 1, type: 'Add' },
  { id: 2, type: 'Edit' },
  { id: 3, type: 'List' },
  { id: 4, type: 'Home' },
  { id: 5, type: 'Login' },
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
