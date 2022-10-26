import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class UtilidadCatalogService {
    constructor(private http: HttpClient, private appService: AppService) { }
    getUtilidad(idCotizacion: string) {
    return this.http.get(`${this.appService.url}utilidad/getUtilidad/${idCotizacion}`)
      .pipe(map(resp => {
        return resp;
      }));
  }
}