import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { PaquetesAdicionales } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdicionalCatalogService {

  constructor(private http: HttpClient, private appService: AppService) { }

  getConceptos(idSucursal: number) {
    return this.http.get(`${this.appService.url}catalogo/concepto/getConceptos/${idSucursal}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getUnidadesMedida(idSucursal: number) {
    return this.http.get(`${this.appService.url}catalogo/concepto/getUnidadesMedida/${idSucursal}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getPaquetesConcepto(idSucursal) {
    return this.http.get(`${this.appService.url}catalogo/paqueteConcepto/getAll/${idSucursal}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  saveConceptos(paquete: PaquetesAdicionales) {
    return this.http.post(`${this.appService.url}/catalogo/paqueteConcepto/save`, paquete)
      .pipe(map(resp => {
        return resp;
      }));
  }

  deleteConcepto(id: string) {
    return this.http.delete(`${this.appService.url}/catalogo/paqueteConcepto/${id}`)
    .pipe(map(resp =>{
      return resp;
    }));
  }
}
