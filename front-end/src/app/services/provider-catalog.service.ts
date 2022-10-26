import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { TipoProveedor } from '../models';



@Injectable({
  providedIn: 'root'
})
export class ProviderCatalogService {

  constructor(private http: HttpClient, private appService: AppService) { }

  getProviders(idSucursal: number, idTipoProveedor: string = '') {
    return this.http.get(`${this.appService.url}catalogo/proveedor/getProveedores/${idSucursal}/${idTipoProveedor}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getProviderTypes(): TipoProveedor[] {
    return [
      { idTipoProveedor: 'PVE', nombre: 'Proveedor' },
      { idTipoProveedor: 'PROTER', nombre: 'Proveedor Tercero' },
      { idTipoProveedor: 'TOT', nombre: 'Proveedor Tot' },
      { idTipoProveedor: 'PAS', nombre: 'Proveedores Seminuevos' }
    ];
  }
}
