import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { PaqueteServicio } from '../models/servicioUnidad.model';



@Injectable({
  providedIn: 'root'
})
export class OrdenesCatalogService {

  constructor(private http: HttpClient, private appService: AppService) { }

  getServicios(idSucursal: number, catalogo: any, anio: string) {
    return this.http.get(`${this.appService.url}catalogo/servicioUnidad/getServiciosUnidad/${idSucursal}/${catalogo}/${anio}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getPaqueteServicio(idSucursal: number, catalogo: string = null, anio: string = null) {
    let optionalUrl = '';
    if (catalogo != undefined) {
      optionalUrl = catalogo;
      if (anio != undefined) {
        optionalUrl += '/' + anio;
      }
    }
    return this.http.get(`${this.appService.url}catalogo/paqueteServicioUnidad/getAll/${idSucursal}/${optionalUrl}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  savePaqueteServicio(paqueteServicio: PaqueteServicio) {
    return this.http.post(`${this.appService.url}catalogo/paqueteServicioUnidad/save`, paqueteServicio)
      .pipe(map(resp => {
        return resp;
      }));
  }

  deletePaqueteServicio(idEncPaqueteServicioUnidad) {
    return this.http.delete(`${this.appService.url}catalogo/paqueteServicioUnidad/${idEncPaqueteServicioUnidad}`)
      .pipe(map(resp => {
        return resp;
      }));
  }
}
