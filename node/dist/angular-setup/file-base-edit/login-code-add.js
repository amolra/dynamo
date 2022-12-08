"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginStructure = exports.loginService = exports.loginComponent = exports.loginHtml = void 0;
const constants_1 = require("../../constants");
const fs_1 = __importDefault(require("fs"));
const rxjs_1 = require("rxjs");
function loginHtml() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const appHtmlFile = constants_1.angularDirPathForDownload + '/modules/login/login/login.component.html';
    console.log(appHtmlFile);
    fs_1.default.writeFileSync(appHtmlFile, `<h5><u><i>Login Form using Angular material!!</i></u></h5>
    <p></p>
    <div>
    <form class="example-form" [formGroup]="loginForm">
    <mat-form-field class="example-full-width" appearance="fill">
    <mat-label>User Name</mat-label>
    <input matInput placeholder="Enter your name" formControlName="userName"
    >
    <mat-error
              *ngIf="
                f.userName &&
                f.userName?.errors &&
                f.userName.errors?.required &&
                (f.userName.dirty || f.userName.touched)
              "
            >
              User Name is required!
            </mat-error>
            <mat-error
              *ngIf="
                f.userName &&
                f.userName?.errors &&
                f.userName.errors?.spaces &&
                (f.userName.dirty || f.userName.touched)
              "
            >
              Spaces are not allowed!
            </mat-error>
    </mat-form-field>
    <mat-form-field class="example-full-width" appearance="fill">
    <mat-label>Password</mat-label>
    <input matInput placeholder="Enter your password" formControlName="password" type="password">
    <mat-error
              *ngIf="
                f.password &&
                f.password?.errors &&
                f.password.errors?.required &&
                (f.password.dirty || f.password.touched)
              "
            >
            Password is required!
            </mat-error>
            <mat-error
              *ngIf="
                f.password &&
                f.password?.errors &&
                f.password.errors?.spaces &&
                (f.password.dirty || f.password.touched)
              "
            >
              Spaces are not allowed!
            </mat-error>
    </mat-form-field>
    <button mat-raised-button color="primary" (click)="submit()">Submit</button>
    <span *ngIf="show"> <button mat-button color="accent">Login success !!</button></span>
    </form>
    </div>`, 'utf-8');
    subToReturn.next(true);
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.loginHtml = loginHtml;
function loginComponent() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const appHtmlFile = constants_1.angularDirPathForDownload + '/modules/login/login/login.component.ts';
    console.log(appHtmlFile);
    fs_1.default.writeFileSync(appHtmlFile, `import { Component } from '@angular/core';
    import {
        AbstractControl,
        AsyncValidatorFn,
        FormArray,
        FormBuilder,
        FormControl,
        FormGroup,
        ValidationErrors,
      } from '@angular/forms';
      import { LoginService } from '../login.service';
      import { CustomValidators } from '../../../common/custom-validator';
      @Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css']
      })
      export class LoginComponent {
        loginForm: FormGroup;
        show=false;
        constructor(
            public loginService: LoginService,
            public fb: FormBuilder,
          ) {
            this.loginForm = fb.group({
                userName: new FormControl('', [
                    CustomValidators.required,
                  CustomValidators.spacesNotAllowed,
                  CustomValidators.maxLength(100),
                ]),
                password: new FormControl('', [
                    CustomValidators.required,
                    CustomValidators.spacesNotAllowed,
                    CustomValidators.maxLength(50),
                  ]),
            });
          }
          get f():any {
            return this.loginForm.controls;
          }
          public triggerValidation(): boolean {
            this.loginForm.markAllAsTouched();
            return this.loginForm.valid ? true : false;
          }
          submit():void{
            if(this.triggerValidation() && this.loginForm.valid) {
                const loginData = this.loginForm.value;
                this.loginService.login(loginData).subscribe((res)=>{
                    this.show = res;
                });
            }
          }
      }`, 'utf-8');
    subToReturn.next(true);
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.loginComponent = loginComponent;
function loginService() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const appHtmlFile = constants_1.angularDirPathForDownload + '/modules/login/login.service.ts';
    console.log(appHtmlFile);
    fs_1.default.writeFileSync(appHtmlFile, `import { Injectable } from '@angular/core';
    import { Observable, of } from 'rxjs';
    import { HttpClient } from '@angular/common/http';
    import { map } from 'rxjs/operators';
    @Injectable({
      providedIn: 'root'
    })
    export class LoginService {
        apiURL='http://localhost:4500/'
      constructor(private httpClient: HttpClient) { }
      public login(loginObj:any): Observable<boolean> {
        const url = this.apiURL + 'login';
        return this.httpClient
          .post<any>(url, {
            ...loginObj,
          })
          .pipe(map((data) => data.result));
      }
    }`, 'utf-8');
    subToReturn.next(true);
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.loginService = loginService;
function loginStructure() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    loginHtml().subscribe((res) => {
        if (res) {
            loginComponent().subscribe((result) => {
                if (result) {
                    loginService().subscribe((resultInstall) => {
                        if (resultInstall) {
                            subToReturn.next(true);
                        }
                    });
                }
            });
        }
    });
    return subToReturn.asObservable();
}
exports.loginStructure = loginStructure;
