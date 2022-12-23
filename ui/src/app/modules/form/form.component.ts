import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
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
  type = [
    { id: 1, name: 'Add' },
    { id: 2, name: 'Edit' },
    { id: 3, name: 'Home' },
  ];
  validation = [
    { id: 1, name: 'Required' },
    { id: 2, name: 'SpacesNotAllowed' },
    { id: 3, name: 'MaxLength(100)' },
    { id: 4, name: 'Unique' },
    { id: 5, name: 'Email' },
  ];
  public formName: FormGroup;
  constructor(public fb: FormBuilder) {
    this.formName = this.fb.group({
      fetTech: new FormControl(''),
      backendTech: new FormControl(''),
      parentModuleName: new FormControl(''),
      newModuleName: new FormControl(''),
      component: new FormArray([]),
    });
  }
  public ComponentfieldForm(): void {
    const controls = this.fb.group({
      name: new FormControl(''),
      type: new FormControl(''),
      fields: new FormArray([]),
    });
    (<FormArray>this.formName.get('component')).push(controls);
  }
  get component() {
    return (this.formName.get('component') as FormArray).controls;
  }
  public fieldForm(i: number): void {
    const controls = this.fb.group({
      fieldName: new FormControl(''),
      fieldLabel: new FormControl(''),
      fieldNameBackend: new FormControl(''),
      lengthOfField: new FormControl(''),
      typeOfField: new FormControl(''),
      validation: new FormControl([]),
    });
    const component = (<FormArray>this.formName.get('component'))
      ?.at(i)
      .get('fields') as FormArray;
    component.push(controls);
  }
  public field(i: number): FormArray {
    return (<FormArray>this.formName.get('component'))?.controls[
      i
    ] as FormArray;
  }
  ngOnInit(): void {}
}
