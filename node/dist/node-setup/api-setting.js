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
exports.setApi = void 0;
const rxjs_1 = require("rxjs");
const _1 = require(".");
const db_table_generation_1 = require("./database/db-table-generation");
const setApi = (components) => {
    const subToReturn = new rxjs_1.Subject();
    (0, _1.ApiSetting)().subscribe((result) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('result', result);
        if (result) {
            yield components.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                console.log('element', element);
                const { parentModuleName, newModuleName, componentName, fields, serviceMethodName, tableNameForTransaction, typeOfOpration, } = element;
                (0, _1.createIndexTs)(componentName, fields, serviceMethodName, typeOfOpration, tableNameForTransaction).subscribe((resultcreateIndexTs) => {
                    if (resultcreateIndexTs) {
                        if (typeOfOpration !== 'List') {
                            (0, db_table_generation_1.dbOprations)('dynamo', tableNameForTransaction, fields).subscribe((response) => {
                                if (response) {
                                    // res.setHeader('Content-Type', 'application/json');
                                    subToReturn.next(true);
                                    return true;
                                }
                            });
                        }
                        else {
                            subToReturn.next(true);
                            return true;
                        }
                    }
                });
            }));
        }
        else
            subToReturn.next(false);
    }));
    return subToReturn.asObservable();
};
exports.setApi = setApi;
