import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { IEstado } from 'src/app/core/models/i-estado';

@Injectable({
  providedIn: 'root'
})
export class LotesGeneralService {
  private url = `${environment.apiUrl}`;

  constructor(private http: HttpClient,
    private cookieService : CookieService) { }

  obtenerEstados() {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<IEstado>(this.url + '/lotes/estados', {}, {headers});
  }
}
