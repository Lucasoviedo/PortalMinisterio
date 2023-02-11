import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILoginUsuario } from 'src/app/core/models/i-loginUsuario'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginApi = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  login(nombreUsuario: string, password: string) {
    return this.http.post<ILoginUsuario>(this.loginApi + '/usuarios/login', {
        nombreUsuario,
        password
    });
  }
}
