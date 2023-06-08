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
import { IEditarDevolucion } from "src/app/core/models/devoluciones/i-editarDevolucion";
import { ICriteriosBusquedaLotesLabs } from "src/app/core/models/i-criteriosBusquedaLotesLabs";
import { ICriteriosBusquedaDevolucionesLabs } from "src/app/core/models/i-criteriosBusquedaDevolucionesLabs";
import { IModoDistribucion } from "src/app/core/models/i-modosDistribucion";
import { UsuarioService } from "../../api/resources/usuarios.service";
import { FormControl, Validators } from "@angular/forms";
import { IEstructuraAux } from "src/app/core/models/provincias/i-estructuraAux";

@Component({
    selector: 'app-lotesAdmin',
    templateUrl: './lotesAdmin.component.html',
    styleUrls: ['./lotesAdmin.component.css','../generalStyles.css']
})
export class LotesAdminComponent implements OnInit{
    filtro!: FormControl;
    
    myModal = document.getElementById('#confirmDataChangeModal');

    selectedOptionState = ""
    selectedOptionLab = ""

    empresaTransporteActual = 0;
    motivoDevolucionActual = 0;
    descripcionProblemaActual = "";
    fechaDevolucion = undefined;
    codigoSeguiminetoActual = "";

    lenguaje = 1;

    totalVacunasADistribuir = 0;

    finalizarVerificacion = false;

    loteDevolucionEditado: IEditarDevolucion = {codigoDevolucion : "", descripcionProblema : "", idEmpresaTransporte : 0, idMotivoDevolucion : 0, codigoSeguimiento: "", fechaEnvio: new Date()}
    modoDistribucionData: Array<IModoDistribucion> = [];
    fechaActualizacionRecibo = new Date();
    loteActualizacionRecibo :  IEditarLoteRecepcion =  { idUsuario: 1, codigoLote: "", fechaRecepcion: "", codigoProvincia: ""} ;
    modalSeguimiento : ILoteLab =  { idUsuario: 0, codigoLaboratorio: "", codigoEstado: "", codigoLote: "", fechaEnvio: new Date, codigoSeguimiento: "", fechaRecepcion: new Date, idEmpresaTransporte: 0, distribuido: 0, despachado: 0, estado: "", cantidadVacunasADistribuir: 0, cantidadVacunas: 0, nombreLaboratorio: "", fechaRegistro: new Date, fechaVencimiento: new Date, estadoMostrar : ""} ;

    lotesData: Array<ILoteLab> = [];
    lotesDataLab: Array<ILoteLab> = [];
    lotesDataComplete: Array<ILoteLab> = [];
    empresasTransporte : Array<IEmpresaTransporte> = [];
    estadosData : Array<IEstado> = [];
    laboratoriosData : Array<ILaboratorio> = [];
    vaccinesData : Array<IVacuna> = [];
    vacunasDistribuirData : Array<IVacuna> = [];

    vaccinesStatesData : Array<IEstadosVacunas> = [];
    rejectionReasonsData : Array<IRejectReason> = []

    provinciasDistribuirData : Array<IProvinciaDistribuir> = [];
    provinciaCambioCod : String = "";
    provinciaTipoDistribucion: number = 1;

    criteriaBusquedaLotesLabs : ICriteriosBusquedaLotesLabs = { codigoLaboratorio : undefined, codigoEstado : undefined}
    criteriaBusquedaDevolucionesLabs: ICriteriosBusquedaDevolucionesLabs = {codigoLaboratorio: undefined}

    fechaInicio : Date =  new Date("1900-01-01");
    fechaFin : Date =  new Date();

    vacunasLoteProvincia :Array<IEstructuraAux> = [];

    constructor(private router: Router, 
        private cookieService: CookieService,
        private lotesMinLabService : LotesMinLabService,
        private lotesGeneralService : LotesGeneralService,
        private laboratorioService : LaboratorioService,
        private usuariosService : UsuarioService,
        private vacunasService : VacunasService,
        private devolucionesService : DevolucionesService,
        private provinciasService : ProvinciaService) { }

