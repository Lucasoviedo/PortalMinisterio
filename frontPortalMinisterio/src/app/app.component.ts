import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import { UsuarioService } from './main/api/resources/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontPortalMinisterio';

  onlogin = true;

  constructor(  private router: Router, 
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService){
      this.router.events.subscribe(event => {
        if (this.router.url === `${environment.apiUrl}/login`) {
          this.onlogin = true;
        } else {
          this.onlogin = false;
        }
      });
    }

  cerrarSesion(){
    this.cookieService.delete('authToken');
    this.router.navigate(['/login']);
  }

  logout(){
    this.usuarioService.logout()
    .subscribe((response: any) => {
        this.router.navigate(['/login']);
    });
}
}
