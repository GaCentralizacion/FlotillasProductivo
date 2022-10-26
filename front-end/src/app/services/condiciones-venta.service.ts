import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { GrupoUnidades, DetalleUnidades } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})

export class CondionesVentaService {
  constructor(
    private http: HttpClient,
    private appService: AppService
  ) { }

  getFinancieras(idSucursal: number) {
    return this.http.get(`${this.appService.url}/catalogo/financiera/getFinancieras/${idSucursal}`)
      .pipe(map(res => {
        return res;
      }));
  }

  getAllCfdi() {
    return this.http.get(`${this.appService.url}/catalogo/cfdi/getAll`)
      .pipe(map(res => {
        return res;
      }));
  }

  getAllCFDIByEmpresa(idEmpresa) {
    return this.http.get(`${this.appService.url}cotizador/getCfdiListingByAgency/${idEmpresa}`).pipe(map(res => res));
  }

  getIva(idSucursal) {
    return this.http.get(`${this.appService.url}/catalogo/getIvas/${idSucursal}`)
    .pipe(map(res => {
      return res;
    }));
  }

  saveGrupoUnidades(grupoUnidad: GrupoUnidades) {
    return this.http.post(`${this.appService.url}/cotizador/grupoUnidades/save`, grupoUnidad)
      .pipe(map(res => {
        return res;
      }));
  }

  updateCotizacionUnidadDetalle(detalleUnidad: DetalleUnidades) {
    return this.http.put(`${this.appService.url}cotizador/detalleUnidades/update`, detalleUnidad)
      .pipe(map(res => {
        return res;
      }));
  }

  getFechaMinimaPromesaEntrega(idCotizacion: string, idGrupoUnidad: number) {
    return this.http.get(`${this.appService.url}cotizador/getFechaMinimaPromesaEntrega/${idCotizacion}/${idGrupoUnidad}`)
    .pipe(map(res => {
      return res;
    }));
  }

  cfdiCliente(idEmpresa,idSucursal,idCliente,idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/cfdiCliente/${idEmpresa}/${idSucursal}/${idCliente}/${idCotizacion}`);
  }

}
