import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxSmartModalModule} from 'ngx-smart-modal';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    NgxSmartModalModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
  ]
})
export class ToolsModule { }
