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

@Component({
    selector: 'app-lotesAdmin',
    templateUrl: './lotesAdmin.component.html',
    styleUrls: ['./lotesAdmin.component.css','../generalStyles.css']
})
export class LotesAdminComponent implements OnInit{
    
    myModal = document.getElementById('#confirmDataChangeModal');

    selectedOptionState = ""
    selectedOptionLab = ""

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
    estadosData : Array<IEstado> = [];
    laboratoriosData : Array<ILaboratorio> = [];
    vaccinesData : Array<IVacuna> = [];
    vaccinesStatesData : Array<IEstadosVacunas> = [];
    rejectionReasonsData : Array<IRejectReason> = []

    constructor(private router: Router, 
        private cookieService: CookieService,
        private lotesMinLabService : LotesMinLabService,
        private lotesGeneralService : LotesGeneralService,
        private laboratorioService : LaboratorioService,
        private vacunasService : VacunasService) { }

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

        this.vacunasService.getRejectReasons()
        .subscribe((response: any) => {
            this.rejectionReasonsData = response;
            console.log(response)
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
        })
    }

    cerrarModal(){
        window.location.reload();
    }
}