import { Component , OnInit } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { ICentroSalud } from "src/app/core/models/provincias/i-centroSalud";
import { IProvincia } from "src/app/core/models/provincias/i-provincia";
import { ProvinciaService } from "../../api/resources/provincias.service";
import { Router } from "@angular/router";
import { EndpointService } from "../../api/resources/endpoints.service";
import { IEndpoints } from "src/app/core/models/endpoints/i-endpoints";
import { IEndpoint } from "src/app/core/models/endpoints/i-endpoint";
import { ITecnologia } from "src/app/core/models/endpoints/i-tecnologia";
import { EventBusService } from "../../api/resources/event-bus.service";

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
        nombreContacto :"",
        valor : 0
    };
    provinciaCentrosDeSalud : Array<ICentroSalud> = [];

    tecnologiasData : Array<ITecnologia> = [];

    endpoints: Array<IEndpoints> = [];
    endpointExiste : number = 0;
    endpointEditar : IEndpoint = {
        clave: "",
        codigoLabOProv: "",
        habilitado: 1,
        tecnologia: "",
        url: "",
        usuario: "",
    };

    constructor(private router: Router, 
        private eventBusService: EventBusService,
        private cookieService: CookieService,
        private provinciaService: ProvinciaService,
        private endpointService: EndpointService) { }

    ngOnInit(){
        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') != "1"){
                this.router.navigate(['/']);
            }
        }
        
        this.endpointService.obtenerEndpoints()
        .subscribe((response : any) => {
            this.endpoints = response;
        })

        setTimeout(() => {
            this.provinciaService.getProvincias(1)
            .subscribe((response: any) => {
                this.provinciasData = response.map((data: any) => {
    
                    let valor;
                    const variable = this.endpoints.find(endpoint => endpoint.codigoProvincia === data.codigoProvincia);
    
                    if(variable?.habilitado)  valor = 1
                    else if(variable) valor = 0
                    else valor = 2
    
                    return{
                        ...data,
                        valor
                    };
                })
            });
        },1000)


        this.endpointService.obtenerTecnologias()
        .subscribe((data : any) => {
            this.tecnologiasData = data;
        })

        this.eventBusService.onEndpointEdit.subscribe(() => {
            this.ngOnInit();
          });
    }

    editarProvincia(provincia:IProvincia){

        const variable = this.endpoints.find(endpoint => endpoint.codigoProvincia === provincia.codigoProvincia);
        if(variable) { 
            this.endpointEditar.clave = variable.clave;
            this.endpointEditar.codigoLabOProv = variable.codigoLaboratorio || variable.codigoProvincia;
            this.endpointEditar.habilitado = variable.habilitado;
            this.endpointEditar.tecnologia = variable.tecnologia;
            this.endpointEditar.url = variable.url;
            this.endpointEditar.usuario = variable.usuario;

            this.endpointExiste = 1
        } else {
            this.endpointEditar = {
                clave: "",
                codigoLabOProv: "",
                habilitado: 1,
                tecnologia: "",
                url: "",
                usuario: "",
            }; 
            this.endpointExiste = 0
        }

        this.provinciaModal = provincia; 
    }

    mostrarCentrosSalud(codigoProvincia:string){
        this.provinciaService.getCentrosSalud(codigoProvincia)
        .subscribe((response: any) => {
            this.provinciaCentrosDeSalud = response;
        });
    }

    editarEndpoint(){
        this.endpointService.editarEndpoint(this.endpointEditar)
        .subscribe( (data : any) => {
            console.log(data)
            this.eventBusService.onEndpointEdit.emit();
        })

        this.endpointEditar = {
            clave: "",
            codigoLabOProv: "",
            habilitado: 1,
            tecnologia: "",
            url: "",
            usuario: "",
        }; 
    }
}