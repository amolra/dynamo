import express from 'express';
import cors from 'cors';
import {
  addModulesInAppModule,
  appModuleChanges,
} from './angular-setup/file-base-edit/app-component-edit';
import { loginStructure } from './angular-setup/file-base-edit/login-code-add';
import { createprojectStructure } from './angular-setup/index';
import { ApiSetting, packageEdit } from './node-setup';
import { componentStructure } from './angular-setup/file-base-edit/add-fields-in-files';
import { requestFields } from './interfaces/fields';

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

  req.body.forEach(async (element: requestFields) => {
    const {
      parentModuleName,
      newModuleName,
      componentName,
      fields,
      serviceMethodName,
    } = element;
    await createprojectStructure(
      parentModuleName,
      newModuleName,
      componentName,
      fields,
      serviceMethodName
    ).subscribe(async (result: boolean) => {
      console.log('result', result);
      if (result) {
        await addModulesInAppModule().subscribe(
          async (resultAddModulesInAppModule: boolean) => {
            console.log(
              'resultAddModulesInAppModule',
              resultAddModulesInAppModule
            );
            if (resultAddModulesInAppModule) {
              console.log('reading app module');
              await appModuleChanges().subscribe(
                async (resultAppModuleChanges: boolean) => {
                  console.log('resultAppModuleChanges', resultAppModuleChanges);
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
                      if (resultAppModuleChanges) {
                        console.log(
                          'Successfully inserted resultComponentStructure'
                        );
                      } else res.send('resultComponentStructure API Failed');
                    });
                  } else res.send('inserted app module API Failed');
                }
              );
            } else res.send('reading app module API Failed');
          }
        );
        res.send('Successfully installed');
      } else res.send('installed API Failed');
    });
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
app.get('/login-api-code-add', async (req, res) => {
  await ApiSetting().subscribe((result: boolean) => {
    console.log('result', result);
    if (result) res.send('Successfully created api');
    else res.send('API Failed');
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
