import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { AccesorioNuevo, PaqueteAccesorios } from '../models';
//SISCO
import { SolicitudCotizacionSisco } from '../models/accesorio.model'
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AccesorioCatalogService {

  constructor(private http: HttpClient, private appService: AppService) { }

  getProveedores(idSucursal: number, idTipoProveedor: string) {
    return this.http.get(`${this.appService.url}catalogo/proveedor/getProveedores/${idSucursal}/${idTipoProveedor}`)
      .pipe(map(res => res));
  }

  getAccesoriosBpro(idMarca: string, idSucursal: number, idCotizacion: string) {
    return this.http.get(`${this.appService.url}catalogo/accesorio/getAccesorios/${idCotizacion}/${idMarca}/${idSucursal}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getAccesoriosBproSC(idMarca: string, idSucursal: number) {
    return this.http.get(`${this.appService.url}catalogo/accesorio/getAccesorios/${idMarca}/${idSucursal}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  getAccesoriosNuevos(idSucursal: number) {
    return this.http.get(`${this.appService.url}catalogo/accesorio/getAccesoriosNuevos/${idSucursal}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  saveAccesorioNuevo(accesorioNuevo: AccesorioNuevo) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/saveAccesorioNuevo`, accesorioNuevo)
      .pipe(map(resp => {
        return resp;
      }));
  }

  deleteAccesorioNuevo(idAccesorioNuevo: number) {
    return this.http.delete(`${this.appService.url}catalogo/accesorio/${idAccesorioNuevo}`)
      .pipe(map(resp => {
        return resp;
      }));
  }
  getPaquetesAccesorios(idSucursal) {
    return this.http.get(`${this.appService.url}catalogo/paqueteAccesorios/getAll/${idSucursal}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  savePaqueteAccesorios(paqueteAccesorios: PaqueteAccesorios) {
    return this.http.post(`${this.appService.url}catalogo/paqueteAccesorios/save`, paqueteAccesorios)
      .pipe(map(resp => {
        return resp;
      }));
  }

  deletePaqueteAccesorios(idEncPaqueteAccesorios: number) {
    return this.http.delete(`${this.appService.url}catalogo/paqueteAccesorios/${idEncPaqueteAccesorios}`)
      .pipe(map(resp => {
        return resp;
      }));
  }
  //SISCO
  //obtiene catalogo de productos SISCO
  getCatalogoAccesoriosSISCO(filtroSisco: any, token: string, url: string) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: token
    });
    let respuesta: any;

    //return this.http.get(`http://189.204.141.199:5112/partida/GetPartidas?idTipoObjeto=${filtroSisco.idTipoObjeto}&numeroContrato=${filtroSisco.numeroContrato}&idCliente=${filtroSisco.idCliente}&idClase=${filtroSisco.idClase}&idTipoSolicitud=${filtroSisco.idTipoSolicitud}&idMoneda=${filtroSisco.idMoneda}`, { headers: httpHeaders })
    return this.http.get(`${url}?idTipoObjeto=${filtroSisco.idTipoObjeto}&numeroContrato=${filtroSisco.numeroContrato}&idCliente=${filtroSisco.idCliente}&idClase=${filtroSisco.idClase}&idTipoSolicitud=${filtroSisco.idTipoSolicitud}&idMoneda=${filtroSisco.idMoneda}`, { headers: httpHeaders })
      .pipe(map(resp => {
        respuesta = [resp];
        return respuesta;
      }));
  }
  //crea una nueva solicitud de cotizacion en SISCO
  postInsSolicitudCompra(solicitudCompraSisco: SolicitudCotizacionSisco, token: string, url: string) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: token
    });
    let respuesta: any;

    try {
      //return this.http.post(`http://189.204.141.199:5112/solicitud/PostInsSolicitudCompra`, solicitudCompraSisco, { headers: httpHeaders })
      return this.http.post(url, solicitudCompraSisco, { headers: httpHeaders })
        .pipe(map(resp => {
          respuesta = [resp];
          return respuesta;
        }));
    }
    catch (e) {
      console.log(e);
      return e;
    }
  }

  //cancela una  solicitud de cotizacion en SISCO
  postDelSolicitudCompra(solicitudCompraSisco: any, token: string, url: string, noOrden: string) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: token
    });
    let respuesta: any;

    try {
      //return this.http.post(`http://189.204.141.199:5112/solicitud/postDelSolicitudCompra`, solicitudCompraSisco, { headers: httpHeaders })
      return this.http.post(url, solicitudCompraSisco, { headers: httpHeaders })
        .pipe(map(resp => {


          const parametros = {
            numeroOrden: noOrden,
            partidas: '',
            observaciones: 'Cancelación sisco',
            estatus: 5
          }
          console.log(parametros)
          this.http.post(environment.utl+ 'catalogo/accesorio/ActualizaSolicitudCotizacionAccesorio', parametros, { headers: httpHeaders }).toPromise().then(resp =>{
            respuesta = [resp];
            return respuesta;
          })
         
        }));
    }
    catch (e) {
      console.log(e);
      return e;
    }
  }

  //crea una nueva solicitud de cotizacion en SISCO
  PutAvanzaOrdenEspecifico(solicitudCompraSisco: any, token: string, url: string) {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: token
    });
    let respuesta: any;

    //return this.http.put(`http://189.204.141.199:5112/solicitud/PutAvanzaOrdenEspecifico`, solicitudCompraSisco, { headers: httpHeaders })
    return this.http.put(url, solicitudCompraSisco, { headers: httpHeaders })
      .pipe(map(resp => {
        respuesta = [resp];
        return respuesta;
      }));
  }

  //Logue a SISCO para obtener token de autenticacion
  postSiscoLogin(email: string, password: string, application: number, url: string) {

    let credentials = {
      "credentials": {
        "email": email,
        "password": password
      },
      "application": application
    };
    let respuesta: any;
    console.log(credentials);
    console.log(url);

    return this.http.post(url, credentials)//`http://189.204.141.199:4901/v2/auth/Login`, credentials)
      .pipe(map(resp => {
        respuesta = [resp];
        return respuesta;
      }));
  }
  //OCT 99 Obtiene datos de acceso a SISCO
  getDatosSisco() {
    return this.http.get(`${this.appService.url}catalogo/accesorio/getFlotillasDatosSISCO`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  //guarda la solicitud creada en flotillas
  saveSolicitudSISCOFlotillas(idCotizacion: string, idUsuario: number, solicitudCotizacion: string, idAccesorioNuevo: number, descripcionParte: string, modeloAnio: string, cantidad: number) {
    return this.http.post(`${this.appService.url}catalogo/SolicitudSISCOFlotillas/${idCotizacion}/${idUsuario}/${solicitudCotizacion}/${idAccesorioNuevo}/${descripcionParte}/${modeloAnio}/${cantidad}`, [])
      .pipe(map(resp => {
        return resp;
      }));
  }

  //SISCO
  //api para consumo de sisco
  postActualizaSolicitudCotizacionAccesorio(solicitudSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/ActualizaSolicitudCotizacionAccesorio`, solicitudSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }

  //escenario 3
  guardaSolicitudAccesorioNuevo(solicitudSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/guardaSolicitudAccesorioNuevo`, solicitudSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }
  // SISCO - POSTERIORES/ADICIONALES 20210128
  //escenario 3
  guardaSolicitudAccesorioNuevoPostAd(solicitudSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/guardaSolicitudAccesorioNuevoPostAd`, solicitudSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }

  //escenario 1
  guardaSolicitudAccesorio(solicitudSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/guardaSolicitudAccesorio`, solicitudSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }

  // SISCO - POSTERIORES/ADICIONALES 20210128
  //escenario 1
  guardaSolicitudAccesorioPostAd(solicitudSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/guardaSolicitudAccesorioPostAd`, solicitudSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }

  //escenario 2
  guardaSolicitudAccesorioSISCO(solicitudSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/guardaSolicitudAccesorioSISCO`, solicitudSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }

  // SISCO - POSTERIORES/ADICIONALES 20210128
  //escenario 2
  guardaSolicitudAccesorioSISCOPostAd(solicitudSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/guardaSolicitudAccesorioSISCOPostAd`, solicitudSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }

  //guarda respuesta de SOLICITUD SISCO
  guardaSISCOSolicitudFlotillas(solicitudSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/guardaSISCOSolicitudFlotillas`, solicitudSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }
  
  // CHK 03 Feb 21k - guarda respuesta de SOLICITUD SISCO
  guardaSISCOSolicitudFlotillasPostAd(solicitudSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/guardaSISCOSolicitudFlotillasPostAd`, solicitudSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }
  //elimina accesorio SISCO
  eliminaAccesorioSisco(accesorioSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/eliminaAccesorioSisco`, accesorioSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }
  // SISCO - POSTERIORES/ADICIONALES 20210128
  //elimina accesorio SISCO
  eliminaAccesorioSiscoPostAd(accesorioSisco: any) {
    return this.http.post(`${this.appService.url}catalogo/accesorio/eliminaAccesorioSiscoPostAd`, accesorioSisco)
      .pipe(map(resp => {
        return resp;
      }));
  }

  //obtiene accesorios para ser enviados a SISCO
  getAccesoriosSISCO(idCotizacion: string) {
    return this.http.get(`${this.appService.url}catalogo/accesorio/getAccesoriosSISCO/${idCotizacion}`)
      .pipe(map(resp => {
        return resp;
      }));
  }
  // SISCO - POSTERIORES/ADICIONALES 20210128
  //obtiene accesorios para ser enviados a SISCO
  getAccesoriosSISCOPostAd(idCotizacion: string) {
    return this.http.get(`${this.appService.url}catalogo/accesorio/getAccesoriosSISCOPostAd/${idCotizacion}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

}
