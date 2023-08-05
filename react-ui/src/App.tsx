import React from 'react';
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import TemplateComponent from './Components/TemplateComponent';
import FormComponent from './Components/FormComponent';


function App() {
  return (
    <div>
      
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={TemplateComponent}></Route>
          <Route path='/form' Component={FormComponent}></Route>
        </Routes>
      </BrowserRouter>      
    </div>
  )
}

export default App
