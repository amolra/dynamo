import { Observable, Subject } from 'rxjs';
import fs from 'fs';
import path from 'path';
import { nodeDirMyApp, reactDirMyApp, reactDirPathForDownload } from '../constants';


export function createTemplate(
  htmlContent: string,
  cssContent: string,
  templateDirectoryName: string,
): Observable<boolean> {
  const subToReturn = new Subject<boolean>();

  const templateDirPath1 = path.join(nodeDirMyApp, 'templates');
  fs.mkdirSync(templateDirPath1, { recursive: true });
  const templateDirPath = path.join(templateDirPath1, templateDirectoryName);
  fs.mkdirSync(templateDirPath, { recursive: true });
 
  // Create the 'templates' directory if it doesn't exist
  if (!fs.existsSync(path.join(nodeDirMyApp, 'templates'))) {
    try {
      fs.mkdirSync(path.join(nodeDirMyApp, 'templates'));
    } catch (error) {
      console.error('Error creating "templates" directory:', error);
      subToReturn.next(false);
      return subToReturn.asObservable();
    }
  }

  // Create the 'templateDirectoryName' directory inside 'templates'
  try {
    fs.mkdirSync(templateDirPath, { recursive: true });
    // Write the HTML content to index.html
    //create html n css files path
    const indexPathForNode = path.join(templateDirPath, 'index.html');
    const stylesPathForNode = path.join(templateDirPath, 'styles.css');

   fs.writeFile(indexPathForNode, htmlContent, { encoding: 'utf8' }, (error) => {
    if (error) {
      console.error(`Error creating index.html: ${error}`);
      subToReturn.next(false);
    } else {
      console.log(`index.html created successfully: ${indexPathForNode}`);
      // Write the CSS content to styles.css
      fs.writeFile(stylesPathForNode, cssContent, { encoding: 'utf8' }, (error) => {
        if (error) {
          console.error(`Error creating styles.css: ${error}`);
          subToReturn.next(false);
        } else {
          console.log(`styles.css created successfully: ${stylesPathForNode}`);
          subToReturn.next(true);
        }
      });
    }
  });
  } catch (error) {
    console.error('Error creating template directory:', error);
    subToReturn.next(false);
    return subToReturn.asObservable();
  }
   
  // const indexPath = path.join(reactDirMyApp,'public', 'index.html');
  // const stylesPath = path.join(reactDirPathForDownload, 'index.css');


  // // in htmlContent: when you see %%root%% replace it with <div id="root"></div>
  // const htmlContentEdited = htmlContent.replace('%%root%%', '<div id="root"></div>');

  // // Write the updated HTML content to index.html
  // fs.writeFile(indexPath, htmlContentEdited, 'utf8', (err) => {
  //   if (err) {
  //     console.error('Error writing to index.html:', err);
  //     subToReturn.next(false);
  //     return;
  //   }

  //   console.log('index.html created successfully: ', indexPath);

  //   // Write the CSS content to index.css
  //   fs.writeFile(stylesPath, cssContent, { encoding: 'utf-8' }, (error) => {
  //     if (error) {
  //       console.error('Error creating index.css:', error);
  //       subToReturn.next(false);
  //       return;
  //     } else {
  //       console.log('index.css created successfully: ', stylesPath);
  //       subToReturn.next(true);
  //     }
  //   });
  // });

  return subToReturn.asObservable();
}
