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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import { loginStructure } from './angular-setup/file-base-edit/login-code-add';
const index_1 = require("./angular-setup/index");
const http_1 = __importDefault(require("http"));
const db_table_generation_1 = require("./node-setup/database/db-table-generation");
const module_creation_1 = require("./angular-setup/module-creation");
const api_setting_1 = require("./node-setup/api-setting");
const generate_code_1 = require("./react-setup/generateCode/generate-code");
const querystring = require("querystring");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)()); // include before other routes
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ result: true });
});
app.post("/project-setup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body", req.body);
    const template = req.body.selectedTemplate;
    const fetTech = req.body.fetTech;
    // in create project structure we are doing following things
    //1. if user slected angular then angular installation 2. if user selected react then react installation is done.
    yield (0, index_1.createprojectStructure)(fetTech).subscribe((result) => __awaiter(void 0, void 0, void 0, function* () {
        if (result) {
            // return res.contentType('application/json').jsonp({ result: true });
            if (fetTech === "Angular") {
                const responseModuleCreate = yield (0, module_creation_1.createEntireCode)(fetTech, template, req.body.component);
                responseModuleCreate.subscribe((eleModCreate) => {
                    if (res.headersSent !== true) {
                        return res
                            .contentType("application/json")
                            .jsonp({ result: eleModCreate });
                    }
                });
            }
            else if (fetTech === "React") {
                // React related code need to be done here.
                // const responseGenerateTsconfig = await generateTsconfig();
                // responseGenerateTsconfig.subscribe((eleModCreate: boolean) => {
                //   if (res.headersSent !== true) {
                //     return res
                //       .contentType("application/json")
                //       .jsonp({ result: eleModCreate });
                //   }
                // });
                //Extra
                const responseGenerateCode = yield (0, generate_code_1.generateCode)();
                responseGenerateCode.subscribe((eleModCreate) => {
                    if (res.headersSent !== true) {
                        return res
                            .contentType("application/json")
                            .jsonp({ result: eleModCreate });
                    }
                });
            }
        }
        else
            res.send("installed API Failed");
    }));
}));
app.post("/api-code-add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body", req.body);
    if (req.body.backTech === "NodeJs") {
        const responseSetApi = yield (0, api_setting_1.setApi)(req.body.component);
        responseSetApi.subscribe((eleModCreate) => {
            if (res.headersSent !== true) {
                return res
                    .contentType("application/json")
                    .jsonp({ result: eleModCreate });
            }
        });
    }
    else {
        // Python code need to be added here.
    }
}));
app.post("/api-generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("post_data", req.body);
    let request = yield http_1.default.request({
        host: "localhost",
        port: 3000,
        path: "/api-code-add",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // headers such as "Cookie" can be extracted from req object and sent to /test
        },
    }, function (response) {
        var data = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
            data += chunk;
        });
        response.on("end", () => {
            res.end("check result: " + data);
        });
    });
    request.write(JSON.stringify(req.body));
    request.end();
}));
app.get("/mysql-connect-api", (req, res) => {
    const fields = [
        {
            fieldName: "userName",
            fieldLabel: "User Name",
            fieldNameBackend: "userName",
            lengthOfField: "100",
            typeOfField: "text",
            validation: ["required", "spacesNotAllowed", "maxLength(100)"],
        },
        {
            fieldName: "password",
            fieldLabel: "password",
            fieldNameBackend: "password",
            lengthOfField: "100",
            typeOfField: "password",
            validation: ["required", "spacesNotAllowed", "maxLength(100)"],
        },
        {
            fieldName: "confirmPassword",
            fieldLabel: "Confirm Password",
            fieldNameBackend: "confirmPassword",
            lengthOfField: "100",
            typeOfField: "password",
            validation: ["required", "spacesNotAllowed", "maxLength(100)"],
        },
        {
            fieldName: "firstName",
            fieldLabel: "First Name",
            fieldNameBackend: "firstName",
            lengthOfField: "100",
            typeOfField: "text",
            validation: ["required", "spacesNotAllowed", "maxLength(100)"],
        },
    ];
    (0, db_table_generation_1.dbOprations)("dynamo", "register", fields).subscribe((response) => {
        if (response) {
            res.send("Successdully connected to db");
        }
    });
    // res.send('Loading ....');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
