"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentStructure = exports.loginService = exports.fieldComponentCode = exports.fieldCss = exports.fieldHtml = void 0;
const constants_1 = require("../../constants");
const fs_1 = __importDefault(require("fs"));
const rxjs_1 = require("rxjs");
const functions_1 = require("../common/functions");
function fieldHtml(parentModule, newModule, componentName, fields, typeOfOpration, serviceMethodName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const appHtmlFile = parentModule === 'app'
        ? constants_1.angularDirPathForDownload +
            '/modules/' +
            newModule +
            '/' +
            componentName +
            '/' +
            componentName +
            '.component.html'
        : constants_1.angularDirPathForDownload +
            '/modules/' +
            parentModule +
            '/' +
            newModule +
            '/' +
            componentName +
            '/' +
            componentName +
            '.component.html';
    console.log(appHtmlFile);
    let formInnerHtml = ``;
    let dataInnerHtml = ``;
    if (typeOfOpration === 'List') {
        // createGrid(fields).then((resp) => {
        //   resp.subscribe((result: string) => {
        //     fs.writeFileSync(appHtmlFile, result, 'utf-8');
        //   });
        // });
        console.log('fields', fields);
        fields.forEach((ele) => {
            formInnerHtml += `<th>${ele.fieldLabel}</th>`;
            dataInnerHtml += `<td>{{data.${ele.fieldName}}}</td>`;
        });
        let outerTable = `<div>
  <table>
  <tr>${formInnerHtml}</tr>
  <tr *ngFor="let data of ${componentName}Data">${dataInnerHtml}</tr>
  </table>
  </div>`;
        fs_1.default.writeFileSync(appHtmlFile, outerTable, 'utf-8');
        subToReturn.next(true);
    }
    else {
        fields.forEach((ele) => {
            formInnerHtml += `<mat-form-field class="example-full-width" appearance="fill">
      <mat-label>${ele.fieldLabel}</mat-label>
      <input matInput placeholder="Enter your name" formControlName="${ele.fieldName}"
      >
      <mat-error
                *ngIf="
                  f.${ele.fieldName} &&
                  f.${ele.fieldName}?.errors &&
                  f.${ele.fieldName}.errors?.required &&
                  (f.${ele.fieldName}.dirty || f.${ele.fieldName}.touched)
                "
              >
              ${ele.fieldLabel} is required!
              </mat-error>
              <mat-error
                *ngIf="
                  f.${ele.fieldName} &&
                  f.${ele.fieldName}?.errors &&
                  f.${ele.fieldName}.errors?.spaces &&
                  (f.${ele.fieldName}.dirty || f.${ele.fieldName}.touched)
                "
              >
                Spaces are not allowed!
              </mat-error>
      </mat-form-field>
      `;
        });
        fs_1.default.writeFileSync(appHtmlFile, `<h5><u><i>${componentName} Form using Dynamo!!</i></u></h5>
      <p></p>
      <div>
      <form class="example-form" [formGroup]="${componentName}Form">
      ${formInnerHtml}
      <button mat-raised-button color="primary" (click)="submit()">Submit</button>
      <span *ngIf="show"> <button mat-button color="accent">${componentName} success !!</button></span>
      </form>
      </div>`, 'utf-8');
        subToReturn.next(true);
    }
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.fieldHtml = fieldHtml;
function fieldCss(parentModule, newModule, componentName, fields, typeOfOpration) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const appHtmlFile = parentModule === 'app'
        ? constants_1.angularDirPathForDownload +
            '/modules/' +
            newModule +
            '/' +
            componentName +
            '/' +
            componentName +
            '.component.css'
        : constants_1.angularDirPathForDownload +
            '/modules/' +
            parentModule +
            '/' +
            newModule +
            '/' +
            componentName +
            '/' +
            componentName +
            '.component.css';
    console.log(appHtmlFile);
    if (typeOfOpration === 'List') {
        fs_1.default.writeFileSync(appHtmlFile, `div {
      width:20%;
      margin:auto;
          
    }
    table, th, td {
      border: 1px solid;
    }`, 'utf-8');
    }
    else {
        fs_1.default.writeFileSync(appHtmlFile, `div {
      width:20%;
      margin:auto;
          
    }
    form {
        width:50%;
        margin:auto;
      }
      .mat-mdc-form-field {
        padding: 15px;
          
      }
      ::ng-deep .mat-mdc-form-field-infix {
        padding-top: 15px;
      }
      mat-error {
        color:red;
      }`, 'utf-8');
    }
    subToReturn.next(true);
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.fieldCss = fieldCss;
function fieldComponentCode(parentModule, newModule, componentName, fields, typeOfOpration, serviceMethodName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    //   const appHtmlFile =
    //     angularDirPathForDownload + '/modules/login/login/login.component.ts';
    const appHtmlFile = parentModule === 'app'
        ? constants_1.angularDirPathForDownload +
            '/modules/' +
            newModule +
            '/' +
            componentName +
            '/' +
            componentName +
            '.component.ts'
        : constants_1.angularDirPathForDownload +
            '/modules/' +
            parentModule +
            '/' +
            newModule +
            '/' +
            componentName +
            '/' +
            componentName +
            '.component.ts';
    console.log(appHtmlFile);
    (0, functions_1.addConstructorInComponentFile)(appHtmlFile, componentName).subscribe((resp) => {
        if (resp) {
            console.log('return files4');
            (0, functions_1.createReactiveFormInComponentFile)(appHtmlFile, componentName, fields, typeOfOpration).subscribe((respo) => {
                if (respo) {
                    console.log('return files3');
                    (0, functions_1.addServicesInComponentFile)(appHtmlFile, newModule).subscribe((response) => {
                        if (response) {
                            console.log('return files2');
                            (0, functions_1.addCustomValidatorInComponentFile)(appHtmlFile).subscribe((res) => {
                                if (res) {
                                    console.log('return files1');
                                    (0, functions_1.addDependaciesReactiveFormInComponentFile)(appHtmlFile, componentName, typeOfOpration, serviceMethodName).subscribe((resRe) => {
                                        if (resRe) {
                                            console.log('return files');
                                            subToReturn.next(true);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    console.log('fieldComponentCode complete');
    return subToReturn.asObservable();
}
exports.fieldComponentCode = fieldComponentCode;
function loginService(parentModule, newModule, serviceMethodName, typeOfOpration) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    //   const appHtmlFile =
    //     angularDirPathForDownload + '/modules/login/login.service.ts';
    const appHtmlFile = parentModule === 'app'
        ? constants_1.angularDirPathForDownload +
            '/modules/' +
            newModule +
            '/' +
            newModule +
            '.service.ts'
        : constants_1.angularDirPathForDownload +
            '/modules/' +
            parentModule +
            '/' +
            newModule +
            '/' +
            newModule +
            '.service.ts';
    console.log(appHtmlFile);
    (0, functions_1.insertServiceDependacies)(appHtmlFile).subscribe((response) => {
        if (response) {
            (0, functions_1.createServiceFunction)(appHtmlFile, serviceMethodName, typeOfOpration).subscribe((resp) => {
                console.log('resp', resp);
                if (resp) {
                    subToReturn.next(true);
                }
            });
        }
    });
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.loginService = loginService;
function componentStructure(parentModule, newModule, componentName, fields, serviceMethodName, typeOfOpration) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    fieldHtml(parentModule, newModule, componentName, fields, typeOfOpration, serviceMethodName).subscribe((res) => {
        if (res) {
            fieldCss(parentModule, newModule, componentName, fields, typeOfOpration).subscribe((resp) => {
                if (resp) {
                    fieldComponentCode(parentModule, newModule, componentName, fields, typeOfOpration, serviceMethodName).subscribe((result) => {
                        console.log('fieldComponentCode', result);
                        if (result) {
                            loginService(parentModule, newModule, serviceMethodName, typeOfOpration).subscribe((resultInstall) => {
                                if (resultInstall) {
                                    subToReturn.next(true);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    return subToReturn.asObservable();
}
exports.componentStructure = componentStructure;
