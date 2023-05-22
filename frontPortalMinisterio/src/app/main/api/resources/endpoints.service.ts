import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
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

//   obtenerEndpoint(endpoint : IEndpoint){
//     const headers = new HttpHeaders({
//       'Authorization': this.cookieService.get('authToken')
//     });
//     return this.http.post<IEndpoint>(this.url + '/endpoints/endpoint', endpoint, {headers});
//   }

}
