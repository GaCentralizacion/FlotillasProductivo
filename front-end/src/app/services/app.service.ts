import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  //DEV
  idApplication = 14;
  url = '';
  login = '';


  constructor() {
    this.url = environment.utl;
    this.login = environment.login
  }
}
