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
import { IEditUser } from "src/app/core/models/usuarios/i-editUser";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.css','../generalStyles.css']
})

export class UsuariosComponent implements OnInit {

    nuevoUsuarioClaveRepetida : string = '';

    usuariosData: Array<IUsuario> = [];
    idiomasData: Array<IIdioma> = [];
    rolesData: Array<IRoles> = [];
    usuariosDataComplete: Array<IUsuario> = [];
    laboratoriosData: Array<ILaboratorio> = [];
    provinciasData: Array<IProvincia> = [];
    dataToSelectRol : Array<any> = [];

    usuarioEliminar: number = 0;
    userIdToEdit? : number = undefined;

    nuevoUsuario : INuevoUsuario  = {
        idUsuario : 100,
        codigoLaboratorio : undefined,
        nroRol : 0,
        codigoProvincia : undefined,
        nombreUsuario : "",
        clave : "",
        email : "",
        nombre : "",
        apellido : "",
        dni : 0,
        habilitado : 1,
        idIdioma : 0,
    }
    userToEdit : IEditUser = {
        idUsuario : 0,
        nombreLaboratorio : "",
        rol : "",
        nombreProvincia : "",
        nombreUsuario : "",
        email : "",
        habilitado : 1,
        idioma : "",
    }
    
    constructor(private router: Router, 
                private cookieService: CookieService,
                private usuarioService: UsuarioService,
                private laboratorioService : LaboratorioService,
                private provinciaService : ProvinciaService) { }

    ngOnInit(){
        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') != "1"){
                this.router.navigate(['/']);
            }
        }

        this.usuarioService.getUsuarios()
        .subscribe((response: any) => {
            this.usuariosData = response;
            this.usuariosDataComplete = response;
            console.log(response)
        });

        this.usuarioService.getIdiomas()
        .subscribe((response: any) => {
            this.idiomasData = response;
        });

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
        const rol = this.rolesData.find((rol) => rol.nroRol === parseInt(evento.target.value));
        if(rol) this.userToEdit.rol = rol.nombreRol.toString()

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
        console.log(this.userIdToEdit)

        if(this.nuevoUsuario.nroRol == 1){
            this.nuevoUsuario.codigoLaboratorio = undefined;
        } else if (this.nuevoUsuario.nroRol == 3){
            this.nuevoUsuario.codigoProvincia = this.nuevoUsuario.codigoLaboratorio;
            this.nuevoUsuario.codigoLaboratorio = undefined;
        } else {
            this.nuevoUsuario.codigoProvincia = undefined;
        }

        if(this.checkUserData()){

            if(this.usuariosDataComplete.find(u => u.nombreUsuario === this.nuevoUsuario.nombreUsuario)){
                alert("Existe un usuario con este mismo nombre de usuario! Se solicita cambiarlo por otro")
            } else {
                this.usuarioService.agregarUsuario(this.nuevoUsuario)
                .subscribe((res: any) => {
                    this.usuarioService.getUsuarios()
                    .subscribe((response: any) => {
                        this.usuariosData = response;
                        this.usuariosDataComplete = response;
                        console.log(response)
                    });
                });
            }
        }
    }

    checkUserData(){
        if(this.nuevoUsuario.nombre.length === 0){
            alert("Debe registrar el nombre del usuario")
        }
        else if (this.nuevoUsuario.apellido.length === 0){
            alert("Debe registrar el apellido del usuario")
        }
        else if (this.nuevoUsuario.dni < 9999999){
            alert("Debe registrar el dni del usuario y debe superar las 8 cifras")
        }
        else if (this.nuevoUsuario.email.length === 0){
            alert("Debe registrar el email del usuario")
        }
        else if (this.nuevoUsuario.nroRol === 0){
            alert("Debe seleccionar un rol")
        }
        else if (this.nuevoUsuario.nroRol != 1  
            && (this.nuevoUsuario.codigoLaboratorio === undefined 
            && this.nuevoUsuario.codigoProvincia === undefined)){
            alert("Debe seleccionar el origen del rol")
        }
        else if (this.nuevoUsuario.idIdioma === 0){
            console.log(this.nuevoUsuario.idIdioma)
            alert("Debe seleccionar el idioma del usuario")
        }
        else if(this.nuevoUsuario.nombreUsuario.length === 0){
            alert("Debe ingresar el nombre del usuario")
        }
        else if(this.nuevoUsuario.clave.length < 8){
            alert("La contraseña debe poseer minimo 8 caracteres")
        }
        else if(this.nuevoUsuario.clave !== this.nuevoUsuarioClaveRepetida){
            alert("Las contraseñas no coinciden")
        } 
        else{
            return true
        }
        return false
    }

    marcarUsuarioEliminar(idUsuario : number){
        console.log(this.usuariosData)
        this.usuarioEliminar = idUsuario;
    }

    eliminarUsuario(){
        this.usuarioService.eliminarUsuario(this.usuarioEliminar)
        .subscribe((res : any) => {
            this.usuarioService.getUsuarios()
            .subscribe((response: any) => {
                this.usuariosData = response;
                this.usuariosDataComplete = response;
                console.log(response)
            });
        });

    }

    cleanUserIdToEdit(){
        this.userIdToEdit = undefined;
    }

    editUser(user : IUsuario){
        this.userIdToEdit = user.idUsuario;
        this.userToEdit.idUsuario = user.idUsuario;
        this.userToEdit.nombreLaboratorio = user.nombreLaboratorio;
        this.userToEdit.habilitado = user.habilitado;
        this.userToEdit.email = user.email;
        this.userToEdit.idioma = user.idioma;
        this.userToEdit.nombreProvincia = user.nombreProvincia;
        this.userToEdit.nombreUsuario = user.nombreUsuario;
        this.userToEdit.rol = user.rol;
    } 

    cambioOrigen(evento : any){
        console.log(evento.target.value)

        const variable = this.dataToSelectRol.find(element => (element.codigoLaboratorio || element.codigoProvincia) === evento.target.value)
        console.log(variable.nombre)

        if(this.dataToSelectRol[0].codigoLaboratorio){
            this.userToEdit.nombreLaboratorio = variable.nombre
            this.userToEdit.nombreProvincia = undefined
        } else if(this.dataToSelectRol[0].codigoProvincia){
            this.userToEdit.nombreLaboratorio = undefined
            this.userToEdit.nombreProvincia = variable.nombre
        } else {
            this.userToEdit.nombreLaboratorio = undefined
            this.userToEdit.nombreProvincia = undefined
        }
    }

    cambioLenguaje(evento : any){
        const lenguaje = this.idiomasData.find(i => i.idIdioma === parseInt(evento.target.value))
        if(lenguaje) this.userToEdit.idioma = lenguaje.idioma || "Español"
    }

    cambioHabilitacion(evento: any){
        this.userToEdit.habilitado = parseInt(evento.target.value)
    }

    confirmarActualizacion(){
        console.log(this.userToEdit)
        // console.log(this.userToEdit.rol)
        this.usuarioService.updateUser(this.userToEdit)
        .subscribe((response: any) => {
            console.log(response)
        })
    }
}