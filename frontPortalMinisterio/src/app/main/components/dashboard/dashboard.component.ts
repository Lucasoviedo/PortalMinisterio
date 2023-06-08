import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { IDashboardItem } from "src/app/core/models/i-dashboardItem";
import { UsuarioService } from "../../api/resources/usuarios.service";
import { EventBusService } from "../../api/resources/event-bus.service";
import { TranslateService } from "@ngx-translate/core";

import * as moment from 'moment';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit{

    dashboardData : Array<IDashboardItem> = [];
    keys : IDashboardItem = {
        title :  "",
        value : null
    };

    constructor(
        private router: Router,
        private cookieService: CookieService,
        private usuariosService : UsuarioService,
        public translate: TranslateService,
        private eventBusService : EventBusService){}

    ngOnInit(): void {
        if(this.cookieService.get('authToken') === ""){
            this.router.navigate(['/login']);
        }

        this.usuariosService.getDashboardUser()
        .subscribe((response : any) => {

            this.usuariosService.getLanguage()
            .subscribe((responseLenguaje: any) => {
                if (responseLenguaje !== 1) {
                    this.translate.use('en');
                } else {
                    this.translate.use('es');
                }

                Object.keys(response).forEach(element => {
                    this.keys = {
                        title :  element.replace(/([A-Z])/g, " $1").toUpperCase(),
                        value : typeof(response[element]) !== "string" ? response[element] : moment(response[element], "MMM D YYYY h:mmA").format("DD-MM-YYYY")
                    };

                    if (responseLenguaje !== 1) {
                        if(this.keys.title === "LOTES"){
                            this.keys.title = "BATCHES"
                        } else if (this.keys.title === "VACUNAS DISPONIBLES A DISTRIBUIR"){
                            this.keys.title = "AVAILABLE VACCINES FOR DISTRIBUTION"
                        } else if (this.keys.title === "VACUNAS DISPONIBLES PROVINCIAS"){
                            this.keys.title = "AVAILABLE VACCINES BY PROVINCE"
                        } else if (this.keys.title === "VACUNAS APLICADAS"){
                            this.keys.title = "ADMINISTERED VACCINES"
                        } else if (this.keys.title === "VACUNAS DEVUELTAS"){
                            this.keys.title = "RETURNED VACCINES"
                        } else if (this.keys.title === "VACUNADOS"){
                            this.keys.title = "VACCINATED"
                        } else if (this.keys.title === "ULTIMA ACTUALIZACION LAB"){
                            this.keys.title = "LAST LAB UPDATE"
                        } else if(this.keys.title === "ULTIMA ACTUALIZACION PROV"){
                            this.keys.title = "LAST PROVINCE UPDATE"
                        } 
                    }

                    if(this.keys.value != undefined){
                        this.dashboardData.push(this.keys)
                    }
                });
            })
        })
        this.eventBusService.onDashboardShown.emit();
    }
}