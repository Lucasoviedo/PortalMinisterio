import { Component, OnInit } from "@angular/core";
import { VacunasService } from "../../api/resources/vacunas.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { IVacunado } from "src/app/core/models/i-vacunado";

@Component({
    selector: 'app-vacunados',
    templateUrl: './vacunados.component.html',
    styleUrls: ['./vacunados.component.css','../generalStyles.css']
})

export class VacunadosComponent implements OnInit{

    vacunadosData:  Array<IVacunado> = []
    
    constructor(private router: Router, 
                private cookieService: CookieService,
                private vacunasService: VacunasService){}

    ngOnInit(): void {
        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') == "2"){
                this.router.navigate(['/']);
            }
        }

        this.vacunasService.getVaccinateds()
        .subscribe((response) => {
            this.vacunadosData = response;
        })
    }
}