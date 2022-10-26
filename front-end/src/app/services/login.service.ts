import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppService} from './app.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private appService: AppService) { }

  loginUser(body): Observable<any> {
    return this.http.post(`${this.appService.login}/v2/auth/login`, body);
  }

  loginUserCentralizacion(body): Observable<any> {
    return this.http.post(`${this.appService.login}/v2/auth/usuarioCentralizacion`, body);
  }
}
