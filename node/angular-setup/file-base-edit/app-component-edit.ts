import { angularDirPathForDownload } from '../constants';
import fs from 'fs';
import { BehaviorSubject, Observable } from 'rxjs';
const directory = angularDirPathForDownload + '/common';
export function editAppHtml(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const appHtmlFile = angularDirPathForDownload + '/app.component.html';
  console.log(appHtmlFile);

  fs.writeFileSync(appHtmlFile, '<router-outlet></router-outlet>', 'utf-8');
  subToReturn.next(true);
  console.log('write file complete');
  return subToReturn.asObservable();
}
export function editAppRouting(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const appRouteFile = angularDirPathForDownload + '/app-routing.module.ts';
  console.log(appRouteFile);

  fs.writeFileSync(
    appRouteFile,
    `import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    
    const routes: Routes = [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        {
          path: 'login',
          loadChildren: () =>
            import('./modules/login/login.module').then((m) => m.LoginModule),
        },];;
    
    @NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule],
    })
    export class AppRoutingModule {}`,
    'utf-8'
  );
  subToReturn.next(true);
  console.log('write file complete');
  return subToReturn.asObservable();
}
export function createLoginModule(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);

  const appRouteFile =
    angularDirPathForDownload + '/modules/login/login.module.ts';
  console.log(appRouteFile);

  let routingData = `import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { LoginComponent } from './login/login.component';
  import { MaterialModule } from '../material/material.module';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { RouterModule, Routes } from '@angular/router';
  import {
    HttpClient,
    HttpClientModule,
    HTTP_INTERCEPTORS,
  } from '@angular/common/http';
  const routes: Routes = [
    {
      path: '',
      component: LoginComponent,
    },
];
  @NgModule({
    declarations: [LoginComponent],
    imports: [RouterModule.forChild(routes),CommonModule, MaterialModule, FormsModule, ReactiveFormsModule,HttpClientModule],
    providers: [HttpClient]
  })
  export class LoginModule {}`;

  fs.writeFileSync(appRouteFile, routingData, 'utf-8');
  subToReturn.next(true);
  console.log('write routing file complete');
  return subToReturn.asObservable();
}
export function createCustomValidator(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);

  const routingFile = directory + '/custom-validator.ts';
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  if (!fs.existsSync(routingFile)) {
    fs.open(routingFile, 'w', function (err, file) {
      if (err) throw err;
      console.log('Saved!');
    });
  }
  const appRouteFile =
    angularDirPathForDownload + '/common/custom-validator.ts';
  console.log(appRouteFile);

  let validationData = `import {
        AbstractControl,
        FormArray,
        FormControl,
        FormGroup,
        ValidationErrors,
        ValidatorFn,
        Validators,
      } from '@angular/forms';
      
      import { from } from 'rxjs';
      import { groupBy, mergeMap, toArray } from 'rxjs/operators';
      
      // setup simple regex for white listed characters
      
      // create your class that extends the angular validator class
      export class CustomValidators extends Validators {
        // create a static method for your validation
        static spacesNotAllowed(control: AbstractControl): ValidationErrors | null {
          // first check if the control has a value
          const value = control.value ? control.value.toString() : '';
          if (value.trim() || value.length <= 0) {
            // match the control value against the regular expression
            return null;
          } else {
            return { spaces: true };
          }
        }
        
        // static OnlyNumberAllowed(control: AbstractControl): ValidationErrors | null {
        //   const reg = /^[0-9]+$/;
        //   if (control && control.value && control.value.length > 0) {
        //     const matches = reg.test(control.value);
        //     return matches ? null : { OnlyNumberAllowed: !matches };
        //   } else {
        //     return null;
        //   }
        // }
        static maxLengthCustom(maxLength: number): ValidatorFn {
          return (control: AbstractControl): ValidationErrors | null => {
            const txtVal = control.value?.toString();
            const value =
              txtVal &&
              txtVal.length > 0 &&
              txtVal.split('.') &&
              txtVal.split('.')[0] &&
              txtVal.split('.')[0].replace('-', '').length > maxLength;
            if (value) {
              return { maxLengthCustom: true };
            } else {
              return null;
            }
          };
        }
        static maxLengthForDecimalNo(maxLength: number): ValidatorFn {
          return (control: AbstractControl): ValidationErrors | null => {
            const txtVal = control.value?.toString();
            const value = txtVal?.includes('.') ? txtVal.split('.') : txtVal;
            const length =
              typeof value === 'object' ? value[0].length : value?.length;
            if (length > maxLength) {
              return { maxLengthCustom: true };
            } else {
              return null;
            }
          };
        }
        // static maxNoteLength(maxLength: number): ValidatorFn {
        //   return (control: AbstractControl): ValidationErrors | null => {
        //     const value = control.value
        //       ? control.value.replace(/<\/?[^>]+(>|$)/g, '')
        //       : '';
        //     const valueWithSpace = value;
        //     if (valueWithSpace.length > maxLength) {
        //       return { maxLengthCustom: true };
        //     } else {
        //       return null;
        //     }
        //   };
        // }
        static OnlyPositiveNumbers(
          control: AbstractControl
        ): ValidationErrors | null {
          if (control && control.value && control.value < 0) {
            return { OnlyPositiveNumbers: true };
          } else {
            return null;
          }
        }
        static nonPremativeFieldValidationRequired(
          control: AbstractControl
        ): ValidationErrors | null {
          return control.value && control.value?.id !== ''
            ? null
            : { required: true };
        }
      }
      `;

  fs.writeFileSync(appRouteFile, validationData, 'utf-8');
  subToReturn.next(true);
  console.log('write routing file complete');
  return subToReturn.asObservable();
}
export function createMaterialModule(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const appRouteFile =
    angularDirPathForDownload + '/modules/material/material.module.ts';
  console.log(appRouteFile);

  fs.writeFileSync(
    appRouteFile,
    `import {
        CUSTOM_ELEMENTS_SCHEMA,
        NgModule,
        NO_ERRORS_SCHEMA,
      } from '@angular/core';
      import { MatButtonModule } from '@angular/material/button';
      import { MatIconModule } from '@angular/material/icon';
      import { MatToolbarModule } from '@angular/material/toolbar';
      import { MatDatepickerModule } from '@angular/material/datepicker';
      import { MatNativeDateModule } from '@angular/material/core';
      import { MatInputModule } from '@angular/material/input';
      import { MatAutocompleteModule } from '@angular/material/autocomplete';
      import { MatFormFieldModule } from '@angular/material/form-field';
      import { MatMenuModule } from '@angular/material/menu';
      import { MatCardModule } from '@angular/material/card';
      import { MatGridListModule } from '@angular/material/grid-list';
      import { MatBadgeModule } from '@angular/material/badge';
      import { MatSelectModule } from '@angular/material/select';
      import { MatChipsModule } from '@angular/material/chips';
      import { MatRippleModule } from '@angular/material/core';
      
      
      const importsAr = [
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatCardModule,
        MatGridListModule,
        MatBadgeModule,
        MatSelectModule,
        MatChipsModule,
        MatRippleModule,
        
      ];
      @NgModule({
        declarations: [],
        imports: importsAr,
        exports: importsAr,
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        providers: [],
      })
      export class MaterialModule {}
      `,
    'utf-8'
  );
  subToReturn.next(true);
  console.log('write file complete');
  return subToReturn.asObservable();
}
export function appModuleChanges(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);

  editAppHtml().subscribe((res) => {
    if (res) {
      createMaterialModule().subscribe((materialOutPut) => {
        if (materialOutPut) {
          editAppRouting().subscribe((result) => {
            if (result) {
              createLoginModule().subscribe((resultCreation) => {
                if (resultCreation) {
                  createCustomValidator().subscribe(
                    (resultCreateCustomValidator) => {
                      if (resultCreateCustomValidator) {
                        subToReturn.next(true);
                      }
                    }
                  );
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
