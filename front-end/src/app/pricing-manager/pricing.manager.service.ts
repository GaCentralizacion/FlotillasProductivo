import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PricingManagerService {

  onlyRead = true;
  perfilSoloLectura = false;

  constructor() { 
    this.soloLectura();
  }

  soloLectura(){
    const objAuth: any = JSON.parse(localStorage.getItem('app_token'));
    let rol = objAuth.data.security.rol[0].RolId;
    if(rol === 63)
      this.perfilSoloLectura = true;
  }

}
