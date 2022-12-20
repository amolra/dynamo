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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app_component_edit_1 = require("./angular-setup/file-base-edit/app-component-edit");
const index_1 = require("./angular-setup/index");
const node_setup_1 = require("./node-setup");
const add_fields_in_files_1 = require("./angular-setup/file-base-edit/add-fields-in-files");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)()); // include before other routes
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/project-setup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.body', req.body);
    req.body.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
        const { parentModuleName, newModuleName, componentName, fields, serviceMethodName, } = element;
        yield (0, index_1.createprojectStructure)(parentModuleName, newModuleName, componentName, fields, serviceMethodName).subscribe((result) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('result', result);
            if (result) {
                yield (0, app_component_edit_1.addModulesInAppModule)().subscribe((resultAddModulesInAppModule) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log('resultAddModulesInAppModule', resultAddModulesInAppModule);
                    if (resultAddModulesInAppModule) {
                        console.log('reading app module');
                        yield (0, app_component_edit_1.appModuleChanges)().subscribe((resultAppModuleChanges) => __awaiter(void 0, void 0, void 0, function* () {
                            console.log('resultAppModuleChanges', resultAppModuleChanges);
                            if (resultAppModuleChanges) {
                                console.log('Successfully inserted app module');
                                yield (0, add_fields_in_files_1.componentStructure)(parentModuleName, newModuleName, componentName, fields, serviceMethodName).subscribe((resultComponentStructure) => {
                                    console.log('resultComponentStructure', resultComponentStructure);
                                    if (resultAppModuleChanges) {
                                        console.log('Successfully inserted resultComponentStructure');
                                    }
                                    else
                                        res.send('resultComponentStructure API Failed');
                                });
                            }
                            else
                                res.send('inserted app module API Failed');
                        }));
                    }
                    else
                        res.send('reading app module API Failed');
                }));
                res.send('Successfully installed');
            }
            else
                res.send('installed API Failed');
        }));
    }));
}));
// app.get('/add-modules-in-app', async (req, res) => {
//   await addModulesInAppModule().subscribe((result: boolean) => {
//     console.log('result', result);
//     if (result) res.send('reading app module');
//     else res.send('API Failed');
//   });
// });
// app.get('/app-file-code-add', async (req, res) => {
//   await appModuleChanges().subscribe((result: boolean) => {
//     console.log('result', result);
//     if (result) res.send('Successfully inserted app module');
//     else res.send('API Failed');
//   });
// });
// app.get('/login-file-code-add', async (req, res) => {
//   await loginStructure().subscribe((result: boolean) => {
//     console.log('result', result);
//     if (result) res.send('Successfully inserted login module');
//     else res.send('API Failed');
//   });
// });
app.get('/login-api-code-add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, node_setup_1.ApiSetting)().subscribe((result) => {
        console.log('result', result);
        if (result)
            res.send('Successfully created api');
        else
            res.send('API Failed');
    });
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
