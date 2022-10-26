
import { Injectable, ErrorHandler } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ErrorService } from './error.service';


@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => { }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        const errorMessage = err.statusText + (err.error == undefined ? '' :
          ': ' + JSON.stringify(err.error.message == undefined ? err.error : err.error.message));
        this.errorService.emitError(errorMessage);
      }
    }));

  }
}
