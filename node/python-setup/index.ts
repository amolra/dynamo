import { BehaviorSubject, Observable, Subject } from "rxjs";
import { exec } from "shelljs";
import process from "process";
import fs, { readFile, writeFile } from "fs";
import {
  baseDirName,
  pythonDir,
  basePath,
  dir,
  projectFolder,
} from "../constants";
import { fields } from "./interfaces/fields";
export function changeDir(dirName: string): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  console.log("change dir", basePath + baseDirName + "/" + dirName);
  process.chdir(basePath + baseDirName + "/" + dirName);
  subToReturn.next(true);
  return subToReturn.asObservable();
}
export function install(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);

  exec(
    basePath + projectFolder + "/python-setup/install.sh",
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      subToReturn.next(true);
    }
  );
  return subToReturn.asObservable();
}
const createMain = (): Observable<boolean> => {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const mainPy = "./main.py";
  if (!fs.existsSync(mainPy)) {
    fs.open(mainPy, "w", function (err, file) {
      if (err) throw err;
      console.log("Saved!" + mainPy);
    });

    const contentQuery = `
import mariadb 

from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

app = FastAPI()

@app.post("/items/")
async def create_item(item: Item):
    item_dict = item.dict()
    if item.tax:
        price_with_tax = item.price + item.tax
    conn = mariadb.connect(
        user="root",
        password="admin",
        host="localhost",
        port=3306,
        database="python")
    cur = conn.cursor() 
    cur.execute("SELECT * FROM users")
    for FirstName in cur: 
        print(f"First name: {FirstName}")
    for FirstName in cur: 
        print(f"First name: {FirstName}")
    item_dict.update({"price_with_tax": price_with_tax})
    return item_dict

@app.get("/items/name")
async def get_item(name):
    item_dict = item.dict()
    if item.tax:
        price_with_tax = item.price + item.tax
    # Logic to fetch the item with the given item_id/name from the database
    conn = mariadb.connect(
        user="root",
        password="admin",
        host="localhost",
        port=3306,
        database="python")
    cur = conn.cursor() 
    cur.execute("SELECT * FROM users WHERE name=?",(FirstName))
    for FirstName in cur: 
        print(f"First name: {FirstName}")
    item = cur.fetchone()
    
    if item is None:
        return {"error": "Item not found"}
    item_dict.update({"price_with_tax": price_with_tax})
    return item_dict
    `;
    writeFile(mainPy, contentQuery, "utf-8", function (err) {
      console.log(err);

      subToReturn.next(true);
    });
  }
  return subToReturn.asObservable();
};
export function ApiSetting(): Observable<boolean> {
  const subToReturn = new Subject<boolean>();
  changeDir(pythonDir).subscribe((result: boolean) => {
    if (result) {
      install().subscribe((resultInstall: boolean) => {
        if (resultInstall) {
          createMain().subscribe((resultMainPy: boolean) => {});
          subToReturn.next(true);
        }
      });
    }
  });

  return subToReturn.asObservable();
}
