import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirstPageComponent } from './modules/first-page/first-page.component';
import { AddFieldDetailsComponent } from './modules/add-field-details/add-field-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialExampleModule } from './modules/material.module';
import { ModuleComponentListComponent } from './modules/module-component-list/module-component-list.component';
@NgModule({
  declarations: [
    AppComponent,
    FirstPageComponent,
    AddFieldDetailsComponent,
    ModuleComponentListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
