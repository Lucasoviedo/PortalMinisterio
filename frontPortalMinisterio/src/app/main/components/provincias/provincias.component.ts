import { Component , OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { CookieService } from 'ngx-cookie-service';
import { ProvinciaService } from "../../api/resources/provincias.service";
import { EndpointService } from "../../api/resources/endpoints.service";
import { EventBusService } from "../../api/resources/event-bus.service";

import { ICentroSalud } from "src/app/core/models/provincias/i-centroSalud";
import { IProvincia } from "src/app/core/models/provincias/i-provincia";
import { IEndpoint } from "src/app/core/models/endpoints/i-endpoint";
import { IEndpoints } from "src/app/core/models/endpoints/i-endpoints";
import { ITecnologia } from "src/app/core/models/endpoints/i-tecnologia";
import { UsuarioService } from "../../api/resources/usuarios.service";
import { INuevoEndpoint } from "src/app/core/models/endpoints/i-nuevoEndpoint";

import { FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'app-provincias',
    templateUrl: './provincias.component.html',
    styleUrls: ['./provincias.component.css','../generalStyles.css']
})

export class ProvinciasComponent implements OnInit {
    
    filtro!: FormControl;

    provinciasData: Array<IProvincia> = [];
    provinciaModal: IProvincia = {nombre : "", codigoProvincia: "", emailContacto: "", nombreContacto :"", valor : 0};
    provinciaCentrosDeSalud : Array<ICentroSalud> = [];

    tecnologiasData : Array<ITecnologia> = [];

    endpoints: Array<IEndpoints> = [];
    endpointExiste : number = 0;
    endpointEditar : IEndpoint = { clave: "", codigoLabOProv: "", habilitado: 1, tecnologia: "",  url: "", usuario: "", urlStatus: ""};

    endpointInsertar : INuevoEndpoint = {codigoLabOProv: "", clave: "", habilitado: 1, tecnologia: "",  url: "", usuario: "",
        urlStatus: "", codigoLaboratorio: undefined, codigoProvincia: "" }

    mensajePing = ""
    codigoMensajePing = 0

    placeholderBuscador = ""

    constructor(private router: Router, 
        private eventBusService: EventBusService,
        private cookieService: CookieService,
        private usuariosService : UsuarioService,
        private provinciaService: ProvinciaService,
        private endpointService: EndpointService) { }

    ngOnInit(){
        this.filtro = new FormControl('', [Validators.maxLength(255)]);

        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') != "1"){
                this.router.navigate(['/']);
            }
        }

        this.usuariosService.getLanguage()
        .subscribe((responseLenguaje: any) => {
            responseLenguaje !== 1 ? this.placeholderBuscador = "Filter by name, contact or email" 
            :  this.placeholderBuscador = "Filtrar por nombre, contacto o email"
        })
        
        this.endpointService.obtenerEndpoints()
        .subscribe((response : any) => {
            this.endpoints = response;
            this.provinciaService.getProvincias(1)
            .subscribe((response2: any) => {
                this.provinciasData = response2.map((data: any) => {
    
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
        })

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
            this.endpointEditar.codigoLabOProv = provincia.codigoProvincia;
            this.endpointEditar.habilitado = variable.habilitado;
            this.endpointEditar.tecnologia = variable.tecnologia;
            this.endpointEditar.url = variable.url;
            this.endpointEditar.urlStatus = variable.urlStatus;
            this.endpointEditar.usuario = variable.usuario;
            this.endpointExiste = 1
        } else {
            this.endpointEditar = {
                clave: "",
                codigoLabOProv: provincia.codigoProvincia,
                habilitado: 1,
                tecnologia: "",
                url: "",
                usuario: "",
                urlStatus: ""
            }; 

            this.endpointInsertar = {
                codigoLabOProv: provincia.codigoProvincia,
                clave: "",
                habilitado: 1,
                tecnologia: "",
                url: "",
                usuario: "",
                urlStatus: "",
                codigoLaboratorio: undefined,
                codigoProvincia: provincia.codigoProvincia
            }
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

    cambioUrl(evento : any){
        this.endpointEditar.url = evento.target.value
        this.endpointInsertar.url = evento.target.value
    }

    cambioUrlStatus(evento : any){
        this.endpointEditar.urlStatus = evento.target.value
        this.endpointInsertar.urlStatus = evento.target.value
    }

    cambioClave(evento : any){
        this.endpointEditar.clave = evento.target.value
        this.endpointInsertar.clave = evento.target.value
    }

    cambioTecnologia(evento : any){
        this.endpointEditar.tecnologia = evento.target.value
        this.endpointInsertar.tecnologia = evento.target.value
    }

    cambioUsuario(evento : any){
        this.endpointEditar.usuario = evento.target.value
        this.endpointInsertar.usuario = evento.target.value
    }

    editarEndpoint(){
        this.endpointService.editarEndpoint(this.endpointEditar)
        .subscribe( (data : any) => {
            this.ngOnInit()
        })
    }

    pingProvincia(provincia:IProvincia){
        this.provinciaModal = provincia
        this.mensajePing = "Error"
        this.codigoMensajePing = 2
        this.endpointService.pingEndpoint(provincia.codigoProvincia)
        .subscribe((response : any) => {
            this.usuariosService.getLanguage()
            .subscribe((responseLenguaje: any) => {
                if(response.statusCode == "OK"){
                    responseLenguaje !== 1 ? this.mensajePing = "Successful conection" :  this.mensajePing = "Conexion exitosa"
                    this.codigoMensajePing = 1
                } else if(response.statusCode === "INTERNAL_SERVER_ERROR"){
                    responseLenguaje !== 1 ? this.mensajePing = "The connection could not be established" :  this.mensajePing = "La conexion no se pudo establecer"
                    this.codigoMensajePing = 2
                } else {
                    responseLenguaje !== 1 ? this.mensajePing = "There is no connection to this endpoint" :  this.mensajePing = "No existe una conexion a este endpoint"
                    this.codigoMensajePing = 2
                }
            })
        })    
    }

    insertarEndpoint(){
        this.endpointService.insertarEndpoint(this.endpointInsertar)
        .subscribe( (data : any) => {
            this.ngOnInit();
        })
    }
}