import { Component, OnInit } from "@angular/core";
import { IUsuario } from "src/app/core/models/usuarios/i-usuario";
import { IIdioma } from "src/app/core/models/usuarios/i-idiomas";
import { IRoles } from "src/app/core/models/usuarios/i-roles";

import { UsuarioService } from "../../api/resources/usuarios.service";
import { LaboratorioService } from "../../api/resources/laboratorios.service";
import { ProvinciaService } from "../../api/resources/provincias.service";
import { ILaboratorio } from "src/app/core/models/laboratorios/i-laboratorio";
import { IProvincia } from "src/app/core/models/provincias/i-provincia";
import { INuevoUsuario } from "src/app/core/models/usuarios/i-nuevoUsuario";

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.css','../generalStyles.css']
})

export class UsuariosComponent implements OnInit {

    usuariosData: Array<IUsuario> = [];
    idiomasData: Array<IIdioma> = [];
    rolesData: Array<IRoles> = [];
    usuariosDataComplete: Array<IUsuario> = [];

    nuevoUsuario : INuevoUsuario  = {
        idUsuario : 0,
        codigoLaboratorio : "asd",
        nroRol : 0,
        codigoProvincia : "asd",
        nombreUsuario : "asd",
        clave : "asd",
        email : "asd",
        nombre : "asd",
        apellido : "asd",
        dni : 0,
        habilitado : 1,
        idIdioma : 1,
    }

    laboratoriosData: Array<ILaboratorio> = [];
    provinciasData: Array<IProvincia> = [];

    dataToSelectRol : Array<any> = [];

    constructor(private usuarioService: UsuarioService,
                private laboratorioService : LaboratorioService,
                private provinciaService : ProvinciaService) { }

    ngOnInit(){
        this.usuarioService.getUsuarios()
        .subscribe((response: any) => {
            this.usuariosData = response;
            this.usuariosDataComplete = response;
        });

        // this.usuarioService.getIdiomas(null)
        // .subscribe((response: any) => {
        //     this.idiomasData = response
        // });

        this.usuarioService.getRoles()
        .subscribe((response: any) => {
            this.rolesData = response
        });
        
        this.laboratorioService.getLaboratorios()
        .subscribe((response: any) => {
            this.laboratoriosData = response
        });
        
        this.provinciaService.getProvincias(1)
        .subscribe((response: any) => {
            this.provinciasData = response
        });
    }

    rolOnChange(evento: any){
        if(evento.target.value === "1"){
            this.dataToSelectRol = []
        } else if (evento.target.value === "2"){
            this.dataToSelectRol = this.laboratoriosData
        } else {
            this.dataToSelectRol = this.provinciasData
        }
    }

    filtrarPorRol(evento: any) {
        if(this.usuariosData){
            if(evento.target.value === ""){
                this.usuariosData = this.usuariosDataComplete;
            } else {
                const newData = this.usuariosDataComplete.filter(usuario => usuario.rol === evento.target.value);
                this.usuariosData = newData;
            }
        }
    }

    agregarUsuario(){
        if(this.nuevoUsuario.nroRol == 1){
            this.nuevoUsuario.codigoLaboratorio = "null";
        } else if (this.nuevoUsuario.nroRol == 3){
            this.nuevoUsuario.codigoProvincia = this.nuevoUsuario.codigoLaboratorio;
            this.nuevoUsuario.codigoLaboratorio = "null";
        } else {
            this.nuevoUsuario.codigoProvincia = "null";
        }
        
        this.usuarioService.agregarUsuario(this.nuevoUsuario)
        .subscribe((response: any) => {
            console.log(response);
        });
    }
}