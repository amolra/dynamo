import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
    { id: 1, name: '.Net' },
    { id: 2, name: 'Java' },
    { id: 3, name: 'PHP' },
    { id: 4, name: 'Python' },
  ];
  types = [
    { id: 1, name: 'Add' },
    { id: 2, name: 'Edit' },
    { id: 3, name: 'Home' },
  ];
  validations = [
    { id: 1, name: 'Required' },
    { id: 2, name: 'SpacesNotAllowed' },
    { id: 3, name: 'MaxLength(100)' },
    { id: 4, name: 'Unique' },
    { id: 5, name: 'Email' },
  ];
  codeForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.codeForm = this.fb.group({
      fetTech: '',
      backTech: '',
      component: this.fb.array([]),
    });
  }
  component(): FormArray {
    return this.codeForm.get('component') as FormArray;
  }
  newComponent(): FormGroup {
    return this.fb.group({
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
  }
}
