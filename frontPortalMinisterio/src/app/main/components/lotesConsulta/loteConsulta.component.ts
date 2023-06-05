import { Component, OnInit } from "@angular/core";
import { DevolucionesService } from "../../api/resources/devoluciones.service";
import { INuevaDevolucionLab } from "src/app/core/models/lotesMinLab/i-nuevaDevolucionLab";
import { ProvinciaService } from "../../api/resources/provincias.service";
import { INuevoLoteProv } from "src/app/core/models/lotesMinProv/i-nuevoLoteProv";
import { IEmpresaTransporte } from "src/app/core/models/i-empresaTransporte";
import { IRejectReason } from "src/app/core/models/vacunas/i-rejectReason";
import { LotesGeneralService } from "../../api/resources/lotesGeneral.service";
import { IEnvioProvincia } from "src/app/core/models/lotesMinProv/i-envioProvincia";
import { Modal } from 'bootstrap';
import { IEditarLoteRecepcion } from "src/app/core/models/lotesMinLab/i-editarLote";
import { IDevolucionProvincia } from "src/app/core/models/lotesMinProv/i-devolucionProvincia";
import { ICriteriosBusqueda } from "src/app/core/models/i-criteriosBusqueda";
import { ICriteriosBusquedaProv } from "src/app/core/models/i-criteriosBusquedaProv";
import { LaboratorioService } from "../../api/resources/laboratorios.service";
import { LotesMinLabService } from "../../api/resources/lotesMinLab.service";
import { ILoteLab } from "src/app/core/models/lotesMinLab/i-loteLab";
import { ICriteriosBusquedaLotesLabs } from "src/app/core/models/i-criteriosBusquedaLotesLabs";
import { ICriteriosBusquedaDevolucionesLabs } from "src/app/core/models/i-criteriosBusquedaDevolucionesLabs";
import { CookieService } from "ngx-cookie-service";
import { UsuarioService } from "../../api/resources/usuarios.service";
import { FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'app-loteConsulta',
    templateUrl: './loteConsulta.component.html',
    styleUrls: ['./loteConsulta.component.css', '../generalStyles.css']
})

export class LotesConsultaComponent implements OnInit {
    filtro!: FormControl;

    constructor(private devolucionesService: DevolucionesService,
        private lotesGeneralService: LotesGeneralService,
        private provinciasService: ProvinciaService,
        private cookieService: CookieService,
        private usuariosService: UsuarioService,
        private laboratoriosService: LaboratorioService,
        private lotesMinLabService: LotesMinLabService) { }

    myModal = document.getElementById('#confirmDataChangeModal');

    userPermissions: number = 0;

    empresaTransporteActual = 0;
    fechaDevolucion = "";
    codigoSeguiminetoActual = "";

    loteDevolucionEditado: IEnvioProvincia = { codigoLote: "", codigoProvincia: "", idEmpresaTransporte: 0, fechaEnvio: "", codigoSeguimiento: "" }

    devolucionesLaboratorios: Array<INuevaDevolucionLab> = [];
    devolucionesLaboratoriosComplete: Array<INuevaDevolucionLab> = [];

    lotesProvincias: Array<INuevoLoteProv> = [];
    lotesProvinciasComplete: Array<INuevoLoteProv> = [];

    loteActual: Array<INuevoLoteProv> = [];

    lotesDevolucionesProvincias: Array<IDevolucionProvincia> = [];
    lotesDevolucionesProvinciasComplete: Array<IDevolucionProvincia> = [];

    fechaActualizacionRecibo = new Date();

    loteActualizacionRecibo: IEditarLoteRecepcion = { idUsuario: 1, codigoLote: "", codigoProvincia: "", fechaRecepcion: "" };

    empresasTransporte: Array<IEmpresaTransporte> = [];
    rejectionReasonsData: Array<IRejectReason> = [];

    criteriaBusqueda: ICriteriosBusqueda = {
        codigoLaboratorio: undefined,
        codigoProvincia: undefined,
    }

    criteriaBusquedaLotesLabs: ICriteriosBusquedaLotesLabs = {
        codigoLaboratorio: undefined,
        codigoEstado: undefined,
    }

    criteriaBusquedaDevolucionesLabs: ICriteriosBusquedaDevolucionesLabs = {
        codigoLaboratorio: undefined
    }

