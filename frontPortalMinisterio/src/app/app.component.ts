import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";
import { LoginService } from './main/api/resources/login.service';
import { UsuarioService } from './main/api/resources/usuarios.service';
import { TranslateService } from '@ngx-translate/core';
import { EventBusService } from './main/api/resources/event-bus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showHeaderOptions = false;
  showHeaderOptionsMovile = false;

  userPermissions: number = 0;
  nombreUsuario : string = "";

  constructor(
    private router: Router,
    private eventBusService: EventBusService,
    private cookieService: CookieService,
    private usuariosService: UsuarioService,
    private loginService: LoginService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
  }
  showSplash = true;

  ngOnInit(): void {

    setTimeout(() => {
      this.showSplash = false;
    }, 2000);

    //Comprobar que exista la sesion
    if (!this.cookieService.get('authToken' || this.cookieService.get('authToken') === "")) {
      this.showHeaderOptions = false;
      this.cookieService.delete('rolUsuario');
      this.router.navigate(['/login']);
    } else {
      this.usuariosService.getRolNumber()
      .subscribe((response) => {
        this.cookieService.set('rolUsuario', response);
        this.userPermissions = response;
      })
      this.showHeaderOptions = true;

      this.usuariosService.obtenerNombreApellido()
      .subscribe((response : any) => {
        this.nombreUsuario = `${response.apellido} ${response.nombre}`
      })

      this.usuariosService.getLanguage()
      .subscribe((responseLenguaje: any) => {
          if (responseLenguaje !== 1) {
              this.translate.use('en');
          } else {
              this.translate.use('es');
          }
        })
    }

    this.eventBusService.onDashboardShown.subscribe(() => {
      this.ngOnInit();
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }

  logout() {
    this.loginService.logout()
      .subscribe(() => {
        this.router.navigate(['/login']);
        this.cookieService.delete('authToken');
        this.cookieService.delete('idUsuario');
        this.cookieService.delete('rolUsuario');
        this.showHeaderOptions = false;
        this.showHeaderOptionsMovile = false;
      },
        (error => {
          this.router.navigate(['/login']);
          this.cookieService.delete('authToken');
          this.cookieService.delete('idUsuario');
          this.cookieService.delete('rolUsuario');
          this.showHeaderOptions = false;
          this.showHeaderOptionsMovile = false;
          this.cdr.detectChanges(); // Manually trigger change detection
        }));
        
        this.userPermissions = 0;
        this.nombreUsuario = "";
  }

  ruteoHeader(ruta: String) {
    if (this.cookieService.get('authToken')){
      this.router.navigate([ruta]);
      this.clickShowHeaderOptionsMovile();
    }
  }

  clickShowHeaderOptionsMovile() {
    this.showHeaderOptionsMovile = !this.showHeaderOptionsMovile;
  }
}
