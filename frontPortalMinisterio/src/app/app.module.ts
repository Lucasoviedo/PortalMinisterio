import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppHttpInterceptor } from './core/interceptors/app-http.interceptor';
import { AppErrorHandler } from './core/handlers/app-error.handler';

import { CoreModule } from './core/core.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { LoginComponent } from './main/components/login/login.component';
import { NotFoundPageComponent } from './main/components/notFoundPage/notFoundPage.component';
import { DashboardComponent } from './main/components/dashboard/dashboard.component';
import { LaboratoriosComponent } from './main/components/laboratorios/laboratorios.component';
import { ProvinciasComponent } from './main/components/provincias/provincias.component';
import { VacunadosComponent } from './main/components/vacunados/vacunados.component';
import { UsuariosComponent } from './main/components/usuarios/usuarios.component';

import { CommonModule } from '@angular/common';

const appRoutes:Routes = [
  {path: '', component: DashboardComponent},
  {path:'login',component: LoginComponent},
  {path: 'laboratorios',component: LaboratoriosComponent},
  {path: 'provincias',component: ProvinciasComponent},
  {path: 'usuarios',component: UsuariosComponent},
  {path: 'vacunados',component: VacunadosComponent},
  {path: '**',component: NotFoundPageComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundPageComponent,
    DashboardComponent,
    ProvinciasComponent,
    UsuariosComponent,
    LaboratoriosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
