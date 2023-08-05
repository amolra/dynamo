import React, { useState, useEffect } from "react";
import grapesjs, { Editor } from "grapesjs";
import gjsPresetNewsletter from "grapesjs-preset-newsletter";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ckeditor from "grapesjs-plugin-ckeditor";
import customCode from "grapesjs-custom-code";
import tuiEditor from "grapesjs-tui-image-editor";
import blocks from "grapesjs-blocks-basic";
import forms from "grapesjs-plugin-forms";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
// import tab from "grapesjs-tabs";
import flexbox from "grapesjs-blocks-flexbox";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function TemplateComponent(): JSX.Element {
  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!value.trim()) {
      toast.error("Please enter a template name.");
      return;
    }

    if (/[^a-zA-Z0-9\s]/.test(value)) {
      toast.error(
        "Template name should only contain letters, numbers, and spaces."
      );
      return;
    }

    if (value.length > 50) {
      toast.error("Template name should not exceed 50 characters.");
      return;
    }
    if (editor) {
      const htmlContent = editor.getHtml();
      const cssContent = editor.getCss();
      try {
        await postCodeToEndpoint(htmlContent, cssContent, value);

        handleClose();
      } catch (error) {
        toast.error("Error saving template.");
      }
    }
  };

  const [editor, setEditor] = useState<Editor | null>(null);

  interface PostData {
    htmlContent: string;
    cssContent: string;
    templateDirectoryName: String;
  }

  const postCodeToEndpoint = async (
    htmlCode: string,
    cssCode: any,
    templateDirectoryName: String
  ) => {
    try {
      const postData: PostData = {
        htmlContent: htmlCode,
        cssContent: cssCode,
        templateDirectoryName,
      };
      console.log(postData);

      await axios.post(
        "http://localhost:3000/api-template-generation",
        postData
      );
      toast.success("Template Saved Successfully!!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setTimeout(() => {
        navigate("/form", {
          state: {
            templateDirectoryName,
            htmlContent: htmlCode,
            cssContent: cssCode,
          },
        });
      }, 4000);
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
        flexbox,
      ],
      pluginsOpts: {
        gjsPresetNewsletter: {},
        ckeditor: {},
        customCode: {},
        flexbox: {},
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

    editor.Panels.getPanels();
    editor.Panels.addButton("options", [
      {
        id: "save",
        className: "fa fa-floppy-o icon-blank",
        command: function (editor1: Editor, sender: any) {
          console.log(
            "editor",
            editor1.Canvas.getCanvasView().getCanvasOffset()
          );

          const canvas = editor.Canvas.getElement();
          if (!canvas) {
            console.error("Canvas element not found!");
            return;
          }

          handleShow();
        },

        attributes: { title: "Save Template" },
      },
    ]);
    setEditor(editor);
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <div id="editor"></div>
      {/* Bootstrap Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Template Generation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Woohoo, your template is ready just name your template!!!
          <InputGroup className="mb-3 mt-2">
            <Form.Control
              value={value}
              placeholder="Template Name"
              aria-label="TemplateName"
              aria-describedby="basic-addon1"
              onChange={(e) => setValue(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Template
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TemplateComponent;
