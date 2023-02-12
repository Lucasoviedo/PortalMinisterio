import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-laboratorios',
    templateUrl: './laboratorios.component.html',
    styleUrls: ['./laboratorios.component.css','../generalStyles.css']
})

export class LaboratoriosComponent{

    constructor(private cookieService: CookieService){}

}