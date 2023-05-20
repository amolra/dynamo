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
function createFolders(fetTech) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const fs = require('fs');
    const dirCode = fetTech === 'Angular' ? constants_1.angularDir : constants_1.reactDir;
    let childDirectories = [constants_1.dir + '/' + dirCode, constants_1.dir + '/' + constants_1.nodeDir];
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
function install(fetTech) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const dir = fetTech === 'Angular' ? constants_1.angularDir : constants_1.reactDir;
    (0, shelljs_1.exec)(constants_1.basePath +
        constants_1.projectFolder +
        '/' +
        fetTech.toLowerCase() +
        '-setup/install.sh ' +
        constants_1.basePath +
        constants_1.baseDirName +
        '/' +
        dir, (error, stdout, stderr) => {
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
function createModules(fetTech, parentModule, newModule) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const dir = fetTech === 'Angular' ? constants_1.angularDirPathForDownload : constants_1.reactDir;
    console.log(constants_1.basePath +
        constants_1.projectFolder +
        '/' +
        fetTech.toLowerCase() +
        '-setup/module-creation.sh ' +
        dir +
        ' ' +
        parentModule +
        ' ' +
        newModule);
    (0, shelljs_1.exec)(constants_1.basePath +
        constants_1.projectFolder +
        '/' +
        fetTech.toLowerCase() +
        '-setup/module-creation.sh ' +
        dir +
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
function createComponentService(fetTech, parentModule, newModule, componentName) {
    const subToReturn = new rxjs_1.BehaviorSubject(false);
    const dir = fetTech === 'Angular' ? constants_1.angularDirPathForDownload : constants_1.reactDir;
    console.log(constants_1.basePath +
        constants_1.projectFolder +
        '/' +
        fetTech.toLowerCase() +
        '-setup/component-creation.sh ' +
        dir +
        ' ' +
        parentModule +
        ' ' +
        newModule +
        ' ' +
        componentName);
    (0, shelljs_1.exec)(constants_1.basePath +
        constants_1.projectFolder +
        '/' +
        fetTech.toLowerCase() +
        '-setup/component-creation.sh ' +
        dir +
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
    console.log("basePath + baseDirName + '/' + dirName", constants_1.basePath + constants_1.baseDirName + '/' + dirName);
    process_1.default.chdir(constants_1.basePath + constants_1.baseDirName + '/' + dirName);
    subToReturn.next(true);
    return subToReturn.asObservable();
}
exports.changeDir = changeDir;
function createprojectStructure(fetTech) {
    const subToReturn = new rxjs_1.Subject();
    const dir = fetTech === 'Angular' ? constants_1.angularDir : constants_1.reactDir;
    createFolders(fetTech).subscribe((res) => {
        if (res) {
            changeDir(dir).subscribe((result) => {
                if (result) {
                    install(fetTech).subscribe((resultInstall) => {
                        if (resultInstall) {
                            subToReturn.next(true);
                        }
                    });
                }
            });
        }
    });
    return subToReturn.asObservable();
}
exports.createprojectStructure = createprojectStructure;
