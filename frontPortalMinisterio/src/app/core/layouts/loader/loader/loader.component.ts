import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Loader, LoaderService } from '../../../services/loader/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { UsuarioService } from 'src/app/main/api/resources/usuarios.service';
import { EventBusService } from 'src/app/main/api/resources/event-bus.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  private _subscription!: Subscription;
  private _loaded: boolean = false;
  
  userPermissions: number = 0;

  constructor(private _service: LoaderService,
    private cookieService: CookieService,
    private usuariosService: UsuarioService,
    private eventBusService : EventBusService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._subscription = this._service.getObservable().subscribe((ref: Loader) => {
      this._loaded = ref.loaded;
    });

    if (this.cookieService.get('rolUsuario')) {
      this.usuariosService.getRolNumber()
        .subscribe((response) => {
          this.userPermissions = response;
          this.cdr.detectChanges(); // Manually trigger change detection
        })
    }
    
    this.eventBusService.onLogin.subscribe(() => {
        this.usuariosService.getRolNumber()
          .subscribe((response) => {
            this.userPermissions = response;
          })
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  get loaded(): boolean {
    return this._loaded;
  }

}
