import { BehaviorSubject, Observable } from 'rxjs';
import { fields } from '../../interfaces/fields';
export async function createGrid(
  fieldsAr: fields[]
): Promise<Observable<string>> {
  const subToReturn = new BehaviorSubject<string>(``);
  let innerHtml = `<tr>`;
  await fieldsAr.forEach((ele: fields) => {
    innerHtml += `
    <th>${ele.fieldLabel}</th>
  `;
  });
  innerHtml += `</tr>`;
  let outerTable = `<div>
  <table>${innerHtml}</table>
  </div>`;
  subToReturn.next(outerTable);
  return subToReturn.asObservable();
}
