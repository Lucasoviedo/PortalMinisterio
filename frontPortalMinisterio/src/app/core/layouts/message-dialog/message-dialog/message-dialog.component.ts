import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMessage } from '../../../models/i-message';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html'
})
export class MessageDialogComponent implements OnInit {

  message: IMessage | undefined;

  constructor(public activeModal: NgbActiveModal) { }
  
  ngOnInit(): void {
  }

}
