import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { exec } from 'shelljs';
import process from 'process';

import {
  baseDirName,
  angularDir,
  basePath,
  dir,
  projectFolder,
  nodeDir,
  angularDirPathForDownload,
  reactDir,
} from '../constants';
import { fields } from '../interfaces/fields';

export function createFolders(fetTech: string): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const fs = require('fs');
  const dirCode = fetTech === 'Angular' ? angularDir : reactDir;
  
  let childDirectories = [dir + '/' + dirCode];
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
export function install(fetTech: string): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const dir = fetTech === 'Angular' ? angularDir : reactDir;
  exec(
    basePath +
      projectFolder +
      '/' +
      fetTech.toLowerCase() +
      '-setup/install.sh ' +
      basePath +
      baseDirName +
      '/' +
      dir,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error}`);
        // return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        // return;
      }
      console.log(`stdout: ${stdout}`);
      subToReturn.next(true);
    }
  );
  return subToReturn.asObservable();
}
export function createModules(
  fetTech: string,
  parentModule: string,
  newModule: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const dir = fetTech === 'Angular' ? angularDirPathForDownload : reactDir;
  console.log(
    basePath +
      projectFolder +
      '/' +
      fetTech.toLowerCase() +
      '-setup/module-creation.sh ' +
      dir +
      ' ' +
      parentModule +
      ' ' +
      newModule
  );
  exec(
    basePath +
      projectFolder +
      '/' +
      fetTech.toLowerCase() +
      '-setup/module-creation.sh ' +
      dir +
      ' ' +
      parentModule +
      ' ' +
      newModule,
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
export function createComponentService(
  fetTech: string,
  parentModule: string,
  newModule: string,
  componentName: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const dir = fetTech === 'Angular' ? angularDirPathForDownload : reactDir;
  console.log(
    basePath +
      projectFolder +
      '/' +
      fetTech.toLowerCase() +
      '-setup/component-creation.sh ' +
      dir +
      ' ' +
      parentModule +
      ' ' +
      newModule +
      ' ' +
      componentName
  );
  exec(
    basePath +
      projectFolder +
      '/' +
      fetTech.toLowerCase() +
      '-setup/component-creation.sh ' +
      dir +
      ' ' +
      parentModule +
      ' ' +
      newModule +
      ' ' +
      componentName,
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
export function changeDir(dirName: string): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  console.log(
    "basePath + baseDirName + '/' + dirName",
    basePath + baseDirName + '/' + dirName
  );
  process.chdir(basePath + baseDirName + '/' + dirName);
  subToReturn.next(true);
  return subToReturn.asObservable();
}

export function createprojectStructure(fetTech: string): Observable<boolean> {
  const subToReturn = new Subject<boolean>();
  const dir = fetTech === 'Angular' ? angularDir : reactDir;
  createFolders(fetTech).subscribe((res: boolean) => {
    if (res) {
      changeDir(dir).subscribe((result: boolean) => {
        if (result) {
          install(fetTech).subscribe((resultInstall: boolean) => {
            if (resultInstall) {
              subToReturn.next(true);
            }
          });
        }
      });
    }
  });
  return subToReturn.asObservable();
}
