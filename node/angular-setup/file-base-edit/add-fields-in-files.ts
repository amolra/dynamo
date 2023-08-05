import { angularDirPathForDownload } from '../../constants';
import fs from 'fs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { fields } from '../../interfaces/fields';
import {
  addConstructorInComponentFile,
  addCustomValidatorInComponentFile,
  addDependaciesReactiveFormInComponentFile,
  addServicesInComponentFile,
  createReactiveFormInComponentFile,
  createServiceFunction,
  insertServiceDependacies,
} from '../common/functions';
import { createGrid } from '../grid';
export function fieldHtml(
  parentModule: string,
  newModule: string,
  componentName: string,
  fields: fields[],
  typeOfOpration: string,
  serviceMethodName: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const appHtmlFile = 
    parentModule === 'app'
      ? angularDirPathForDownload +
        '/modules/' +
        newModule +
        '/' +
        componentName +
        '/' +
        componentName +
        '.component.html'
      : angularDirPathForDownload +
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
    fields.forEach((ele: fields) => {
      formInnerHtml += `<th>${ele.fieldLabel}</th>`;
      dataInnerHtml += `<td>{{data.${ele.fieldName}}}</td>`;
    });
    let outerTable = `<div>
  <table>
  <tr>${formInnerHtml}</tr>
  <tr *ngFor="let data of ${componentName}Data">${dataInnerHtml}</tr>
  </table>
  </div>`;
    fs.writeFileSync(appHtmlFile, outerTable, 'utf-8');
    subToReturn.next(true);
  } else {
    fields.forEach((ele: any) => {
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

    fs.writeFileSync(
      appHtmlFile,
      `<h5><u><i>${componentName} Form using Dynamo!!</i></u></h5>
      <p></p>
      <div>
      <form class="example-form" [formGroup]="${componentName}Form">
      ${formInnerHtml}
      <button mat-raised-button color="primary" (click)="submit()">Submit</button>
      <span *ngIf="show"> <button mat-button color="accent">${componentName} success !!</button></span>
      </form>
      </div>`,
      'utf-8'
    );
    subToReturn.next(true);
  }

  console.log('write file complete');
  return subToReturn.asObservable();
}
export function fieldCss(
  parentModule: string,
  newModule: string,
  componentName: string,
  fields: fields[],
  typeOfOpration: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const appHtmlFile =
    parentModule === 'app'
      ? angularDirPathForDownload +
        '/modules/' +
        newModule +
        '/' +
        componentName +
        '/' +
        componentName +
        '.component.css'
      : angularDirPathForDownload +
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
    fs.writeFileSync(
      appHtmlFile,
      `div {
      width:20%;
      margin:auto;
          
    }
    table, th, td {
      border: 1px solid;
    }`,
      'utf-8'
    );
  } else {
    fs.writeFileSync(
      appHtmlFile,
      `div {
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
      }`,
      'utf-8'
    );
  }
  subToReturn.next(true);
  console.log('write file complete');
  return subToReturn.asObservable();
}

export function fieldComponentCode(
  parentModule: string,
  newModule: string,
  componentName: string,
  fields: fields[],
  typeOfOpration: string,
  serviceMethodName: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  //   const appHtmlFile =
  //     angularDirPathForDownload + '/modules/login/login/login.component.ts';
  const appHtmlFile =
    parentModule === 'app'
      ? angularDirPathForDownload +
        '/modules/' +
        newModule +
        '/' +
        componentName +
        '/' +
        componentName +
        '.component.ts'
      : angularDirPathForDownload +
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
  addConstructorInComponentFile(appHtmlFile, componentName).subscribe(
    (resp: boolean) => {
      if (resp) {
        console.log('return files4');
        createReactiveFormInComponentFile(
          appHtmlFile,
          componentName,
          fields,
          typeOfOpration
        ).subscribe((respo: boolean) => {
          if (respo) {
            console.log('return files3');
            addServicesInComponentFile(appHtmlFile, newModule).subscribe(
              (response: boolean) => {
                if (response) {
                  console.log('return files2');
                  addCustomValidatorInComponentFile(appHtmlFile).subscribe(
                    (res: boolean) => {
                      if (res) {
                        console.log('return files1');
                        addDependaciesReactiveFormInComponentFile(
                          appHtmlFile,
                          componentName,
                          typeOfOpration,
                          serviceMethodName
                        ).subscribe((resRe: boolean) => {
                          if (resRe) {
                            console.log('return files');
                            subToReturn.next(true);
                          }
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  );

  console.log('fieldComponentCode complete');
  return subToReturn.asObservable();
}
export function loginService(
  parentModule: string,
  newModule: string,
  serviceMethodName: string,
  typeOfOpration: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  //   const appHtmlFile =
  //     angularDirPathForDownload + '/modules/login/login.service.ts';
  const appHtmlFile =
    parentModule === 'app'
      ? angularDirPathForDownload +
        '/modules/' +
        newModule +
        '/' +
        newModule +
        '.service.ts'
      : angularDirPathForDownload +
        '/modules/' +
        parentModule +
        '/' +
        newModule +
        '/' +
        newModule +
        '.service.ts';
  console.log(appHtmlFile);

  insertServiceDependacies(appHtmlFile).subscribe((response: boolean) => {
    if (response) {
      createServiceFunction(
        appHtmlFile,
        serviceMethodName,
        typeOfOpration
      ).subscribe((resp: boolean) => {
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
export function componentStructure(
  parentModule: string,
  newModule: string,
  componentName: string,
  fields: fields[],
  serviceMethodName: string,
  typeOfOpration: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);

  fieldHtml(
    parentModule,
    newModule,
    componentName,
    fields,
    typeOfOpration,
    serviceMethodName
  ).subscribe((res: boolean) => {
    if (res) {
      fieldCss(
        parentModule,
        newModule,
        componentName,
        fields,
        typeOfOpration
      ).subscribe((resp: boolean) => {
        if (resp) {
          fieldComponentCode(
            parentModule,
            newModule,
            componentName,
            fields,
            typeOfOpration,
            serviceMethodName
          ).subscribe((result: boolean) => {
            console.log('fieldComponentCode', result);
            if (result) {
              loginService(
                parentModule,
                newModule,
                serviceMethodName,
                typeOfOpration
              ).subscribe((resultInstall: boolean) => {
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