    criteriaBusquedaProvincia: ICriteriosBusquedaProv = {
        codigoProvincia: undefined,
        codigoEstado: undefined,
    }

    codigosProvincias: Array<string> = [];

    lotesData: Array<ILoteLab> = [];
    lotesDataComplete: Array<ILoteLab> = [];
    
    fechaInicio : Date =  new Date("1900-01-01");
    fechaFin : Date =  new Date();

    ngOnInit() {
        this.filtro = new FormControl('', [Validators.maxLength(255)]);

        this.provinciasService.getCodigoProvinciaFromIdUsuarioConectado().subscribe((response: any) => {
            if (response.codigoProvincia == "-2") {
                this.getInfoForLab();
            } else if (response.codigoProvincia == "-1") {
                this.getInfoForAdmin();
            } else {
                this.getInfoForProv(response.codigoProvincia);
            }
        });
    
        this.devolucionesService.getRejectReasons()
        .subscribe((response: any) => {
            this.rejectionReasonsData = response;
        });
    
        this.lotesGeneralService.obtenerEmpresasTransporte()
        .subscribe((response: any) => {
            this.empresasTransporte = response;
        });
    
        if (this.cookieService.get('rolUsuario')) {
            this.usuariosService.getRolNumber()
            .subscribe((response: any) => {
                this.userPermissions = response;
            });
        }
    }
    
    private getInfoForLab() {
        this.laboratoriosService.getCodigoLaboratorioFromIdUsuarioConectado()
        .subscribe((response: any) => {
            const codigoLaboratorio = response.codigoLaboratorio;
            this.criteriaBusquedaLotesLabs.codigoLaboratorio = codigoLaboratorio;
            this.criteriaBusquedaDevolucionesLabs.codigoLaboratorio = codigoLaboratorio;
    
            this.lotesMinLabService.obtenerLotes(this.criteriaBusquedaLotesLabs)
            .subscribe((response: any) => {
                this.lotesData = response || [];
                this.lotesDataComplete = response || [];
            });
    
            this.devolucionesService.obtenerDevoluciones(this.criteriaBusquedaDevolucionesLabs)
            .subscribe((response: any) => {
                this.devolucionesLaboratorios = response || [];
                this.devolucionesLaboratoriosComplete = response || [];
            });
        });
    }
    
    private getInfoForAdmin() {
        this.lotesMinLabService.obtenerLotes(this.criteriaBusquedaLotesLabs)
        .subscribe((response: any) => {
            this.lotesData = response || [];
            this.lotesDataComplete = response || [];
        });
    
        this.devolucionesService.obtenerDevoluciones(this.criteriaBusquedaDevolucionesLabs)
        .subscribe((response: any) => {
            this.devolucionesLaboratorios = response || [];
            this.devolucionesLaboratoriosComplete = response || [];
        });
    
        this.provinciasService.obtenerLotesProvincias(this.criteriaBusquedaProvincia)
        .subscribe((response: any) => {
            this.lotesProvincias = response || [];
            this.lotesProvinciasComplete = response || [];
        });
    
        this.lotesGeneralService.obtenerDevolucionesProvincias(this.criteriaBusqueda)
        .subscribe((response: any) => {
            this.lotesDevolucionesProvincias = response || [];
            this.lotesDevolucionesProvinciasComplete = response || [];
        });
    }
    
    private getInfoForProv(codigoProvincia: string) {
        this.criteriaBusquedaProvincia.codigoProvincia = codigoProvincia;
    
        this.provinciasService.obtenerLotesProvincias(this.criteriaBusquedaProvincia)
        .subscribe((response: any) => {
            this.lotesProvincias = response || [];
            this.lotesProvinciasComplete = response || [];
        });
    
        this.lotesGeneralService.obtenerDevolucionesProvincias(this.criteriaBusquedaProvincia)
        .subscribe((response: any) => {
            this.lotesDevolucionesProvincias = response || [];
            this.lotesDevolucionesProvinciasComplete = response || [];
        });
    }

    despacharLote(lote: INuevoLoteProv) {
        this.loteActual = [lote]
        this.empresaTransporteActual = 0;
        this.fechaDevolucion = "";
        this.codigoSeguiminetoActual = "";
    }

