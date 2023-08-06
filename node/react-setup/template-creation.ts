import { Observable, Subject } from 'rxjs';
import fs from 'fs';
import path from 'path';
import { reactDirMyApp, reactDirPathForDownload } from '../constants';
export function createTemplateForReact(
  htmlContent: string,
  cssContent: string
): Observable<boolean> {
  const subToReturn = new Subject<boolean>();
  // htmlContent.replace('<p>%%root%%</P>', '<Outlet />');
  // htmlContent.replace('<p>%%menu%%</P>', '<Menu />');
  let componentElements = `
  import { Outlet, Link } from "react-router-dom";
  import { Menu } from "./Menu";

  export const Layout = () => {
  return (
    <>
   ${htmlContent
     .replace('<p>%%root%%</p>', '<Outlet />')
     .replace('<p>%%menu%%</p>', '<Menu />')
     .replace('body', 'div')
     .replace('body', 'div')}
    </>
  )
}
`;
  const filePath = `${reactDirPathForDownload}/Layout.tsx`;
  fs.writeFileSync(filePath, componentElements, { encoding: 'utf-8' });
  const stylesPathApp = path.join(reactDirPathForDownload, 'App.css');
  fs.writeFileSync(stylesPathApp, '', { encoding: 'utf-8' });
  const stylesPath = path.join(reactDirPathForDownload, 'index.css');
  fs.writeFile(stylesPath, cssContent, { encoding: 'utf-8' }, (error) => {
    if (error) {
      console.error(`Error creating styles.css: ${error}`);
      subToReturn.next(false);
    } else {
      console.log(`styles.css created successfully: ${stylesPath}`);
      subToReturn.next(true);
    }
  });
  // subToReturn.next(true);
  return subToReturn.asObservable();
}
