import { Observable, Subject } from 'rxjs';
import { ApiSetting} from '.';
import { dbOprations } from './database/db-table-generation';
export const setPythonApi = (components: any): Observable<boolean> => {
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
        subToReturn.next(true);
        return true;
      });
    } else subToReturn.next(false);
  });
  return subToReturn.asObservable();
};
