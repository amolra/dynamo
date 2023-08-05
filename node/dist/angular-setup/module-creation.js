"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEntireCode = void 0;
const rxjs_1 = require("rxjs");
const _1 = require(".");
const add_fields_in_files_1 = require("./file-base-edit/add-fields-in-files");
const app_component_edit_1 = require("./file-base-edit/app-component-edit");
function createEntireCode(fetTech, template, components) {
    const subToReturn = new rxjs_1.Subject();
    components.forEach((element) => __awaiter(this, void 0, void 0, function* () {
        const { parentModuleName, newModuleName, componentName, fields, serviceMethodName, tableName, tableNameForTransaction, typeOfOpration, } = element;
        yield (0, _1.createModules)(fetTech, parentModuleName, newModuleName).subscribe((resultcreateModules) => {
            if (resultcreateModules) {
                (0, _1.createComponentService)(fetTech, parentModuleName, newModuleName, componentName).subscribe((resultcreateComponentService) => __awaiter(this, void 0, void 0, function* () {
                    if (resultcreateComponentService) {
                        console.log('result', resultcreateComponentService);
                        yield (0, app_component_edit_1.addModulesInAppModule)().subscribe((resultAddModulesInAppModule) => __awaiter(this, void 0, void 0, function* () {
                            console.log('resultAddModulesInAppModule', resultAddModulesInAppModule);
                            if (resultAddModulesInAppModule) {
                                console.log('reading app module');
                                yield (0, app_component_edit_1.appModuleChanges)(template, parentModuleName, newModuleName, componentName).subscribe((resultAppModuleChanges) => __awaiter(this, void 0, void 0, function* () {
                                    console.log('resultAppModuleChanges', resultAppModuleChanges);
                                    if (resultAppModuleChanges) {
                                        console.log('Successfully inserted app module');
                                        yield (0, add_fields_in_files_1.componentStructure)(parentModuleName, newModuleName, componentName, fields, serviceMethodName, typeOfOpration).subscribe((resultComponentStructure) => {
                                            console.log('resultComponentStructure', resultComponentStructure);
                                            if (resultComponentStructure) {
                                                console.log('Successfully inserted resultComponentStructure');
                                                subToReturn.next(true);
                                                return true;
                                                // if (res.headersSent !== true) {
                                                //   return true;
                                                // }
                                            }
                                            else
                                                subToReturn.next(false);
                                        });
                                    }
                                    else
                                        subToReturn.next(false);
                                }));
                            }
                            else
                                subToReturn.next(false);
                        }));
                    }
                }));
            }
        });
    }));
    return subToReturn.asObservable();
}
exports.createEntireCode = createEntireCode;
