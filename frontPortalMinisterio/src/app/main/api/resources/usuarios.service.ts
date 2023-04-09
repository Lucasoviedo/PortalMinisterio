import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams } from '@angular/common/http';
import { IUsuario } from 'src/app/core/models/usuarios/i-usuario';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { INuevoUsuario } from 'src/app/core/models/usuarios/i-nuevoUsuario';
import { IIdioma } from 'src/app/core/models/usuarios/i-idiomas';

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

  getIdiomas(){
    let idioma = <IIdioma> {
      idioma : undefined
    }

    return this.http.post<IUsuario>(this.url + '/usuarios/idiomas' , idioma
    );
  }

  getRoles(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<IUsuario>(this.url + '/usuarios/roles' ,{
    }, {headers} );
  }

  agregarUsuario( nuevoUsuario : INuevoUsuario){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<IUsuario>(this.url + '/usuarios/nuevo' , nuevoUsuario
    , {headers} );
  }

  eliminarUsuario( userToDelete : number){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<IUsuario>(this.url + '/usuarios/eliminar' , userToDelete
    , {headers} );
  }

  getDashboardUser(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<any>(this.url + '/usuarios/dashboard',{} , {headers} );
  }


  getRolNumber(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<any>(this.url + '/usuarios/rol', {} , {headers} );
  }
}
