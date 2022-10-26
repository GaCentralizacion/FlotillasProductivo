import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AdditionalService {

  changeCotizacion = new EventEmitter<any>();
  changeUnidades: any;

  constructor() { }

}
