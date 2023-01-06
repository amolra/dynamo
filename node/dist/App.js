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
const http_1 = __importDefault(require("http"));
const db_table_generation_1 = require("./node-setup/database/db-table-generation");
const querystring = require('querystring');
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)()); // include before other routes
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({ result: true });
});
app.post('/project-setup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.body', req.body);
    yield (0, index_1.createprojectStructure)().subscribe((result) => __awaiter(void 0, void 0, void 0, function* () {
        if (result) {
            req.body.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                const { parentModuleName, newModuleName, componentName, fields, serviceMethodName, tableName, tableNameForTransaction, } = element;
                yield (0, index_1.createModules)(parentModuleName, newModuleName).subscribe((resultcreateModules) => {
                    if (resultcreateModules) {
                        (0, index_1.createComponentService)(parentModuleName, newModuleName, componentName).subscribe((resultcreateComponentService) => __awaiter(void 0, void 0, void 0, function* () {
                            if (resultcreateComponentService) {
                                // subToReturn.next(true);
                                console.log('result', result);
                                yield (0, app_component_edit_1.addModulesInAppModule)().subscribe((resultAddModulesInAppModule) => __awaiter(void 0, void 0, void 0, function* () {
                                    console.log('resultAddModulesInAppModule', resultAddModulesInAppModule);
                                    if (resultAddModulesInAppModule) {
                                        console.log('reading app module');
                                        yield (0, app_component_edit_1.appModuleChanges)(parentModuleName, newModuleName, componentName).subscribe((resultAppModuleChanges) => __awaiter(void 0, void 0, void 0, function* () {
                                            console.log('resultAppModuleChanges', resultAppModuleChanges);
                                            if (resultAppModuleChanges) {
                                                console.log('Successfully inserted app module');
                                                yield (0, add_fields_in_files_1.componentStructure)(parentModuleName, newModuleName, componentName, fields, serviceMethodName).subscribe((resultComponentStructure) => {
                                                    console.log('resultComponentStructure', resultComponentStructure);
                                                    if (resultComponentStructure) {
                                                        console.log('Successfully inserted resultComponentStructure');
                                                        if (res.headersSent !== true) {
                                                            // res.setHeader(
                                                            //   'Content-Type',
                                                            //   'application/json'
                                                            // );
                                                            return res
                                                                .contentType('application/json')
                                                                .jsonp({ result: true });
                                                        }
                                                        // let post_data = querystring.stringify({
                                                        //   parentModuleName,
                                                        //   newModuleName,
                                                        //   componentName,
                                                        //   fields,
                                                        //   serviceMethodName,
                                                        // });
                                                        // let request = await http.request(
                                                        //   {
                                                        //     host: 'localhost',
                                                        //     port: 3000,
                                                        //     path: '/login-api-code-add',
                                                        //     method: 'POST',
                                                        //     headers: {
                                                        //       'Content-Type':
                                                        //         'application/x-www-form-urlencoded',
                                                        //       'Content-Length':
                                                        //         Buffer.byteLength(post_data),
                                                        //       // headers such as "Cookie" can be extracted from req object and sent to /test
                                                        //     },
                                                        //   },
                                                        //   function (response) {
                                                        //     var data = 'amol="rajhans"';
                                                        //     response.setEncoding('utf8');
                                                        //     response.on('data', (chunk) => {
                                                        //       data += chunk;
                                                        //     });
                                                        //     response.on('end', () => {
                                                        //       res.end('check result: ' + data);
                                                        //     });
                                                        //   }
                                                        // );
                                                        // request.write(post_data);
                                                        // request.end();
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
                            }
                        }));
                    }
                });
            }));
        }
        else
            res.send('installed API Failed');
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
app.post('/login-api-code-add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.body', req.body);
    yield (0, node_setup_1.ApiSetting)().subscribe((result) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('result', result);
        if (result) {
            yield req.body.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                console.log('element', element);
                const { parentModuleName, newModuleName, componentName, fields, serviceMethodName, tableNameForTransaction, typeOfOpration, } = element;
                (0, node_setup_1.createIndexTs)(componentName, fields, serviceMethodName, typeOfOpration, tableNameForTransaction).subscribe((resultcreateIndexTs) => {
                    if (resultcreateIndexTs) {
                        (0, db_table_generation_1.dbOprations)('dynamo', tableNameForTransaction, fields).subscribe((response) => {
                            if (response) {
                                // res.setHeader('Content-Type', 'application/json');
                                if (res.headersSent !== true) {
                                    res.contentType('application/json').jsonp({ result: true });
                                }
                            }
                        });
                    }
                });
            }));
        }
        else
            res.send('API Failed');
    }));
}));
app.get('/mysql-connect-api', (req, res) => {
    // dabataseManipulation().then((response: Observable<boolean>) => {
    //   response.subscribe((resp: boolean) => {
    //     if (resp) res.send('Successfully connected mysql');
    //   });
    // });
    const fields = [
        {
            fieldName: 'userName',
            fieldLabel: 'User Name',
            fieldNameBackend: 'userName',
            lengthOfField: '100',
            typeOfField: 'text',
            validation: ['required', 'spacesNotAllowed', 'maxLength(100)'],
        },
        {
            fieldName: 'password',
            fieldLabel: 'password',
            fieldNameBackend: 'password',
            lengthOfField: '100',
            typeOfField: 'password',
            validation: ['required', 'spacesNotAllowed', 'maxLength(100)'],
        },
        {
            fieldName: 'confirmPassword',
            fieldLabel: 'Confirm Password',
            fieldNameBackend: 'confirmPassword',
            lengthOfField: '100',
            typeOfField: 'password',
            validation: ['required', 'spacesNotAllowed', 'maxLength(100)'],
        },
        {
            fieldName: 'firstName',
            fieldLabel: 'First Name',
            fieldNameBackend: 'firstName',
            lengthOfField: '100',
            typeOfField: 'text',
            validation: ['required', 'spacesNotAllowed', 'maxLength(100)'],
        },
    ];
    (0, db_table_generation_1.dbOprations)('dynamo', 'register', fields).subscribe((response) => {
        if (response) {
            res.send('Successdully connected to db');
        }
    });
    // res.send('Loading ....');
});
app.post('/login-api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('post_data', req.body);
    let request = yield http_1.default.request({
        host: 'localhost',
        port: 3000,
        path: '/login-api-code-add',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // headers such as "Cookie" can be extracted from req object and sent to /test
        },
    }, function (response) {
        var data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            res.end('check result: ' + data);
        });
    });
    request.write(JSON.stringify(req.body));
    request.end();
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
