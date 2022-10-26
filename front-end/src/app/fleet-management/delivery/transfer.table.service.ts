import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransferTableFlotService {

  public selectChildrens = new EventEmitter<any>();
  public refreshTable = new EventEmitter<any>();
  public scrollTO = new EventEmitter<any>();
  public rootSelect = new EventEmitter<any>();

  constructor() { }

}
