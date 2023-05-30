import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ILaboratorio } from 'src/app/core/models/laboratorios/i-laboratorio';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { INuevoLaboratorio } from 'src/app/core/models/laboratorios/i-nuevoLaboratorio';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  private url = `${environment.apiUrl}`;

  constructor(private http: HttpClient,
    private cookieService : CookieService) { }
    
  getLaboratorios() {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<ILaboratorio>(this.url + '/laboratorios/' , {headers} );
  }

  insertarLaboratorio(laboratorio: INuevoLaboratorio){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<INuevoLaboratorio>(this.url + '/laboratorios/insertar', laboratorio , {headers} );
  }

}
