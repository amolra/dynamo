import express, { response } from 'express';
import cors from 'cors';
import {
  addModulesInAppModule,
  appModuleChanges,
} from './angular-setup/file-base-edit/app-component-edit';
// import { loginStructure } from './angular-setup/file-base-edit/login-code-add';
import {
  createComponentService,
  createModules,
  createprojectStructure,
} from './angular-setup/index';
import { ApiSetting, createIndexTs, packageEdit } from './node-setup';
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
  res.json({ result: true });
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
          tableName,
          tableNameForTransaction,
          typeOfOpration,
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
                              serviceMethodName,
                              typeOfOpration
                            ).subscribe((resultComponentStructure: boolean) => {
                              console.log(
                                'resultComponentStructure',
                                resultComponentStructure
                              );
                              if (resultComponentStructure) {
                                console.log(
                                  'Successfully inserted resultComponentStructure'
                                );
                                if (res.headersSent !== true) {
                                  return res
                                    .contentType('application/json')
                                    .jsonp({ result: true });
                                }
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
    } else res.send('installed API Failed');
  });
});

app.post('/api-code-add', async (req, res) => {
  console.log('req.body', req.body);
  await ApiSetting().subscribe(async (result: boolean) => {
    console.log('result', result);
    if (result) {
      await req.body.forEach(async (element: any) => {
        console.log('element', element);
        const {
          parentModuleName,
          newModuleName,
          componentName,
          fields,
          serviceMethodName,
          tableNameForTransaction,
          typeOfOpration,
        } = element;
        createIndexTs(
          componentName,
          fields,
          serviceMethodName,
          typeOfOpration,
          tableNameForTransaction
        ).subscribe((resultcreateIndexTs: boolean) => {
          if (resultcreateIndexTs) {
            if (typeOfOpration !== 'List') {
              dbOprations('dynamo', tableNameForTransaction, fields).subscribe(
                (response: boolean) => {
                  if (response) {
                    // res.setHeader('Content-Type', 'application/json');
                    if (res.headersSent !== true) {
                      res
                        .contentType('application/json')
                        .jsonp({ result: true });
                    }
                  }
                }
              );
            } else {
              if (res.headersSent !== true) {
                res.contentType('application/json').jsonp({ result: true });
              }
            }
          }
        });
      });
    } else res.send('API Failed');
  });
});

app.post('/api-generate', async (req, res) => {
  console.log('post_data', req.body);
  let request = await http.request(
    {
      host: 'localhost',
      port: 3000,
      path: '/api-code-add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  request.write(JSON.stringify(req.body));
  request.end();
});
app.get('/mysql-connect-api', (req, res) => {
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
    if (response) {
      res.send('Successdully connected to db');
    }
  });
  // res.send('Loading ....');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
