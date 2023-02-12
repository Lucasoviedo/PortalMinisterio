import { Component , OnInit } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { IProvincia } from "src/app/core/models/i-provincia";
import { ProvinciaService } from "../../api/resources/provincias.service";

@Component({
    selector: 'app-provincias',
    templateUrl: './provincias.component.html',
    styleUrls: ['./provincias.component.css','../generalStyles.css']
})

export class ProvinciasComponent implements OnInit {

    provinciasData: Array<IProvincia> = [];

    constructor(private provinciaService: ProvinciaService, 
        private cookieService: CookieService) { }

    ngOnInit(){
        this.provinciaService.getProvincias(1)
        .subscribe((response: any) => {
            this.provinciasData = response
            console.log(this.provinciasData);
        });
    }
}