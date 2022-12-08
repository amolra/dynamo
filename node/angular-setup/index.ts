import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { exec } from 'shelljs';
import process from 'process';

import {
  baseDirName,
  angularDir,
  basePath,
  dir,
  projectFolder,
} from '../constants';

export function createFolders(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  let fs = require('fs');
  let childDirectories = [dir + '/' + angularDir, dir + '/nodejs-code'];
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
    basePath + projectFolder + '/angular-setup/install.sh',
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
