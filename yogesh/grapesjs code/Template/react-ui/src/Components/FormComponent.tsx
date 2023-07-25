import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

//configuration for web-speech-api 
let speech: SpeechRecognition | null;
if (window.webkitSpeechRecognition) {
  // eslint-disable-next-line
  const SpeechRecognition = window.webkitSpeechRecognition;
  speech = new SpeechRecognition();
  speech.continuous = true;
  speech.lang = "en-IN"; // Set the language to "en-IN" for Indian English accent
  speech.interimResults = false;
  speech.maxAlternatives = 1;
} else {
  speech = null;
}
//defined type for dynamic component 
interface DynamicComponent {
  parentModuleName: string;
  newModuleName: string;
  componentName: string;
  serviceMethodName: string;
  typeOfOperation: string;
  tableName: string;
  tableNameForTransaction: string;
}
//defined type for dynamic field 
interface DynamicField {
  fieldName: string;
  fieldLabel: string;
  fieldNameBackend: string;
  lengthOfField: string;
  typeOfField: string;
  validation: string[];
}
//static values
//-----------------------------------------------------
const fetTechnology = [
  { id: 1, name: 'Angular' },
  { id: 2, name: 'React' },
  { id: 3, name: 'ViewJs' },
];

const backendTechnology = [
  { id: 0, name: 'NodeJs' },
  { id: 1, name: '.Net' },
  { id: 2, name: 'Java' },
  { id: 3, name: 'PHP' },
  { id: 4, name: 'Python' },
];
const types = [
  { id: 1, name: 'Insert' },
  { id: 2, name: 'List' },
];
const validations = [
  { id: 1, name: 'required' },
  // { id: 2, name: 'spacesNotAllowed' },
  // { id: 3, name: 'maxLength(100)' },
  { id: 4, name: 'unique' },
  // { id: 5, name: 'email' },
];

