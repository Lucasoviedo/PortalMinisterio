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
import { FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.css','../generalStyles.css']
})

export class UsuariosComponent implements OnInit {

    filtro!: FormControl;

    nuevoUsuarioClaveRepetida : string = '';

    usuariosData: Array<IUsuario> = [];
    idiomasData: Array<IIdioma> = [];
    rolesData: Array<IRoles> = [];
    usuariosDataComplete: Array<IUsuario> = [];
    laboratoriosData: Array<ILaboratorio> = [];
    provinciasData: Array<IProvincia> = [];
    dataToSelectRol : Array<any> = [];

    usuarioEliminar: number = 0;

    nuevoUsuario : INuevoUsuario  = { idUsuario : 100, codigoLaboratorio : undefined, nroRol : 0, codigoProvincia : undefined, nombreUsuario : "", clave : "", email : "", nombre : "", apellido : "", dni : 0, habilitado : 1, idIdioma : 0 }
    userToEdit : IEditUser = {idUsuarioAEditar : 0, nombreLaboratorio : "", rol : "", nombreProvincia : "", nombreUsuario : "", email : "", habilitado : 1, idioma : "" }
    
    usuarioRolAdmin: Array<IUsuario> = [];
    usuarioRolLabs: Array<IUsuario> = [];
    usuarioRolProv: Array<IUsuario> = [];

    constructor(private router: Router, 
                private cookieService: CookieService,
                private usuarioService: UsuarioService,
                private laboratorioService : LaboratorioService,
                private provinciaService : ProvinciaService) { }

    ngOnInit(){
        this.filtro = new FormControl('', [Validators.maxLength(255)]);

        if(this.cookieService.get('rolUsuario')){
            if(this.cookieService.get('rolUsuario') != "1"){
                this.router.navigate(['/']);
            }
        }

        this.usuarioService.getUsuarios()
        .subscribe((response: any) => {
            this.usuariosData = response;
            this.usuariosDataComplete = response;
            
            this.usuarioRolAdmin = response.filter((usuario : IUsuario) => usuario.rol === "ROL_ADMIN")
            this.usuarioRolLabs = response.filter((usuario : IUsuario) => usuario.rol === "ROL_LAB")
            this.usuarioRolProv = response.filter((usuario : IUsuario) => usuario.rol === "ROL_PROV")
        });

        this.usuarioService.getIdiomas()
        .subscribe((response: any) => {
            this.idiomasData = response;
        });

        this.usuarioService.getRoles()
        .subscribe((response: any) => {
            this.rolesData = response.map((rol : any) => {
                let nombre = rol.nombreRol.replace("_"," ")
                return{
                    ...rol,
                    nombre 
                }
            })
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
                        this.ngOnInit();
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
        this.usuarioEliminar = idUsuario;
    }

    eliminarUsuario(){
        this.usuarioService.eliminarUsuario(this.usuarioEliminar)
        .subscribe((res : any) => {
            this.usuarioService.getUsuarios()
            .subscribe((response: any) => {
                this.usuariosData = response;
                this.usuariosDataComplete = response;
            });
        });

    }

    editUser(user : IUsuario){
        this.userToEdit.idUsuarioAEditar = user.idUsuario;
        this.userToEdit.nombreLaboratorio = user.nombreLaboratorio;
        this.userToEdit.habilitado = user.habilitado;
        this.userToEdit.email = user.email;
        this.userToEdit.idioma = user.idioma;
        this.userToEdit.nombreProvincia = user.nombreProvincia;
        this.userToEdit.nombreUsuario = user.nombreUsuario;
        this.userToEdit.rol = user.rol;
    } 

    cambioOrigen(evento : any){
        const variable = this.dataToSelectRol.find(element => (element.codigoLaboratorio || element.codigoProvincia) === evento.target.value)
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
        this.usuarioService.updateUser(this.userToEdit)
        .subscribe((response2: any) => {
            this.usuarioService.getUsuarios()
            .subscribe((response: any) => {
                this.usuariosData = response;
                this.usuariosDataComplete = response;
            });
        })
    }

    resetModalLabels() {
        this.nuevoUsuario.nombre = "";
        this.nuevoUsuario.apellido = "";
        this.nuevoUsuario.dni = 0;
        this.nuevoUsuario.email = "";
        this.nuevoUsuario.nroRol = 0;
        this.nuevoUsuario.codigoLaboratorio = undefined;
        this.nuevoUsuario.codigoProvincia = undefined;
        this.nuevoUsuario.idIdioma = 0;
        this.nuevoUsuario.nombreUsuario = "";
        this.nuevoUsuario.clave = "";
        this.nuevoUsuarioClaveRepetida = "";  
    }
}