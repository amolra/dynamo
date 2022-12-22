import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { exec } from 'shelljs';
import process from 'process';
import fs, { readFile, writeFile } from 'fs';
import {
  baseDirName,
  nodeDir,
  basePath,
  dir,
  projectFolder,
} from '../constants';
import { fields } from '../interfaces/fields';
export function changeDir(dirName: string): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  console.log('change dir', basePath + baseDirName + '/' + dirName);
  process.chdir(basePath + baseDirName + '/' + dirName);
  subToReturn.next(true);
  return subToReturn.asObservable();
}
export function install(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);

  exec(
    basePath + projectFolder + '/node-setup/install.sh',
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      subToReturn.next(true);
    }
  );
  return subToReturn.asObservable();
}
export function tsEdit(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const tsConfigFile = 'tsconfig.json';
  console.log(tsConfigFile);

  readFile(tsConfigFile, 'utf-8', function (err, contents) {
    if (err) {
      console.log(err);
      //   return;
    }

    const replaced = contents.replace(
      `// "outDir": "./"`,
      `"outDir": "./dist"`
    );

    writeFile(tsConfigFile, replaced, 'utf-8', function (err) {
      console.log(err);
    });
    subToReturn.next(true);
  });

  console.log('write file complete');
  return subToReturn.asObservable();
}
export function packageEdit(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);

  const tsConfigFile = 'package.json';
  console.log(tsConfigFile);

  readFile(tsConfigFile, 'utf-8', function (err, contents) {
    if (err) {
      console.log(err);
      //   return;
    }
    const searched = contents.includes(
      `"test": "echo \\"Error: no test specified\\" && exit 1"`
    );

    const replaced = contents.replace(
      `"test": "echo \\"Error: no test specified\\" && exit 1"`,
      `"build": "npx tsc",
        "start": "node dist/index.js",
        "dev": "concurrently \\"npx tsc --watch\\" \\"nodemon -q dist/index.js\\""
        `
    );

    writeFile(tsConfigFile, replaced, 'utf-8', function (err) {
      console.log(err);
    });

    subToReturn.next(true);
  });

  console.log('write file complete');
  return subToReturn.asObservable();
}
export function createIndexTs(
  componentName: string,
  fields: fields[],
  serviceMethodName: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const routingFile = 'index.ts';
  console.log(routingFile);
  if (!fs.existsSync(routingFile)) {
    fs.open(routingFile, 'w', function (err, file) {
      if (err) throw err;
      console.log('Saved!');
    });
  }
  let contentApi = ` app.post('/${serviceMethodName}', (req: Request, res: Response) => {
    console.log('receiving data ...');
    console.log('body is ',req.body);
    if(req.body.userName==='asd' && req.body.password==='asd')
    res.send({'result':true});
    else
    res.send({'result':false});
  });`;
  const indexFileContent = `import express, { Express, Request, Response } from 'express';
  import cors from 'cors';
  const app: Express = express();
  const port = 4500;
  app.use(cors()); // include before other routes
  app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });
  app.use(cors()); // include before other routes
  ${contentApi}
  
  app.listen(port, () => {
    console.log(\`⚡️[server]: Server is running at https://localhost:\${port}\`);
  });`;
  fs.writeFileSync(routingFile, indexFileContent, 'utf-8');
  console.log('write file complete');
  subToReturn.next(true);
  return subToReturn.asObservable();
}
export function runNodemon(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);

  exec(
    basePath + projectFolder + '/node-setup/nodemonInstall.sh',
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      subToReturn.next(true);
    }
  );
  return subToReturn.asObservable();
}
export function ApiSetting(
  parentModuleName: string,
  newModuleName: string,
  componentName: string,
  fields: fields[],
  serviceMethodName: string
): Observable<boolean> {
  const subToReturn = new Subject<boolean>();
  changeDir(nodeDir).subscribe((result: boolean) => {
    if (result) {
      install().subscribe((resultInstall: boolean) => {
        if (resultInstall) {
          tsEdit().subscribe((resulttsEdit: boolean) => {
            if (resulttsEdit) {
              packageEdit().subscribe((resultPackageEdit: boolean) => {
                if (resultPackageEdit) {
                  createIndexTs(
                    componentName,
                    fields,
                    serviceMethodName
                  ).subscribe((resultcreateIndexTs: boolean) => {
                    if (resultcreateIndexTs) {
                      runNodemon().subscribe(
                        (resultcreateRunNodemon: boolean) => {
                          if (resultcreateRunNodemon) {
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
    }
  });

  return subToReturn.asObservable();
}
