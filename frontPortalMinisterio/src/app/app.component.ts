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
  title = 'frontPortalMinisterio';

  showHeaderOptions = false;
  showHeaderOptionsMovile = false;

  userPermissions: number = 0;

  constructor(
    private router: Router,
    private eventBusService: EventBusService,
    private cookieService: CookieService,
    private loginService: LoginService,
    private usuariosService: UsuarioService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
    this.translate.use('en')
  }

  ngOnInit(): void {
    //Comprobar que exista la sesion
    if (!this.cookieService.get('authToken')) {
      this.showHeaderOptions = false;
      this.cookieService.delete('rolUsuario');
      this.router.navigate(['/login']);
    } else {

      if (!this.cookieService.get('rolUsuario')) {
        this.usuariosService.getRolNumber()
          .subscribe((response) => {
            this.cookieService.set('rolUsuario', response);
            this.userPermissions = response;
            this.cdr.detectChanges(); // Manually trigger change detection
          })
      }

      this.showHeaderOptions = true;
      if (this.cookieService.get('authToken') === "") {
        this.cookieService.delete('authToken');
        this.router.navigate(['/login']);
      }

      this.usuariosService.getLanguage()
        .subscribe((response: any) => {
          if (response !== 1) {
            this.translate.use('en');
            this.cdr.detectChanges(); // Manually trigger change detection
          }
        })
    }

    if (this.cookieService.get('rolUsuario')) {
      this.usuariosService.getRolNumber()
        .subscribe((response) => {
          this.userPermissions = response;
          this.cdr.detectChanges(); // Manually trigger change detection
        })
    }

    this.eventBusService.onDashboardShown.subscribe(() => {
      this.ngOnInit();
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }

  logout() {
    this.loginService.logout()
      .subscribe((response: any) => {
        this.router.navigate(['/login']);
        this.cookieService.delete('authToken');
        this.cookieService.delete('idUsuario');
        this.showHeaderOptions = false;
        this.showHeaderOptionsMovile = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
        (error => {
          this.router.navigate(['/login']);
          this.cookieService.delete('authToken');
          this.cookieService.delete('idUsuario');
          this.showHeaderOptions = false;
          this.showHeaderOptionsMovile = false;
          this.cdr.detectChanges(); // Manually trigger change detection
        }));
  }

  ruteoHeader(ruta: String) {
    this.router.navigate([ruta]);
    this.clickShowHeaderOptionsMovile();
  }

  clickShowHeaderOptionsMovile() {
    this.showHeaderOptionsMovile = !this.showHeaderOptionsMovile;
  }
}
