import { BehaviorSubject, Observable } from "rxjs";

import fs, { readFile, writeFile } from "fs";

import { reactDirPathForDownload } from "../../constants";

export function generateCode(): Observable<boolean> {
  const subToReturn = new BehaviorSubject<boolean>(false);
  const component = reactDirPathForDownload + "component.tsx";
  console.log(component);
  if (!fs.existsSync(component)) {
    fs.open(component, "w", function (err, file) {
      if (err) throw err;
      console.log("Saved!" + component);
    });
    const contents = `
import React from 'react'
import PropTypes from 'prop-types'
import { TextField, FormControl, Button } from '@mui/material';
import { useState } from 'react';

function Component(props) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value,
      });
  };

  const handleSubmit = (e) => {
      e.preventDefault();

      // Send the form data to the backend API
      fetch('/api/submit', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      })
          .then((response) => response.json())
          .then((data) => {
              // Handle the response from the backend
              console.log(data);
          })
          .catch((error) => {
              console.error('Error:', error);
          });
  };

  return (
      <div>
          <h4>React and Python</h4>

          <FormControl onSubmit={handleSubmit}>
              <TextField
                  className='firstName'
                  label=Field Label
                  onChange={handleChange}
              />
              <TextField
                  className='lastName'
                  label="Last Name"
                  onChange={handleChange}
              />
              <Button variant="contained">Submit</Button>

          </FormControl>

      </div>
  )
}

Component.propTypes = {

}
o
export default Component
    `;
    console.log(contents);
    writeFile(component, contents, "utf-8", function (err) {
      console.log(err);
      subToReturn.next(true);
    });
  }

  console.log("write file complete");
  return subToReturn.asObservable();
}
