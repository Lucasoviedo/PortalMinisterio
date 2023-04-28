import { Component, OnInit } from "@angular/core";
import { IEstado } from "src/app/core/models/i-estado";
import { ILaboratorio } from "src/app/core/models/laboratorios/i-laboratorio";
import { ILoteLab } from "src/app/core/models/lotesMinLab/i-loteLab";
import { LaboratorioService } from "../../api/resources/laboratorios.service";
import { LotesGeneralService } from "../../api/resources/lotesGeneral.service";
import { LotesMinLabService } from "../../api/resources/lotesMinLab.service";
import { VacunasService } from "../../api/resources/vacunas.service";
import { IEditarLoteRecepcion } from "src/app/core/models/lotesMinLab/i-editarLote";
import { IEstadosVacunas } from "src/app/core/models/vacunas/i-estadosVacunas"
import { IRejectReason } from "src/app/core/models/vacunas/i-rejectReason" 

import { Modal } from 'bootstrap';
import { IVacuna } from "src/app/core/models/vacunas/i-vacunas";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { IEmpresaTransporte } from "src/app/core/models/i-empresaTransporte";
import { DevolucionesService } from "../../api/resources/devoluciones.service";
import { ProvinciaService } from "../../api/resources/provincias.service";
import { IProvinciaDistribuir } from "src/app/core/models/provincias/i-provinciaDistribuir";

@Component({
    selector: 'app-lotesAdmin',
    templateUrl: './lotesAdmin.component.html',
    styleUrls: ['./lotesAdmin.component.css','../generalStyles.css']
})
export class LotesAdminComponent implements OnInit{
    
    myModal = document.getElementById('#confirmDataChangeModal');

    readyToDistribute = false;
    optionCheckModal = 1;

    selectedOptionState = ""
    selectedOptionLab = ""

    empresaTransporteActual = 0;
    motivoDevolucionActual = 0;
    descripcionProblemaActual = "";

    fechaActualizacionRecibo = new Date();
    loteActualizacionRecibo :  IEditarLoteRecepcion =  {
        idUsuario: 1,
        codigoLote: "",
        fechaRecepcion: ""
    } ;
    modalSeguimiento : ILoteLab =  {
        idUsuario: 0,
        codigoLaboratorio: "",
        codigoEstado: "",
        codigoLote: "",
        fechaEnvio: new Date,
        codigoSeguimiento: "",
        fechaRecepcion: new Date,
        idEmpresaTransporte: 0,
        distribuido: 0,
        estado: "",
        nombreLaboratorio: "",
        fechaRegistro: new Date,
        fechaVencimiento: new Date,
    } ;

    lotesData: Array<ILoteLab> = [];
    lotesDataLab: Array<ILoteLab> = [];
    lotesDataComplete: Array<ILoteLab> = [];
    empresasTransporte : Array<IEmpresaTransporte> = [];
    estadosData : Array<IEstado> = [];
    laboratoriosData : Array<ILaboratorio> = [];
    vaccinesData : Array<IVacuna> = [];
    vacunasDistribuirData : Array<IVacuna> = [];

    provinciasDistribuirData : Array<IProvinciaDistribuir> = [];
    provinciasNoDistribuirData : Array<IProvinciaDistribuir> = [];
    provinciaCambioCod : String = "";
    provinciaTipoDistribucion: number = 0;

    vaccinesStatesData : Array<IEstadosVacunas> = [];
    rejectionReasonsData : Array<IRejectReason> = []

    constructor(private router: Router, 
        private cookieService: CookieService,
        private lotesMinLabService : LotesMinLabService,
        private lotesGeneralService : LotesGeneralService,
        private laboratorioService : LaboratorioService,
        private vacunasService : VacunasService,
        private devolucionesService : DevolucionesService,
        private provinciasService : ProvinciaService) { }

