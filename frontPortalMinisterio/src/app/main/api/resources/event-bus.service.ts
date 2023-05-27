import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EventBusService {
  public onDashboardShown: EventEmitter<void> = new EventEmitter();
}
