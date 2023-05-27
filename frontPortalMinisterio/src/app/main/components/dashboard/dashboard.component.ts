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
        })

        this.eventBusService.onDashboardShown.emit();
    }
}