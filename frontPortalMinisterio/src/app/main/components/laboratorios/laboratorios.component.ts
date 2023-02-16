import { Component, OnInit } from "@angular/core";
import { ILaboratorio } from "src/app/core/models/laboratorios/i-laboratorio";
import { LaboratorioService } from "../../api/resources/laboratorios.service";

@Component({
    selector: 'app-laboratorios',
    templateUrl: './laboratorios.component.html',
    styleUrls: ['./laboratorios.component.css','../generalStyles.css']
})

export class LaboratoriosComponent implements OnInit{

    laboratoriosData: Array<ILaboratorio> = [];

    constructor(private laboratorioService: LaboratorioService) { }

    ngOnInit(){
        this.laboratorioService.getLaboratorios()
        .subscribe((response: any) => {
            this.laboratoriosData = response
        });
    }
}