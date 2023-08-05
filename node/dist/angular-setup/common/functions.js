"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDependaciesReactiveFormInComponentFile = exports.createReactiveFormInComponentFile = exports.addCustomValidatorInComponentFile = exports.makeFirstCharUpperCase = exports.addServicesInComponentFile = exports.addConstructorInComponentFile = exports.createServiceFunction = exports.insertServiceDependacies = exports.importModules = exports.insertModuleDependancies = void 0;
const rxjs_1 = require("rxjs");
const fs_1 = __importDefault(require("fs"));
function insertModuleDependancies(appModuleFile, moduleNameToInsert, dataToInsert) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const data = fs_1.default.readFileSync(appModuleFile).toString().split('\n');
    //   const moduleNameToInsert = dataToInsert;
    if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) === -1) {
        const lastIndex = data
            .reverse()
            .findIndex((ele) => ele.includes('import {'));
        const lastModuleName = data[lastIndex].substr(data[lastIndex].indexOf('{') + 1, data[lastIndex].indexOf('}') - data[lastIndex].indexOf('{') - 1);
        console.log('lastModuleName', lastModuleName);
        data.splice(lastIndex, 0, dataToInsert);
        data.reverse();
        const text = data.join('\n');
        // Display the file content
        fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
        subToReturn.next(true);
    }
    return subToReturn.asObservable();
}
exports.insertModuleDependancies = insertModuleDependancies;
function importModules(appModuleFile, moduleNameToInsert, dataToInsert) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const data = fs_1.default.readFileSync(appModuleFile).toString().split('\n');
    console.log('data', data);
    //   const moduleNameToInsert = dataToInsert;
    if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) !== -1) {
        const lastIndex = data
            .reverse()
            .findIndex((ele) => ele.includes(moduleNameToInsert));
        const braceIndex = data[lastIndex].indexOf('[') + 1;
        data[lastIndex] =
            data[lastIndex].slice(0, braceIndex) +
                dataToInsert +
                data[lastIndex].slice(braceIndex);
        // data.splice(lastIndex, 0, dataToInsert);
        data.reverse();
        const text = data.join('\n');
        console.log('text', text);
        // Display the file content
        fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
        subToReturn.next(true);
    }
    return subToReturn.asObservable();
}
exports.importModules = importModules;
function insertServiceDependacies(appModuleFile) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const data = fs_1.default.readFileSync(appModuleFile).toString().split('\n');
    const moduleNameToInsert = 'HttpClient';
    if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) === -1) {
        const lastIndex = data
            .reverse()
            .findIndex((ele) => ele.includes('import {'));
        const lastModuleName = data[lastIndex].substr(data[lastIndex].indexOf('{') + 1, data[lastIndex].indexOf('}') - data[lastIndex].indexOf('{') - 1);
        console.log('lastModuleName', lastModuleName);
        data.splice(lastIndex, 0, `import { Observable, of } from 'rxjs';
        import { HttpClient } from '@angular/common/http';
        import { map } from 'rxjs/operators';`);
        const lastIndexconstructor = data.findIndex((ele) => ele.includes('constructor('));
        const braceIndex = data[lastIndexconstructor].indexOf('(') + 1;
        // data.splice(lastIndexconstructor + 1, 0, `BrowserAnimationsModule,`);
        data[lastIndexconstructor] =
            data[lastIndexconstructor].slice(0, braceIndex) +
                `private httpClient: HttpClient,` +
                data[lastIndexconstructor].slice(braceIndex);
        data.reverse();
        const text = data.join('\n');
        // Display the file content
        fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
        subToReturn.next(true);
    }
    return subToReturn.asObservable();
}
exports.insertServiceDependacies = insertServiceDependacies;
function createServiceFunction(appModuleFile, serviceMethodName, typeOfOpration) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const data = fs_1.default.readFileSync(appModuleFile).toString().split('\n');
    const moduleNameToInsert = '}';
    const lastIndex = data
        .reverse()
        .findIndex((ele) => ele.includes(moduleNameToInsert));
    if (typeOfOpration === 'List') {
        data.splice(lastIndex + 1, 0, `apiURL='http://localhost:4500/'
      public ${serviceMethodName}(): Observable<any> {
        const url = this.apiURL + '${serviceMethodName}';
        return this.httpClient
          .get<any>(url)
          .pipe(map((data) => data.result));
      }`);
    }
    else {
        data.splice(lastIndex + 1, 0, `apiURL='http://localhost:4500/'
      public ${serviceMethodName}(${serviceMethodName}Obj:any): Observable<boolean> {
        const url = this.apiURL + '${serviceMethodName}';
        return this.httpClient
          .post<any>(url, {
            ...${serviceMethodName}Obj,
          })
          .pipe(map((data) => data.result));
      }`);
    }
    data.reverse();
    const text = data.join('\n');
    // Display the file content
    fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
    subToReturn.next(true);
    return subToReturn.asObservable();
}
exports.createServiceFunction = createServiceFunction;
function addConstructorInComponentFile(appModuleFile, componentName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const data = fs_1.default.readFileSync(appModuleFile).toString().split('\n');
    const moduleNameToInsert = makeFirstCharUpperCase(componentName) + 'Component {';
    if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) !== -1) {
        const lastIndex = data
            .reverse()
            .findIndex((ele) => ele.includes(moduleNameToInsert));
        data.splice(lastIndex, 0, `constructor() {

        }`);
        data.reverse();
        const text = data.join('\n');
        // Display the file content
        fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
        subToReturn.next(true);
    }
    return subToReturn.asObservable();
}
exports.addConstructorInComponentFile = addConstructorInComponentFile;
function addServicesInComponentFile(appModuleFile, moduleName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const data = fs_1.default.readFileSync(appModuleFile).toString().split('\n');
    const moduleNameToInsert = makeFirstCharUpperCase(moduleName) + 'Service';
    if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) === -1) {
        const lastIndex = data
            .reverse()
            .findIndex((ele) => ele.includes('import {'));
        const lastModuleName = data[lastIndex].substr(data[lastIndex].indexOf('{') + 1, data[lastIndex].indexOf('}') - data[lastIndex].indexOf('{') - 1);
        console.log('lastModuleName', lastModuleName);
        data.splice(lastIndex, 0, `import { ${moduleNameToInsert} } from '../${moduleName}.service';`);
        const lastIndexconstructor = data.findIndex((ele) => ele.includes('constructor('));
        // data.splice(lastIndexconstructor + 1, 0, `BrowserAnimationsModule,`);
        const braceIndex = data[lastIndexconstructor].indexOf('(') + 1;
        data[lastIndexconstructor] =
            data[lastIndexconstructor].slice(0, braceIndex) +
                `public ${moduleName}Service: ${moduleNameToInsert},` +
                data[lastIndexconstructor].slice(braceIndex);
        data.reverse();
        const text = data.join('\n');
        console.log('text', text);
        // Display the file content
        fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
        subToReturn.next(true);
    }
    return subToReturn.asObservable();
}
exports.addServicesInComponentFile = addServicesInComponentFile;
function makeFirstCharUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.makeFirstCharUpperCase = makeFirstCharUpperCase;
function addCustomValidatorInComponentFile(appModuleFile) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const data = fs_1.default.readFileSync(appModuleFile).toString().split('\n');
    const moduleNameToInsert = 'CustomValidators ';
    if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) === -1) {
        const lastIndex = data
            .reverse()
            .findIndex((ele) => ele.includes('import {'));
        const lastModuleName = data[lastIndex].substr(data[lastIndex].indexOf('{') + 1, data[lastIndex].indexOf('}') - data[lastIndex].indexOf('{') - 1);
        console.log('lastModuleName', lastModuleName);
        data.splice(lastIndex, 0, `import {
        AbstractControl,
        AsyncValidatorFn,
        FormArray,
        FormBuilder,
        FormControl,
        FormGroup,
        ValidationErrors,
      } from '@angular/forms';
      import { CustomValidators } from 'src/app/common/custom-validator';`);
        data.reverse();
        const text = data.join('\n');
        // Display the file content
        fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
        subToReturn.next(true);
    }
    return subToReturn.asObservable();
}
exports.addCustomValidatorInComponentFile = addCustomValidatorInComponentFile;
function createReactiveFormInComponentFile(appModuleFile, componentName, fields, typeOfOpration) {
    const subToReturnC = new rxjs_1.BehaviorSubject(false);
    console.log('typeOfOpration', typeOfOpration);
    if (typeOfOpration === 'List') {
        subToReturnC.next(true);
    }
    else {
        const data = fs_1.default.readFileSync(appModuleFile).toString().split('\n');
        const moduleNameToInsert = 'constructor() {';
        if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) !== -1) {
            console.log('data', moduleNameToInsert);
            const lastIndex = data
                .reverse()
                .findIndex((ele) => ele.includes(moduleNameToInsert));
            let generateForm = `this.${componentName}Form = fb.group({`;
            fields.forEach((ele) => {
                let validateData = ``;
                ele.validation.forEach((element) => {
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
            fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
            subToReturnC.next(true);
        }
    }
    return subToReturnC.asObservable();
}
exports.createReactiveFormInComponentFile = createReactiveFormInComponentFile;
function addDependaciesReactiveFormInComponentFile(appModuleFile, componentName, typeOfOpration, serviceMethodName) {
    const subToReturnA = new rxjs_1.BehaviorSubject(false);
    const data = fs_1.default.readFileSync(appModuleFile).toString().split('\n');
    const moduleNameToInsert = 'constructor(';
    if (typeOfOpration === 'List') {
        if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) !== -1) {
            const lastIndex = data
                .reverse()
                .findIndex((ele) => ele.includes(moduleNameToInsert));
            data.splice(lastIndex + 1, 0, `${componentName}Data:any;
      
       `);
            data.splice(lastIndex, 0, `
            this.${componentName}Service.${serviceMethodName}().subscribe((res)=>{
                this.${componentName}Data = res;
            });
       
      `);
            const braceIndex = data[lastIndex].indexOf('(') + 1;
            // data[lastIndex] =
            //   data[lastIndex].slice(0, braceIndex) +
            //   `public fb: FormBuilder,` +
            //   data[lastIndex].slice(braceIndex);
            data.reverse();
            const text = data.join('\n');
            // Display the file content
            fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
            subToReturnA.next(true);
        }
    }
    else {
        if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) !== -1) {
            const lastIndex = data
                .reverse()
                .findIndex((ele) => ele.includes(moduleNameToInsert));
            const formName = `${componentName}Form`;
            data.splice(lastIndex + 1, 0, `${formName}: FormGroup;
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
            this.${componentName}Service.${serviceMethodName}(${componentName}Data).subscribe((res)=>{
                this.show = res;
            });
        }
      }`);
            const braceIndex = data[lastIndex].indexOf('(') + 1;
            data[lastIndex] =
                data[lastIndex].slice(0, braceIndex) +
                    `public fb: FormBuilder,` +
                    data[lastIndex].slice(braceIndex);
            data.reverse();
            const text = data.join('\n');
            // Display the file content
            fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
            subToReturnA.next(true);
        }
    }
    return subToReturnA.asObservable();
}
exports.addDependaciesReactiveFormInComponentFile = addDependaciesReactiveFormInComponentFile;
