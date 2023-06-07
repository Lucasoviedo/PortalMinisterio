import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { IProvincia } from 'src/app/core/models/provincias/i-provincia';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { INuevaVacunaProv } from 'src/app/core/models/lotesMinProv/i-nuevaVacunaProv';
import { IEnvioProvincia } from 'src/app/core/models/lotesMinProv/i-envioProvincia';
import { ICriteriosBusquedaProv } from 'src/app/core/models/i-criteriosBusquedaProv';

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

  getCentrosSalud(codigoProvincia: string) {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<any>(this.url + '/provincias/centros-vac' ,
      codigoProvincia
    , {headers} );
  }

  obtenerProvinciasDistribuir(codLote : string) {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<any>(this.url + '/provincias/a-distribuir' ,{codLote}, {headers} );
  }

  insertarLoteProvincia(vacuna : INuevaVacunaProv) {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<INuevaVacunaProv>(this.url + '/vacunas-provincias/insertar-vacunas' , [vacuna], {headers} );
  }

  obtenerLotesProvincias(criteria : ICriteriosBusquedaProv ) {
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<any>(this.url + '/lotes-provincias/' , criteria, {headers} );
  }

  editarLoteProvincia(lote: IEnvioProvincia){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.put<any>(this.url + '/lotes-provincias/editar' , lote, {headers} );
  }

  obtenerModosDistribucion(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<any>(this.url + '/lotes-provincias/modos-distribucion' , {headers} );
  }

  getCodigoProvinciaFromIdUsuarioConectado(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<any>(this.url + '/provincias/codigo' , {headers} );
  }

  getCodigosProvinciasConEndpoints(){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.get<any>(this.url + '/provincias/codigos' , {headers} );
  }

  getNombreProvinciaByCodProvincia(codigoProvincia : string){
    const headers = new HttpHeaders({
      'Authorization': this.cookieService.get('authToken')
    });
    return this.http.post<any>(this.url + '/provincias/nombre' ,{codigoProvincia}, {headers} );
  }
}
