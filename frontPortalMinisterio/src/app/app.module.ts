import { HttpClientModule, HttpClient , HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
import { LotesAdminComponent } from './main/components/lotesAdmin/lotesAdmin.component';
import { LotesConsultaComponent } from './main/components/lotesConsulta/loteConsulta.component';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, '../assets/i18n/', '.json')
}

const appRoutes:Routes = [
  {path: '', component: DashboardComponent},
  {path:'login',component: LoginComponent},
  {path: 'laboratorios',component: LaboratoriosComponent},
  {path: 'provincias',component: ProvinciasComponent},
  {path: 'usuarios',component: UsuariosComponent},
  {path: 'vacunados',component: VacunadosComponent},
  {path: 'lotes-admin',component: LotesAdminComponent},
  {path: 'lotes-consulta',component: LotesConsultaComponent},
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
    LaboratoriosComponent,
    LotesAdminComponent,
    LotesConsultaComponent,
    VacunadosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide : TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps : [HttpClient]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
