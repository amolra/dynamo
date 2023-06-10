import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormService } from '../form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  fetTechnology = [
    { id: 1, name: 'Angular' },
    { id: 2, name: 'React' },
    { id: 3, name: 'ViewJs' },
  ];
  backendTechnology = [
    { id: 0, name: 'NodeJs' },
    { id: 1, name: '.Net' },
    { id: 2, name: 'Java' },
    { id: 3, name: 'PHP' },
    { id: 4, name: 'Python' },
  ];
  types = [
    { id: 1, name: 'Add' },
    { id: 2, name: 'List' },
    { id: 3, name: 'Insert' },
  ];
  validations = [
    { id: 1, name: 'required' },
    { id: 2, name: 'spacesNotAllowed' },
    { id: 3, name: 'maxLength(100)' },
    { id: 4, name: 'unique' },
    { id: 5, name: 'email' },
  ];
  codeForm: FormGroup;
  options: any;
  constructor(
    private fb: FormBuilder,
    public service: FormService,
    private toastr: ToastrService
  ) {
    this.options = [
      {
        value: 'green',
        label: 'Template Green',
        img: './assets/templates/green.png',
      },
      {
        value: 'blue',
        label: 'Template Blue',
        img: './assets/templates/blue.png',
      },
    ];

    this.codeForm = this.fb.group({
      fetTech: '',
      backTech: '',
      component: this.fb.array([]),
      selectedTemplate: '',
    });
  }
  component(): FormArray {
    return this.codeForm.get('component') as FormArray;
  }
  newComponent(): FormGroup {
    return this.fb.group({
      parentModuleName: '',
      newModuleName: '',
      componentName: '',
      serviceMethodName: '',
      typeOfOpration: '',
      tableName: '',
      tableNameForTransaction: '',
      fields: this.fb.array([]),
    });
  }
  addComponent() {
    this.component().push(this.newComponent());
  }
  removeComponent(i: number) {
    this.component().removeAt(i);
  }
  getField(i: number): FormArray {
    return this.component().at(i).get('fields') as FormArray;
  }
  newField(): FormGroup {
    return this.fb.group({
      fieldName: '',
      fieldLabel: '',
      fieldNameBackend: '',
      lengthOfField: '',
      typeOfField: '',
      validation: [],
    });
  }
  addField(i: number) {
    this.getField(i).push(this.newField());
  }
  removeComponentField(component: number, field: number) {
    this.getField(component).removeAt(field);
  }
  save(): void {
    console.log(this.codeForm.value);
    this.toastr.info(
      'Project structure creation will take 7 to 8 minutes.',
      'Project Structure Creation'
    );

    // this.service
    //   .generateModuleComponent(this.codeForm.value)
    //   .subscribe((result) => {
    //     this.toastr.info(
    //       this.codeForm.value.fetTech + ' project structure creation done.',
    //       'Project Structure'
    //     );
    //     console.log('result', result);
        
    //   });
      this.service
          .generateAPICode(this.codeForm.value)
          .subscribe((resultApi) => {
            this.toastr.info(
              this.codeForm.value.backTech +
                ' project structure creation done.',
              'Project Structure'
            );
            if (resultApi) {
              alert('Code generated');
            }
          });
  }
}
