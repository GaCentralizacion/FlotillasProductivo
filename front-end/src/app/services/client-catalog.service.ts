import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RelDireccionFlotilla } from '../models/relDireccionFlotilla.model';
import { AppService } from './app.service';
import { RelCFDIFlotilla } from '../models/relCFDIFlotilla.model';
import { ClienteFilter } from '../models/clienteFilter.model';


@Injectable({
  providedIn: 'root'
})
export class ClientCatalogService {

  constructor(private http: HttpClient, private appService: AppService) { }

  postClienteFilter(filter: ClienteFilter) {
    const body = filter;
    return this.http.post(`${this.appService.url}catalogo/cliente/getClientes`, body)
      .pipe(map(resp => {
        return resp;
      }));
  }

  postRelClienteFlotilla(relFlotilla: { idCliente: number, direccionesFlotillas: RelDireccionFlotilla[] }[]) {
    const body = relFlotilla;
    return this.http.post(`${this.appService.url}catalogo/cliente/saveAllRelDireccionFlotillas`, body)
      .pipe(map(resp => {
        return resp;
      }));
  }

  postRelCFDIFlotilla(relCFDI: { idCliente: number, cfdis: RelCFDIFlotilla[] }[]) {
    const body = relCFDI;
    return this.http.post(`${this.appService.url}catalogo/cliente/saveAllRelCfdis`, body)
      .pipe(catchError(
        (error: any, caught: Observable<HttpEvent<any>>) => {
          if (error.status === 401) {
            this.handleAuthError();
            // if you've caught / handled the error, you don't
            // want to rethrow it unless you also want
            // downstream consumers to have to handle it as
            // well.
            return of(error);
          }
          throw error;
        }
      ), map(resp => {
        return resp;
      }));
  }

  private handleAuthError() {
    // clear stored credentials; they're invalid
  }

  getAllCFDI() {
    return this.http.get(`${this.appService.url}catalogo/cfdi/getAll`).pipe(map(res => res));
  }

  getAllCFDIByEmpresa(idEmpresa) {
    return this.http.get(`${this.appService.url}cotizador/getCfdiListingByAgency/${idEmpresa}`).pipe(map(res => res));
  }

  getDataContract(idCliente,idEmpresa,idSucursal) {
    return this.http.get(`${this.appService.url}cotizador/getDataContract/${idCliente}/${idEmpresa}/${idSucursal}`).pipe(map(res => res));
  }

  getRelClientCFDI() {
    return this.http.get(`${this.appService.url}catalogo/cliente/getAllRelCfdis`).pipe(map(res => res));
  }

  getAllClients() {
    return this.http.get(`${this.appService.url}catalogo/cliente/getAll`)

      .pipe(map(res => res));
  }

  getAllFlotillas() {
    return this.http.get(`${this.appService.url}catalogo/direccionFlotillas/getAll`)

      .pipe(map(res => res));
  }

  getCliente(idCliente: number) {
    return this.http.get(`${this.appService.url}catalogo/cliente/get/${idCliente}`)

      .pipe(map(res => res));
  }


  getRelClientFlotilla() {
    return this.http.get(`${this.appService.url}catalogo/cliente/getAllRelDireccionFlotillas`)
      .pipe(map(res => res));
  }

  cfdiCliente(idEmpresa,idSucursal,idCliente,idCotizacion) {
    return this.http.get(`${this.appService.url}cotizador/cfdiCliente/${idEmpresa}/${idSucursal}/${idCliente}/${idCotizacion}`);
  }

}
