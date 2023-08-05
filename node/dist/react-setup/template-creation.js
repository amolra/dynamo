"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplateForReact = void 0;
const rxjs_1 = require("rxjs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
function createTemplateForReact(htmlContent, cssContent) {
    const subToReturn = new rxjs_1.Subject();
    const indexPath = path_1.default.join(constants_1.reactDirMyApp, 'index.html');
    const stylesPath = path_1.default.join(constants_1.reactDirPathForDownload, 'index.css');
    // in htmlContent: when you see %%root%% replace it with <div id="root"></div>
    let htmlContentEdited = htmlContent.replace("%%root%%", "<div id=\"root\"></div> <script type=\"module\" src=\"/src/main.tsx\"></script>");
    //then in index.html  replace <body></body> with htmlContentEdited
    //read index.html content
    fs_1.default.readFile(indexPath, 'utf8', (err, html_content) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        else {
            const bodyStart = html_content.indexOf('<body>');
            const bodyEnd = html_content.indexOf('</body>') + '</body>'.length;
            const updated_html_content = html_content.substring(0, bodyStart) + htmlContentEdited + html_content.substring(bodyEnd);
            //write updated content inside index.html
            fs_1.default.writeFile(indexPath, updated_html_content, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to the file:', err);
                    return;
                }
                console.log('HTML file updated successfully!');
                // Write the CSS content to styles.css
                fs_1.default.writeFile(stylesPath, cssContent, { encoding: 'utf-8' }, (error) => {
                    if (error) {
                        console.error(`Error creating styles.css: ${error}`);
                        subToReturn.next(false);
                    }
                    else {
                        console.log(`styles.css created successfully: ${stylesPath}`);
                        subToReturn.next(true);
                    }
                });
            });
        }
        console.log('index.html created successfully: ', indexPath);
    });
    return subToReturn.asObservable();
}
exports.createTemplateForReact = createTemplateForReact;
