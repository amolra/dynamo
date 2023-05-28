import { Observable, Subject } from 'rxjs';
import { createComponentService, createModules } from '.';
import { requestFields } from '../interfaces/fields';
import { componentStructure } from './file-base-edit/add-fields-in-files';
import {
  addModulesInAppModule,
  appModuleChanges,
} from './file-base-edit/app-component-edit';

export function createEntireCode(
  fetTech: string,
  template: string,
  components: requestFields[]
): Observable<boolean> {
  const subToReturn = new Subject<boolean>();
  components.forEach(async (element: requestFields) => {
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
    await createModules(fetTech, parentModuleName, newModuleName).subscribe(
      (resultcreateModules: boolean) => {
        if (resultcreateModules) {
          createComponentService(
            fetTech,
            parentModuleName,
            newModuleName,
            componentName
          ).subscribe(async (resultcreateComponentService: boolean) => {
            if (resultcreateComponentService) {
              console.log('result', resultcreateComponentService);

              await addModulesInAppModule().subscribe(
                async (resultAddModulesInAppModule: boolean) => {
                  console.log(
                    'resultAddModulesInAppModule',
                    resultAddModulesInAppModule
                  );
                  if (resultAddModulesInAppModule) {
                    console.log('reading app module');
                    await appModuleChanges(
                      template,
                      parentModuleName,
                      newModuleName,
                      componentName
                    ).subscribe(async (resultAppModuleChanges: boolean) => {
                      console.log(
                        'resultAppModuleChanges',
                        resultAppModuleChanges
                      );
                      if (resultAppModuleChanges) {
                        console.log('Successfully inserted app module');
                        await componentStructure(
                          parentModuleName,
                          newModuleName,
                          componentName,
                          fields,
                          serviceMethodName,
                          typeOfOpration
                        ).subscribe((resultComponentStructure: boolean) => {
                          console.log(
                            'resultComponentStructure',
                            resultComponentStructure
                          );
                          if (resultComponentStructure) {
                            console.log(
                              'Successfully inserted resultComponentStructure'
                            );
                            subToReturn.next(true);
                            return true;
                            // if (res.headersSent !== true) {
                            //   return true;
                            // }
                          } else subToReturn.next(false);
                        });
                      } else subToReturn.next(false);
                    });
                  } else subToReturn.next(false);
                }
              );
            }
          });
        }
      }
    );
  });
  return subToReturn.asObservable();
}
