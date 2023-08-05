"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appModuleChanges = exports.addModulesInAppModule = exports.createMaterialModule = exports.createCustomValidator = exports.addModuleDependacies = exports.insertAppRouting = exports.editAppRouting = exports.editCss = exports.editAppHtml = void 0;
const constants_1 = require("../../constants");
const fs_1 = __importDefault(require("fs"));
const rxjs_1 = require("rxjs");
const functions_1 = require("../common/functions");
const directory = constants_1.angularDirPathForDownload + '/common';
function editAppHtml(template) {
    const templateName = 'templates/' + template;
    const templatePath = constants_1.basePath + constants_1.projectFolder + '/' + templateName;
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const appHtmlFile = constants_1.angularDirPathForDownload + '/app.component.html';
    console.log(appHtmlFile);
    const dataAppHtml = fs_1.default.readFileSync(appHtmlFile).toString();
    if (!dataAppHtml.includes('<router-outlet></router-outlet>')) {
        const data = fs_1.default
            .readFileSync(templatePath + '/index.html')
            .toString()
            .replace('%internal template%', '<router-outlet></router-outlet>');
        fs_1.default.writeFileSync(appHtmlFile, data, 'utf-8');
    }
    subToReturn.next(true);
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.editAppHtml = editAppHtml;
function editCss(template) {
    const templateName = 'templates/' + template;
    const templatePath = constants_1.basePath + constants_1.projectFolder + '/' + templateName;
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const templateCssFile = templatePath + '/styles.css';
    const appHtmlFile = constants_1.srcFile + '/styles.css';
    console.log(appHtmlFile);
    const data = fs_1.default.readFileSync(templateCssFile).toString();
    fs_1.default.writeFileSync(appHtmlFile, data, 'utf-8');
    subToReturn.next(true);
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.editCss = editCss;
function editAppRouting() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const appRouteFile = constants_1.angularDirPathForDownload + '/app-routing.module.ts';
    console.log(appRouteFile);
    if (fs_1.default.existsSync(appRouteFile)) {
        const data = fs_1.default.readFileSync(appRouteFile).toString().split('\n');
        if (data.findIndex((ele) => ele.includes('const routes:')) === -1) {
            fs_1.default.writeFileSync(appRouteFile, `import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    
    const routes: Routes = [
        ];
    
    @NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule],
    })
    export class AppRoutingModule {}`, 'utf-8');
        }
    }
    subToReturn.next(true);
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.editAppRouting = editAppRouting;
function insertAppRouting(parentModuleName, newModuleName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const appRouteFile = constants_1.angularDirPathForDownload + '/app-routing.module.ts';
    const data = fs_1.default.readFileSync(appRouteFile).toString().split('\n');
    console.log('data', data);
    const moduleNameToInsert = 'const routes: Routes = [';
    if (data.findIndex((ele) => ele.includes(moduleNameToInsert)) !== -1) {
        const lastIndex = data
            .reverse()
            .findIndex((ele) => ele.includes(moduleNameToInsert));
        const dataToInsert = parentModuleName === 'app'
            ? `{
        path: '${newModuleName}',
        loadChildren: () =>
          import('./modules/${newModuleName}/${newModuleName}.module').then((m) => m.${(0, functions_1.makeFirstCharUpperCase)(newModuleName)}Module),
      },`
            : `{
        path: '${newModuleName}',
        loadChildren: () =>
          import('./modules/${parentModuleName}/${newModuleName}/${newModuleName}.module').then((m) => m.${(0, functions_1.makeFirstCharUpperCase)(newModuleName)}Module),
      },`;
        const braceIndex = data[lastIndex].indexOf('[') + 1;
        data[lastIndex] =
            data[lastIndex].slice(0, braceIndex) +
                dataToInsert +
                data[lastIndex].slice(braceIndex);
        // data.splice(lastIndex, 0, dataToInsert);
        const appHtmlFile = constants_1.angularDirPathForDownload + '/app.component.html';
        data.reverse();
        const text = data.join('\n');
        console.log('text', text);
        // Display the file content
        const dataMenu = fs_1.default.readFileSync(appHtmlFile).toString().split('\n');
        console.log('dataMenu', dataMenu);
        const lastIndexMenu = dataMenu.findIndex((ele) => ele.includes(`<li><a href="#">Home</a></li>`));
        console.log('lastIndexMenu', lastIndexMenu);
        dataMenu.splice(lastIndexMenu + 1, 0, `<li><a routerLink="${newModuleName}">${newModuleName}</a></li>`);
        fs_1.default.writeFileSync(appHtmlFile, dataMenu.join('\n'), 'utf-8');
        fs_1.default.writeFileSync(appRouteFile, text, 'utf-8');
        subToReturn.next(true);
    }
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.insertAppRouting = insertAppRouting;
function addModuleDependacies(parentModuleName, newModuleName, componentName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const arrayModule = [
        'RouterModule.forChild(routes),',
        'CommonModule,',
        'MaterialModule,',
        'FormsModule,',
        'ReactiveFormsModule,',
        'HttpClientModule,',
    ];
    // const appRouteFile =
    //   angularDirPathForDownload + '/modules/login/login.module.ts';
    const appRouteFile = parentModuleName === 'app'
        ? constants_1.angularDirPathForDownload +
            '/modules/' +
            newModuleName +
            '/' +
            newModuleName +
            '.module.ts'
        : constants_1.angularDirPathForDownload +
            '/modules/' +
            parentModuleName +
            '/' +
            newModuleName +
            '/' +
            newModuleName +
            '.module.ts';
    console.log(appRouteFile);
    (0, functions_1.insertModuleDependancies)(appRouteFile, 'MaterialModule', `import { MaterialModule } from '../material/material.module';
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
      component: ${(0, functions_1.makeFirstCharUpperCase)(componentName)}Component,
    },
];`).subscribe((response) => {
        if (response) {
            arrayModule.forEach((ele) => {
                (0, functions_1.importModules)(appRouteFile, 'imports: [', ele);
            });
        }
    });
    subToReturn.next(true);
    console.log('write routing file complete');
    return subToReturn.asObservable();
}
exports.addModuleDependacies = addModuleDependacies;
function createCustomValidator() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const routingFile = directory + '/custom-validator.ts';
    if (!fs_1.default.existsSync(directory)) {
        fs_1.default.mkdirSync(directory, { recursive: true });
    }
    if (!fs_1.default.existsSync(routingFile)) {
        fs_1.default.open(routingFile, 'w', function (err, file) {
            if (err)
                throw err;
            console.log('Saved!');
        });
    }
    const appRouteFile = constants_1.angularDirPathForDownload + '/common/custom-validator.ts';
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
    fs_1.default.writeFileSync(appRouteFile, validationData, 'utf-8');
    subToReturn.next(true);
    console.log('write routing file complete');
    return subToReturn.asObservable();
}
exports.createCustomValidator = createCustomValidator;
function createMaterialModule() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const appRouteFile = constants_1.angularDirPathForDownload + '/modules/material/material.module.ts';
    console.log(appRouteFile);
    fs_1.default.writeFileSync(appRouteFile, `import {
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
      `, 'utf-8');
    subToReturn.next(true);
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.createMaterialModule = createMaterialModule;
function addModulesInAppModule() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const appModuleFile = constants_1.angularDirPathForDownload + '/app.module.ts';
    console.log(appModuleFile);
    // Use fs.readFile() method to read the file
    const data = fs_1.default.readFileSync(appModuleFile).toString().split('\n');
    if (data.findIndex((ele) => ele.includes('BrowserAnimationsModule')) === -1) {
        const lastIndex = data
            .reverse()
            .findIndex((ele) => ele.includes('import {'));
        const lastModuleName = data[lastIndex].substr(data[lastIndex].indexOf('{') + 1, data[lastIndex].indexOf('}') - data[lastIndex].indexOf('{') - 1);
        console.log('lastModuleName', lastModuleName);
        data.splice(lastIndex, 0, `import { BrowserAnimationsModule } from '@angular/platform-browser/animations';`);
        const lastIndexPrevImports = data.findIndex((ele) => ele.includes(lastModuleName.trim()));
        data.splice(lastIndexPrevImports + 1, 0, `BrowserAnimationsModule,`);
        data.reverse();
        const text = data.join('\n');
        // Display the file content
        fs_1.default.writeFileSync(appModuleFile, text, 'utf-8');
    }
    subToReturn.next(true);
    console.log('write file complete');
    return subToReturn.asObservable();
}
exports.addModulesInAppModule = addModulesInAppModule;
function appModuleChanges(template, parentModuleName, newModuleName, componentName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    editAppHtml(template).subscribe((res) => {
        if (res) {
            editCss(template).subscribe((resp) => {
                if (resp) {
                    createMaterialModule().subscribe((materialOutPut) => {
                        if (materialOutPut) {
                            editAppRouting().subscribe((result) => {
                                if (result) {
                                    insertAppRouting(parentModuleName, newModuleName).subscribe((re) => {
                                        if (re) {
                                            addModuleDependacies(parentModuleName, newModuleName, componentName).subscribe((resultCreation) => {
                                                if (resultCreation) {
                                                    createCustomValidator().subscribe((resultCreateCustomValidator) => {
                                                        if (resultCreateCustomValidator) {
                                                            addModulesInAppModule().subscribe((resultAddModulesInAppModule) => {
                                                                subToReturn.next(true);
                                                            });
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
                }
            });
        }
    });
    return subToReturn.asObservable();
}
exports.appModuleChanges = appModuleChanges;
