import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { IEstado } from 'src/app/core/models/i-estado';
import { IEditarLoteRecepcion } from 'src/app/core/models/lotesMinLab/i-editarLote';
import { IEstadosVacunas } from 'src/app/core/models/vacunas/i-estadosVacunas';
import { IEmpresaTransporte } from 'src/app/core/models/i-empresaTransporte';
import { IConsultaDevolucion } from 'src/app/core/models/lotesMinProv/i-consultaDevolucion';
import { ICriteriosBusqueda } from 'src/app/core/models/i-criteriosBusqueda';

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
    return this.http.get<IEstado>(this.url + '/lotes/estados', {headers});
  }

  obtenerEmpresasTransporte() {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<IEmpresaTransporte>(this.url + '/lotes/empresas-transporte', {headers});
  }

  actualizarLoteAdmin(lote : String){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.put<IEditarLoteRecepcion>(this.url + '/lotes/marcar-recepcion-lote', lote, {headers});
  }

  getVaccinesStates(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<IEstadosVacunas>(this.url + '/vacunas/estados', {headers});
  }

  obtenerDevolucionesProvincias(criteria : ICriteriosBusqueda){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<ICriteriosBusqueda>(this.url + '/devoluciones-provincias/' , criteria , {headers} );
  }

  marcarRecepcionDevolucionProvincia(fecha : string){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.put<IConsultaDevolucion>(this.url + '/devoluciones-provincias/marcar-recepcion-devolucion' , fecha , {headers} );
  }
}
