"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSetting = exports.runNodemon = exports.createIndexTs = exports.createMariadbConnectFile = exports.packageEdit = exports.tsEdit = exports.install = exports.changeDir = exports.createFolders = void 0;
const rxjs_1 = require("rxjs");
const shelljs_1 = require("shelljs");
const process_1 = __importDefault(require("process"));
const fs_1 = __importStar(require("fs"));
const constants_1 = require("../constants");
function createFolders(fetTech) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const fs = require("fs");
    // const dirCode = fetTech === 'Angular' ? angularDir : reactDir;
    let childDirectories = [constants_1.dir + "/" + constants_1.nodeDir];
    let i = 0;
    childDirectories.forEach((directory) => {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        i++;
        if (i === childDirectories.length) {
            subToReturn.next(true);
        }
    });
    return subToReturn.asObservable();
}
exports.createFolders = createFolders;
function changeDir(dirName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    console.log("change dir", constants_1.basePath + constants_1.baseDirName + "/" + dirName);
    process_1.default.chdir(constants_1.basePath + constants_1.baseDirName + "/" + dirName);
    subToReturn.next(true);
    return subToReturn.asObservable();
}
exports.changeDir = changeDir;
function install() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    (0, shelljs_1.exec)(constants_1.basePath + constants_1.projectFolder + "/node-setup/install.sh", (error, stdout, stderr) => {
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
    });
    return subToReturn.asObservable();
}
exports.install = install;
function tsEdit() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const tsConfigFile = "tsconfig.json";
    console.log(tsConfigFile);
    (0, fs_1.readFile)(tsConfigFile, "utf-8", function (err, contents) {
        if (err) {
            console.log(err);
            //   return;
        }
        const replaced = contents.replace(`// "outDir": "./"`, `"outDir": "./dist"`);
        (0, fs_1.writeFile)(tsConfigFile, replaced, "utf-8", function (err) {
            console.log(err);
        });
        subToReturn.next(true);
    });
    console.log("write file complete");
    return subToReturn.asObservable();
}
exports.tsEdit = tsEdit;
function packageEdit() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const tsConfigFile = "package.json";
    console.log(tsConfigFile);
    (0, fs_1.readFile)(tsConfigFile, "utf-8", function (err, contents) {
        if (err) {
            console.log(err);
            //   return;
        }
        const searched = contents.includes(`"test": "echo \\"Error: no test specified\\" && exit 1"`);
        const replaced = contents.replace(`"test": "echo \\"Error: no test specified\\" && exit 1"`, `"build": "npx tsc",
        "start": "node dist/index.js",
        "dev": "concurrently \\"npx tsc --watch\\" \\"nodemon -q dist/index.js\\""
        `);
        (0, fs_1.writeFile)(tsConfigFile, replaced, "utf-8", function (err) {
            console.log(err);
        });
        subToReturn.next(true);
    });
    console.log("write file complete");
    return subToReturn.asObservable();
}
exports.packageEdit = packageEdit;
function createMariadbConnectFile() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    if (!fs_1.default.existsSync("database")) {
        fs_1.default.mkdirSync("database", { recursive: true });
    }
    const tsConfigFile = constants_1.basePath + constants_1.projectFolder + "/node-setup/database/mysql-connect.ts";
    const tsConfigFileWrite = "./database/mysql-connect.ts";
    const tsConfigFileQuery = "./database/mysql-queries.ts";
    console.log(tsConfigFile);
    if (!fs_1.default.existsSync(tsConfigFileWrite)) {
        fs_1.default.open(tsConfigFileWrite, "w", function (err, file) {
            if (err)
                throw err;
            console.log("Saved!" + tsConfigFileWrite);
        });
        (0, fs_1.readFile)(tsConfigFile, "utf-8", function (err, contents) {
            if (err) {
                console.log(err);
                //   return;
            }
            console.log(contents);
            (0, fs_1.writeFile)(tsConfigFileWrite, contents, "utf-8", function (err) {
                console.log(err);
            });
        });
    }
    if (!fs_1.default.existsSync(tsConfigFileQuery)) {
        fs_1.default.open(tsConfigFileQuery, "w", function (err, file) {
            if (err)
                throw err;
            console.log("Saved!" + tsConfigFileQuery);
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
        (0, fs_1.writeFile)(tsConfigFileQuery, contentQuery, "utf-8", function (err) {
            console.log(err);
            subToReturn.next(true);
        });
    }
    console.log("write file complete");
    return subToReturn.asObservable();
}
exports.createMariadbConnectFile = createMariadbConnectFile;
function createIndexTs(componentName, fields, serviceMethodName, typeOfOpration, tableNameForTransaction) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const routingFile = "index.ts";
    // Need to do below things
    //1. create mariadb connect file
    //2. create query to select and insert inside of api.
    console.log(routingFile);
    let indexFileContent = ``;
    if (!fs_1.default.existsSync(routingFile)) {
        fs_1.default.open(routingFile, "w", function (err, file) {
            if (err)
                throw err;
            console.log("Saved!");
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
    }
    else {
        indexFileContent = fs_1.default.readFileSync(routingFile).toString();
    }
    let contentApi = ``;
    if (typeOfOpration === "List") {
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
    }
    else {
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
    const data = indexFileContent.toString().split("\n");
    const lastIndex = data
        .reverse()
        .findIndex((ele) => ele.includes("app.listen(port, () => {"));
    data.splice(lastIndex + 1, 0, `${contentApi}`);
    data.reverse();
    const text = data.join("\n");
    fs_1.default.writeFileSync(routingFile, text, "utf-8");
    console.log("write file complete");
    subToReturn.next(true);
    return subToReturn.asObservable();
}
exports.createIndexTs = createIndexTs;
function runNodemon() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    (0, shelljs_1.exec)(constants_1.basePath + constants_1.projectFolder + "/node-setup/nodemonInstall.sh", (error, stdout, stderr) => {
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
    });
    return subToReturn.asObservable();
}
exports.runNodemon = runNodemon;
function ApiSetting() {
    const subToReturn = new rxjs_1.Subject();
    createFolders("").subscribe((res) => {
        if (res) {
            changeDir(constants_1.nodeDir).subscribe((result) => {
                if (result) {
                    install().subscribe((resultInstall) => {
                        if (resultInstall) {
                            tsEdit().subscribe((resulttsEdit) => {
                                if (resulttsEdit) {
                                    packageEdit().subscribe((resultPackageEdit) => {
                                        if (resultPackageEdit) {
                                            createMariadbConnectFile().subscribe((resultcreateIndexTs) => {
                                                if (resultcreateIndexTs) {
                                                    runNodemon().subscribe((resultcreateRunNodemon) => {
                                                        if (resultcreateRunNodemon) {
                                                            subToReturn.next(true);
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
exports.ApiSetting = ApiSetting;
