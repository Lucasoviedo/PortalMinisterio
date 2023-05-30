import { Component, OnInit } from "@angular/core";
import { ILaboratorio } from "src/app/core/models/laboratorios/i-laboratorio";
import { LaboratorioService } from "../../api/resources/laboratorios.service";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { EndpointService } from "../../api/resources/endpoints.service";
import { IEndpoints } from "src/app/core/models/endpoints/i-endpoints";
import { UsuarioService } from "../../api/resources/usuarios.service";
import { IEndpoint } from "src/app/core/models/endpoints/i-endpoint";
import { ITecnologia } from "src/app/core/models/endpoints/i-tecnologia";
import { EventBusService } from "../../api/resources/event-bus.service";
import { INuevoLaboratorio } from "src/app/core/models/laboratorios/i-nuevoLaboratorio";

@Component({
    selector: 'app-laboratorios',
    templateUrl: './laboratorios.component.html',
    styleUrls: ['./laboratorios.component.css','../generalStyles.css']
})

export class LaboratoriosComponent implements OnInit{

    laboratoriosData: Array<ILaboratorio> = [];

    endpointsData : Array<IEndpoints> = [];
    tecnologiasData : Array<ITecnologia> = [];

    laboratorioModal: ILaboratorio = { 
        nombre : "",
        codigoLaboratorio: "", 
        pais: "",
        direccion: "",
        emailContacto: "", 
        nombreContacto :"",
        valor : 0
    };
    mensajePing = ""

    endpointEditar : IEndpoint = {
        clave: "",
        codigoLabOProv: "",
        habilitado: 1,
        tecnologia: "",
        url: "",
        usuario: "",
        urlStatus: "",
    };

    nuevoLaboratorio : INuevoLaboratorio = {
        codigoLaboratorio: "",
        nombre: "",
        pais: "",
        direccion: "",
        emailContacto: "",
        nombreContacto: "",
    }

    constructor(private router: Router, 
        private eventBusService: EventBusService,
        private laboratorioService: LaboratorioService,
        private endpointService : EndpointService,
        private usuariosService: UsuarioService,
        private cookieService : CookieService) { }

    ngOnInit(){
        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') != "1"){
                this.router.navigate(['/']);
            }
        }

        this.endpointService.obtenerEndpoints()
        .subscribe((response : any) => {
            this.endpointsData = response;
            this.laboratorioService.getLaboratorios()
            .subscribe((response: any) => {
                this.laboratoriosData = response.map((data: any) => {
        
                    let valor;
                    const variable = this.endpointsData.find(endpoint => endpoint.codigoLaboratorio === data.codigoLaboratorio);

                    if(variable?.habilitado)  valor = 1
                    else if(variable) valor = 0
                    else valor = 2

                    return{
                        ...data,
                        valor
                    };  
                })
                console.log(this.laboratoriosData)
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

    pingLaboratorio(laboratorio:ILaboratorio){
        this.laboratorioModal = laboratorio
        this.mensajePing = ""
        this.endpointService.pingEndpoint(laboratorio.codigoLaboratorio)
        .subscribe((response : any) => {
            this.usuariosService.getLanguage()
            .subscribe((responseLenguaje: any) => {
                console.log(responseLenguaje)
                if(response.statusCode == "OK"){
                    responseLenguaje == 1 ? this.mensajePing = "Successful conection" :  this.mensajePing = "Conexion exitosa"
                } else if(response.statusCode === "INTERNAL_SERVER_ERROR"){
                    responseLenguaje == 1 ? this.mensajePing = "The connection could not be established" :  this.mensajePing = "La conexion no se pudo establecer"
                } else {
                    responseLenguaje == 1 ? this.mensajePing = "There is no connection to this endpoint" :  this.mensajePing = "No existe una conexion a este endpoint"
                }
            })
        })    
    }

    editarLaboratorio(laboratorio:ILaboratorio){
        console.log(laboratorio);
        const variable = this.endpointsData.find(endpoint => endpoint.codigoLaboratorio === laboratorio.codigoLaboratorio);
        if(variable) { 
            this.endpointEditar.clave = variable.clave;
            this.endpointEditar.codigoLabOProv = laboratorio.codigoLaboratorio;
            this.endpointEditar.habilitado = variable.habilitado;
            this.endpointEditar.tecnologia = variable.tecnologia;
            this.endpointEditar.url = variable.url;
            this.endpointEditar.urlStatus = variable.urlStatus;
            this.endpointEditar.usuario = variable.usuario;
        } else {
            this.endpointEditar = {
                clave: "",
                codigoLabOProv: laboratorio.codigoLaboratorio,
                habilitado: 1,
                tecnologia: "",
                url: "",
                usuario: "",
                urlStatus: ""
            }; 
        }

        this.laboratorioModal = laboratorio; 
    }

    
    cambioUrl(evento : any){
        this.endpointEditar.url = evento.target.value
    }

    cambioUrlStatus(evento : any){
        this.endpointEditar.urlStatus = evento.target.value
    }

    cambioClave(evento : any){
        this.endpointEditar.clave = evento.target.value
    }

    cambioTecnologia(evento : any){
        this.endpointEditar.tecnologia = evento.target.value
    }

    cambioUsuario(evento : any){
        this.endpointEditar.usuario = evento.target.value
    }

    editarEndpoint(){
        console.log(this.endpointEditar)
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
            urlStatus: ""
        }; 
    }























    insertarLaboratorio(){
        console.log(this.nuevoLaboratorio)

        this.laboratorioService.insertarLaboratorio(this.nuevoLaboratorio)
        .subscribe((data : any) => {
            this.eventBusService.onEndpointEdit.emit();
        })
    }

    cambioCodigoLaboratorio(evento : any){
        this.nuevoLaboratorio.codigoLaboratorio = evento.target.value
    }

    cambioNombre(evento : any){
        this.nuevoLaboratorio.nombre = evento.target.value
    }
    
    cambioPais(evento : any){
        this.nuevoLaboratorio.pais = evento.target.value
    }
    
    cambioDireccion(evento : any){
        this.nuevoLaboratorio.direccion = evento.target.value
    }
    
    cambioEmailContaco(evento : any){
        this.nuevoLaboratorio.emailContacto = evento.target.value
    }
    
    cambioNombreContacto(evento : any){
        this.nuevoLaboratorio.nombreContacto = evento.target.value
    }
}