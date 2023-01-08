// import { angularDirPathForDownload } from '../../constants';
// import fs from 'fs';
// import { BehaviorSubject, Observable, Subject } from 'rxjs';
// export function loginHtml(): Observable<boolean> {
//   const subToReturn = new BehaviorSubject<boolean>(false);
//   const appHtmlFile =
//     angularDirPathForDownload + '/modules/login/login/login.component.html';
//   console.log(appHtmlFile);

//   fs.writeFileSync(
//     appHtmlFile,
//     `<h5><u><i>Login Form using Angular material!!</i></u></h5>
//     <p></p>
//     <div>
//     <form class="example-form" [formGroup]="loginForm">
//     <mat-form-field class="example-full-width" appearance="fill">
//     <mat-label>User Name</mat-label>
//     <input matInput placeholder="Enter your name" formControlName="userName"
//     >
//     <mat-error
//               *ngIf="
//                 f.userName &&
//                 f.userName?.errors &&
//                 f.userName.errors?.required &&
//                 (f.userName.dirty || f.userName.touched)
//               "
//             >
//               User Name is required!
//             </mat-error>
//             <mat-error
//               *ngIf="
//                 f.userName &&
//                 f.userName?.errors &&
//                 f.userName.errors?.spaces &&
//                 (f.userName.dirty || f.userName.touched)
//               "
//             >
//               Spaces are not allowed!
//             </mat-error>
//     </mat-form-field>
//     <mat-form-field class="example-full-width" appearance="fill">
//     <mat-label>Password</mat-label>
//     <input matInput placeholder="Enter your password" formControlName="password" type="password">
//     <mat-error
//               *ngIf="
//                 f.password &&
//                 f.password?.errors &&
//                 f.password.errors?.required &&
//                 (f.password.dirty || f.password.touched)
//               "
//             >
//             Password is required!
//             </mat-error>
//             <mat-error
//               *ngIf="
//                 f.password &&
//                 f.password?.errors &&
//                 f.password.errors?.spaces &&
//                 (f.password.dirty || f.password.touched)
//               "
//             >
//               Spaces are not allowed!
//             </mat-error>
//     </mat-form-field>
//     <button mat-raised-button color="primary" (click)="submit()">Submit</button>
//     <span *ngIf="show"> <button mat-button color="accent">Login success !!</button></span>
//     </form>
//     </div>`,
//     'utf-8'
//   );
//   subToReturn.next(true);
//   console.log('write file complete');
//   return subToReturn.asObservable();
// }
// export function loginComponent(): Observable<boolean> {
//   const subToReturn = new BehaviorSubject<boolean>(false);
//   const appHtmlFile =
//     angularDirPathForDownload + '/modules/login/login/login.component.ts';
//   console.log(appHtmlFile);

//   fs.writeFileSync(
//     appHtmlFile,
//     `import { Component } from '@angular/core';
//     import {
//         AbstractControl,
//         AsyncValidatorFn,
//         FormArray,
//         FormBuilder,
//         FormControl,
//         FormGroup,
//         ValidationErrors,
//       } from '@angular/forms';
//       import { LoginService } from '../login.service';
//       import { CustomValidators } from '../../../common/custom-validator';
//       @Component({
//         selector: 'app-login',
//         templateUrl: './login.component.html',
//         styleUrls: ['./login.component.css']
//       })
//       export class LoginComponent {
//         loginForm: FormGroup;
//         show=false;
//         constructor(
//             public loginService: LoginService,
//             public fb: FormBuilder,
//           ) {
//             this.loginForm = fb.group({
//                 userName: new FormControl('', [
//                     CustomValidators.required,
//                   CustomValidators.spacesNotAllowed,
//                   CustomValidators.maxLength(100),
//                 ]),
//                 password: new FormControl('', [
//                     CustomValidators.required,
//                     CustomValidators.spacesNotAllowed,
//                     CustomValidators.maxLength(50),
//                   ]),
//             });
//           }
//           get f():any {
//             return this.loginForm.controls;
//           }
//           public triggerValidation(): boolean {
//             this.loginForm.markAllAsTouched();
//             return this.loginForm.valid ? true : false;
//           }
//           submit():void{
//             if(this.triggerValidation() && this.loginForm.valid) {
//                 const loginData = this.loginForm.value;
//                 this.loginService.login(loginData).subscribe((res)=>{
//                     this.show = res;
//                 });
//             }
//           }
//       }`,
//     'utf-8'
//   );
//   subToReturn.next(true);
//   console.log('write file complete');
//   return subToReturn.asObservable();
// }
// export function loginService(): Observable<boolean> {
//   const subToReturn = new BehaviorSubject<boolean>(false);
//   const appHtmlFile =
//     angularDirPathForDownload + '/modules/login/login.service.ts';
//   console.log(appHtmlFile);

//   fs.writeFileSync(
//     appHtmlFile,
//     `import { Injectable } from '@angular/core';
//     import { Observable, of } from 'rxjs';
//     import { HttpClient } from '@angular/common/http';
//     import { map } from 'rxjs/operators';
//     @Injectable({
//       providedIn: 'root'
//     })
//     export class LoginService {
//         apiURL='http://localhost:4500/'
//       constructor(private httpClient: HttpClient) { }
//       public login(loginObj:any): Observable<boolean> {
//         const url = this.apiURL + 'login';
//         return this.httpClient
//           .post<any>(url, {
//             ...loginObj,
//           })
//           .pipe(map((data) => data.result));
//       }
//     }`,
//     'utf-8'
//   );
//   subToReturn.next(true);
//   console.log('write file complete');
//   return subToReturn.asObservable();
// }
// export function loginStructure(): Observable<boolean> {
//   const subToReturn = new BehaviorSubject<boolean>(false);

//   loginHtml().subscribe((res: boolean) => {
//     if (res) {
//       loginComponent().subscribe((result: boolean) => {
//         if (result) {
//           loginService().subscribe((resultInstall: boolean) => {
//             if (resultInstall) {
//               subToReturn.next(true);
//             }
//           });
//         }
//       });
//     }
//   });
//   return subToReturn.asObservable();
// }
