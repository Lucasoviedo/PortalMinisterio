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
import { FormControl, Validators } from "@angular/forms";
import { IMensajeLaboratorio } from "src/app/core/models/i-mensajeLaboratorio";

@Component({
    selector: 'app-laboratorios',
    templateUrl: './laboratorios.component.html',
    styleUrls: ['./laboratorios.component.css','../generalStyles.css']
})

export class LaboratoriosComponent implements OnInit{
    filtro!: FormControl;

    laboratoriosData: Array<ILaboratorio> = [];

    endpointsData : Array<IEndpoints> = [];
    tecnologiasData : Array<ITecnologia> = [];

    laboratorioModal: ILaboratorio = {nombre : "", codigoLaboratorio: "", pais: "", direccion: "", emailContacto: "", nombreContacto :"", valor : 0};
    
    mensajePing = ""
    codigoMensajePing = 0

    mensajeLaboratorio = ""
    mensaje : IMensajeLaboratorio = {
        mensaje :"",
        fecha : new Date(),
        codigoLaboratorio: ""
    }

    endpointEditar : IEndpoint = {clave: "", codigoLabOProv: "", habilitado: 1, tecnologia: "", url: "", usuario: "", urlStatus: ""};
    nuevoLaboratorio : INuevoLaboratorio = {codigoLaboratorio: "", nombre: "", pais: "", direccion: "", emailContacto: "", nombreContacto: ""}

    constructor(private router: Router, 
        private eventBusService: EventBusService,
        private laboratorioService: LaboratorioService,
        private endpointService : EndpointService,
        private usuariosService: UsuarioService,
        private cookieService : CookieService) { }

    ngOnInit(){
        this.filtro = new FormControl('', [Validators.maxLength(255)]);

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
        this.codigoMensajePing = 2
        this.endpointService.pingEndpoint(laboratorio.codigoLaboratorio)
        .subscribe((response : any) => {
            this.usuariosService.getLanguage()
            .subscribe((responseLenguaje: any) => {
                if(response.statusCode == "OK"){
                    responseLenguaje != 1 ? this.mensajePing = "Successful conection" :  this.mensajePing = "Conexion exitosa"
                    this.codigoMensajePing = 1
                } else if(response.statusCode === "INTERNAL_SERVER_ERROR"){
                    responseLenguaje != 1 ? this.mensajePing = "The connection could not be established" :  this.mensajePing = "La conexion no se pudo establecer"
                    this.codigoMensajePing = 2
                } else {
                    responseLenguaje != 1 ? this.mensajePing = "There is no connection to this endpoint" :  this.mensajePing = "No existe una conexion a este endpoint"
                    this.codigoMensajePing = 2
                }
            })
        })    
    }

    editarLaboratorio(laboratorio:ILaboratorio){
        this.mensajeLaboratorio = ""
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

    editarEndpoint(){
        this.endpointService.editarEndpoint(this.endpointEditar)
        .subscribe(() => {
            this.ngOnInit();
        })
    }
    
    insertarLaboratorio(){
        this.laboratorioService.insertarLaboratorio(this.nuevoLaboratorio)
        .subscribe(() => {
            this.eventBusService.onEndpointEdit.emit();
        })
    }

    resetModalLabels() {
        this.nuevoLaboratorio.nombre = '';
        this.nuevoLaboratorio.pais = '';
        this.nuevoLaboratorio.direccion = '';
        this.nuevoLaboratorio.emailContacto = '';
        this.nuevoLaboratorio.nombreContacto = '';
        this.nuevoLaboratorio.codigoLaboratorio = '';
      }


      enviarMensajeLaboratorio(){
        this.mensaje.mensaje = this.mensajeLaboratorio;
        this.mensaje.fecha = new Date();
        this.mensaje.codigoLaboratorio = this.endpointEditar.codigoLabOProv
        
        this.laboratorioService.enviarMensaje(this.mensaje).subscribe(() => {
            alert(`¡Mensaje enviado correctamente a ${this.mensaje.codigoLaboratorio}!`)
        })
      }
      
}