import { ErrorHandler, Injectable, Injector, NgZone } from "@angular/core";
import { environment } from "src/environments/environment";
import { IMessage } from "../models/i-message";
import { AppMessageService } from "../services/utils/app-message.service";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

    private _service: AppMessageService | undefined;
  
    constructor(private _injector: Injector, private _ngZone: NgZone) { }
  
    handleError(error: any): void {
      let message: IMessage;
  
      if (!this._service) {
        this._service = this._injector.get(AppMessageService);
      }
  
      if(error.rejection) {
        error = error.rejection;
      }
      
      if(error.body) {
        if(error.body.message) {
          message = { text: error.body.message, num: error.status };
        }
        else if(error.body.error) {
          message = { text: error.body.error, num: error.status };
        }
        else {
          if(error.status == 0) {
            message = { text: $localize`Error al conectarse al servicio`, num: error.status };
          }
          else {
            message = { text: error.body, num: error.status };
          }
        }
      }
      else if(error.error) {
        message = { text: error.error, num: error.status }; 
      }
      else if(error.message) {
        message = { text: error.message, num: error.status }; 
      }
      else {
        message = { text: error, num: error.status };
      }
      
      !environment.production ? console.log(error) : null;
  
      this._ngZone.run(() => this._service?.showMessage(message), 0);
    }
  
  }
  