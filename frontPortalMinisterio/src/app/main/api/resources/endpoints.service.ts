import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { IEndpoint } from 'src/app/core/models/endpoints/i-endpoint';
import { IEndpoints } from 'src/app/core/models/endpoints/i-endpoints';
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


  pingCABA(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<any>(this.url + '/endpoints/estado-caba', {headers});
  }

  pingCBA(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<any>(this.url + '/endpoints/estado-cba', {headers});
  }

  
  pingSA(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<any>(this.url + '/endpoints/estado-sa', {headers});
  }

  // actualizarVacunas(vacuna : IVacunaEditada){
  //   const headers = new HttpHeaders({
  //     'Authorization': this.cookieService.get('authToken')
  //   });
  //   return this.http.put<IVacunaEditada>(this.url + '/vacunas/editar-vacuna', vacuna, {headers});
  // }

//   insertarEndpoint(endpoint : IEndpoint){
//     const headers = new HttpHeaders({
//       'Authorization': this.cookieService.get('authToken')
//     });
//     return this.http.post<IEndpoint>(this.url + '/endpoints/endpoint', endpoint, {headers});
//   }

}
