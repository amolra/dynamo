import { BehaviorSubject, Observable } from "rxjs";

import fs, { readFile, writeFile } from "fs";
import { reactDirMyApp } from "../constants";

export function generateTsconfig(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const tsConfigFile = reactDirMyApp+"tsconfig.json";
  console.log(tsConfigFile);
  if (!fs.existsSync(tsConfigFile)) {
    fs.open(tsConfigFile, "w", function (err, file) {
      if (err) throw err;
      console.log("Saved!" + tsConfigFile);
    });
    const contents = `{
        "compilerOptions": {
          "outDir": "./dist/",
          "noImplicitAny": true,
          "module": "es6",
          "target": "es5",
          "jsx": "react",
          "allowJs": true,
          "moduleResolution": "Node"
        }
      }`;
    console.log(contents);
    writeFile(tsConfigFile, contents, "utf-8", function (err) {
      console.log(err);
      subToReturn.next(true);
    });
  }

  console.log("write file complete");
  return subToReturn.asObservable();
}
