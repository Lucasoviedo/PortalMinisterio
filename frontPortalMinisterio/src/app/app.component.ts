import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from "@angular/router";
import { UsuarioService } from './main/api/resources/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontPortalMinisterio';

  showHeaderOptions = false;
  showHeaderOptionsMovile = false

  constructor(  private router: Router, 
    private cookieService: CookieService,
    private usuarioService: UsuarioService){}

  ngOnInit(): void {
    //Comprobar que exista la sesion
    if(!this.cookieService.get('authToken')){
        this.showHeaderOptions = false;
        this.router.navigate(['/login']);
    } else {
      this.showHeaderOptions = true;
      if(this.cookieService.get('authToken') === ""){
        this.cookieService.delete('authToken');
        this.router.navigate(['/login']);
      }
    }
  }

  logout(){
    this.usuarioService.logout()
    .subscribe((response: any) => {
      console.log(response)
        this.cookieService.delete('authToken');
        this.router.navigate(['/login']);
        window.location.reload();
    });
  }

  ruteoHeader(ruta : String){
    this.router.navigate([ruta]);
  }

  clickShowHeaderOptionsMovile(){
    this.showHeaderOptionsMovile = !this.showHeaderOptionsMovile;
  }
}
