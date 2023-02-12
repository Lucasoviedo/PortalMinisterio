import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from 'src/environments/environment';

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
    private route: ActivatedRoute){
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
}
