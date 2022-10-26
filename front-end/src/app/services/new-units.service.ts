import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { UnidadInteres } from '../models';


@Injectable({
  providedIn: 'root'
})
export class NewUnitsService {

  constructor(private http: HttpClient, private appService: AppService) { }

  getNewUnits(idEmpresa: number, idSucursal: number) {
    return this.http.get(`${this.appService.url}catalogo/inventario/getUnidadesNuevas/${idEmpresa}/${idSucursal}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getExteriorColors(idEmpresa: number, idCatalogo: string, idModelo: number) {
    return this.http.get(`${this.appService.url}catalogo/unidad/getColorExterior/${idEmpresa}/${idCatalogo}/${idModelo}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getInterioresColors(idEmpresa: number, idCatalogo: string, idModelo: number) {
    return this.http.get(`${this.appService.url}catalogo/unidad/getColorInterior/${idEmpresa}/${idCatalogo}/${idModelo}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getVersiones(idEmpresa: number, idCatalogo: string) {
    return this.http.get(`${this.appService.url}catalogo/unidad/getVersiones/${idEmpresa}/${idCatalogo}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getCostoCatalago(sucursal: string, idCatalogo: string, modelo: string) {
    return this.http.get(`${this.appService.url}catalogo/unidad/getCostoCatalago/${sucursal}/${idCatalogo}/${modelo}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getCatalogo(idEmpresa: number) {
    return this.http.get(`${this.appService.url}catalogo/unidad/getUnidadesBpro/${idEmpresa}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getModelos(idEmpresa: number, idCatalogo: string, nombreVersion: string) {
    const modeloFilter = { idEmpresa: idEmpresa, idCatalogo: idCatalogo, anio: nombreVersion };
    return this.http.post(`${this.appService.url}catalogo/unidad/getModelos`, modeloFilter)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getUnidadesInteres(idCotizacion: string) {
    return this.http.get(`${this.appService.url}cotizador/unidadInteres/getAll/${idCotizacion}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getCotizacionId(idCotizacion: string) {
    return this.http.get(`${this.appService.url}cotizador/getCotizacionById/${idCotizacion}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  reserveUnits(idCotizacion: string, idGrupoUnidad: number, reserved: UnidadInteres[]) {
    const body = reserved;
    return this.http.post(`${this.appService.url}cotizador/solicitarApartadoUnidadesInteres/${idCotizacion}/${idGrupoUnidad}`, body)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getCatalogoExterno(idEmpresa: number) {
    return this.http.get(`${this.appService.url}catalogo/unidad/getUnidadesExterno/${idEmpresa}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getVersionesExterno(idEmpresa: number, idCatalogo: string) {
    return this.http.get(`${this.appService.url}catalogo/unidad/getVersionesExterno/${idEmpresa}/${idCatalogo}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getModeloExterno(idEmpresa: number, idCatalogo: string, nombreVersion: string) {
    const modeloFilter = { idEmpresa: idEmpresa, idCatalogo: idCatalogo, anio: nombreVersion };
    return this.http.post(`${this.appService.url}catalogo/unidad/getModeloExterno`, modeloFilter)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getCostoCatalagoExterno(sucursal: string, idCatalogo: string, modelo: string) {
    return this.http.get(`${this.appService.url}catalogo/unidad/getCostoCatalagoExterno/${sucursal}/${idCatalogo}/${modelo}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

}
