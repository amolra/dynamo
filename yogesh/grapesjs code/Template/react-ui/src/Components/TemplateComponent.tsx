
import React, { useState, useEffect } from "react";
import grapesjs, { Editor } from "grapesjs";
import gjsPresetNewsletter from "grapesjs-preset-newsletter";

import ckeditor from "grapesjs-plugin-ckeditor";
import customCode from "grapesjs-custom-code";
import tuiEditor from "grapesjs-tui-image-editor";
import blocks from "grapesjs-blocks-basic";
import forms from "grapesjs-plugin-forms";
import { Toaster, toast } from "react-hot-toast";
import axios from 'axios';
// import tab from "grapesjs-tabs";
import flexbox from "grapesjs-blocks-flexbox";
// import puppeteer from "puppeteer";


function TemplateComponent():JSX.Element{
    // async function exportTemplateAsImage() {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
      
    //     // Your GrapesJS initialization code here
    //     const editor = grapesjs.init({
    //       container: '#editor',
    //       // Your other GrapesJS configuration options here
    //     });
      
    //     // Wait for GrapesJS to fully render the content
    //     await page.waitForTimeout(2000); // Adjust the timeout as needed
      
    //     // Get the content of the GrapesJS editor 
    //     if(document.querySelector("#editor")?.innerHTML!==null && Object!==null){
    //     const content = document.querySelector('#editor').innerHTML;
    //     await page.setContent(content);
      
    //     // Take a screenshot of the rendered content
    //     await page.screenshot({ path: 'template.png', fullPage: true });
      
    //     await browser.close();
    //   }
    //     // Set the HTML content of the page to the GrapesJS editor content
       
    //   }
      
    //   // Call the function to export the template as an image
    //   exportTemplateAsImage();

    const [editor, setEditor] = useState<Editor | null>(null);

   
    interface PostData {
      htmlContent: string;
      cssContent: string;
    }
  
    const postCodeToEndpoint = async (htmlCode: string, cssCode: any) => {
      try {
        const postData: PostData = {
          htmlContent: htmlCode,
          cssContent: cssCode,
        };
  
        await axios.post('http://localhost:3000/api-template-generation', postData);
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      const editor = grapesjs.init({
        container: "#editor",
        panels: {},
        plugins: [
          gjsPresetNewsletter,
          ckeditor,
          customCode,
          tuiEditor,
          blocks,
          forms,
          flexbox
        ],
        pluginsOpts: {
          gjsPresetNewsletter: {},
          ckeditor: {},
          customCode: {},
          flexbox:{},
          tuiEditor: {
            config: {
              includeUI: {
                initMenu: "filter",
              },
            },
          },
          blocks: {},
          forms: {},
        },
      });
/*  
  var canvas = document.getElementById("mycanvas");
    var downloadlink = document.getElementById("downloadlink");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(100,75,50,0,Math.PI*2);
    ctx.stroke();
    var imagedata = canvas.toDataURL("image/png");
    downloadlink.href = imagedata;




     const canvas = editor.Canvas.getElement();
                if (!canvas) {
                  console.error("Canvas element not found!");
                  return;
                }
                
                const imagedata = canvas.toDataURL("image/png");
      
                console.log(imagedata); // This will log the data URL of the canvas image

*/
      editor.Panels.getPanels();
      editor.Panels.addButton("options", [
        {
          id: "save",
          className: "fa fa-floppy-o icon-blank",
          command: function (editor1: Editor, sender: any) {
            console.log("editor",editor1.Canvas.getCanvasView().getCanvasOffset());
            const htmlContent = editor.getHtml();
            const cssContent = editor.getCss();
            const canvas = editor.Canvas.getElement();
            if (!canvas) {
              console.error("Canvas element not found!");
              return;
            }
            
            // const imagedata = canvas.toDataURL("image/png");
            console.log("imagedata",canvas);
            // const canvas = editor.Canvas.getBody();
            // const imagedata = canvas.toDataURL("image/png");
            // command: function (editor1, sender) {
               
            console.log(htmlContent);
            console.log(cssContent);
  
            postCodeToEndpoint(htmlContent, cssContent);
          },
  
          attributes: { title: "Save Template" }
        },
      ]);
      setEditor(editor);
    }, []);
  
    return (
      <div className="App">
        <div id="editor"></div>
      </div>
    );
  }
  


export default TemplateComponent
