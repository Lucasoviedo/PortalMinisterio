import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ILoteLab } from 'src/app/core/models/lotesMinLab/i-loteLab';
import { CookieService } from 'ngx-cookie-service';
import { IVacuna } from 'src/app/core/models/vacunas/i-vacunas';
import { ICriteriosBusquedaLotesLabs } from 'src/app/core/models/i-criteriosBusquedaLotesLabs';

@Injectable({
  providedIn: 'root'
})
export class LotesMinLabService {
  private url = `${environment.apiUrl}`;

  constructor(private http: HttpClient,
    private cookieService : CookieService) { }

  obtenerLotes(criteria : ICriteriosBusquedaLotesLabs) {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<ILoteLab>(this.url + '/lotes/', criteria, {headers});
  }

  obtenerVacunasLote(codigoLote : String){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<IVacuna>(this.url + '/vacunas/', {"codigoLote" : codigoLote} , {headers});
  }
}
