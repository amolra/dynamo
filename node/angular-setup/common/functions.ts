import { BehaviorSubject, Observable } from 'rxjs';
import fs from 'fs';
import { fields } from '../../interfaces/fields';
export function insertServiceDependacies(
  appModuleFile: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const data = fs.readFileSync(appModuleFile).toString().split('\n');
  const moduleNameToInsert = 'HttpClient';
  if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) === -1) {
    const lastIndex = data
      .reverse()
      .findIndex((ele) => ele.includes('import {'));
    const lastModuleName = data[lastIndex].substr(
      data[lastIndex].indexOf('{') + 1,
      data[lastIndex].indexOf('}') - data[lastIndex].indexOf('{') - 1
    );
    console.log('lastModuleName', lastModuleName);
    data.splice(
      lastIndex,
      0,
      `import { Observable, of } from 'rxjs';
        import { HttpClient } from '@angular/common/http';
        import { map } from 'rxjs/operators';`
    );

    const lastIndexconstructor = data.findIndex((ele) =>
      ele.includes('constructor(')
    );
    const braceIndex = data[lastIndexconstructor].indexOf('(') + 1;
    // data.splice(lastIndexconstructor + 1, 0, `BrowserAnimationsModule,`);
    data[lastIndexconstructor] =
      data[lastIndexconstructor].slice(0, braceIndex) +
      `private httpClient: HttpClient,` +
      data[lastIndexconstructor].slice(braceIndex);
    data.reverse();
    const text = data.join('\n');
    // Display the file content
    fs.writeFileSync(appModuleFile, text, 'utf-8');
    subToReturn.next(true);
  }
  return subToReturn.asObservable();
}
export function createServiceFunction(
  appModuleFile: string,
  serviceMethodName: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const data = fs.readFileSync(appModuleFile).toString().split('\n');
  const moduleNameToInsert = '}';

  const lastIndex = data
    .reverse()
    .findIndex((ele) => ele.includes(moduleNameToInsert));

  data.splice(
    lastIndex + 1,
    0,
    `apiURL='http://localhost:4500/'
      public ${serviceMethodName}(${serviceMethodName}Obj:any): Observable<boolean> {
        const url = this.apiURL + '${serviceMethodName}';
        return this.httpClient
          .post<any>(url, {
            ...${serviceMethodName}Obj,
          })
          .pipe(map((data) => data.result));
      }`
  );

  data.reverse();
  const text = data.join('\n');
  // Display the file content
  fs.writeFileSync(appModuleFile, text, 'utf-8');
  subToReturn.next(true);

  return subToReturn.asObservable();
}
export function addConstructorInComponentFile(
  appModuleFile: string,
  componentName: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const data = fs.readFileSync(appModuleFile).toString().split('\n');
  const moduleNameToInsert =
    makeFirstCharUpperCase(componentName) + 'Component {';
  if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) !== -1) {
    const lastIndex = data
      .reverse()
      .findIndex((ele) => ele.includes(moduleNameToInsert));

    data.splice(
      lastIndex,
      0,
      `constructor() {

        }`
    );

    data.reverse();
    const text = data.join('\n');
    // Display the file content
    fs.writeFileSync(appModuleFile, text, 'utf-8');
    subToReturn.next(true);
  }
  return subToReturn.asObservable();
}
export function addServicesInComponentFile(
  appModuleFile: string,
  moduleName: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const data = fs.readFileSync(appModuleFile).toString().split('\n');
  const moduleNameToInsert = makeFirstCharUpperCase(moduleName) + 'Service';
  if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) === -1) {
    const lastIndex = data
      .reverse()
      .findIndex((ele) => ele.includes('import {'));
    const lastModuleName = data[lastIndex].substr(
      data[lastIndex].indexOf('{') + 1,
      data[lastIndex].indexOf('}') - data[lastIndex].indexOf('{') - 1
    );
    console.log('lastModuleName', lastModuleName);
    data.splice(
      lastIndex,
      0,
      `import { ${moduleNameToInsert} } from '../${moduleName}.service';`
    );

    const lastIndexconstructor = data.findIndex((ele) =>
      ele.includes('constructor(')
    );
    // data.splice(lastIndexconstructor + 1, 0, `BrowserAnimationsModule,`);
    const braceIndex = data[lastIndexconstructor].indexOf('(') + 1;
    data[lastIndexconstructor] =
      data[lastIndexconstructor].slice(0, braceIndex) +
      `public ${moduleName}Service: ${moduleNameToInsert},` +
      data[lastIndexconstructor].slice(braceIndex);
    data.reverse();
    const text = data.join('\n');
    // Display the file content
    fs.writeFileSync(appModuleFile, text, 'utf-8');
    subToReturn.next(true);
  }
  return subToReturn.asObservable();
}
export function makeFirstCharUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function addCustomValidatorInComponentFile(
  appModuleFile: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const data = fs.readFileSync(appModuleFile).toString().split('\n');
  const moduleNameToInsert = 'CustomValidators ';
  if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) === -1) {
    const lastIndex = data
      .reverse()
      .findIndex((ele) => ele.includes('import {'));
    const lastModuleName = data[lastIndex].substr(
      data[lastIndex].indexOf('{') + 1,
      data[lastIndex].indexOf('}') - data[lastIndex].indexOf('{') - 1
    );
    console.log('lastModuleName', lastModuleName);
    data.splice(
      lastIndex,
      0,
      `import {
        AbstractControl,
        AsyncValidatorFn,
        FormArray,
        FormBuilder,
        FormControl,
        FormGroup,
        ValidationErrors,
      } from '@angular/forms';
      import { CustomValidators } from 'src/app/common/custom-validator';`
    );

    data.reverse();
    const text = data.join('\n');
    // Display the file content
    fs.writeFileSync(appModuleFile, text, 'utf-8');
    subToReturn.next(true);
  }
  return subToReturn.asObservable();
}
export function createReactiveFormInComponentFile(
  appModuleFile: string,
  componentName: string,
  fields: fields[]
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const data = fs.readFileSync(appModuleFile).toString().split('\n');
  const moduleNameToInsert = 'constructor() {';
  if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) !== -1) {
    console.log('data', moduleNameToInsert);
    const lastIndex = data
      .reverse()
      .findIndex((ele) => ele.includes(moduleNameToInsert));
    let generateForm = `this.${componentName}Form = fb.group({`;
    fields.forEach((ele: fields) => {
      let validateData = ``;
      ele.validation.forEach((element: string) => {
        validateData += `CustomValidators.${element},`;
      });
      generateForm += `
            ${ele.fieldName}: new FormControl('', [
                ${validateData}
            ]),
        `;
    });
    generateForm += `});`;
    console.log('data', generateForm);
    data.splice(lastIndex, 0, `${generateForm}`);
    data.reverse();

    const text = data.join('\n');
    fs.writeFileSync(appModuleFile, text, 'utf-8');
    subToReturn.next(true);
  }
  return subToReturn.asObservable();
}
export function addDependaciesReactiveFormInComponentFile(
  appModuleFile: string,
  componentName: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const data = fs.readFileSync(appModuleFile).toString().split('\n');
  const moduleNameToInsert = 'constructor(';
  if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) !== -1) {
    const lastIndex = data
      .reverse()
      .findIndex((ele) => ele.includes(moduleNameToInsert));
    const formName = `${componentName}Form`;
    data.splice(
      lastIndex + 1,
      0,
      `${formName}: FormGroup;
    show=false;
    public get f():any {
        return this.${formName}.controls;
      }
      public triggerValidation(): boolean {
        this.${formName}.markAllAsTouched();
        return this.${formName}.valid ? true : false;
      }
      submit():void {
        if(this.triggerValidation() && this.${formName}.valid) {
            const ${componentName}Data = this.${formName}.value;
            this.${componentName}Service.${componentName}(${componentName}Data).subscribe((res)=>{
                this.show = res;
            });
        }
      }`
    );
    const braceIndex = data[lastIndex].indexOf('(') + 1;
    data[lastIndex] =
      data[lastIndex].slice(0, braceIndex) +
      `public fb: FormBuilder,` +
      data[lastIndex].slice(braceIndex);
    data.reverse();
    const text = data.join('\n');
    // Display the file content
    fs.writeFileSync(appModuleFile, text, 'utf-8');
    subToReturn.next(true);
  }
  return subToReturn.asObservable();
}
