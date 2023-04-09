import { Component, OnInit } from "@angular/core";
import { ILaboratorio } from "src/app/core/models/laboratorios/i-laboratorio";
import { LaboratorioService } from "../../api/resources/laboratorios.service";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-laboratorios',
    templateUrl: './laboratorios.component.html',
    styleUrls: ['./laboratorios.component.css','../generalStyles.css']
})

export class LaboratoriosComponent implements OnInit{

    laboratoriosData: Array<ILaboratorio> = [];

    constructor(private router: Router, 
        private laboratorioService: LaboratorioService,
        private cookieService : CookieService) { }

    ngOnInit(){
        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') != "1"){
                this.router.navigate(['/']);
            }
        }

        this.laboratorioService.getLaboratorios()
        .subscribe((response: any) => {
            this.laboratoriosData = response
        });
    }
}