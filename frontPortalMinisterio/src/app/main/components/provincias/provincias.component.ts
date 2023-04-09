import { Component , OnInit } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { ICentroSalud } from "src/app/core/models/provincias/i-centroSalud";
import { IProvincia } from "src/app/core/models/provincias/i-provincia";
import { ProvinciaService } from "../../api/resources/provincias.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-provincias',
    templateUrl: './provincias.component.html',
    styleUrls: ['./provincias.component.css','../generalStyles.css']
})

export class ProvinciasComponent implements OnInit {

    provinciasData: Array<IProvincia> = [];
    provinciaModal: IProvincia = { 
        nombre : "",
        codigoProvincia: "", 
        emailContacto: "", 
        nombreContacto :""
    };
    provinciaCentrosDeSalud : Array<ICentroSalud> = [];

    constructor(private router: Router, 
        private cookieService: CookieService,
        private provinciaService: ProvinciaService) { }

    ngOnInit(){
        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') != "1"){
                this.router.navigate(['/']);
            }
        }

        this.provinciaService.getProvincias(1)
        .subscribe((response: any) => {
            this.provinciasData = response
        });
    }

    editarProvincia(provincia:IProvincia){
        this.provinciaModal = provincia; 
    }

    mostrarCentrosSalud(codigoProvincia:string){
        this.provinciaService.getCentrosSalud(codigoProvincia)
        .subscribe((response: any) => {
            this.provinciaCentrosDeSalud = response;
            console.log(response)
            console.log(codigoProvincia)
        });
    }
}