    ngOnInit() {
        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') != "1"){
                this.router.navigate(['/']);
            }
        }
        
        this.laboratorioService.getLaboratorios()
        .subscribe((response: any) => {
            this.laboratoriosData = response
        });

        this.lotesMinLabService.obtenerLotes()
        .subscribe((response: any) => {
            this.lotesDataComplete = response
        });

        this.lotesGeneralService.obtenerEstados()
        .subscribe((response: any) => {
            this.estadosData = response
        });

        this.vacunasService.getVacunas()
        .subscribe((response: any) => {
            console.log(response)
        });

        this.lotesGeneralService.getVaccinesStates()
        .subscribe((response: any) => {
            this.vaccinesStatesData = response;
        });

        this.devolucionesService.getRejectReasons()
        .subscribe((response: any) => {
            this.rejectionReasonsData = response;
            console.log(response)
        })

        this.lotesGeneralService.obtenerEmpresasTransporte()
        .subscribe((response: any) => {
            this.empresasTransporte = response;
        })
    }

    filtrarPorLaboratorio(evento: any){
        if(evento.target.value === ""){
            this.lotesData = this.lotesDataComplete;
            this.lotesDataLab = this.lotesDataComplete;
        } else {
            const newData = this.lotesDataComplete.filter(lote => lote.codigoLaboratorio === evento.target.value);
            this.lotesData = newData;
            this.lotesDataLab = newData;
        }
        this.selectedOptionState = ""
    }

    filtrarPorEstado(evento: any){
        if(this.lotesDataLab.length  > 0){
                if(evento.target.value === ""){
                    this.lotesData = this.lotesDataLab;
                } else {
                    const newData = this.lotesDataLab.filter(lote => lote.estado === evento.target.value);
                    this.lotesData = newData;
                }
        }
    }

    openConfirmDataModal(evento : any, lote : ILoteLab){
        if(new Date().toISOString().slice(0, 10) < evento.target.value){
            alert("Seleccione una fecha igual o anterior al dia actual")
        } else {
            this.myModal = document.getElementById('confirmDataChangeModal');
            if (this.myModal) {
                const modal = new Modal(this.myModal);
                    this.fechaActualizacionRecibo = evento.target.value;
                    this.loteActualizacionRecibo.codigoLote = lote.codigoLote;
                    this.loteActualizacionRecibo.fechaRecepcion = evento.target.value;
                    modal.show();
              }
        }
    }

    actualizarFechaLoteAdmin(){
        this.lotesGeneralService.actualizarLoteAdmin(this.loteActualizacionRecibo.codigoLote 
            + 'SEPARADOR' + this.loteActualizacionRecibo.fechaRecepcion)
        .subscribe((response: any) => {
            alert("Se ha actualizado correctamente el lote");
            window.location.reload();
        });
    }
    
    verificarVacunas(lote : ILoteLab){
        this.lotesMinLabService.obtenerVacunasLote(lote.codigoLote)
        .subscribe((response:any) =>{
            this.vaccinesData = response;
            console.log(response)
        })

        this.readyToDistribute = false;
        this.optionCheckModal = 1;
    }

    cerrarModal(){
        window.location.reload();
    }

    changeVaccineCode(evento: any,vaccineCod : string){
        this.vaccinesData.map((element, index) => {
            if(element.codigoVacuna == vaccineCod){
                this.vaccinesData[index].codigoEstadoVacuna = evento.target.value
                if(evento.target.value === "A"){
                    this.vaccinesData[index].estado = "ACEPTADA"
                } else {
                    this.vaccinesData[index].estado = "RECHAZADA"
                }
            }
        })

        let ready = this.vaccinesData.filter(element => {
            return element.codigoEstadoVacuna === null
        })

        if(ready.length === 0){
            this.readyToDistribute = true;
        } else {
            this.readyToDistribute = false;
        }
    }

    optionCheck(){
        let ready = this.vaccinesData.filter(element => {
            return element.codigoEstadoVacuna === "R"
        })

        if(ready.length !== 0){
            this.optionCheckModal = 2;
        } else {
            // ACA VA LA FUNCION DEVOLUCION
        }
    }

    async editarVacunas(){

        if(this.motivoDevolucionActual === 0 
            || this.descripcionProblemaActual === ""
            || this.empresaTransporteActual === 0){
                alert("Completar todos los campos")
                return
            }

        for (let element of this.vaccinesData) {
            let data = {
                codigoVacuna : element.codigoVacuna,
                codigoLote :   element.codigoLote,
                codigoEstadoVacuna : element.codigoEstadoVacuna,
                estado : element.estado
            }
            try{
                this.vacunasService.actualizarVacunas(data).toPromise();
                await this.vacunasService.actualizarVacunas(data).toPromise();
            } catch (error) {
                console.log(error)
            }
        }

        const responseDevoluciones = await this.devolucionesService.obtenerDevoluciones().toPromise();
        
        const loteDevolucion = await responseDevoluciones.find((devolucion: { codigoLote: string; }) => devolucion.codigoLote === this.vaccinesData[0].codigoLote)

        this.devolucionesService.crearDevolucion({
            codigoDevolucion : loteDevolucion.codigoDevolucion,
            descripcionProblema : this.descripcionProblemaActual,
            idEmpresaTransporte : this.empresaTransporteActual,
            idMotivoDevolucion : this.motivoDevolucionActual,
        }).subscribe((response : any) => {
            console.log(response)
            alert("Se han actualizado todas las vacunas y generado el lote de devolucion correspondient")
        })
    }

    distribuirVacunas(lote : ILoteLab){
        this.lotesMinLabService.obtenerVacunasLote(lote.codigoLote)
        .subscribe((response:any) =>{
            const result = response.filter((element : any) => {
                return element.codigoEstadoVacuna == "A"
            })
            this.vacunasDistribuirData = result
        })

        this.provinciasService.obtenerProvinciasDistribuir(lote.codigoLote)
        .subscribe((response : any) => {
            this.provinciasNoDistribuirData = response
            console.log(response)
        })

        this.provinciasDistribuirData = [];
        this.provinciaTipoDistribucion = 0;
    }

    cambioEmpresaTransporte(evento : any){
        this.empresaTransporteActual = parseInt(evento.target.value)
        console.log(evento.target.value)
    }

    cambioMotivoDevolucion(evento : any){
        this.motivoDevolucionActual = parseInt(evento.target.value)
        console.log(evento.target.value)
    }

    cambioDescripcionProblema(evento : any){
        this.descripcionProblemaActual = evento.target.value
        console.log(evento.target.value)
    }

    cambioProvinciaDistribuir(evento: any){
        this.provinciaCambioCod = evento.target.value
    }

    cambioProvinciaDistribucion(evento: any){
        this.provinciaTipoDistribucion = evento.target.value
    }

    agregarProvinciaDistribuir(){
        const data = this.provinciasNoDistribuirData.find(element => 
            element.codigoProvincia === this.provinciaCambioCod
        )
        if(data){
            this.provinciasDistribuirData.push(data)
            this.provinciasNoDistribuirData = this.provinciasNoDistribuirData.filter((element) => 
                element.codigoProvincia != this.provinciaCambioCod
            )
        } 
    }

    async distribucionVacunas(){
        if(this.provinciasDistribuirData.length === 1){
            for (let element of this.vacunasDistribuirData) {
                let data = {
                    codigoProvincia : this.provinciasDistribuirData[0].codigoProvincia,
                    codigoLote :  element.codigoLote,
                    codigoVacuna : element.codigoVacuna,
                    estado : null
                }
                try{
                    await this.provinciasService.insertarLoteProvincia(data).toPromise();
                } catch (error) {
                    console.log(error)
                }
            }
            alert("Se han insertado las vacunas en lote correspondiente")
            // insertarLoteProvincia
        }
    }
}