    despacharLoteProvincia() {
        this.loteDevolucionEditado.idEmpresaTransporte = this.empresaTransporteActual;
        this.loteDevolucionEditado.codigoSeguimiento = this.codigoSeguiminetoActual;
        this.loteDevolucionEditado.fechaEnvio = this.fechaDevolucion;
        this.loteDevolucionEditado.codigoLote = this.loteActual[0].codigoLote || "",
        this.loteDevolucionEditado.codigoProvincia = this.loteActual[0].codigoProvincia || "",

        this.provinciasService.editarLoteProvincia(this.loteDevolucionEditado)
        .subscribe(() => {
            this.provinciasService.obtenerLotesProvincias(this.criteriaBusquedaProvincia)
            .subscribe((response: any) => {
                this.lotesProvincias = response
            })
        })
    }

    openConfirmDataModal(evento: any, lote: IDevolucionProvincia) {
        if (new Date().toISOString().slice(0, 10) < evento.target.value) {
            alert("Seleccione una fecha igual o anterior al dia actual")
        } else {
            this.myModal = document.getElementById('confirmDataChangeModal');
            if (this.myModal) {
                const modal = new Modal(this.myModal);
                this.fechaActualizacionRecibo = evento.target.value;
                this.loteActualizacionRecibo.codigoProvincia = lote.codigoProvincia;
                this.loteActualizacionRecibo.codigoLote = lote.codigoDevolucion;
                this.loteActualizacionRecibo.fechaRecepcion = evento.target.value;
                modal.show();
            }
        }
    }

    actualizarFechaLoteAdmin() {
        this.lotesGeneralService.marcarRecepcionDevolucionProvincia(this.loteActualizacionRecibo.codigoLote + 'SEPARADOR' +
        this.loteActualizacionRecibo.fechaRecepcion + 'SEPARADOR' + this.loteActualizacionRecibo.codigoProvincia)
        .subscribe(() => {
            this.lotesGeneralService.obtenerDevolucionesProvincias(this.criteriaBusqueda)
                .subscribe((response: any) => {
                    this.lotesDevolucionesProvincias = response
                });
        })
    }


    reiniciarData(){
        this.lotesData = this.lotesDataComplete;
        this.devolucionesLaboratorios = this.devolucionesLaboratoriosComplete;
        this.lotesData = this.lotesDataComplete;
        // if(this.selectedOptionLab !== "") this.filtrarPorLaboratorio(this.selectedOptionLab)
        // if(this.selectedOptionState !== "") this.filtrarPorEstado(this.selectedOptionState)
        this.filtrarFechaInicio(this.fechaInicio)
        this.filtrarFechaFin(this.fechaFin)
    }

    filtrarFechaInicio(evento : any){
        try{
            if(evento.target.value === "")  {this.fechaInicio = new Date("1900-01-01") ; this.reiniciarData()}
            else this.fechaInicio = new Date(evento.target.value)
        } catch {
            this.fechaInicio = evento
        }
        if(this.lotesDataComplete.length  > 0){
            this.lotesData = this.lotesDataComplete;
            if(typeof(this.fechaFin) === "string")  this.filtrarFechaFin(this.fechaFin)

            const newData = this.lotesData.filter(lote => (new Date(lote.fechaEnvio) >= new Date(this.fechaInicio) || new Date(lote.fechaRecepcion) >= new Date(this.fechaInicio)) 
            && (new Date(lote.fechaEnvio) <= new Date(this.fechaFin) || new Date(lote.fechaRecepcion) <= new Date(this.fechaFin)));
            this.lotesData = newData;
        }

        if(this.devolucionesLaboratorios.length  > 0){
            this.devolucionesLaboratorios = this.devolucionesLaboratoriosComplete;
            if(typeof(this.fechaFin) === "string")  this.filtrarFechaFin(this.fechaFin)

            const newData = this.devolucionesLaboratorios.filter(lote => (new Date(lote.fechaEnvio) >= new Date(this.fechaInicio) || new Date(lote.fechaRecepcion) >= new Date(this.fechaInicio)) 
            && (new Date(lote.fechaEnvio) <= new Date(this.fechaFin) || new Date(lote.fechaRecepcion) <= new Date(this.fechaFin)));
            this.devolucionesLaboratorios = newData;
        }

        if(this.devolucionesLaboratoriosComplete.length  > 0){
            this.lotesProvincias = this.lotesProvinciasComplete;
            if(typeof(this.fechaFin) === "string")  this.filtrarFechaFin(this.fechaFin)

            const newData = this.lotesProvincias.filter(lote => (new Date(lote.fechaEnvio) >= new Date(this.fechaInicio) || new Date(lote.fechaRecepcion) >= new Date(this.fechaInicio)) 
            && (new Date(lote.fechaEnvio) <= new Date(this.fechaFin) || new Date(lote.fechaRecepcion) <= new Date(this.fechaFin)));
            this.lotesProvincias = newData;
        }

        if(this.lotesDevolucionesProvinciasComplete.length  > 0){
            this.lotesDevolucionesProvincias = this.lotesDevolucionesProvinciasComplete;
            if(typeof(this.fechaFin) === "string")  this.filtrarFechaFin(this.fechaFin)

            const newData = this.lotesDevolucionesProvincias.filter(lote => (new Date(lote.fechaEnvio) >= new Date(this.fechaInicio) || new Date(lote.fechaRecepcion) >= new Date(this.fechaInicio)) 
            && (new Date(lote.fechaEnvio) <= new Date(this.fechaFin) || new Date(lote.fechaRecepcion) <= new Date(this.fechaFin)));
            this.lotesDevolucionesProvincias = newData;
        }
    }
    
