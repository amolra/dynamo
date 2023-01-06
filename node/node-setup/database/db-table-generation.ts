import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { fields } from '../../interfaces/fields';
import { pool } from './mysql-connect';
export async function dabataseManipulation(
  dbName: string
): Promise<Observable<boolean>> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  try {
    const result = await pool.query('CREATE DATABASE IF NOT EXISTS ' + dbName);
    subToReturn.next(true);
    console.log(result);
  } catch (err) {
    throw err;
  }

  return subToReturn.asObservable();
}
export async function useDatabase(
  dbName: string
): Promise<Observable<boolean>> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  try {
    const result = await pool.query('use ' + dbName);
    subToReturn.next(true);
    console.log(result);
  } catch (err) {
    throw err;
  }

  return subToReturn.asObservable();
}
export async function createTable(
  tableName: string,
  fields: fields[]
): Promise<Observable<boolean>> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  try {
    let fieldArray: string[] = [];
    fields.forEach((ele) => {
      let tableFields = ``;
      tableFields = `${ele.fieldName} varchar(${ele.lengthOfField})`;
      fieldArray.push(tableFields);
    });
    const queryStr = `CREATE OR REPLACE TABLE ${tableName} (id int NOT NULL AUTO_INCREMENT,${fieldArray.join(
      ','
    )},PRIMARY KEY (id))`;
    console.log('queryStr', queryStr);
    const result = await pool.query(queryStr);
    subToReturn.next(true);
    console.log(result);
  } catch (err) {
    throw err;
  }

  return subToReturn.asObservable();
}
export function dbOprations(
  dbName: string,
  tableName: string,
  fields: fields[]
): Observable<boolean> {
  const subToReturn = new Subject<boolean>();
  dabataseManipulation(dbName).then((response: Observable<boolean>) => {
    response.subscribe((resp: boolean) => {
      console.log('resp', resp);
      if (resp) {
        useDatabase(dbName).then((responseUseDB: Observable<boolean>) => {
          responseUseDB.subscribe((respDb: boolean) => {
            console.log('respDb', respDb);
            if (respDb) {
              createTable(tableName, fields).then(
                (responseCreateTable: Observable<boolean>) => {
                  responseCreateTable.subscribe((respCreateTable: boolean) => {
                    console.log('respCreateTable', respCreateTable);
                    if (respCreateTable) subToReturn.next(true);
                  });
                }
              );
            }
          });
        });
      }
    });
  });
  return subToReturn.asObservable();
}
