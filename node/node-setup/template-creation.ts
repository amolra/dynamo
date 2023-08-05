import { BehaviorSubject, Observable, Subject } from 'rxjs';
import fs from 'fs';
import path from 'path';
import {
  nodeDirMyApp,
  reactDirMyApp,
  reactDirPathForDownload,
} from '../constants';

export function createTemplate(
  htmlContent: string,
  cssContent: string,
  templateDirectoryName: string
): Observable<string> {
  const subToReturn = new BehaviorSubject<string>('NotConfirm');

  const templateDir = path.join(nodeDirMyApp, 'templates');
  // fs.mkdirSync(templateDirPath1, { recursive: true });
  const templateDirPath = path.join(templateDir, templateDirectoryName);
  if (!fs.existsSync(templateDirPath)) {
    //fs.mkdirSync(templateDirPath, { recursive: true });

    try {
      fs.mkdirSync(templateDirPath, { recursive: true });
      // Write the HTML content to index.html
      //create html n css files path
      const indexPathForNode = path.join(templateDirPath, 'index.html');
      const stylesPathForNode = path.join(templateDirPath, 'styles.css');

      fs.writeFile(
        indexPathForNode,
        htmlContent,
        { encoding: 'utf8' },
        (error) => {
          if (error) {
            console.error(`Error creating index.html: ${error}`);
            subToReturn.next('error');
          } else {
            console.log(`index.html created successfully: ${indexPathForNode}`);
            // Write the CSS content to styles.css
            fs.writeFile(
              stylesPathForNode,
              cssContent,
              { encoding: 'utf8' },
              (error) => {
                if (error) {
                  console.error(`Error creating styles.css: ${error}`);
                  subToReturn.next('error');
                } else {
                  console.log(
                    `styles.css created successfully: ${stylesPathForNode}`
                  );
                  subToReturn.next('completed');
                }
              }
            );
          }
        }
      );
    } catch (error) {
      console.error('Error creating template directory:', error);
      subToReturn.next('error');
      // return subToReturn.asObservable();
    }
  } else {
    console.log('In amol');
    subToReturn.next('already Created');
    //return subToReturn.asObservable();
  }
  return subToReturn.asObservable();
}
