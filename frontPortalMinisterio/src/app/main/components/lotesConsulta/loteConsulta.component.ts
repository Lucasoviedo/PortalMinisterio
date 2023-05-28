import { Component, OnInit } from "@angular/core";
import { DevolucionesService } from "../../api/resources/devoluciones.service";
import { INuevaDevolucionLab } from "src/app/core/models/lotesMinLab/i-nuevaDevolucionLab";
import { ProvinciaService } from "../../api/resources/provincias.service";
import { INuevoLoteProv } from "src/app/core/models/lotesMinProv/i-nuevoLoteProv";
import { IEmpresaTransporte } from "src/app/core/models/i-empresaTransporte";
import { IRejectReason } from "src/app/core/models/vacunas/i-rejectReason";
import { LotesGeneralService } from "../../api/resources/lotesGeneral.service";
import { IEnvioProvincia } from "src/app/core/models/lotesMinProv/i-envioProvincia";

@Component({
    selector: 'app-loteConsulta',
    templateUrl: './loteConsulta.component.html',
    styleUrls: ['./loteConsulta.component.css','../generalStyles.css']
})

export class LotesConsultaComponent implements OnInit{

    empresaTransporteActual = 0;
    fechaDevolucion = "";
    codigoSeguiminetoActual = "";

    loteDevolucionEditado: IEnvioProvincia = {
        codigoLote: "",
        codigoProvincia: "",
        idEmpresaTransporte: 0,
        fechaEnvio: "",
        codigoSeguimiento: "",
    }

    constructor(private devolucionesService : DevolucionesService,
        private lotesGeneralService : LotesGeneralService,
        private provinciasService : ProvinciaService) { }

    devolucionesLaboratorios : Array<INuevaDevolucionLab> = [];
    lotesProvincias : Array<INuevoLoteProv> = [];

    loteActual : Array<INuevoLoteProv> = [];

    empresasTransporte : Array<IEmpresaTransporte> = [];
    rejectionReasonsData : Array<IRejectReason> = [];

    ngOnInit() {
        this.devolucionesService.obtenerDevoluciones()
        .subscribe((response : any) => {
            this.devolucionesLaboratorios = response || [];
        })
 
        this.devolucionesService.getRejectReasons()
        .subscribe((response: any) => {
            this.rejectionReasonsData = response;
        })

        this.lotesGeneralService.obtenerEmpresasTransporte()
        .subscribe((response: any) => {
            this.empresasTransporte = response;
        })

        this.provinciasService.obtenerLotesProvincias()
        .subscribe((response : any) => {
            this.lotesProvincias = response || [];
            console.log(response)
        })
    }

    despacharLote(lote : INuevoLoteProv){
        this.loteActual = [lote]
    }

    cambioEmpresaTransporte(evento : any){
        this.empresaTransporteActual = parseInt(evento.target.value)
    }

    cambioCodigoSeguimiento(evento: any){
        this.codigoSeguiminetoActual = evento.target.value
    }
    
    cambioFechaDevolucion(evento: any){
        this.fechaDevolucion = evento.target.value
    }

    despacharLoteProvincia(){
        this.loteDevolucionEditado.idEmpresaTransporte = this.empresaTransporteActual;
        this.loteDevolucionEditado.codigoSeguimiento = this.codigoSeguiminetoActual;
        this.loteDevolucionEditado.fechaEnvio = this.fechaDevolucion;
        this.loteActual
        this.loteDevolucionEditado.codigoLote = this.loteActual[0].codigoLote || "",
        this.loteDevolucionEditado.codigoProvincia = this.loteActual[0].codigoProvincia || "",


        this.provinciasService.editarLoteProvincia(this.loteDevolucionEditado)
        .subscribe((response : any) => {
                console.log(response);
                this.loteDevolucionEditado.idEmpresaTransporte = 0;
                this.loteDevolucionEditado.codigoSeguimiento = "";
                this.loteDevolucionEditado.fechaEnvio = ""; 
                this.loteDevolucionEditado.codigoLote = "";
                this.loteDevolucionEditado.codigoProvincia = "";
        })

        this.provinciasService.obtenerLotesProvincias()
        .subscribe((response : any) => {
            this.lotesProvincias = response
            console.log(response)
        })
    }

}