import express, { response } from "express";
import cors from "cors";
import {
  addModulesInAppModule,
  appModuleChanges,
} from "./angular-setup/file-base-edit/app-component-edit";
// import { loginStructure } from './angular-setup/file-base-edit/login-code-add';
import {
  createComponentService,
  createModules,
  createprojectStructure,
} from "./angular-setup/index";
import { ApiSetting, createIndexTs, packageEdit } from "./node-setup";
import { componentStructure } from "./angular-setup/file-base-edit/add-fields-in-files";
import { fields, requestFields } from "./interfaces/fields";
import http from "http";
import {
  dabataseManipulation,
  dbOprations,
  useDatabase,
} from "./node-setup/database/db-table-generation";
import { Observable } from "rxjs";
import { createEntireCode } from "./angular-setup/module-creation";
import { setApi } from "./node-setup/api-setting";
import { generateTsconfig } from "./react-setup/remaining-setup";
import { generateCode } from "./react-setup/generateCode/generate-code";
import { setPythonApi } from "./python-setup/api-setting";
import { nodeDir, pythonDir, dir } from "./constants";
import fs, { readFile, writeFile } from "fs";
const querystring = require("querystring");
const app = express();
const port = 3000;
app.use(cors()); // include before other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({ result: true });
});
app.post("/project-setup", async (req, res) => {
  console.log("req.body", req.body);
  const template = req.body.selectedTemplate;
  const fetTech = req.body.fetTech;
  // in create project structure we are doing following things
  //1. if user slected angular then angular installation 2. if user selected react then react installation is done.
  await createprojectStructure(fetTech).subscribe(async (result: boolean) => {
    if (result) {
      // return res.contentType('application/json').jsonp({ result: true });
      if (fetTech === "Angular") {
        const responseModuleCreate = await createEntireCode(
          fetTech,
          template,
          req.body.component
        );
        responseModuleCreate.subscribe((eleModCreate: boolean) => {
          if (res.headersSent !== true) {
            return res
              .contentType("application/json")
              .jsonp({ result: eleModCreate });
          }
        });
      } else if (fetTech === "React") {
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
        const responseGenerateCode = await generateCode();
        responseGenerateCode.subscribe((eleModCreate: boolean) => {
          if (res.headersSent !== true) {
            return res
              .contentType("application/json")
              .jsonp({ result: eleModCreate });
          }
        });
      }
    } else res.send("installed API Failed");
  });
});

app.post("/api-code-add", async (req, res) => {
  console.log("req.body", req.body);
  const createDir =
    req.body.backTech === "NodeJs"
      ? dir + "/" + nodeDir
      : dir + "/" + pythonDir;
  if (!fs.existsSync(createDir)) {
    fs.mkdirSync(createDir, { recursive: true });
  }
  if (req.body.backTech === "NodeJs") {
    const responseSetApi = await setApi(req.body.component);
    responseSetApi.subscribe((eleModCreate: boolean) => {
      if (res.headersSent !== true) {
        return res
          .contentType("application/json")
          .jsonp({ result: eleModCreate });
      }
    });
  } else {
    // Python code need to be added here.

    const responseSetPythonApi = await setPythonApi(req.body.component);
    responseSetPythonApi.subscribe((eleModCreate: boolean) => {
      if (res.headersSent !== true) {
        return res
          .contentType("application/json")
          .jsonp({ result: eleModCreate });
      }
    });
  }
});

app.post("/api-generate", async (req, res) => {
  console.log("post_data", req.body);
  let request = await http.request(
    {
      host: "localhost",
      port: 3000,
      path: "/api-code-add",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // headers such as "Cookie" can be extracted from req object and sent to /test
      },
    },
    function (response) {
      var data = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        res.end("check result: " + data);
      });
    }
  );
  request.write(JSON.stringify(req.body));
  request.end();
});
app.get("/mysql-connect-api", (req, res) => {
  const fields: fields[] = [
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
  dbOprations("dynamo", "register", fields).subscribe((response: boolean) => {
    if (response) {
      res.send("Successdully connected to db");
    }
  });
  // res.send('Loading ....');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
