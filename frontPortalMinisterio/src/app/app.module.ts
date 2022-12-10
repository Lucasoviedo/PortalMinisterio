import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderComponent } from './core/layouts/loader/loader/loader.component';
import { MessageDialogComponent } from './core/layouts/message-dialog/message-dialog/message-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    MessageDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
