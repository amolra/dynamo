import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { frontendValidations } from 'src/app/constants/constants';

@Component({
  selector: 'app-add-field-details',
  templateUrl: './add-field-details.component.html',
  styleUrls: ['./add-field-details.component.scss'],
})
export class AddFieldDetailsComponent {
  @Input() addFieldForm?: FormGroup;
  public validations = frontendValidations;
  checkedOptions = [];
  constructor(public fb: FormBuilder) {}
  get f(): any | null {
    return this.addFieldForm ? this.addFieldForm.controls : null;
  }
}
