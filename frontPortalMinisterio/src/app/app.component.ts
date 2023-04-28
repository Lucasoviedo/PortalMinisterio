import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";
import { LoginService } from './main/api/resources/login.service';
import { UsuarioService } from './main/api/resources/usuarios.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontPortalMinisterio';

  showHeaderOptions = false;
  showHeaderOptionsMovile = false

  userPermissions : number = 0;

  constructor(  private router: Router, 
    private cookieService: CookieService,
    private loginService : LoginService,
    private usuariosService : UsuarioService,
    public translate : TranslateService){
      this.translate.addLangs(['es','en']);
      this.translate.setDefaultLang('es');
      this.translate.use('en')
    }

  ngOnInit(): void {
    //Comprobar que exista la sesion
    if(!this.cookieService.get('authToken')){
        this.showHeaderOptions = false;
        this.cookieService.delete('rolUsuario');
        this.router.navigate(['/login']);
    } else {
      
      if(!this.cookieService.get('rolUsuario')){
        this.usuariosService.getRolNumber()
        .subscribe((response) => {
            this.cookieService.set('rolUsuario', response);
            this.userPermissions = response;
        })
      }

      this.showHeaderOptions = true;
      if(this.cookieService.get('authToken') === ""){
        this.cookieService.delete('authToken');
        this.router.navigate(['/login']);
      }

      this.usuariosService.getLanguage()
      .subscribe((response: any) => {
        if(response !== 1){
          this.translate.use('en')
        }
      })
    }

    if(this.cookieService.get('rolUsuario')){
      this.usuariosService.getRolNumber()
      .subscribe((response) => {
          this.userPermissions = response;
      })
    }
  }

  logout(){
    this.loginService.logout()
    .subscribe((response: any) => {
      this.router.navigate(['/login']);
      this.cookieService.delete('authToken');
      this.cookieService.delete('idUsuario');
      window.location.reload();
    },
    (error => {
      this.router.navigate(['/login']);
      this.cookieService.delete('authToken');
      this.cookieService.delete('idUsuario');
      window.location.reload();
    }));
  }

  ruteoHeader(ruta : String){
    this.router.navigate([ruta]);
    this.clickShowHeaderOptionsMovile();
  }

  clickShowHeaderOptionsMovile(){
    this.showHeaderOptionsMovile = !this.showHeaderOptionsMovile;
  }
}
