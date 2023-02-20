import { Component, OnInit } from "@angular/core";
import { IEstado } from "src/app/core/models/i-estado";
import { ILaboratorio } from "src/app/core/models/laboratorios/i-laboratorio";
import { ILoteLab } from "src/app/core/models/lotesMinLab/i-loteLab";
import { LaboratorioService } from "../../api/resources/laboratorios.service";
import { LotesGeneralService } from "../../api/resources/lotesGeneral.service";
import { LotesMinLabService } from "../../api/resources/lotesMinLab.service";

@Component({
    selector: 'app-lotesAdmin',
    templateUrl: './lotesAdmin.component.html',
    styleUrls: ['./lotesAdmin.component.css','../generalStyles.css']
})
export class LotesAdminComponent implements OnInit{
    
    lotesData: Array<ILoteLab> = [];
    lotesDataComplete: Array<ILoteLab> = [];
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
    estadosData : Array<IEstado> = [];
    laboratoriosData : Array<ILaboratorio> = [];

    constructor(private lotesMinLabService : LotesMinLabService,
        private lotesGeneralService : LotesGeneralService,
        private laboratorioService : LaboratorioService) { }

    ngOnInit() {
        this.lotesMinLabService.obtenerLotes()
        .subscribe((response: any) => {
            this.lotesDataComplete = response
            console.log(response)
        });

        this.lotesGeneralService.obtenerEstados()
        .subscribe((response: any) => {
            this.estadosData = response
            console.log(response)
        });

        this.laboratorioService.getLaboratorios()
        .subscribe((response: any) => {
            this.laboratoriosData = response
            console.log(response)
        });
    }

    mostrarSeguimiento(lote : ILoteLab){
        this.modalSeguimiento = lote;
    }

    filtrarPorLaboratorio(evento: any){
        if(evento.target.value === ""){
            this.lotesData = this.lotesDataComplete;
        } else {
            const newData = this.lotesDataComplete.filter(lote => lote.codigoLaboratorio === evento.target.value);
            this.lotesData = newData;
        }
    }

    filtrarPorEstado(evento: any){
        if(this.lotesData.length  > 0){
                if(evento.target.value === ""){
                    this.lotesData = this.lotesDataComplete;
                } else {
                    const newData = this.lotesDataComplete.filter(lote => lote.estado === evento.target.value);
                    this.lotesData = newData;
                }
        }
    }
}