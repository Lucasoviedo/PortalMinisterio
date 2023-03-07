import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { IVacuna } from 'src/app/core/models/vacunas/i-vacunas';

@Injectable({
  providedIn: 'root'
})
export class VacunasService {
  private url = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient,
    private cookieService : CookieService) { }

  // getVaccinateds(){
  //   const headers = new HttpHeaders({
  //     'Authorization': this.cookieService.get('authToken')
  //   });
  //   return this.http.post<IVacuna>(this.url + '/vacunas/' ,{
  //   }, {headers} );
  // }
    
  getVacunas() {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<IVacuna>(this.url + '/vacunas/' ,{
    }, {headers} );
  }

}
