
import { Injectable, ErrorHandler } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(public errorHandler: ErrorHandler) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const userInformation = JSON.parse(localStorage.getItem('app_token'));

    if (request.body) {
      this.removeNullValues(request.body);
    }

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });

    if (!userInformation) {
      return next.handle(request);
    }

    if (userInformation) {
      headers = request.headers
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('idUsuario', userInformation.data.user.id);

    }
    const cloneReq = request.clone({ headers });
    return next.handle(cloneReq);
  }

  private removeNullValues(obj: any) {
    Object.keys(obj).forEach(k =>
      (obj[k] && typeof obj[k] === 'object') && this.removeNullValues(obj[k]) ||
      (obj[k] == undefined) && delete obj[k]
    );
    return obj;
  }
}
