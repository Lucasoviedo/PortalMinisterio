import { Component, OnInit } from "@angular/core";
import { IUsuario } from "src/app/core/models/usuarios/i-usuario";
import { UsuarioService } from "../../api/resources/usuarios.service";

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.css','../generalStyles.css']
})

export class UsuariosComponent implements OnInit {

    usuariosData: Array<IUsuario> = [];

    constructor(private usuarioService: UsuarioService) { }

    ngOnInit(){
        this.usuarioService.getUsuarios()
        .subscribe((response: any) => {
            this.usuariosData = response
        });
    }
}