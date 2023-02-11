import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "../../api/resources/login.service";

// import { ILoginUsuario } from "src/app/core/models/i-loginUsuario";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent{
    nombreUsuario: string = "";
    password: string = "";

    constructor(private loginService: LoginService, private router: Router) { }

    onLogin() {
        this.loginService.login(this.nombreUsuario, this.password)
        .subscribe((response) => {
            console.log(response);
            this.router.navigate(['/']);
        });
    }
}



// export class LoginComponent implements OnInit{

//     loginUsuario!: LoginUsuario;
//     nombreUsuario: string = "";
//     password: string = "";

//     errMsj: string = "";

//     constructor(
//         private authService: AuthService,
//         private toastr: ToastrService,
//         private tokenService: TokenService,
//         private router: Router
//     ){}

//     ngOnInit() {
//     }

//     onLogin() : void {
//         this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
//         this.authService.login(this.loginUsuario).subscribe(
//             data => {
//                 this.tokenService.setToken(data.token);
//                 this.toastr.success('Bienvenido','OK', {
//                     timeOut: 3000, positionClass: 'toast-top-center'
//                 });
//                 this.router.navigate(['']);
//             },
//             err => {
//                 this.errMsj = err.message;
//                 this.toastr.error(this.errMsj, 'Error', {
//                     timeOut: 3000, positionClass: 'toast-top-center'
//                 });
//             }
//         );
//     }

// }