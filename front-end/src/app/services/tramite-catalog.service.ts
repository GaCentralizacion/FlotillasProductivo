import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { PaqueteTramite } from '../models';



@Injectable({
  providedIn: 'root'
})
export class TramiteCatalogService {

  constructor(private http: HttpClient, private appService: AppService) { }

  getTramites(idMarca: string, idSucursal: number) {
    return this.http.get(`${this.appService.url}catalogo/tramite/getTramites/${idMarca}/${idSucursal}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getSubtramites(idMarca: string, idSucursal: number, idTramite: string) {
    return this.http.get(`${this.appService.url}catalogo/tramite/getSubtramites/${idMarca}/${idSucursal}/${idTramite}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getProveedorSubtramite(idMarca: string, idSucursal: number, idSubtramite: string) {
    return this.http.get(`${this.appService.url}catalogo/tramite/getProveedoresSubtramite/${idMarca}/${idSucursal}/${idSubtramite}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getPaquetesTramite(idSucursal: number) {
    return this.http.get(`${this.appService.url}catalogo/paqueteTramite/getAll/${idSucursal}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  savePaqueteTramite(paqueteTramite: PaqueteTramite) {
    return this.http.post(`${this.appService.url}catalogo/paqueteTramite/save`, paqueteTramite)
      .pipe(map(resp => {
        return resp;
      }));
  }

  deletePaqueteTramite(idEncPaqueteTramite: number) {
    return this.http.delete(`${this.appService.url}catalogo/paqueteTramite/${idEncPaqueteTramite}`)
      .pipe(map(resp => {
        return resp;
      }));
  }
}
