import { Component, OnInit } from "@angular/core";
import { DevolucionesService } from "../../api/resources/devoluciones.service";
import { INuevaDevolucionLab } from "src/app/core/models/lotesMinLab/i-nuevaDevolucionLab";
import { ProvinciaService } from "../../api/resources/provincias.service";

@Component({
    selector: 'app-loteConsulta',
    templateUrl: './loteConsulta.component.html',
    styleUrls: ['./loteConsulta.component.css','../generalStyles.css']
})

export class LotesConsultaComponent implements OnInit{

    constructor(private devolucionesService : DevolucionesService,
        private provinciasService : ProvinciaService) { }

    devolucionesLaboratorios : Array<INuevaDevolucionLab> = [];

    ngOnInit() {
        this.devolucionesService.obtenerDevoluciones()
        .subscribe((response : any) => {
            this.devolucionesLaboratorios = response
        })

        this.provinciasService.obtenerLotesProvincias()
        .subscribe((response : any) => {
            console.log(response)
        })
    }

}