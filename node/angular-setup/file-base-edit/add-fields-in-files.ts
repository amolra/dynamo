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
export function fieldHtml(
  parentModule: string,
  newModule: string,
  componentName: string,
  fields: fields[]
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
    <span *ngIf="show"> <button mat-button color="accent">Login success !!</button></span>
    </form>
    </div>`,
    'utf-8'
  );
  subToReturn.next(true);
  console.log('write file complete');
  return subToReturn.asObservable();
}
export function fieldComponentCode(
  parentModule: string,
  newModule: string,
  componentName: string,
  fields: fields[]
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
        createReactiveFormInComponentFile(
          appHtmlFile,
          componentName,
          fields
        ).subscribe((respo: boolean) => {
          if (respo) {
            addServicesInComponentFile(appHtmlFile, newModule).subscribe(
              (response: boolean) => {
                if (response) {
                  addCustomValidatorInComponentFile(appHtmlFile).subscribe(
                    (res: boolean) => {
                      if (res) {
                        addDependaciesReactiveFormInComponentFile(
                          appHtmlFile,
                          componentName
                        ).subscribe((resRe: boolean) => {
                          if (resRe) {
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
  serviceMethodName: string
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
      createServiceFunction(appHtmlFile, serviceMethodName).subscribe(
        (resp: boolean) => {
          if (resp) {
            subToReturn.next(true);
          }
        }
      );
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
  serviceMethodName: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);

  fieldHtml(parentModule, newModule, componentName, fields).subscribe(
    (res: boolean) => {
      if (res) {
        fieldComponentCode(
          parentModule,
          newModule,
          componentName,
          fields
        ).subscribe((result: boolean) => {
          if (result) {
            loginService(parentModule, newModule, serviceMethodName).subscribe(
              (resultInstall: boolean) => {
                if (resultInstall) {
                  subToReturn.next(true);
                }
              }
            );
          }
        });
      }
    }
  );
  return subToReturn.asObservable();
}
