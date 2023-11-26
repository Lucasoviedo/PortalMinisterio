import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltrarPorPipe } from './pipes/filtrar-por.pipe';



@NgModule({
  declarations: [
    FiltrarPorPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FiltrarPorPipe
  ]
})


export class SharedModule { }
