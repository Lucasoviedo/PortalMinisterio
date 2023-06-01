import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ITokenModel } from 'src/app/core/models/i-tokenModel';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = `${environment.apiUrl}`;

  constructor(private http: HttpClient,
    private cookieService : CookieService) { }

  login(nombreUsuario: string, password: string) {
    return this.http.post<ITokenModel>(this.url + '/usuarios/login', {
        nombreUsuario,
        password
    });
  }

  logout(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<any>(this.url + '/usuarios/logout' ,{
    }, {headers} );
  }

  getUsuarioIdByToken() {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<ITokenModel>(this.url + '/token/id', {}, {headers});
  }
}
