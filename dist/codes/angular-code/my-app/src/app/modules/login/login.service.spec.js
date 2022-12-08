"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const login_service_1 = require("./login.service");
describe('LoginService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(login_service_1.LoginService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
