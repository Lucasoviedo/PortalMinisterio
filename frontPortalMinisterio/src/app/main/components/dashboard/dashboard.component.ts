import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { IDashboardItem } from "src/app/core/models/i-dashboardItem";
import { UsuarioService } from "../../api/resources/usuarios.service";
import { EventBusService } from "../../api/resources/event-bus.service";

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
        private eventBusService : EventBusService){}

    ngOnInit(): void {
        if(this.cookieService.get('authToken') === ""){
            this.router.navigate(['/login']);
        }

        this.usuariosService.getDashboardUser()
        .subscribe((response : any) => {
            Object.keys(response).forEach(element => {
                this.keys = {
                    title :  element.replace(/([A-Z])/g, " $1").toUpperCase(),
                    value : response[element]
                };
                if(this.keys.value != undefined){
                    this.dashboardData.push(this.keys)
                }
            });
            console.log(this.dashboardData)

            this.usuariosService.getLanguage()
            .subscribe((responseLenguaje: any) => {
                console.log(responseLenguaje)
                if (response !== 1) {
                    if (this.dashboardData[0]) this.dashboardData[0].title = "BATCHES"
                    if (this.dashboardData[1]) this.dashboardData[1].title = "AVAILABLE VACCINES FOR DISTRIBUTION"
                    if (this.dashboardData[2]) this.dashboardData[2].title = "AVAILABLE VACCINES BY PROVINCES"
                    if (this.dashboardData[3]) this.dashboardData[3].title = "ADMINISTERED VACCINES"
                    if (this.dashboardData[4]) this.dashboardData[4].title = "RETURNED VACCINES"
                    if (this.dashboardData[5]) this.dashboardData[5].title = "VACCINATED"
                    if (this.dashboardData[6]) this.dashboardData[6].title = "LAST LAB UPDATE"
                    if (this.dashboardData[7]) this.dashboardData[7].title = "LAST PROVINCE UPDATE"
                }
            })
        })

        this.eventBusService.onDashboardShown.emit();
    }
}