const options = [
  { value: 'template', img: 'image1.jpg' },
  { value: 'fancytemplate', img: 'image2.jpg' },
];
//-----------------------------------------------------------------------------
const FormComponent: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,

  } = useForm();
  const [dynamicComponents, setDynamicComponents] = useState<DynamicComponent[]>([]);
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const frontendDropdownRef = useRef<HTMLSelectElement>(null);
  const backendDropdownRef = useRef<HTMLSelectElement>(null);
  const [isListening, setIsListening] = useState(false);
  const transcriptRef = useRef("");
  const dropdownRefs = useRef<Array<HTMLSelectElement | null>>([]);
  const validationDropdownRefs = useRef<Array<HTMLSelectElement | null>>([]);
  //adding new component in dynamicComponents
  const addComponent = () => {
    setDynamicComponents((prevDynamicComponents) => {
      const newComponent: DynamicComponent = {
        parentModuleName: '',
        newModuleName: '',
        componentName: '',
        serviceMethodName: '',
        typeOfOperation: '',
        tableName: '',
        tableNameForTransaction: '',
      };

      return [...prevDynamicComponents, newComponent];
    });
  };
  //remvoing component in dynamicComponents
  const removeComponent = (index: number) => {
    const updatedComponents = [...dynamicComponents];
    updatedComponents.splice(index, 1);
    setDynamicComponents(updatedComponents);
  };
  //adding new component in dynamicFields
  const addField = () => {
    setDynamicFields((prevDynamicFields) => {
      const newComponent: DynamicField = {
        fieldName: "",
        fieldLabel: "",
        fieldNameBackend: "",
        lengthOfField: "",
        typeOfField: "",
        validation: []
      };

      return [...prevDynamicFields, newComponent];
    });
  };
  //removing field in dynamicFields
  const removeField = (index: number) => {
    const updatedComponents = [...dynamicFields];
    updatedComponents.splice(index, 1);
    setDynamicFields(updatedComponents);
  };
  //start listening and handle transcript
  useEffect(() => {
    if (!speech) {
      return;
    }
    if (isListening) {
      speech.start();
    } else {
      speech.stop();
    }

    speech.onstart = () => {
      console.log("Speech recognition started");
    };

    speech.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      handleSpeechRecognition(transcript);
    };

    return () => {
      speech?.stop();
    };
  }, [isListening]);
  //listen on page load
  useEffect(() => {
    listen();
    //SET DEFAULT VALUES OF DROPDOWN
    if(frontendDropdownRef.current)
    {
      frontendDropdownRef.current.value='Angular';
    }
    if(backendDropdownRef.current)
    {
      backendDropdownRef.current.value='NodeJs';
    }
  

  }, []);
  const listen = () => {
    setIsListening(!isListening);
  };

  //calling dynamicComponents.length to make sure its value is available
  useEffect(() => {
    console.log(dynamicComponents.length);
    console.log(document.getElementsByClassName("dynamic-component").length)
  }, [dynamicComponents]);

  //setting value for template
  const handleCheckTemplate = (optionValue: string) => {
    setValue('selectedTemplate', optionValue);
  };
  //handling transcript for form filling
  const handleSpeechRecognition = useCallback((transcript: string) => {
    transcriptRef.current = transcript.toLowerCase();
    console.log(transcriptRef.current);
    if (transcriptRef.current.includes('backend technology') || transcriptRef.current.includes('back end technology') || transcriptRef.current.includes('back and technology')) {
      if (backendDropdownRef.current) {
        backendDropdownRef.current.focus();
        console.log(backendDropdownRef.current)

        backendDropdownRef.current.setAttribute('size', '5');
        console.log(backendDropdownRef.current.value);
      }

      transcriptRef.current = '';
    } else if (transcriptRef.current.includes('frontend technology') || transcriptRef.current.includes('front and technology') || transcriptRef.current.includes('front end technology')) {
      if (frontendDropdownRef.current) {
        frontendDropdownRef.current.focus();

        frontendDropdownRef.current.setAttribute('size', '3'); // make its size large so that it can extend

      }
      transcriptRef.current = '';
    }

    else if (transcriptRef.current.includes('node') || transcriptRef.current.includes('nodejs') || transcriptRef.current.includes('node js') || transcriptRef.current.includes('n o d e')) {
      console.log("recognized node");
      console.log(backendDropdownRef.current);
      if (backendDropdownRef.current) {
        backendDropdownRef.current.value = 'NodeJs';
        backendDropdownRef.current.setAttribute('size', '1');
        transcriptRef.current = '';
      }
    }
    else if (transcriptRef.current.includes('java')) {

      if (backendDropdownRef.current) {
        backendDropdownRef.current.value = 'Java';
        backendDropdownRef.current.setAttribute('size', '1');
        transcriptRef.current = '';
      }
    }
    else if (transcriptRef.current.includes('python')) {

      if (backendDropdownRef.current) {
        backendDropdownRef.current.value = 'Python';
        backendDropdownRef.current.setAttribute('size', '1');
        transcriptRef.current = '';
      }
    }
    else if (transcriptRef.current.includes('angular')) {
      if (frontendDropdownRef.current) {
        frontendDropdownRef.current.value = 'Angular';
        frontendDropdownRef.current.setAttribute('size', '1');
        transcriptRef.current = '';
      }
    }
    else if (transcriptRef.current.includes('react')) {
      if (frontendDropdownRef.current) {
        frontendDropdownRef.current.value = 'React';

        frontendDropdownRef.current.setAttribute('size', '1');

        transcriptRef.current = '';
      }
    }
    else if (transcriptRef.current.includes('add component') || transcriptRef.current.includes(' add component')) {
      let addComponentButtonRef = document.getElementById("addComponentButton");
      // Simulate a click on the button
      if (addComponentButtonRef) {
        addComponentButtonRef.click();
      }
      console.log("called add new component method");
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('delete component')) {
      let deleteComponentButtonRef = document.getElementById("deleteComponentButton");
      // Simulate a click on the button
      if (deleteComponentButtonRef) {
        deleteComponentButtonRef.click();
      }
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('add field') || transcriptRef.current.includes('ad field')) {

      let addComponentButtonRef = document.getElementById("addFieldButton");

      // Simulate a click on the button
      if (addComponentButtonRef) {
        addComponentButtonRef.click();
      }
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('delete field')) {
      let deleteComponentButtonRef = document.getElementById("deleteFieldButton");
      // Simulate a click on the button
      if (deleteComponentButtonRef) {
        deleteComponentButtonRef.click();
      }
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('parent module name') || transcriptRef.current.includes('parent model name')) {
      const fieldName = `dynamicComponents[${document.getElementsByClassName("dynamic-component").length - 1}].parentModuleName`;
      console.log(fieldName);
      setValue(fieldName, '');
      let value = '';
      if (transcriptRef.current.includes('parent model name')) {
        value = transcriptRef.current.replace(`parent model name`, "").trim();
      }
      else {
        value = transcriptRef.current.replace(`parent module name`, "").trim();
      }
      setValue(fieldName, value); // Set the value using setValue

      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('module name') || transcriptRef.current.includes('model name')) {
      const fieldName = `dynamicComponents[${document.getElementsByClassName("dynamic-component").length - 1}].newModuleName`;
      console.log(fieldName);
      setValue(fieldName, '');
      let value = '';
      if (transcriptRef.current.includes('model name')) {
        value = transcriptRef.current.replace(`model name`, "").trim();
      }
      else {
        value = transcriptRef.current.replace(`module name`, "").trim();
      }
      setValue(fieldName, value); // Set the value using setValue
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('component name')) {
      const fieldName = `dynamicComponents[${document.getElementsByClassName("dynamic-component").length - 1}].componentName`;
      console.log(fieldName);
      const value = transcriptRef.current.replace(`component name`, "").trim();
      setValue(fieldName, value); // Set the value using setValue
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('service method name') || transcriptRef.current.includes('service method')) {
      const fieldName = `dynamicComponents[${document.getElementsByClassName("dynamic-component").length - 1}].serviceMethodName`;
      console.log(fieldName);
      const value = transcriptRef.current.replace(`service method name`, "").trim();
      setValue(fieldName, value); // Set the value using setValue
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('table name for transaction')) {
      const fieldName = `dynamicComponents[${document.getElementsByClassName("dynamic-component").length - 1}].tableNameForTransaction`;
      console.log(fieldName);
      const value = transcriptRef.current.replace(`table name for transaction`, "").trim();
      setValue(fieldName, value); // Set the value using setValue
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('table name')) {
      const fieldName = `dynamicComponents[${document.getElementsByClassName("dynamic-component").length - 1}].tableName`;
      console.log(fieldName);
      const value = transcriptRef.current.replace(`table name`, "").trim();
      setValue(fieldName, value); // Set the value using setValue
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('type of operation')) {
      const dropdownIndex: number = document.getElementsByClassName("dynamic-component").length - 1;
      console.log(dropdownIndex);
      const dropdown = dropdownRefs.current[dropdownIndex];
      console.log(dropdown);
      if (dropdown) {
        dropdown.focus();
        dropdown.setAttribute('size', '4'); // make its size large to show options
      }
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('add') || transcriptRef.current.includes('ad')) {
      const dropdownIndex: number = document.getElementsByClassName("dynamic-component").length - 1;
      const dropdown = dropdownRefs.current[dropdownIndex];
      if (dropdown) {
        dropdown.setAttribute('size', '1'); // make its size large to show options
        dropdown.value = "Add";
      }
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('list')) {
      const dropdownIndex: number = document.getElementsByClassName("dynamic-component").length - 1;
      const dropdown = dropdownRefs.current[dropdownIndex];
      if (dropdown) {
        dropdown.setAttribute('size', '1'); // make its size large to show options
        dropdown.value = "List";
      }
      transcriptRef.current = '';
    }

    else if (transcriptRef.current.includes('field name backend')) {
      const fieldName = `dynamicFields[${document.getElementsByClassName("dynamic-field").length - 1}].fieldNameBackend`;
      const value = transcriptRef.current.replace(`field name backend`, "").trim();
      setValue(fieldName, value); // Set the value using setValue
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('field name')) {
      const fieldName = `dynamicFields[${document.getElementsByClassName("dynamic-field").length - 1}].fieldName`;
      const value = transcriptRef.current.replace(`field name`, "").trim();
      setValue(fieldName, value); // Set the value using setValue
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('field label')) {
      const fieldName = `dynamicFields[${document.getElementsByClassName("dynamic-field").length - 1}].fieldLabel`;
      const value = transcriptRef.current.replace(`field label`, "").trim();
      setValue(fieldName, value); // Set the value using setValue
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('length of field')) {
      const fieldName = `dynamicFields[${document.getElementsByClassName("dynamic-field").length - 1}].lengthOfField`;
      const value = transcriptRef.current.replace(`length of field`, "").trim();
      setValue(fieldName, value); // Set the value using setValue
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('type of field')) {
      const fieldName = `dynamicFields[${document.getElementsByClassName("dynamic-field").length - 1}].typeOfField`;
      const value = transcriptRef.current.replace(`type of field`, "").trim();
      setValue(fieldName, value); // Set the value using setValue
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('validation')) {
      const dropdownIndex: number = document.getElementsByClassName("dynamic-field").length - 1;
      const dropdown = validationDropdownRefs.current[dropdownIndex];
      if (dropdown) {
        dropdown.focus();
        dropdown.setAttribute('size', '3'); // make its size large to show options
      }
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('required')) {
      const dropdownIndex: number = document.getElementsByClassName("dynamic-field").length - 1;
      const dropdown = validationDropdownRefs.current[dropdownIndex];
      if (dropdown) {
        dropdown.setAttribute('size', '1'); // make its size large to show options
        dropdown.value = "required";
      }
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes('unique')) {
      const dropdownIndex: number = document.getElementsByClassName("dynamic-field").length - 1;
      const dropdown = validationDropdownRefs.current[dropdownIndex];
      if (dropdown) {
        dropdown.setAttribute('size', '1'); // make its size large to show options
        dropdown.value = "unique";
      }
      transcriptRef.current = '';
    }
    else if (transcriptRef.current.includes("fancy template")) {
      handleCheckTemplate("fancytemplate");
      transcriptRef.current = "";
    }
    else if (transcriptRef.current.includes("template")) {
      handleCheckTemplate("template");
      transcriptRef.current = "";
    }
    else if (transcriptRef.current.includes("generate code")) {
      let addComponentButtonRef = document.getElementById("submit-button");
      // Simulate a click on the button
      if (addComponentButtonRef) {
        addComponentButtonRef.click();
      }
      transcriptRef.current = "";
    }
  }, [dynamicComponents, dynamicFields]);

  //handling form submit
  const handleFormSubmit = (data: any) => {
    console.log(data);
    //converting to required format 
    const objSent = {
      fetTech: data.frontendTechnology===undefined ? 'Angular':data.frontendTechnology,
      backTech: data.backendTechnology===undefined? 'NodeJs':data.backendTechnology,
      component: [] as any[],
      selectedTemplate: data.selectedTemplate,
    };

    data.dynamicComponents?.forEach((component: any) => {
      const convertedComponent: any = {
        parentModuleName: component.parentModuleName,
        newModuleName: component.newModuleName,
        componentName: component.componentName,
        serviceMethodName: component.serviceMethodName,
        typeOfOperation: component.typeOfOperation,
        tableName: component.tableName,
        tableNameForTransaction: component.tableNameForTransaction,
        fields: [],
      };

      component.fields?.forEach((field: any) => {
        const convertedField: any = {
          fieldName: field.fieldName,
          fieldLabel: field.fieldLabel,
          fieldNameBackend: field.fieldNameBackend,
          lengthOfField: field.lengthOfField,
          typeOfField: field.typeOfField,
          validation: field.validation===undefined ? 'Insert':field.validation,
        };

        convertedComponent.fields.push(convertedField);
      });

      objSent.component.push(convertedComponent);
    });

    console.log(objSent);
    const generateAPICode = (moduleObj: any) => {
      axios.post('http://localhost:3000/api-generate', moduleObj)
        .then((response) => {
          toast.success(`${moduleObj.backTech} project structure creation for backend done.`);
          console.log('Result', response.data);
        })
        .catch((error) => {
          toast.error('Failed to generate API code');
          console.error(error);
        });
    };
    const generateModuleComponent = (objSent:any) => {
      axios.post('http://localhost:3000/project-setup', objSent)
        .then((response) => {
          toast.success(`${objSent.fetTech} project structure creation for frontend done.`);
          console.log('Result', response.data);
          generateAPICode(objSent);

        })
        .catch((error) => {
          toast.error('Failed to generate module component');
          console.error(error);
        });
    };

  
     generateModuleComponent(objSent);
    // generateAPICode(objSent);
  };


  return (
    <>
      <div className="d-flex justify-content-center align-items-center container">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="form-container">
          <div className="">
            <div className="row header-form">
              <div className="col-12">
                <div className="row">
                  {options.map((option) => (
                    <div className="col-lg-6  col-sm-12" key={option.value}>
                      <div className="mat-card">
                        <input
                          type="radio"
                          {...register("selectedTemplate")}
                          value={option.value}
                        />
                        <img src={option.img} alt={option.value} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="row header-form">
              <div className="col-lg-6  col-sm-12 custom-select">
                <label htmlFor="frontendDropdownTech">Frontend Technology</label>
                <select
                  id="frontendDropdownTech"
                  {...register("frontendTechnology")}
                  ref={frontendDropdownRef}
                  onChange={(e)=>setValue("frontendTechnology",e.target.value)}
                  value={'Angular'}
                >
                  {fetTechnology.map((tech) => (
                    <option key={tech.id} value={tech.name}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-6  col-sm-12 custom-select">
                <label htmlFor="backendDropdownTech">Backend Technology</label>
                <select
                  id="backendDropdownTech"
                  {...register("backendTechnology")}
                  ref={backendDropdownRef}
                  onChange={(e)=>setValue("backendTechnology",e.target.value)}
                  defaultValue={'NodeJs'}
                >
                  {backendTechnology.map((tech) => (
                    <option key={tech.id} value={tech.name}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {dynamicComponents.length > 0 && (
              <div className="component-container">
                {dynamicComponents.map((component, index) => (
                  <div key={index} className="dynamic-component">
                    <div className="row">
                      <p>{index + 1} Component</p>
                      <div className="col-lg-3  col-sm-6">
                        <label htmlFor={`parentModuleName-${index}`}>
                          Parent Module Name
                        </label>
                        <input
                          type="text"
                          id={`parentModuleName-${index}`}
                          {...register(`dynamicComponents[${index}].parentModuleName`)}
                        />
                      </div>
                      <div className="col-lg-3  col-sm-6">
                        <label htmlFor={`newModuleName-${index}`}>Module Name</label>
                        <input
                          type="text"
                          id={`newModuleName-${index}`}
                          {...register(`dynamicComponents[${index}].newModuleName`)}
                        />
                      </div>
                      <div className="col-lg-3  col-sm-6">
                        <label htmlFor={`componentName-${index}`}>
                          Component Name
                        </label>
                        <input
                          type="text"
                          id={`componentName-${index}`}
                          {...register(`dynamicComponents[${index}].componentName`)}
                        />
                      </div>
                      <div className="col-lg-3  col-sm-6">
                        <label htmlFor={`serviceMethodName-${index}`}>
                          Service Method Name
                        </label>
                        <input
                          type="text"
                          id={`serviceMethodName-${index}`}
                          {...register(`dynamicComponents[${index}].serviceMethodName`)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3 col-sm-6 custom-select">
                        <label htmlFor={`typeOfOperation-${index}`}>
                          Type Of Operation {index + 1}
                        </label>
                        <select
                          id={`typeOfOperation-${index}`}
                          {...register(`dynamicComponents[${index}].typeOfOperation`)}
                          ref={(el) => (dropdownRefs.current[index] = el)}
                        >
                          {types.map((type) => (
                            <option key={type.id} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <label htmlFor={`tableName-${index}`}>Table Name</label>
                        <input
                          type="text"
                          id={`tableName-${index}`}
                          {...register(`dynamicComponents[${index}].tableName`)}
                        />
                      </div>
                      <div className="col-lg-3  col-sm-6">
                        <label htmlFor={`tableNameForTransaction-${index}`}>
                          Table Name For Transaction
                        </label>
                        <input
                          type="text"
                          id={`tableNameForTransaction-${index}`}
                          {...register(`dynamicComponents[${index}].tableNameForTransaction`)}
                        />
                      </div>
                      <div className="col-lg-3  col-sm-6 mt-2">
                        <button
                          type="button"
                          id="deleteComponentButton"
                          onClick={() => removeComponent(index)}
                        >
                          Delete Component
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* For Field */}
            {dynamicFields.length > 0 ? (
              <div className="component-container">
                {dynamicFields.map((component, index) => (
                  <div key={index} className="dynamic-field">
                    <div className="row">
                      <p>{index + 1} Field</p>
                      <div className="col-lg-3 col-sm-6">
                        <label htmlFor={`fieldName-${index}`}>Field Name</label>
                        <input
                          type="text"
                          id={`fieldName-${index}`}
                          {...register(`dynamicFields[${index}].fieldName`)}
                        />
                      </div>
                      <div className="col-lg-3  col-sm-6">
                        <label htmlFor={`fieldLabel-${index}`}>Field Label</label>
                        <input
                          type="text"
                          id={`fieldLabel-${index}`}
                          {...register(`dynamicFields[${index}].fieldLabel`)}
                        />
                      </div>
                      <div className="col-lg-3  col-sm-6">
                        <label htmlFor={`fieldNameBackend-${index}`}>
                          Field Name Backend
                        </label>
                        <input
                          type="text"
                          id={`fieldNameBackend-${index}`}
                          {...register(`dynamicFields[${index}].fieldNameBackend`)}
                        />
                      </div>
                      <div className="col-lg-3  col-sm-6">
                        <label htmlFor={`lengthOfField-${index}`}>Length Of Field</label>
                        <input
                          type="text"
                          id={`lengthOfField-${index}`}
                          {...register(`dynamicFields[${index}].lengthOfField`)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3  col-sm-6">
                        <label htmlFor={`typeOfField-${index}`}>Type Of Field</label>
                        <input
                          type="text"
                          id={`typeOfField-${index}`}
                          {...register(`dynamicFields[${index}].typeOfField`)}
                        />
                      </div>
                      <div className="col-lg-3  col-sm-6 custom-select mt-3">
                        <label htmlFor={`validation-${index}`}>Validation</label>
                        <select
                          id={`validation-${index}`}
                          {...register(`dynamicFields[${index}].validation`)}
                          ref={(el) => (validationDropdownRefs.current[index] = el)}
                        >
                          {validations.map((type) => (
                            <option key={type.id} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-lg-3  col-sm-6 mt-3">
                        <button
                          type="button"
                          id="deleteFieldButton"
                          onClick={() => removeField(index)}
                        >
                          Delete Field
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="row">
                  <div className="col">
                    <button type="button" id="addFieldButton" onClick={addField}>
                      Add Field
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col">
                  <button type="button" id="addFieldButton" onClick={addField}>
                    Add Field
                  </button>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-12 mt-3">
                <button type="button" id="addComponentButton" onClick={addComponent}>
                  Add Component
                </button>
                <button onClick={listen}>
                  <FontAwesomeIcon icon={isListening ? faMicrophoneSlash : faMicrophone} />
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3 text-center">
                {/* Submit button */}
                <button type="submit" id="submit-button">
                  Generate Code
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>

  );
};

export default FormComponent;
