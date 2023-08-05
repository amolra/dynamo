import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { createModules } from './index';
import { requestFields, fields } from '../interfaces/fields';
import fs from 'fs';
import path from 'path';
import { reactDirPathForDownload } from '../constants';

export function createEntireReactCode(
  fetTech: string,
  template: string,
  components: requestFields[]
): Observable<boolean> {
  const subToReturn = new Subject<boolean>();

  const capatalizeFirstLetterOfString = (data: string): string => {
    return data.charAt(0).toUpperCase() + data.slice(1);
  };

  const generateComponentFileContent = (
    fields: fields[],
    componentName: string,
    tableName: string,
    serviceMethodName: string,
    typeOfOpration: string
  ): string => {
    const componentNametoPass = capatalizeFirstLetterOfString(componentName);

    const generateInterface = (fields: fields[]): string => {
      const interfaceFields = fields.map(
        ({ fieldName, typeOfField }) => `${fieldName}: ${typeOfField};`
      );
      return `interface GeneratedInterface {\n${interfaceFields.join('\n')}\n}`;
    };

    const generateInterfaceCode = generateInterface(fields);
    let componentContent = '';
    if (typeOfOpration === 'Insert') {
      componentContent = `
      import React, { useState, useEffect } from 'react';
      import { useForm } from 'react-hook-form';
      import axios from 'axios';
      import { TextField, Button } from '@mui/material';

     

      const ${componentNametoPass}: React.FC = () => {
        const { handleSubmit, register } = useForm();

        const postData = (data) => {
          axios.post("http://localhost:4500/${serviceMethodName}",data)
              .then(response=>console.log(response.data))
              .catch(error=>console.log(error))
            }
          return (
          <div>
            <form onSubmit={handleSubmit(postData)}>
            ${fields
              .map((field) => {
                const { fieldName, fieldLabel, typeOfField } = field;
                return `
                <div key="${fieldName}">
                 <TextField
                    label="${fieldLabel}"
                    variant="outlined"
                    color="primary"     
                    type="${typeOfField}"
                    id="${fieldName}"
                    sx={{ mb: 3 }}
                    {...register("${fieldName}",{required:true})}
                 />
                </div>
              `;
              })
              .join('')}
            <Button variant="outlined" type="submit">Submit</Button>
            </form>  
          </div>
        );
      };

      export default ${componentNametoPass};
    `;
    } else if (typeOfOpration === 'List') {
      componentContent = `
      import React, { useState, useEffect } from 'react';
      import { useForm } from 'react-hook-form';
      import axios from 'axios';
      import { TextField, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
      
      const ${componentNametoPass}: React.FC = () => {
        const [data, setData] = useState<any[]>([]);
        const { handleSubmit, register } = useForm();
      
        useEffect(() => {
          fetchData();
        }, []);
      
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:4500/${serviceMethodName}');
            setData(response.data.result);
          } catch (error) {
            console.error(error);
          }
        };
      
        return (
          <div>
           <Table>
              <TableHead>
                <TableRow>
                  ${fields
                    .map(
                      (field) => `
                        <TableCell key="${field.fieldName}">${field.fieldLabel}</TableCell>
                      `
                    )
                    .join('')}
                </TableRow>
              </TableHead>
              <TableBody>
                { data && data.map((item) => (
                  <TableRow key={item.id}>
                    ${fields
                      .map(
                        (field) => `
                          <TableCell key={item.${field.fieldName}}>{item.${field.fieldName}}</TableCell>
                        `
                      )
                      .join('')}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      };
      
      export default ${componentNametoPass};
    `;
    }

    return componentContent;
  };

  const createComponentFile = (
    componentContent: string,
    parentModuleName: string,
    newModuleName: string,
    componentName: string
  ) => {
    const subToReturn = new BehaviorSubject<boolean>(false);

    const componentNametoPass = capatalizeFirstLetterOfString(componentName);
    const filePath = `${reactDirPathForDownload}/${parentModuleName}/${newModuleName}/${componentNametoPass}.tsx`;
    const dirPath = path.dirname(filePath);

    // Create the directory structure if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true });

    fs.writeFile(filePath, componentContent, { encoding: 'utf-8' }, (error) => {
      if (error) {
        console.error(`Error creating component file: ${error}`);
        subToReturn.next(false);
      } else {
        console.log(`Component file created successfully: ${filePath}`);
        subToReturn.next(true);
      }
    });

    return subToReturn.asObservable();
  };

  const updateAppFile = (components: requestFields[]) => {
    const subToReturn = new BehaviorSubject<boolean>(false);
    const componentNametoPassArr: string[] = components.map(
      (data: requestFields) => capatalizeFirstLetterOfString(data.componentName)
    );
    const parentModuleNametoPassArr: string[] = components.map(
      (data: requestFields) => data.parentModuleName
    );
    const newModuleNametoPassArr: string[] = components.map(
      (data: requestFields) => data.newModuleName
    );

    const filePath = `${reactDirPathForDownload}/App.tsx`;
    const data = fs.readFileSync(filePath).toString().split('\n');
    const checkReactIndex = data.findIndex((ele) =>
      ele.includes("import React,{ useState } from 'react';")
    );
    if (checkReactIndex === -1) {
      let importStatement = `import React,{ useState } from 'react';
    import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'; 
    import Routing from './Routing';`;
      const importStatements = data.filter((ele) => ele.includes('import {')); //all import statements
      const insertIndexForImport = data.findIndex((ele) =>
        ele.includes('import {')
      ); //find 1st index of insert statements

      for (let i = 0; i < componentNametoPassArr.length; i++) {
        importStatement += `\nimport ${componentNametoPassArr[i]} from './${parentModuleNametoPassArr[i]}/${newModuleNametoPassArr[i]}/${componentNametoPassArr[i]}';`;
      }

      data.splice(
        insertIndexForImport,
        importStatements.length,
        importStatement
      ); //replace all import with our statement
    }
    // Find the index of the last import statement
    const lastIndex = data.findIndex((ele) => ele.includes('import {'));
    const insertIndex = lastIndex !== -1 ? lastIndex + 1 : 0;

    // Add the import statements after the last import

    // Generate the component JSX elements
    let componentElements = `
                         <Router>
                         <Routing />
                            <Routes>
                                   ${componentNametoPassArr
                                     .map(
                                       (componentName) =>
                                         `<Route path="/${componentName}" element={<${componentName}/>} />`
                                     )
                                     .join('\n')}
                           </Routes>
                        </Router>
`;
    // Find the index of the return statement
    const returnIndex = data.findIndex((ele) => ele.trim() === '<>');

    // Check if the return statement is found
    if (returnIndex !== -1) {
      // Find the closing tag index
      const closingTagIndex = data.findIndex(
        (ele, index) => index > returnIndex && ele.trim() === '</>'
      );
      // Replace the existing JSX content with the component elements
      data.splice(
        returnIndex + 1,
        closingTagIndex - returnIndex - 1,
        componentElements
      );
    } else {
      console.error('Return statement not found in App.tsx');
    }

    const updatedContent = data.join('\n');
    fs.writeFileSync(filePath, updatedContent, { encoding: 'utf-8' });
    subToReturn.next(true);

    return subToReturn.asObservable();
  };
  //route file
  //Route and Link Code
  const generateRouteFileContent = (): string => {
    const componentNametoPassArr: string[] = components.map(
      (data: requestFields) => capatalizeFirstLetterOfString(data.componentName)
    );

    let routeContent = `
  import { Outlet, Link } from "react-router-dom";

  const Routing = () => {
    return (
      <>
      <nav>
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        <li style={{ display: "inline-block" }}>
          <Link to="/" style={{ textDecoration: 'none' }}>Home</Link>
        </li> &nbsp;&nbsp;&nbsp;                
        ${componentNametoPassArr
          .map(
            (componentName) =>
              `<li style={{ display: "inline-block"}}>
      <Link to="/${componentName}" style={{ textDecoration: 'none' }}>${componentName}</Link>
      </li>&nbsp;&nbsp;&nbsp;`
          )
          .join('\n')}
      </ul>
    </nav>
   <Outlet />
      </>
    )
  };
  
  export default Routing;`;

    return routeContent;
  };
  const createRouteFile = (routeContent: string) => {
    const subToReturn = new BehaviorSubject<boolean>(false);
    const filePath = `${reactDirPathForDownload}/Routing.tsx`;
    const dirPath = path.dirname(filePath);

    // Create the directory structure if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true });

    fs.writeFile(filePath, routeContent, { encoding: 'utf-8' }, (error) => {
      if (error) {
        console.error(`Error creating component file: ${error}`);
        subToReturn.next(false);
      } else {
        console.log(`Route file created successfully: ${filePath}`);
        subToReturn.next(true);
      }
    });

    return subToReturn.asObservable();
  };
  const createModulesObservable = createModules(
    fetTech,
    template,
    components[0].parentModuleName
  );

  createModulesObservable.subscribe((resultcreateModules: boolean) => {
    if (resultcreateModules) {
      console.log('Module created successfully');

      const createComponentFilesObservable = new BehaviorSubject<boolean>(
        false
      );

      for (const element of components) {
        const {
          parentModuleName,
          newModuleName,
          componentName,
          fields,
          serviceMethodName,
          tableName,
          tableNameForTransaction,
          typeOfOpration,
        } = element;

        if (
          !fetTech
          //||  !parentModuleName ||
          // !newModuleName ||
          // !componentName ||
          // !fields ||
          // !serviceMethodName ||
          // !tableName ||
          // !tableNameForTransaction ||
          // !typeOfOpration
        ) {
          throw new Error('Incomplete component information');
        }

        const componentContent = generateComponentFileContent(
          fields,
          componentName,
          tableName,
          serviceMethodName,
          typeOfOpration
        );
        const createComponentFileObservable = createComponentFile(
          componentContent,
          parentModuleName,
          newModuleName,
          componentName
        );

        createComponentFileObservable.subscribe(
          (resultCreateComponentFile: boolean) => {
            if (resultCreateComponentFile) {
              console.log(`Component file created for ${componentName}`);
              if (element === components[components.length - 1]) {
                createComponentFilesObservable.next(true);
              }
            } else {
              createComponentFilesObservable.next(false);
            }
          }
        );
      }

      createComponentFilesObservable.subscribe((response: boolean) => {
        if (response) {
          updateAppFile(components).subscribe((resultEditAppFile: boolean) => {
            if (resultEditAppFile) {
              subToReturn.next(true);
            } else {
              subToReturn.next(false);
            }
          });
        }
      });

      const routeContent = generateRouteFileContent();
      const createrouteFileObservable = createRouteFile(routeContent);
      createrouteFileObservable.subscribe((resultCreateRouterFile: boolean) => {
        if (resultCreateRouterFile) {
          console.log(`Router file created sucessfully}`);
          subToReturn.next(true);
        } else {
          subToReturn.next(false);
        }
      });
    }
  });
  subToReturn.next(true);
  return subToReturn.asObservable();
}
