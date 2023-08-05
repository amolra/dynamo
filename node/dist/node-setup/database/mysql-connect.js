"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const mariadb_1 = __importDefault(require("mariadb"));
exports.pool = mariadb_1.default.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'admin',
    database: 'dynamo',
});
// Expose a method to establish connection with MariaDB SkySQL