    ngOnInit() {
        this.filtro = new FormControl('', [Validators.maxLength(255)]);

        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') != "1"){
                this.router.navigate(['/']);
            }
        }
        
        this.laboratorioService.getLaboratorios()
        .subscribe((response: any) => {
            this.laboratoriosData = response
        });

        

        this.usuariosService.getLanguage()
        .subscribe((responseLenguaje: any) => {
            this.lenguaje = responseLenguaje

            this.lotesMinLabService.obtenerLotes(this.criteriaBusquedaLotesLabs)
            .subscribe((response: any) => {
                this.lotesDataComplete = response.map((lote : any) => {
                    if(this.lenguaje != 1) {
                        let estadoFinal = ""
                        if(lote.estado === "ACEPTADO") estadoFinal= "ACEPTED"
                        if(lote.estado === "ACEPTADO_PARCIALMENTE") estadoFinal= "PARCIALY ACEPTED"
                        if(lote.estado === "EN_CAMINO") estadoFinal= "ON ITS WAY"
                        if(lote.estado === "EN_ORIGEN") estadoFinal= "ON ORIGIN"
                        if(lote.estado === "RECHAZADO") estadoFinal= "REJECTED"
                        if(lote.estado === "RECIBIDO") estadoFinal= "RECIVED"
                        return{
                            ...lote,
                            estadoMostar : estadoFinal
                        }
                    } else {
                        return{
                            ...lote,
                            estadoMostar : lote.estado
                        }
                    }
                })
            });

            this.devolucionesService.getRejectReasons()
            .subscribe((response: any) => {
                this.rejectionReasonsData = response;
                if(this.lenguaje != 1) {
                    this.rejectionReasonsData[0].tipoMotivo = "Packaging damage"
                    this.rejectionReasonsData[1].tipoMotivo = "Manufacturing defects"
                    this.rejectionReasonsData[2].tipoMotivo = "Failure to meet quality standards"
                    this.rejectionReasonsData[3].tipoMotivo = "Lack of proper documentation"
                    this.rejectionReasonsData[4].tipoMotivo = "Expiration of vaccine batch"
                    this.rejectionReasonsData[5].tipoMotivo = "Storage issues"
                    this.rejectionReasonsData[6].tipoMotivo = "Contamination during transportation"
                    this.rejectionReasonsData[7].tipoMotivo = "Other"
                }
            })

            this.lotesGeneralService.obtenerEstados()
            .subscribe((response: any) => {
                this.estadosData = response
                this.lenguaje !== 1 ? this.estadosData[0].titulo = "ACEPTED" : this.estadosData[0].titulo = this.estadosData[0].estado;
                this.lenguaje !== 1 ? this.estadosData[1].titulo = "PARCIALY ACEPTED" : this.estadosData[1].titulo = this.estadosData[1].estado;
                this.lenguaje !== 1 ? this.estadosData[2].titulo = "ON ITS WAY" : this.estadosData[2].titulo = this.estadosData[2].estado;
                this.lenguaje !== 1 ? this.estadosData[3].titulo = "ON ORIGIN" : this.estadosData[3].titulo = this.estadosData[3].estado;
                this.lenguaje !== 1 ? this.estadosData[4].titulo = "REJECTED" : this.estadosData[4].titulo = this.estadosData[4].estado;
                this.lenguaje !== 1 ? this.estadosData[5].titulo = "RECIVED" : this.estadosData[5].titulo = this.estadosData[5].estado;
            });
    
            this.lotesGeneralService.getVaccinesStates()
            .subscribe((response: any) => {
                this.vaccinesStatesData = response;
                this.lenguaje !== 1 ? this.vaccinesStatesData[0].estado = "ACEPTED" : this.vaccinesStatesData[0].estado = this.vaccinesStatesData[0].estado;
                this.lenguaje !== 1 ? this.vaccinesStatesData[1].estado = "REJECTED" : this.vaccinesStatesData[1].estado = this.vaccinesStatesData[1].estado;
            });
        })

        this.lotesGeneralService.obtenerEmpresasTransporte()
        .subscribe((response: any) => {
            this.empresasTransporte = response;
        })

        this.provinciasService.obtenerModosDistribucion()
        .subscribe((response: any) => {
            this.usuariosService.getLanguage()
            .subscribe((responseLenguaje: any) => {
                this.modoDistribucionData = response;
                if (responseLenguaje !== 1){
                    this.modoDistribucionData[1].modoDistribucion = "Balanced"
                }
            })
        })
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
        .subscribe((res: any) => {
            this.lotesMinLabService.obtenerLotes(this.criteriaBusquedaLotesLabs)
            .subscribe((response: any) => {
                this.lotesDataComplete = response.map((lote : any) => {
                    if(this.lenguaje != 1) {
                        let estadoFinal = ""
                        if(lote.estado === "ACEPTADO") estadoFinal= "ACEPTED"
                        if(lote.estado === "ACEPTADO_PARCIALMENTE") estadoFinal= "PARCIALY ACEPTED"
                        if(lote.estado === "EN_CAMINO") estadoFinal= "ON ITS WAY"
                        if(lote.estado === "EN_ORIGEN") estadoFinal= "ON ORIGIN"
                        if(lote.estado === "RECHAZADO") estadoFinal= "REJECTED"
                        if(lote.estado === "RECIBIDO") estadoFinal= "RECIVED"
                        return{
                            ...lote,
                            estadoMostar : estadoFinal
                        }
                    } else {
                        return{
                            ...lote,
                            estadoMostar : lote.estado
                        }
                    }
                })
                this.lotesData = this.lotesDataComplete;
            });
        });
    }

    cambioEstadoGeneral(evento: any){
        this.vaccinesData.map((element, index) => {
           element.codigoEstadoVacuna = evento.target.value
            if(evento.target.value === "A"){
                this.lenguaje !== 1 ? element.estado = "ACEPTED" : element.estado = "ACEPTADA";
            } else {
                this.lenguaje !== 1 ? element.estado = "REJECTED" : element.estado = "RECHAZADA";
            }
        })
        this.finalizarVerificacion = true
    }

    changeVaccineCode(evento: any,vaccineCod : string){
        this.vaccinesData.map((element, index) => {
            if(element.codigoVacuna == vaccineCod){
                this.vaccinesData[index].codigoEstadoVacuna = evento.target.value
                if(evento.target.value === "A"){
                    this.lenguaje !== 1 ?  this.vaccinesData[index].estado = "ACEPTED" : this.vaccinesData[index].estado = "ACEPTADA"
                } else {
                    this.lenguaje !== 1 ?  this.vaccinesData[index].estado = "REJECTED" : this.vaccinesData[index].estado = "RECHAZADA"
                }
            }
        })
        const ready = this.vaccinesData.find((vacuna: { estado: string; }) => vacuna.estado === null)
        !ready ? this.finalizarVerificacion = true : this.finalizarVerificacion = false;
    }
    
    verificarVacunas(lote : ILoteLab){
        this.loteDevolucionEditado.codigoDevolucion = "";
        this.loteDevolucionEditado.descripcionProblema = "";
        this.loteDevolucionEditado.idEmpresaTransporte = 0;
        this.loteDevolucionEditado.idMotivoDevolucion = 0;
        this.loteDevolucionEditado.codigoSeguimiento = "";
        this.loteDevolucionEditado.fechaEnvio = new Date();  
        this.fechaDevolucion = undefined;
        this.finalizarVerificacion = false
        this.lotesMinLabService.obtenerVacunasLote(lote.codigoLote)
        .subscribe((response:any) =>{
            this.vaccinesData = response.map((vacuna : any) => {
                let estadoVacuna = vacuna.estado

                if(this.lenguaje !== 1){
                    if(estadoVacuna == "ACEPTADA"){
                        estadoVacuna = "ACEPTED"
                    } else {
                        estadoVacuna = "REJECTED"
                    }
                }

                return{
                    ...vacuna,
                    estado : estadoVacuna
                }
            });
        })
    }

    async editarVacunas(){
        for (let element of this.vaccinesData) {

            let estadoFinal = "ACEPTADA" 
            if (element.estado == "RECHAZADA" || element.estado == "REJECTED" ){
                estadoFinal = "RECHAZADA"
            }

            let data = {
                codigoVacuna : element.codigoVacuna,
                codigoLote :   element.codigoLote,
                codigoEstadoVacuna : element.codigoEstadoVacuna,
                estado : estadoFinal
            }
            try{
                await this.vacunasService.actualizarVacunas(data).toPromise();
            } catch (error) {
                console.log(error)
            }
        }
        this.lotesMinLabService.obtenerLotes(this.criteriaBusquedaLotesLabs)
        .subscribe((response: any) => {
            this.lotesDataComplete = response.map((lote : any) => {
                if(this.lenguaje != 1) {
                    let estadoFinal = ""
                    if(lote.estado === "ACEPTADO") estadoFinal= "ACEPTED"
                    if(lote.estado === "ACEPTADO_PARCIALMENTE") estadoFinal= "PARCIALY ACEPTED"
                    if(lote.estado === "EN_CAMINO") estadoFinal= "ON ITS WAY"
                    if(lote.estado === "EN_ORIGEN") estadoFinal= "ON ORIGIN"
                    if(lote.estado === "RECHAZADO") estadoFinal= "REJECTED"
                    if(lote.estado === "RECIBIDO") estadoFinal= "RECIVED"
                    return{
                        ...lote,
                        estadoMostar : estadoFinal
                    }
                } else {
                    return{
                        ...lote,
                        estadoMostar : lote.estado
                    }
                }
            })
            this.lotesData = this.lotesDataComplete;
        });
    }

    distribuirVacunas(lote : ILoteLab){
        this.lotesMinLabService.obtenerVacunasLote(lote.codigoLote)
        .subscribe((response:any) =>{
            const result = response.filter((element : any) => {
                return element.codigoEstadoVacuna == "A"
            })
            this.vacunasDistribuirData = result
        })

        this.provinciasService.getLoteProvincia(lote.codigoLote).subscribe((response: any) => {
           this.vacunasLoteProvincia = response.map((data: any) => {
                return{
                   codigoProvincia: data.codigoProvincia,
                   cantidadVacunas: data.cantidadVacunas
                };
           })

           this.provinciasService.obtenerProvinciasDistribuir(lote.codigoLote)
           .subscribe((response : any) => {
               this.provinciasDistribuirData = response.map((data: any) => {
                   let cantidad = 0;
                   for (let element of this.vacunasLoteProvincia) {
                       if(element.codigoProvincia == data.codigoProvincia){
                           cantidad = element.cantidadVacunas
                       }
                   }
                   return{
                       ...data,
                       valor: cantidad
                   };
               })
           })
        })
        this.provinciaTipoDistribucion = 0;
    }
    
    async despacharVacunas(){
        if(this.fechaDevolucion === undefined) return
            
        const responseDevoluciones = await this.devolucionesService.obtenerDevoluciones(this.criteriaBusquedaDevolucionesLabs).toPromise();
        const loteDevolucion = await responseDevoluciones.find((devolucion: { codigoLote: string; }) => devolucion.codigoLote === this.vaccinesData[0].codigoLote)

        this.loteDevolucionEditado.codigoDevolucion = loteDevolucion.codigoDevolucion;
        this.loteDevolucionEditado.descripcionProblema = this.descripcionProblemaActual;
        this.loteDevolucionEditado.idEmpresaTransporte = this.empresaTransporteActual;
        this.loteDevolucionEditado.idMotivoDevolucion = this.motivoDevolucionActual;
        this.loteDevolucionEditado.codigoSeguimiento = this.codigoSeguiminetoActual;
        this.loteDevolucionEditado.fechaEnvio = this.fechaDevolucion;

        this.devolucionesService.crearDevolucion(this.loteDevolucionEditado)
        .subscribe(() => {
            this.lotesMinLabService.obtenerLotes(this.criteriaBusquedaLotesLabs)
            .subscribe((response: any) => {
                this.lotesDataComplete = response.map((lote : any) => {
                    if(this.lenguaje != 1) {
                        let estadoFinal = ""
                        if(lote.estado === "ACEPTADO") estadoFinal= "ACEPTED"
                        if(lote.estado === "ACEPTADO_PARCIALMENTE") estadoFinal= "PARCIALY ACEPTED"
                        if(lote.estado === "EN_CAMINO") estadoFinal= "ON ITS WAY"
                        if(lote.estado === "EN_ORIGEN") estadoFinal= "ON ORIGIN"
                        if(lote.estado === "RECHAZADO") estadoFinal= "REJECTED"
                        if(lote.estado === "RECIBIDO") estadoFinal= "RECIVED"
                        return{
                            ...lote,
                            estadoMostar : estadoFinal
                        }
                    } else {
                        return{
                            ...lote,
                            estadoMostar : lote.estado
                        }
                    }
                })
                this.lotesData = this.lotesDataComplete;

                this.empresaTransporteActual = 0;
                this.motivoDevolucionActual = 0;
                this.descripcionProblemaActual = "";
                this.fechaDevolucion = undefined;
                this.codigoSeguiminetoActual = "";
            });
        })  
    }

    async distribucionVacunas(){
        let index2 = 0;
        for(let provincia of this.provinciasDistribuirData){
            for(let i = 0; i < provincia.valor ; i++) {
                let data = {
                    codigoProvincia : provincia.codigoProvincia,
                    codigoLote :  this.vacunasDistribuirData[index2].codigoLote,
                    codigoVacuna : this.vacunasDistribuirData[index2].codigoVacuna,
                    estado : null,
                    idModoDistribucion : this.provinciaTipoDistribucion
                }
                try{
                    await this.provinciasService.insertarLoteProvincia(data).toPromise();
                } catch (error) {
                    console.log(error)
                }
                index2 += 1;
            }
        }

        this.lotesMinLabService.obtenerLotes(this.criteriaBusquedaLotesLabs)
        .subscribe(() => {this.ngOnInit()});
    }

    cambioProvinciaDistribucion(evento: any){
        
        try{
            this.provinciaTipoDistribucion = evento.target.value
        } catch{
            this.provinciaTipoDistribucion = evento
        }

        if(this.provinciaTipoDistribucion == 2){
            let resto = this.vacunasDistribuirData.length
            this.provinciasDistribuirData = this.provinciasDistribuirData.map((element : IProvinciaDistribuir) => {
                return {
                    ...element,
                    valor: Math.floor(this.vacunasDistribuirData.length / this.provinciasDistribuirData.length)
                }
            });
            this.provinciasDistribuirData[0].valor += resto - Math.floor(this.vacunasDistribuirData.length / this.provinciasDistribuirData.length) * this.provinciasDistribuirData.length
            this.totalVacunasADistribuir = this.vacunasDistribuirData.length
        }
    }

    cambioValorInput(provincia: IProvinciaDistribuir ,evento: any){
        if(evento.target.value < 0){
            evento.target.value = 0
        }

        this.cambioProvinciaDistribucion(1)
        
        let provinciasDistribuirTest = this.provinciasDistribuirData.filter(element => element.nombre !== provincia.nombre)
        this.totalVacunasADistribuir = 0;

        provinciasDistribuirTest.forEach(element => {
            if(element.nombre !== provincia.nombre){
                this.totalVacunasADistribuir += element.valor
            }
        })

        this.provinciasDistribuirData = this.provinciasDistribuirData.map((element : IProvinciaDistribuir) => {
            if(element.nombre === provincia.nombre){
                if(evento.target.value *1 + this.totalVacunasADistribuir < this.vacunasDistribuirData.length + 1){
                    return {
                        ...element,
                        valor: evento.target.value * 1
                    }
                } else {
                    return {
                        ...element,
                        valor: this.vacunasDistribuirData.length - this.totalVacunasADistribuir
                    }
                }
            }
            return element
        });

        this.totalVacunasADistribuir = 0;
        this.provinciasDistribuirData.forEach(element => {
            this.totalVacunasADistribuir += element.valor
        })
    }

    reiniciarData(){
        this.lotesData = this.lotesDataComplete;
        if(this.selectedOptionLab !== "") {
            const newData = this.lotesData.filter(lote => lote.codigoLaboratorio === this.selectedOptionLab);
            this.lotesData = newData;
        }
        if(this.selectedOptionState !== "") {
            const newData = this.lotesData.filter(lote => lote.estado === this.selectedOptionState);
            this.lotesData = newData;
        }
        if(typeof(this.fechaInicio) === "object"){
            const newData = this.lotesData.filter(lote => new Date(lote.fechaRecepcion) >= new Date(this.fechaInicio)
            &&  new Date(lote.fechaRecepcion) <= new Date(this.fechaFin));
            this.lotesData = newData;
        }
        if(typeof(this.fechaFin) === "object"){
            const newData = this.lotesData.filter(lote =>  new Date(lote.fechaRecepcion) <= new Date(this.fechaFin)
            && new Date(lote.fechaRecepcion) >= new Date(this.fechaInicio));
            this.lotesData = newData;
        }
    }

    filtrarPorLaboratorio(evento: any){
        try{
            this.selectedOptionLab = evento.target.value
        } catch {
            this.selectedOptionLab = evento
        }
        this.reiniciarData();
    }

    filtrarPorEstado(evento: any){
        try{
            this.selectedOptionState = evento.target.value
        } catch {
            this.selectedOptionState = evento
        }
        this.reiniciarData();
    }

    filtrarFechaInicio(evento : any){
        try{
            if(evento.target.value === "")  {this.fechaInicio = new Date("1900-01-01") ; this.reiniciarData()}
            else this.fechaInicio = new Date(evento.target.value)
        } catch {
            this.fechaInicio = evento
        }
       this.reiniciarData()
    }
    
    filtrarFechaFin(evento : any){
        try{
            if(evento.target.value === "")  {this.fechaFin = new Date() ; this.reiniciarData()}
            else this.fechaFin = new Date(evento.target.value)
        } catch {
            this.fechaFin = evento
        }
        this.reiniciarData()
    }
}