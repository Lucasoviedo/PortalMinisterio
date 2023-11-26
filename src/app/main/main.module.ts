import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResourceModule } from 'ngx-resource';

import { DateFormatPipe } from './api/resources/date-format.pipe';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    DateFormatPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    ResourceModule.forRoot()
  ],
  providers: [],
  exports: [
  ]
})
export class MainModule { }
