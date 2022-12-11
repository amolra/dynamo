"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createprojectStructure = exports.changeDir = exports.createComponentService = exports.createModules = exports.install = exports.createFolders = void 0;
const rxjs_1 = require("rxjs");
const shelljs_1 = require("shelljs");
const process_1 = __importDefault(require("process"));
const constants_1 = require("../constants");
function createFolders() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const fs = require('fs');
    let childDirectories = [constants_1.dir + '/' + constants_1.angularDir, constants_1.dir + '/' + constants_1.nodeDir];
    let i = 0;
    childDirectories.forEach((directory) => {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        i++;
        if (i === childDirectories.length) {
            subToReturn.next(true);
        }
    });
    return subToReturn.asObservable();
}
exports.createFolders = createFolders;
function install() {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    (0, shelljs_1.exec)(constants_1.basePath +
        constants_1.projectFolder +
        '/angular-setup/install.sh ' +
        constants_1.basePath +
        constants_1.baseDirName +
        '/' +
        constants_1.angularDir, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error}`);
            // return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            // return;
        }
        console.log(`stdout: ${stdout}`);
        subToReturn.next(true);
    });
    return subToReturn.asObservable();
}
exports.install = install;
function createModules(parentModule, newModule) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    console.log(constants_1.basePath +
        constants_1.projectFolder +
        '/angular-setup/module-creation.sh ' +
        constants_1.angularDirPathForDownload +
        ' ' +
        parentModule +
        ' ' +
        newModule);
    (0, shelljs_1.exec)(constants_1.basePath +
        constants_1.projectFolder +
        '/angular-setup/module-creation.sh ' +
        constants_1.angularDirPathForDownload +
        ' ' +
        parentModule +
        ' ' +
        newModule, (error, stdout, stderr) => {
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
    });
    return subToReturn.asObservable();
}
exports.createModules = createModules;
function createComponentService(parentModule, newModule, componentName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    console.log(constants_1.basePath +
        constants_1.projectFolder +
        '/angular-setup/component-creation.sh ' +
        constants_1.angularDirPathForDownload +
        ' ' +
        parentModule +
        ' ' +
        newModule +
        ' ' +
        componentName);
    (0, shelljs_1.exec)(constants_1.basePath +
        constants_1.projectFolder +
        '/angular-setup/component-creation.sh ' +
        constants_1.angularDirPathForDownload +
        ' ' +
        parentModule +
        ' ' +
        newModule +
        ' ' +
        componentName, (error, stdout, stderr) => {
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
    });
    return subToReturn.asObservable();
}
exports.createComponentService = createComponentService;
function changeDir(dirName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    process_1.default.chdir(constants_1.basePath + constants_1.baseDirName + '/' + dirName);
    subToReturn.next(true);
    return subToReturn.asObservable();
}
exports.changeDir = changeDir;
function createprojectStructure(parentModule, newModule, componentName) {
    const subToReturn = new rxjs_1.Subject();
    createFolders().subscribe((res) => {
        if (res) {
            changeDir(constants_1.angularDir).subscribe((result) => {
                if (result) {
                    install().subscribe((resultInstall) => {
                        if (resultInstall) {
                            createModules(parentModule, newModule).subscribe((resultcreateModules) => {
                                if (resultcreateModules) {
                                    createComponentService(parentModule, newModule, componentName).subscribe((resultcreateComponentService) => {
                                        if (resultcreateComponentService) {
                                            subToReturn.next(true);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    return subToReturn.asObservable();
}
exports.createprojectStructure = createprojectStructure;
