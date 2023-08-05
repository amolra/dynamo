import { Observable, Subject } from 'rxjs';
import fs from 'fs';
import path from 'path';
import {  reactDirMyApp, reactDirPathForDownload } from '../constants';


export function createTemplateForReact(
  htmlContent: string,
  cssContent: string,
): Observable<boolean> {
  const subToReturn = new Subject<boolean>();
  const indexPath = path.join(reactDirMyApp, 'index.html');
  const stylesPath = path.join(reactDirPathForDownload, 'index.css');


  // in htmlContent: when you see %%root%% replace it with <div id="root"></div>
  

  let htmlContentEdited = htmlContent.replace("%%root%%", "<div id=\"root\"></div> <script type=\"module\" src=\"/src/main.tsx\"></script>");
      //then in index.html  replace <body></body> with htmlContentEdited
      //read index.html content
      fs.readFile(indexPath, 'utf8', (err, html_content) => {
        if (err) {
          console.error('Error reading the file:', err);
          return;
        }
        else {
          const bodyStart = html_content.indexOf('<body>');
          const bodyEnd = html_content.indexOf('</body>') + '</body>'.length;
          const updated_html_content =
            html_content.substring(0, bodyStart) + htmlContentEdited + html_content.substring(bodyEnd);
          //write updated content inside index.html
          fs.writeFile(indexPath, updated_html_content, 'utf8', (err) => {
            if (err) {
              console.error('Error writing to the file:', err);
              return;
            }
            console.log('HTML file updated successfully!');
            // Write the CSS content to styles.css
            fs.writeFile(stylesPath, cssContent, { encoding: 'utf-8' }, (error) => {
              if (error) {
                console.error(`Error creating styles.css: ${error}`);
                subToReturn.next(false);
              } else {
                console.log(`styles.css created successfully: ${stylesPath}`);
                subToReturn.next(true);
              }
            });
          });
        }
   console.log('index.html created successfully: ', indexPath);   
  });

  return subToReturn.asObservable();
}
