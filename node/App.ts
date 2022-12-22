import express, { response } from 'express';
import cors from 'cors';
import {
  addModulesInAppModule,
  appModuleChanges,
} from './angular-setup/file-base-edit/app-component-edit';
import { loginStructure } from './angular-setup/file-base-edit/login-code-add';
import {
  createComponentService,
  createModules,
  createprojectStructure,
} from './angular-setup/index';
import { ApiSetting, packageEdit } from './node-setup';
import { componentStructure } from './angular-setup/file-base-edit/add-fields-in-files';
import { fields, requestFields } from './interfaces/fields';
import http from 'http';
import {
  dabataseManipulation,
  dbOprations,
  useDatabase,
} from './node-setup/database/db-table-generation';
import { Observable } from 'rxjs';
const querystring = require('querystring');
const app = express();
const port = 3000;
app.use(cors()); // include before other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/project-setup', async (req, res) => {
  console.log('req.body', req.body);
  await createprojectStructure().subscribe(async (result: boolean) => {
    if (result) {
      req.body.forEach(async (element: requestFields) => {
        const {
          parentModuleName,
          newModuleName,
          componentName,
          fields,
          serviceMethodName,
        } = element;
        await createModules(parentModuleName, newModuleName).subscribe(
          (resultcreateModules: boolean) => {
            if (resultcreateModules) {
              createComponentService(
                parentModuleName,
                newModuleName,
                componentName
              ).subscribe(async (resultcreateComponentService: boolean) => {
                if (resultcreateComponentService) {
                  // subToReturn.next(true);

                  console.log('result', result);

                  await addModulesInAppModule().subscribe(
                    async (resultAddModulesInAppModule: boolean) => {
                      console.log(
                        'resultAddModulesInAppModule',
                        resultAddModulesInAppModule
                      );
                      if (resultAddModulesInAppModule) {
                        console.log('reading app module');
                        await appModuleChanges(
                          parentModuleName,
                          newModuleName,
                          componentName
                        ).subscribe(async (resultAppModuleChanges: boolean) => {
                          console.log(
                            'resultAppModuleChanges',
                            resultAppModuleChanges
                          );
                          if (resultAppModuleChanges) {
                            console.log('Successfully inserted app module');
                            await componentStructure(
                              parentModuleName,
                              newModuleName,
                              componentName,
                              fields,
                              serviceMethodName
                            ).subscribe((resultComponentStructure: boolean) => {
                              console.log(
                                'resultComponentStructure',
                                resultComponentStructure
                              );
                              if (resultComponentStructure) {
                                console.log(
                                  'Successfully inserted resultComponentStructure'
                                );
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
                              } else
                                res.send('resultComponentStructure API Failed');
                            });
                          } else res.send('inserted app module API Failed');
                        });
                      } else res.send('reading app module API Failed');
                    }
                  );
                }
              });
            }
          }
        );
      });
      res.send('Successfully installed');
    } else res.send('installed API Failed');
  });
});
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
app.post('/login-api-code-add', async (req, res) => {
  console.log('req.body', req.body);
  const {
    parentModuleName,
    newModuleName,
    componentName,
    fields,
    serviceMethodName,
  } = req.body;
  await ApiSetting(
    parentModuleName,
    newModuleName,
    componentName,
    fields,
    serviceMethodName
  ).subscribe((result: boolean) => {
    console.log('result', result);
    if (result) res.send('Successfully created api');
    else res.send('API Failed');
  });
});
app.get('/mysql-connect-api', (req, res) => {
  // dabataseManipulation().then((response: Observable<boolean>) => {
  //   response.subscribe((resp: boolean) => {
  //     if (resp) res.send('Successfully connected mysql');
  //   });
  // });
  const fields: fields[] = [
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
  dbOprations('dynamo', 'register', fields).subscribe((response: boolean) => {
    if (response) res.send('Successdully connected to db');
  });
  // res.send('Loading ....');
});
app.get('/login-api', async (req, res) => {
  let post_data = querystring.stringify({
    parentModuleName: 'app',
    newModuleName: 'login',
    componentName: 'login',
    serviceMethodName: 'login',
    fields: [
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
    ],
  });
  let request = await http.request(
    {
      host: 'localhost',
      port: 3000,
      path: '/login-api-code-add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(post_data),
        // headers such as "Cookie" can be extracted from req object and sent to /test
      },
    },
    function (response) {
      var data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        res.end('check result: ' + data);
      });
    }
  );
  request.write(post_data);
  request.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
