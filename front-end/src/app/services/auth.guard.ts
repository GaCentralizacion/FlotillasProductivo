import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  paramIdUsuario:any = new URLSearchParams(window.location.search)
  constructor(private router: Router) {
    if( this.paramIdUsuario.get('idUsuario') != null ){
      if(this.paramIdUsuario.get('idUsuario') != ''){
        if(this.paramIdUsuario.get('idUsuario') != 0){
          localStorage.removeItem('app_token');
          localStorage.removeItem('idUsuario');
          localStorage.setItem('idUsuario', this.paramIdUsuario.get('idUsuario')) 
        }
      }
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const userInformation = JSON.parse(localStorage.getItem('app_token'));

    // tslint:disable-next-line:member-ordering
    let tokenInfo = undefined;
    if (userInformation) 
    tokenInfo = this.getDecodedAccessToken(userInformation.data.security.token); // decode token

    if (userInformation && userInformation.data.security.token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
        return jwt_decode(token);
    } catch(Error) {
        return null;
    }
  }
}
