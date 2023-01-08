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
export function createMariadbConnectFile() {
  const subToReturn = new BehaviorSubject<boolean>(false);
  if (!fs.existsSync('database')) {
    fs.mkdirSync('database', { recursive: true });
  }
  const tsConfigFile =
    basePath + projectFolder + '/node-setup/database/mysql-connect.ts';
  const tsConfigFileWrite = './database/mysql-connect.ts';
  const tsConfigFileQuery = './database/mysql-queries.ts';
  console.log(tsConfigFile);
  if (!fs.existsSync(tsConfigFileWrite)) {
    fs.open(tsConfigFileWrite, 'w', function (err, file) {
      if (err) throw err;
      console.log('Saved!' + tsConfigFileWrite);
    });
    readFile(tsConfigFile, 'utf-8', function (err, contents) {
      if (err) {
        console.log(err);
        //   return;
      }
      console.log(contents);
      writeFile(tsConfigFileWrite, contents, 'utf-8', function (err) {
        console.log(err);
      });
    });
  }
  if (!fs.existsSync(tsConfigFileQuery)) {
    fs.open(tsConfigFileQuery, 'w', function (err, file) {
      if (err) throw err;
      console.log('Saved!' + tsConfigFileQuery);
    });

    const contentQuery = `import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
    
    import { pool } from './mysql-connect';
    export async function selectQuery(
      tableNameForTransaction: string
    ): Promise<Observable<any>> {
      const subToReturn = new BehaviorSubject<any>([]);
      try {
        const result = await pool.query('SELECT * FROM  ' + tableNameForTransaction);
        subToReturn.next(result);
        console.log(result);
      } catch (err) {
        throw err;
      }
    
      return subToReturn.asObservable();
    }
    export async function insertQuery(
      tableNameForTransaction: string,
      fields:any
    ): Promise<Observable<boolean>> {
      const subToReturn = new BehaviorSubject<boolean>(false);
      try {
        let keysAr = [];
        let valuesAr = [];
        keysAr = Object.keys(fields);
          valuesAr = Object.values(fields);
        valuesAr.forEach((ele,index)=>{
          valuesAr[index] = '"'+ele+'"';
        });
        const result = await pool.query('INSERT INTO  ' + tableNameForTransaction+'('+keysAr.join(",")+') VALUES ('+valuesAr.join(",")+')');
        subToReturn.next(true);
        console.log(result);
      } catch (err) {
        throw err;
      }
    
      return subToReturn.asObservable();
    }`;
    writeFile(tsConfigFileQuery, contentQuery, 'utf-8', function (err) {
      console.log(err);

      subToReturn.next(true);
    });
  }
  console.log('write file complete');
  return subToReturn.asObservable();
}
export function createIndexTs(
  componentName: string,
  fields: fields[],
  serviceMethodName: string,
  typeOfOpration: string,
  tableNameForTransaction: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const routingFile = 'index.ts';
  // Need to do below things
  //1. create mariadb connect file
  //2. create query to select and insert inside of api.

  console.log(routingFile);
  let indexFileContent = ``;
  if (!fs.existsSync(routingFile)) {
    fs.open(routingFile, 'w', function (err, file) {
      if (err) throw err;
      console.log('Saved!');
    });
    indexFileContent = `import express, { Express, Request, Response } from 'express';
      import cors from 'cors';
      import {selectQuery,insertQuery} from './database/mysql-queries';
      const app: Express = express();
      const port = 4500;
      app.use(cors()); // include before other routes
      app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
      app.get('/', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server');
      });
      app.use(cors()); // include before other routes
      
      app.listen(port, () => {
        console.log(\`⚡️[server]: Server is running at https://localhost:\${port}\`);
      });`;
  } else {
    indexFileContent = fs.readFileSync(routingFile).toString();
  }

  let contentApi = ``;
  if (typeOfOpration === 'List') {
    contentApi = ` app.get('/${serviceMethodName}', (req: Request, res: Response) => {
      console.log('receiving data ...');
      console.log('body is ',req.body);
      selectQuery('${tableNameForTransaction}').then((resp)=>{
        resp.subscribe((response)=>{
        res.send({'result':response});
      });
      // if(req.body.userName==='asd' && req.body.password==='asd')
      // res.send({'result':true});
      // else
      // res.send({'result':false});
    });
    });
    `;
  } else {
    contentApi = ` app.post('/${serviceMethodName}', (req: Request, res: Response) => {
      console.log('receiving data ...');
      console.log('body is ',req.body);
      insertQuery('${tableNameForTransaction}',req.body).then((resp)=>{
        resp.subscribe((response)=>{
          if(response)
            res.send({'result':response});
      });
      // if(req.body.userName==='asd' && req.body.password==='asd')
      // res.send({'result':true});
      // else
      // res.send({'result':false});
    });
    });
    `;
  }

  const data = indexFileContent.toString().split('\n');
  const lastIndex = data
    .reverse()
    .findIndex((ele) => ele.includes('app.listen(port, () => {'));
  data.splice(lastIndex + 1, 0, `${contentApi}`);
  data.reverse();
  const text = data.join('\n');
  fs.writeFileSync(routingFile, text, 'utf-8');
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
export function ApiSetting(): Observable<boolean> {
  const subToReturn = new Subject<boolean>();
  changeDir(nodeDir).subscribe((result: boolean) => {
    if (result) {
      install().subscribe((resultInstall: boolean) => {
        if (resultInstall) {
          tsEdit().subscribe((resulttsEdit: boolean) => {
            if (resulttsEdit) {
              packageEdit().subscribe((resultPackageEdit: boolean) => {
                if (resultPackageEdit) {
                  createMariadbConnectFile().subscribe(
                    (resultcreateIndexTs: boolean) => {
                      if (resultcreateIndexTs) {
                        runNodemon().subscribe(
                          (resultcreateRunNodemon: boolean) => {
                            if (resultcreateRunNodemon) {
                              subToReturn.next(true);
                            }
                          }
                        );
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
