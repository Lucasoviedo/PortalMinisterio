import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from "../../api/resources/login.service";
import { EventBusService } from "../../api/resources/event-bus.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    nombreUsuario: string = "";
    password: string = "";

    constructor(private loginService: LoginService, 
        private router: Router,
        private eventBusService : EventBusService,
        private cookieService: CookieService) { }

    ngOnInit(): void{
        if(this.cookieService.get('authToken')){
            this.router.navigate(['/']);
        }
    }

    onLogin() {
        this.loginService.login(this.nombreUsuario, this.password)
        .subscribe((response) => {
            this.cookieService.set('authToken', response.token.toString());
            this.router.navigate(['/']);
            this.eventBusService.onLogin.emit();
        });
    }
}