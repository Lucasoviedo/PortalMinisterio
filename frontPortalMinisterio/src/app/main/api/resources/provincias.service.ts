import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { IProvincia } from 'src/app/core/models/i-provincia';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  private url = `${environment.apiUrl}`;
  

  constructor(private http: HttpClient,
    private cookieService : CookieService) { }
    
  getProvincias(idUsuario: number) {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });

    return this.http.post<IProvincia>(this.url + '/provincias/' ,{
      idUsuario
    }, {headers} );
  }
}
