"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbOprations = exports.createTable = exports.useDatabase = exports.dabataseManipulation = void 0;
const rxjs_1 = require("rxjs");
const mysql_connect_1 = require("./mysql-connect");
function dabataseManipulation(dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        const subToReturn = new rxjs_1.BehaviorSubject(false);
        try {
            const result = yield mysql_connect_1.pool.query('CREATE DATABASE IF NOT EXISTS ' + dbName);
            subToReturn.next(true);
            console.log(result);
        }
        catch (err) {
            throw err;
        }
        return subToReturn.asObservable();
    });
}
exports.dabataseManipulation = dabataseManipulation;
function useDatabase(dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        const subToReturn = new rxjs_1.BehaviorSubject(false);
        try {
            const result = yield mysql_connect_1.pool.query('use ' + dbName);
            subToReturn.next(true);
            console.log(result);
        }
        catch (err) {
            throw err;
        }
        return subToReturn.asObservable();
    });
}
exports.useDatabase = useDatabase;
function createTable(tableName, fields) {
    return __awaiter(this, void 0, void 0, function* () {
        const subToReturn = new rxjs_1.BehaviorSubject(false);
        try {
            let fieldArray = [];
            fields.forEach((ele) => {
                let tableFields = ``;
                tableFields = `${ele.fieldName} varchar(${ele.lengthOfField})`;
                fieldArray.push(tableFields);
            });
            const queryStr = `CREATE OR REPLACE TABLE ${tableName} (id int NOT NULL AUTO_INCREMENT,${fieldArray.join(',')},PRIMARY KEY (id))`;
            console.log('queryStr', queryStr);
            const result = yield mysql_connect_1.pool.query(queryStr);
            subToReturn.next(true);
            console.log(result);
        }
        catch (err) {
            throw err;
        }
        return subToReturn.asObservable();
    });
}
exports.createTable = createTable;
function dbOprations(dbName, tableName, fields) {
    const subToReturn = new rxjs_1.Subject();
    dabataseManipulation(dbName).then((response) => {
        response.subscribe((resp) => {
            console.log('resp', resp);
            if (resp) {
                useDatabase(dbName).then((responseUseDB) => {
                    responseUseDB.subscribe((respDb) => {
                        console.log('respDb', respDb);
                        if (respDb) {
                            createTable(tableName, fields).then((responseCreateTable) => {
                                responseCreateTable.subscribe((respCreateTable) => {
                                    console.log('respCreateTable', respCreateTable);
                                    if (respCreateTable)
                                        subToReturn.next(true);
                                });
                            });
                        }
                    });
                });
            }
        });
    });
    return subToReturn.asObservable();
}
exports.dbOprations = dbOprations;
