import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { IVacuna } from 'src/app/core/models/vacunas/i-vacunas';
import { IVacunaEditada } from 'src/app/core/models/vacunas/i-vacunaEditada';

@Injectable({
  providedIn: 'root'
})
export class VacunasService {
  private url = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient,
    private cookieService : CookieService) { }

  getVaccinateds(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<any>(this.url + '/vacunaciones/' , {} , {headers} );
  }
    
  getVacunas() {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<IVacuna>(this.url + '/vacunas/' ,{
    }, {headers} );
  }
  
  actualizarVacunas(vacuna : IVacunaEditada){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.put<IVacunaEditada>(this.url + '/vacunas/editar-vacuna', vacuna, {headers});
  }

  getVacunacionesLab(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<any>(this.url + '/vacunaciones/vacunaciones-laboratorio', {headers});
  }
}
