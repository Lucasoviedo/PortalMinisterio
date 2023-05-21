import { Component, OnInit } from "@angular/core";
import { DevolucionesService } from "../../api/resources/devoluciones.service";
import { INuevaDevolucionLab } from "src/app/core/models/lotesMinLab/i-nuevaDevolucionLab";
import { ProvinciaService } from "../../api/resources/provincias.service";
import { INuevoLoteProv } from "src/app/core/models/lotesMinProv/i-nuevoLoteProv";

@Component({
    selector: 'app-loteConsulta',
    templateUrl: './loteConsulta.component.html',
    styleUrls: ['./loteConsulta.component.css','../generalStyles.css']
})

export class LotesConsultaComponent implements OnInit{

    constructor(private devolucionesService : DevolucionesService,
        private provinciasService : ProvinciaService) { }

    devolucionesLaboratorios : Array<INuevaDevolucionLab> = [];
    lotesProvincias : Array<INuevoLoteProv> = [];

    ngOnInit() {
        this.devolucionesService.obtenerDevoluciones()
        .subscribe((response : any) => {
            this.devolucionesLaboratorios = response
        })

        this.provinciasService.obtenerLotesProvincias()
        .subscribe((response : any) => {
            this.lotesProvincias = response
            console.log(response)
        })
    }

}