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
exports.createGrid = void 0;
const rxjs_1 = require("rxjs");
function createGrid(fieldsAr) {
    return __awaiter(this, void 0, void 0, function* () {
        const subToReturn = new rxjs_1.BehaviorSubject(``);
        let innerHtml = `<tr>`;
        yield fieldsAr.forEach((ele) => {
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
    });
}
exports.createGrid = createGrid;
