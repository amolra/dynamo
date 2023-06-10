import { Observable, Subject } from 'rxjs';
import { ApiSetting, createIndexTs } from '.';
import { dbOprations } from './database/db-table-generation';
export const setApi = (components: any): Observable<boolean> => {
  const subToReturn = new Subject<boolean>();
  ApiSetting().subscribe(async (result: boolean) => {
    console.log('result', result);

    if (result) {
      await components.forEach(async (element: any) => {
        console.log('element', element);
        const {
          parentModuleName,
          newModuleName,
          componentName,
          fields,
          serviceMethodName,
          tableNameForTransaction,
          typeOfOpration,
        } = element;
        createIndexTs(
          componentName,
          fields,
          serviceMethodName,
          typeOfOpration,
          tableNameForTransaction
        ).subscribe((resultcreateIndexTs: boolean) => {
          if (resultcreateIndexTs) {
            if (typeOfOpration !== 'List') {
              dbOprations('dynamo', tableNameForTransaction, fields).subscribe(
                (response: boolean) => {
                  if (response) {
                    // res.setHeader('Content-Type', 'application/json');
                    subToReturn.next(true);
                    return true;
                  }
                }
              );
            } else {
              subToReturn.next(true);
              return true;
            }
          }
        });
      });
    } else subToReturn.next(false);
  });
  return subToReturn.asObservable();
};