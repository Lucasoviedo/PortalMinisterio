import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { IEditarDevolucion } from 'src/app/core/models/devoluciones/i-editarDevolucion';
import { ICriteriosBusquedaDevolucionesLabs } from 'src/app/core/models/i-criteriosBusquedaDevolucionesLabs';

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {
  private url = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient,
    private cookieService : CookieService) { }

  getRejectReasons(){
    return this.http.get<any>(this.url + '/devoluciones/motivos' );
  }

  obtenerDevoluciones(criteria: ICriteriosBusquedaDevolucionesLabs){
    const headers = new HttpHeaders({
          'Authorization': this.cookieService.get('authToken')
        });
        return this.http.post<any>(this.url + '/devoluciones/', criteria, {headers});
  }

  crearDevolucion(devolucion : IEditarDevolucion){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.put<IEditarDevolucion>(this.url + '/devoluciones/editar', devolucion, {headers});
  }

}
