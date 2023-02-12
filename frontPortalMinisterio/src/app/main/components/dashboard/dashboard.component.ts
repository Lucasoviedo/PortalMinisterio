import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit{

    constructor(
        private router: Router,private cookieService: CookieService){}

    ngOnInit(): void {

        //Comprobar que exista la sesion
        if(this.cookieService.get('authToken') === ""){
            this.router.navigate(['/login']);
        }
    }
}