import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  backendFramework,
  componentTypes,
  frontendFramework,
  IApplicationDetails,
} from 'src/app/constants/constants';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.scss'],
})
export class FirstPageComponent {
  // public customForm: FormGroup;
  public frontendFrameworkList = frontendFramework;
  public backendFrameworkList = backendFramework;
  toppings = new FormControl('');
  toppingList: string[] = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];
  // public moduleListForm: any[] = ['Add New One'];
  // public tableData: IApplicationDetails[] = [];
  // public componentTypes = componentTypes;
  // public customerAirCarrierCodes = 'customerAirCarrierCodes';
  // constructor(public fb: FormBuilder) {
  //   this.customForm = this.fb.group({
  //     frontendFramework: new FormControl(null, Validators.required),
  //     backendFramework: new FormControl(null, Validators.required),
  //     moduleName: new FormControl('', Validators.required),
  //     componentName: new FormControl('', Validators.required),
  //     componentType: new FormControl('', Validators.required),
  //     customerAirCarrierCodes: new FormArray([]),
  //   });
  // }
  // ngOnInit(): void {}
  // get f(): any {
  //   return this.customForm.controls;
  // }
  // public triggerValidation(): boolean {
  //   this.customForm.markAllAsTouched();
  //   return this.customForm.valid ? true : false;
  // }
  // addInput(): void {
  //   const form = this.customForm.value;
  //   if (this.triggerValidation()) {
  //     const saveObj: IApplicationDetails = {
  //       frontendFramework: form.frontendFramework,
  //       backendFramework: form.backendFramework,
  //       moduleName: form.moduleName,
  //       componentName: form.componentName,
  //       componentType: form.componentType,
  //       fieldDetails: form.customerAirCarrierCodes,
  //     };
  //     if (saveObj.moduleName !== 'Add New One')
  //       this.moduleListForm.push(saveObj.moduleName);
  //     this.tableData.push(saveObj);
  //     this.customForm.reset();
  //     const arrayControl = <FormArray>(
  //       this.customForm.controls[this.customerAirCarrierCodes]
  //     );
  //     arrayControl.clear();
  //   }
  // }
  // get airCarrierArr(): Array<FormGroup> {
  //   return <FormGroup[]>(
  //     (this.customForm.get(this.customerAirCarrierCodes) as FormArray).controls
  //   );
  // }
  // addFieldInput(): void {
  //   const arrayControl = <FormArray>(
  //     this.customForm.controls[this.customerAirCarrierCodes]
  //   );
  //   this.createNewFormGroup(arrayControl);
  // }
  // createNewFormGroup(arrayControl: FormArray): void {
  //   const addFieldForm = this.fb.group({
  //     fieldNameFET: new FormControl('', Validators.required),
  //     fieldNameBackend: new FormControl('', Validators.required),
  //     lengthOfField: new FormControl('', Validators.required),
  //     typeOfField: new FormControl('', Validators.required),
  //     validation: new FormControl('', Validators.required),
  //   });

  //   arrayControl.push(addFieldForm);
  //   this.customForm.controls[this.customerAirCarrierCodes] = arrayControl;
  // }
}
