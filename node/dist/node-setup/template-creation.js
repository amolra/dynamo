"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplate = void 0;
const rxjs_1 = require("rxjs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
function createTemplate(htmlContent, cssContent, templateDirectoryName) {
    const subToReturn = new rxjs_1.Subject();
    const templateDirPath1 = path_1.default.join(constants_1.nodeDirMyApp, 'templates');
    fs_1.default.mkdirSync(templateDirPath1, { recursive: true });
    const templateDirPath = path_1.default.join(templateDirPath1, templateDirectoryName);
    fs_1.default.mkdirSync(templateDirPath, { recursive: true });
    // Create the 'templates' directory if it doesn't exist
    if (!fs_1.default.existsSync(path_1.default.join(constants_1.nodeDirMyApp, 'templates'))) {
        try {
            fs_1.default.mkdirSync(path_1.default.join(constants_1.nodeDirMyApp, 'templates'));
        }
        catch (error) {
            console.error('Error creating "templates" directory:', error);
            subToReturn.next(false);
            return subToReturn.asObservable();
        }
    }
    // Create the 'templateDirectoryName' directory inside 'templates'
    try {
        fs_1.default.mkdirSync(templateDirPath, { recursive: true });
        // Write the HTML content to index.html
        //create html n css files path
        const indexPathForNode = path_1.default.join(templateDirPath, 'index.html');
        const stylesPathForNode = path_1.default.join(templateDirPath, 'styles.css');
        fs_1.default.writeFile(indexPathForNode, htmlContent, { encoding: 'utf8' }, (error) => {
            if (error) {
                console.error(`Error creating index.html: ${error}`);
                subToReturn.next(false);
            }
            else {
                console.log(`index.html created successfully: ${indexPathForNode}`);
                // Write the CSS content to styles.css
                fs_1.default.writeFile(stylesPathForNode, cssContent, { encoding: 'utf8' }, (error) => {
                    if (error) {
                        console.error(`Error creating styles.css: ${error}`);
                        subToReturn.next(false);
                    }
                    else {
                        console.log(`styles.css created successfully: ${stylesPathForNode}`);
                        subToReturn.next(true);
                    }
                });
            }
        });
    }
    catch (error) {
        console.error('Error creating template directory:', error);
        subToReturn.next(false);
        return subToReturn.asObservable();
    }
    // const indexPath = path.join(reactDirMyApp,'public', 'index.html');
    // const stylesPath = path.join(reactDirPathForDownload, 'index.css');
    // // in htmlContent: when you see %%root%% replace it with <div id="root"></div>
    // const htmlContentEdited = htmlContent.replace('%%root%%', '<div id="root"></div>');
    // // Write the updated HTML content to index.html
    // fs.writeFile(indexPath, htmlContentEdited, 'utf8', (err) => {
    //   if (err) {
    //     console.error('Error writing to index.html:', err);
    //     subToReturn.next(false);
    //     return;
    //   }
    //   console.log('index.html created successfully: ', indexPath);
    //   // Write the CSS content to index.css
    //   fs.writeFile(stylesPath, cssContent, { encoding: 'utf-8' }, (error) => {
    //     if (error) {
    //       console.error('Error creating index.css:', error);
    //       subToReturn.next(false);
    //       return;
    //     } else {
    //       console.log('index.css created successfully: ', stylesPath);
    //       subToReturn.next(true);
    //     }
    //   });
    // });
    return subToReturn.asObservable();
}
exports.createTemplate = createTemplate;
