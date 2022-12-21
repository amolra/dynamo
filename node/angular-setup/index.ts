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
} from '../constants';
import { fields } from '../interfaces/fields';

export function createFolders(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const fs = require('fs');
  let childDirectories = [dir + '/' + angularDir, dir + '/' + nodeDir];
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
export function install(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);

  exec(
    basePath +
      projectFolder +
      '/angular-setup/install.sh ' +
      basePath +
      baseDirName +
      '/' +
      angularDir,
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
  parentModule: string,
  newModule: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  console.log(
    basePath +
      projectFolder +
      '/angular-setup/module-creation.sh ' +
      angularDirPathForDownload +
      ' ' +
      parentModule +
      ' ' +
      newModule
  );
  exec(
    basePath +
      projectFolder +
      '/angular-setup/module-creation.sh ' +
      angularDirPathForDownload +
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
  parentModule: string,
  newModule: string,
  componentName: string
): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  console.log(
    basePath +
      projectFolder +
      '/angular-setup/component-creation.sh ' +
      angularDirPathForDownload +
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
      '/angular-setup/component-creation.sh ' +
      angularDirPathForDownload +
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
  process.chdir(basePath + baseDirName + '/' + dirName);
  subToReturn.next(true);
  return subToReturn.asObservable();
}

export function createprojectStructure(): Observable<boolean> {
  const subToReturn = new Subject<boolean>();

  createFolders().subscribe((res: boolean) => {
    if (res) {
      changeDir(angularDir).subscribe((result: boolean) => {
        if (result) {
          install().subscribe((resultInstall: boolean) => {
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