    filtrarFechaFin(evento : any){
        try{
            if(evento.target.value === "")  {this.fechaFin = new Date() ; this.reiniciarData()}
            else this.fechaFin = new Date(evento.target.value)
        } catch {
            this.fechaFin = evento
        }
        if(this.lotesDataComplete.length  > 0){
            this.lotesData = this.lotesDataComplete;
            if(typeof(this.fechaInicio) === "string") this.filtrarFechaInicio(this.fechaInicio)

            const newData = this.lotesData.filter(lote => (new Date(lote.fechaEnvio) <= new Date(this.fechaFin) || new Date(lote.fechaRecepcion) <= new Date(this.fechaFin))
            && (new Date(lote.fechaEnvio) >= new Date(this.fechaInicio) || new Date(lote.fechaRecepcion) >= new Date(this.fechaInicio)));
            this.lotesData = newData;
        }

        if(this.devolucionesLaboratoriosComplete.length  > 0){
            this.devolucionesLaboratorios = this.devolucionesLaboratoriosComplete;
            if(typeof(this.fechaInicio) === "string") this.filtrarFechaInicio(this.fechaInicio)

            const newData = this.devolucionesLaboratorios.filter(lote => (new Date(lote.fechaEnvio) <= new Date(this.fechaFin) || new Date(lote.fechaRecepcion) <= new Date(this.fechaFin))
            && (new Date(lote.fechaEnvio) >= new Date(this.fechaInicio) || new Date(lote.fechaRecepcion) >= new Date(this.fechaInicio)));
            this.devolucionesLaboratorios = newData;
        }

        if(this.lotesProvinciasComplete.length  > 0){
            this.lotesProvincias = this.lotesProvinciasComplete;
            if(typeof(this.fechaInicio) === "string") this.filtrarFechaInicio(this.fechaInicio)

            const newData = this.lotesProvincias.filter(lote => (new Date(lote.fechaEnvio) <= new Date(this.fechaFin) || new Date(lote.fechaRecepcion) <= new Date(this.fechaFin))
            && (new Date(lote.fechaEnvio) >= new Date(this.fechaInicio) || new Date(lote.fechaRecepcion) >= new Date(this.fechaInicio)));
            this.lotesProvincias = newData;
        }

        if(this.lotesDevolucionesProvinciasComplete.length  > 0){
            this.lotesDevolucionesProvincias = this.lotesDevolucionesProvinciasComplete;
            if(typeof(this.fechaInicio) === "string") this.filtrarFechaInicio(this.fechaInicio)

            const newData = this.lotesDevolucionesProvincias.filter(lote => (new Date(lote.fechaEnvio) <= new Date(this.fechaFin) || new Date(lote.fechaRecepcion) <= new Date(this.fechaFin))
            && (new Date(lote.fechaEnvio) >= new Date(this.fechaInicio) || new Date(lote.fechaRecepcion) >= new Date(this.fechaInicio)));
            this.lotesDevolucionesProvincias = newData;
        }
    }
}

