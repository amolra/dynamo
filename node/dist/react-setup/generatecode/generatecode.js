"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCodeForReact = void 0;
const rxjs_1 = require("rxjs");
const fs_1 = __importStar(require("fs"));
const constants_1 = require("../../constants");
function generateCodeForReact(parentModule, newModule, component) {
    const subToReteurn = new rxjs_1.BehaviorSubject(false);
    const reactcode = constants_1.reactDirPathForDownload + `/${component.componentName}.tsx`;
    if (!fs_1.default.existsSync(reactcode)) {
        fs_1.default.open(reactcode, "w", function (err, file) {
            if (err)
                throw err;
            console.log("Saved!" + reactcode);
        });
        let htmlFormFields = '';
        if (component.fields) {
            component.fields.map((ele) => {
                htmlFormFields += ` <div>
              <label for="${ele.fieldName}">${ele.fieldLabel}:</label><br></br>
              <input type="${ele.typeOfField}" {...register("${ele.fieldName}",{required:true})}></input><br></br><br></br>
              {errors.${ele.fieldName} && errors.${ele.fieldName}.type==="required" && <span>${ele.fieldName} field can't be Empty</span>}
            </div>`;
            });
        }
        const fields = component.fields;
        let defaultValuesFields = {};
        const tableName = component.tableName;
        fields.forEach((item) => {
            const key = Object.keys(item.fieldName)[0];
            defaultValuesFields[key] = "";
        });
        const contents = `
      import React from 'react'
      import PropTypes from 'prop-types'
      import { TextField, FormControl, Button } from '@mui/material';
      import { useState } from 'react';
  
      import { useForm} from "react-hook-form";
      import axios from "axios";
  
      function ${component.componentName}(props) {
        const{register,handleSubmit,formState:{errors}}=useForm(
          {
              defaultValues:${defaultValuesFields},
          }
        );
      
        const postData=(data)=>{
          axios.post("http://localhost:4500/${tableName}",data)
          .then(response=>console.log(response.data))
          .catch(error=>console.log(error))
          // console.log(data)
        };
  
        return (
          <div>
            <h4>React and Node</h4>
  
            <form onSubmit={handleSubmit(postData)}> 
              ${htmlFormFields}
              <input type="submit" value="Submit"></input>
            </form>
          </div>
        )
      }
      ${component.componentName}.propTypes = {}
      export default ${component.componentName}`;
        console.log(contents);
        (0, fs_1.writeFile)(reactcode, contents, "utf-8", function (err) {
            console.log(err);
        });
        subToReteurn.next(true);
    }
    return subToReteurn.asObservable();
}
exports.generateCodeForReact = generateCodeForReact;
