import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { UbicacionTraslado, Traslado, CotizacionTraslado } from '../models';



@Injectable({
  providedIn: 'root'
})
export class TrasladosCatalogService {

  constructor(private http: HttpClient, private appService: AppService) { }

  getUbicacionTraslados() {
    return this.http.get(`${this.appService.url}catalogo/traslados/getUbicacionTraslados`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getTraslados() {
    return this.http.get(`${this.appService.url}catalogo/traslados/getTraslados`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  saveUbicacionTraslados(ubicacionTraslados: UbicacionTraslado[]) {
    return this.http.post(`${this.appService.url}catalogo/traslados/saveUbicacionTraslados`, ubicacionTraslados)
      .pipe(map(resp => {
        return resp;
      }));
  }

  saveTraslados(traslados: Traslado[]) {
    return this.http.post(`${this.appService.url}catalogo/traslados/saveTraslados`, traslados)
      .pipe(map(resp => {
        return resp;
      }));
  }

  saveTraslado(idUbicacionOrigen: number, idUbicacionDestino: number, traslado: CotizacionTraslado) {
    return this.http.post(`${this.appService.url}cotizador/traslados/save/${idUbicacionOrigen}/${idUbicacionDestino}`, traslado)
      .pipe(map(resp => {
        return resp;
      }));
  }

  saveTrasladoMov(idUbicacionOrigen: number, idUbicacionDestino: number, traslado: CotizacionTraslado) {
    return this.http.post(`${this.appService.url}cotizador/saveCotizacionTrasladoMovs/${idUbicacionOrigen}/${idUbicacionDestino}`, traslado)
      .pipe(map(resp => {
        return resp;
      }));
  }


  deleteTraslado(idCotizacionTraslado: number) {
      return this.http.delete(`${this.appService.url}cotizador/traslados/${idCotizacionTraslado}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  deleteTrasladoMov(idCotizacionTraslado: number) {
    return this.http.delete(`${this.appService.url}cotizador/deleteCotizacionTrasladosMov/${idCotizacionTraslado}`)
    .pipe(map(resp => {
      return resp;
    }));
}


  deleteUbicacionTraslados(idUbicacionTraslado: number) {
    return this.http.delete(`${this.appService.url}catalogo/traslados/removeUbicacionTraslados/${idUbicacionTraslado}`)
      .pipe(map(resp => {
        return resp;
      }));
  }
  deleteTraslados(idTraslado: number) {
    return this.http.delete(`${this.appService.url}catalogo/traslados/removeTraslados/${idTraslado}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  // OCT 99 20201204 TRASLADOS POSTERIORES
  postGuardaTrasladoPosterior(traslado: any) {
    return this.http.post(`${this.appService.url}catalogo/traslados/postGuardaTrasladoPosterior`, traslado)
      .pipe(map(resp => {
        return resp;
      }));
  }

  postInsertaTrasladosMovs(traslado: any) {
    return this.http.post(`${this.appService.url}catalogo/traslados/postInsertaTrasladosMovs`, traslado)
      .pipe(map(resp => {
        return resp;
      }));
  }
  // OCT 99 20201207 LISTA VINES TRASLADOS
  getListaVinesTraslados(idCotizacion: string) {// OCT99
    return this.http.get(`${this.appService.url}catalogo/traslados/getListaVinesTraslados/${idCotizacion}`)
    .pipe(map(resp => {
      return resp;
    }));
  }

  // OCT 99 20201214 obtiene unidades con o sin vin, para traslados posteriores    
  getListaUnidadesTraslados(idCotizacion: string) {// OCT99
    return this.http.get(`${this.appService.url}catalogo/traslados/getListaUnidadesTraslados/${idCotizacion}`)
    .pipe(map(resp => {
      return resp;
    }));
  }
  // OCT 99 20201214 lista unidades configuradas para armar traslados posteriores
  getListaUnidadesConfiguradas(idCotizacion: string) {// OCT99
    return this.http.get(`${this.appService.url}catalogo/traslados/getListaUnidadesConfiguradas/${idCotizacion}`)
    .pipe(map(resp => {
      return resp;
    }));
  }
  // OCT 99 20201215 lista traslados por cotizacion en posteriores  
  getListadoTrasladosCotizacion(idCotizacion: string) {// OCT99
    return this.http.get(`${this.appService.url}catalogo/traslados/getListadoTrasladosCotizacion/${idCotizacion}`)
    .pipe(map(resp => {
      return resp;
    }));
  }
  // OCT 99 20201214 Obtiene datos de traslado posterior
  getDatosTraslado(idCotizacion: string, idCotizacionTraslado: number) {// OCT99
    return this.http.get(`${this.appService.url}catalogo/traslados/getDatosTraslado/${idCotizacion}/${idCotizacionTraslado}`)
    .pipe(map(resp => {
      return resp;
    }));
  }

  // OCT 99 20210106 Elimina traslados posteriores de MOV antes de haber enviado a BPRO
  eliminaTrasladoPosteriorMov(idCotizacionTraslado: number) {
    return this.http.delete(`${this.appService.url}catalogo/traslados/eliminaTrasladoPosteriorMov/${idCotizacionTraslado}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  // CHK - 07 ene 2021 Lista traslados mov
  getListarTrasladosPosteriores(idCotizacion: string) {
    return this.http.get(`${this.appService.url}catalogo/traslados/listarTrasladosPosteriores/${idCotizacion}`)
    .pipe(map(resp => {
      return resp;
    }));
  }

  // OCT 99 20210302 obtiene listado del traslado en modal para consultar/editar traslados POSTAD
  getListadoTrasladoDetallePost(idCotizacion: string, idCotizacionTraslado: number) {
    return this.http.get(`${this.appService.url}catalogo/traslados/getListadoTrasladoDetallePost/${idCotizacion}/${idCotizacionTraslado}`)
    .pipe(map(resp => {
      return resp;
    }));
  }

  // OCT 99 20210308 obtiene listado del traslado en modal para editar traslados POSTAD
  getObtenerDatosEdicionTrasladoPost(idCotizacion: string, idCotizacionTraslado: number) {
    return this.http.get(`${this.appService.url}catalogo/traslados/getObtenerDatosEdicionTrasladoPost/${idCotizacion}/${idCotizacionTraslado}`)
    .pipe(map(resp => {
      return resp;
    }));
  }

  // OCT 99 20210308 edicion de traslado posterior
  postEditaTrasladosMovs(traslado: any) {
    return this.http.post(`${this.appService.url}catalogo/traslados/postEditaTrasladosMovs`, traslado)
      .pipe(map(resp => {
        return resp;
      }));
  }
  
}
