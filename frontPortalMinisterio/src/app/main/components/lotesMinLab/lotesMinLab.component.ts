import { Component, OnInit } from "@angular/core";
import { IEstado } from "src/app/core/models/i-estado";
import { ILoteLab } from "src/app/core/models/lotesMinLab/i-loteLab";
import { LotesGeneralService } from "../../api/resources/lotesGeneral.service";
import { LotesMinLabService } from "../../api/resources/lotesMinLab.service";

@Component({
    selector: 'app-lotesMinLab',
    templateUrl: './lotesMinLab.component.html',
    styleUrls: ['./lotesMinLab.component.css','../generalStyles.css']
})
export class LotesMinLabComponent implements OnInit{
    
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

    constructor(private lotesMinLabService : LotesMinLabService,
        private lotesGeneralService : LotesGeneralService) { }

    ngOnInit() {
        this.lotesMinLabService.obtenerLotes()
        .subscribe((response: any) => {
            this.lotesData = response
            this.lotesDataComplete = response
        });

        this.lotesGeneralService.obtenerEstados()
        .subscribe((response: any) => {
            this.estadosData = response
        });
    }

    mostrarSeguimiento(lote : ILoteLab){
        this.modalSeguimiento = lote;
    }

    filtrarPorEstado(evento: any){
       if(evento.target.value === ""){
            this.lotesData = this.lotesDataComplete;
       } else {
           const newData = this.lotesDataComplete.filter(lote => lote.estado === evento.target.value);
           this.lotesData = newData;
       }
    }
}