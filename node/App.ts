import express from 'express';
import cors from 'cors';
import { appModuleChanges } from './angular-setup/file-base-edit/app-component-edit';
import { loginStructure } from './angular-setup/file-base-edit/login-code-add';
import { createprojectStructure } from './angular-setup/index';
import { ApiSetting, packageEdit } from './node-setup';

const app = express();
const port = 3000;
app.use(cors()); // include before other routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/project-setup', async (req, res) => {
  await createprojectStructure().subscribe((result: boolean) => {
    console.log('result', result);
    if (result) res.send('Successfully installed');
    else res.send('API Failed');
  });
});
app.get('/app-file-code-add', async (req, res) => {
  await appModuleChanges().subscribe((result: boolean) => {
    console.log('result', result);
    if (result) res.send('Successfully inserted app module');
    else res.send('API Failed');
  });
});
app.get('/login-file-code-add', async (req, res) => {
  await loginStructure().subscribe((result: boolean) => {
    console.log('result', result);
    if (result) res.send('Successfully inserted login module');
    else res.send('API Failed');
  });
});
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
