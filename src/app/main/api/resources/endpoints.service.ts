import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { IEndpoint } from 'src/app/core/models/endpoints/i-endpoint';
import { IEndpoints } from 'src/app/core/models/endpoints/i-endpoints';
import { INuevoEndpoint } from 'src/app/core/models/endpoints/i-nuevoEndpoint';
// import { IEndpoint } from 'src/app/core/models/endpoints/i-endpoint';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  private url = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient,
    private cookieService : CookieService) { }

  obtenerEndpoints(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<any>(this.url + '/endpoints/', {headers});
  }

  obtenerTecnologias(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<any>(this.url + '/endpoints/tecnologias', {headers});
  }


  editarEndpoint(endpoint: IEndpoint){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.put<IEndpoint>(this.url + '/endpoints/editar', endpoint, {headers});
  }

  insertarEndpoint(endpoint: INuevoEndpoint){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<INuevoEndpoint>(this.url + '/endpoints/insertar', endpoint, {headers});
  }

  pingEndpoint(codigo: string){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<any>(this.url + `/endpoints/estado/${codigo}`, {headers});
  }

}
