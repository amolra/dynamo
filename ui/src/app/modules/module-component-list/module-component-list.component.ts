import { Component, Input, OnInit } from '@angular/core';
import { IApplicationDetails } from 'src/app/constants/constants';

@Component({
  selector: 'app-module-component-list',
  templateUrl: './module-component-list.component.html',
  styleUrls: ['./module-component-list.component.scss'],
})
export class ModuleComponentListComponent implements OnInit {
  @Input() tableData: IApplicationDetails[] = [];
  public fieldDetails: string = '';
  constructor() {}

  ngOnInit(): void {}
}
