import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { CookieService } from 'ngx-cookie-service';
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

    constructor(private loginService: LoginService, 
        private router: Router,
        private cookieService: CookieService) { }

    onLogin() {
        this.loginService.login(this.nombreUsuario, this.password)
        .subscribe((response) => {
            this.cookieService.set('authToken', response.toString());
            this.router.navigate(['/']);
        });
    }
}