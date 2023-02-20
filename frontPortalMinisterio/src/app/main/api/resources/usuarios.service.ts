import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { IUsuario } from 'src/app/core/models/usuarios/i-usuario';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = `${environment.apiUrl}`;
  

  constructor(private http: HttpClient,
    private cookieService : CookieService) { }
    
  getUsuarios() {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<IUsuario>(this.url + '/usuarios/' ,{
    }, {headers} );
  }

  logout(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<IUsuario>(this.url + '/usuarios/logout' ,{
    }, {headers} );
  }

}
