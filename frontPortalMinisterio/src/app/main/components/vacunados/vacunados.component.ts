import { Component, OnInit } from "@angular/core";
import { VacunasService } from "../../api/resources/vacunas.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { IVacunado } from "src/app/core/models/i-vacunado";
import { LaboratorioService } from "../../api/resources/laboratorios.service";
import { ProvinciaService } from "../../api/resources/provincias.service";

import * as moment from 'moment';

@Component({
    selector: 'app-vacunados',
    templateUrl: './vacunados.component.html',
    styleUrls: ['./vacunados.component.css','../generalStyles.css']
})

export class VacunadosComponent implements OnInit{

    vacunadosData:  Array<IVacunado> = []
    vacunadosDataCompleta:  Array<IVacunado> = []
    
    laboratoriosData : Array<string> = []
    provinciasData : Array<string> = []

    filtroLaboratorio = ""
    filtroProvincia = ""
    
    constructor(private router: Router, 
                private cookieService: CookieService,
                private laboratorioService : LaboratorioService,
                private provinciaService : ProvinciaService,
                private vacunasService: VacunasService){}

    ngOnInit(): void {
        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') == "2"){
                this.router.navigate(['/']);
            }
        }

        this.vacunasService.getVaccinateds()
        .subscribe((response) => {

            this.vacunadosDataCompleta = response
        })

        this.laboratorioService.getLaboratorios()
        .subscribe((response: any) => {
            this.laboratoriosData = response.map((laboratorio : any) => {
                return laboratorio.nombre;
            })
        })

        if(this.cookieService.get('rolUsuario') == "1"){
            this.provinciaService.getProvincias(1)
            .subscribe((response: any) => {
                this.provinciasData = response.map((laboratorio : any) => {
                    return laboratorio.nombre;
                })
            })
        }

        
    }

    filtrarPorLaboratorio(evento : any){
        this.filtroLaboratorio = evento.target.value;
        this.filtrarVacunados();
    }

    filtrarPorProvincia(evento : any){
        this.filtroProvincia = evento.target.value;
        this.filtrarVacunados();
    }

    filtrarVacunados(){
        this.vacunadosData = this.vacunadosDataCompleta;
        if(this.filtroLaboratorio === "" && this.filtroProvincia === ""){
            return
        } else {
            this.vacunadosData = this.vacunadosData.filter(vacunado => {
                if(this.filtroLaboratorio !== "" && this.filtroProvincia !== ""){
                    if(vacunado.laboratorio === this.filtroLaboratorio && vacunado.provincia === this.filtroProvincia){
                        return vacunado
                    }
                } else if (this.filtroLaboratorio !== ""){
                    if(vacunado.laboratorio === this.filtroLaboratorio){
                        return vacunado
                    }
                } else {
                    if(vacunado.provincia === this.filtroProvincia){
                        return vacunado
                    }
                }
                return
            })
        }
    }
}