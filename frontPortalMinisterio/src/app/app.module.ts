import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppHttpInterceptor } from './core/interceptors/app-http.interceptor';
import { AppErrorHandler } from './core/handlers/app-error.handler';
import { ResourceModule } from '@kkoehn/ngx-resource-handler-ngx-http';

import { CoreModule } from './core/core.module';
import { MainModule } from './main/main.module';
import { RouterModule, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { LoginComponent } from './main/components/login/login.component';
import { NotFoundPageComponent } from './main/components/notFoundPage/notFoundPage.component';

const appRoutes:Routes = [
  {path:'login',component: LoginComponent},
  {path: '**',component: NotFoundPageComponent}, 
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ResourceModule.forRoot(),
    CoreModule,
    MainModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    { provide: CookieService},
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
