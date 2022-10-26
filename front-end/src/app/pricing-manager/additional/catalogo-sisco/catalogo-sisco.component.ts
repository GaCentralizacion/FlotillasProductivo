import { Component, OnInit, Input } from '@angular/core';
import {
  Cotizacion, PaqueteAccesorios, DetallePaqueteAccesorios, IdTiposProveedor,
  AccesorioSinPaquete, AccesorioNuevo, Proveedor, TipoProveedor, GrupoUnidades,
  Cantidad, AccesorioNuevoUnidad
} from 'src/app/models';
import { PricingService, AccesorioCatalogService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { elementContainerEnd } from '@angular/core/src/render3';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-catalogo-sisco',
  templateUrl: './catalogo-sisco.component.html',
  styleUrls: ['./catalogo-sisco.component.scss']
})

export class CatalogoSiscoComponent implements OnInit {

  @Input() cotizacion: Cotizacion;
  @Input() idGrupoUnidad: number;
  @Input() modalGestoria: boolean;
  @Input() idDetalleUnidad: number;
  @Input() idEscenario: number;
  @Input() filtroDescripcion: string;
  @Input() idProveedor: number;
  @Input() nombreProveedor: string;
  @Input() idAccesorioNuevo: number;

  input = new Cantidad();
  cantidadSeleccionada: any[] = [];
  value: '';
  activeId = 'accesorios';
  tipoOrden = '';

  //SISCO
  accesoriosSisco: any[] = [];
  accesoriosSiscoFiltro: any[] = [];
  searchDescripcion = '';
  accesoriosSiscoAgregar: any[] = [];

  busquedaExterna = false;
  descripcionesBuscar: string[];
  resultadoBusquedaExterna: any[] = [];

  constructor(
    private pricingService: PricingService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private accesorioCatalogService: AccesorioCatalogService) {
  }

  ngOnInit() {
    this.cargaPartidasSisco();
    let grupo: any;
    grupo = this.cotizacion.gruposUnidades.filter(grupo => grupo.idGrupoUnidad === this.idGrupoUnidad);
    this.idDetalleUnidad = grupo[0].cantidad;
  }

  closeModal() {
    this.activeModal.close(false);
  }

  OBJtoXML(obj) {
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += "<" + prop + ">";
          xml += this.OBJtoXML(new Object(obj[prop][array]));
          xml += "</" + prop + ">";
        }
      } else if (typeof obj[prop] == "object") {
        xml += this.OBJtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
  }

  agregar() {
    if (this.modalGestoria) {
      this.agregarCotizacionSiscoPostAd()
    }
    else {
      this.agregarCotizacionSisco();
    }
  }


  agregarCotizacionSisco(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {

      if (!this.busquedaExterna) {
        this.accesoriosSiscoAgregar = this.accesoriosSisco.filter(f => f.cantidad > 0);
      }

      let nuevos: any[] = [];

      if (this.accesoriosSiscoAgregar.length > 0) {
        console.log(this.accesoriosSiscoAgregar);

        this.accesoriosSiscoAgregar.forEach(async (element) => {

          let partida: any;
          if (!this.busquedaExterna)
            partida = (({ Descripción, cantidad, idPartida, noParte, Costo, Venta }) => ({ Descripción, cantidad, idPartida, noParte, Costo, Venta }))(element);
          else
            partida = (({ Descripción, cantidad, idPartida, noParte, Costo, Venta, idAccesorioNuevo, existencia }) => ({ Descripción, cantidad, idPartida, noParte, Costo, Venta, idAccesorioNuevo, existencia }))(element);

          nuevos.push(partida);
        });

        let partidas: string = '<partidas>';
        nuevos.forEach(async (element) => {
          partidas += '<partida>';
          if (this.idEscenario === 1) {

            partidas += '<idProveedor>' + (this.idProveedor == undefined) ? '' : this.idProveedor + '</idProveedor>';
            partidas += '<nombreProveedor>' + (this.nombreProveedor == undefined) ? '' : this.nombreProveedor + '</nombreProveedor>';

            if (!this.busquedaExterna) {
              partidas += '<idAccesorioNuevo>' + this.idAccesorioNuevo + '</idAccesorioNuevo>';
              partidas += '<existencia>0</existencia>';
            }
          }
          else {

            partidas += '<idGrupoUnidad>' + this.idGrupoUnidad + '</idGrupoUnidad>'
              + '<idMarca>' + this.cotizacion.idMarca + '</idMarca>'
              + '<idEmpresa>' + this.cotizacion.idEmpresa + '</idEmpresa>'
              + '<idSucursal>' + this.cotizacion.idSucursal + '</idSucursal>'
              + '<nombreEmpresa>' + this.cotizacion.nombreEmpresa + '</nombreEmpresa>'
              + '<nombreSucursal>' + this.cotizacion.nombreSucursal + '</nombreSucursal>'
              + '<idDireccionFlotillas>' + this.cotizacion.idDireccionFlotillas + '</idDireccionFlotillas>';
          }
          partidas += this.OBJtoXML(element);
          partidas += '</partida>';
        });
        partidas += '</partidas>';
        partidas = partidas.split("Descripción").join("descripcion");//partidas.replace("Descripción","descripcion");
        partidas = partidas.split("Costo").join("costo");
        partidas = partidas.split("Venta").join("venta");
        //partidas = partidas.split("Partida").join("idPartida");//partidas.replace("Partida","idPartida");
        /*
        console.log(nuevos);
        */
        console.log(partidas);
        let solicitudSisco: any;
        if (this.idEscenario === 1) {
          solicitudSisco = {
            "idCotizacion": this.cotizacion.idCotizacion,
            "partidas": partidas,
            "idUsuario": Number(localStorage.getItem('idUsuario')),
            "idGrupoUnidad": this.idGrupoUnidad
          };
        }
        else {
          solicitudSisco = {
            "idCotizacion": this.cotizacion.idCotizacion,
            "partidas": partidas,
            "idUsuario": Number(localStorage.getItem('idUsuario')),
            "comentario": ""
          };
        }

        if (this.idEscenario === 1) {

          this.accesorioCatalogService.guardaSolicitudAccesorio(solicitudSisco).subscribe((resp: any) => {
            if (resp[0].Success === 1) {
              this.toastrService.success(resp[0].Mensaje, 'Accesorios Sisco');
              this.activeModal.close(true);

              resolve([{ Error: false, Mensaje: resp[0].Mensaje }]);
            }
            else {
              this.toastrService.error('Ocurrio un error al agregar: ' + resp[0].Mensaje, 'Accesorios Sisco');
              resolve([{ Error: true, Mensaje: resp[0].Mensaje }]);
            }
          }, (httpError) => {
            const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
            this.toastrService.error(message, 'Accesorios');
            reject([{ Error: true, Mensaje: message }]);
          });
        }
        else {
          this.accesorioCatalogService.guardaSolicitudAccesorioSISCO(solicitudSisco).subscribe((resp: any) => {
            if (resp[0].Success === 1) {
              this.toastrService.success(resp[0].Mensaje, 'Accesorios Sisco');
              this.activeModal.close(true);
            }
            else {
              this.toastrService.error('Ocurrio un error al agregar: ' + resp[0].Mensaje, 'Accesorios Sisco');
            }
          }, (httpError) => {
            const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
            this.toastrService.error(message, 'Accesorios');
          });
        }
      }
      else {
        this.toastrService.warning('No existen elementos con cantidades mayores a 0 para agregar.', 'Accesorios Sisco');
        resolve([{ Error: true, Mensaje: 'No existen elementos con cantidades mayores a 0 para agregar.' }]);
      }
    })
  }
  // SISCO - POSTERIORES/ADICIONALES 20210128
  agregarCotizacionSiscoPostAd(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {

      if (!this.busquedaExterna) {
        this.accesoriosSiscoAgregar = this.accesoriosSisco.filter(f => f.cantidad > 0);
      }

      let nuevos: any[] = [];

      if (this.accesoriosSiscoAgregar.length > 0) {
        console.log(this.accesoriosSiscoAgregar);

        this.accesoriosSiscoAgregar.forEach(async (element) => {

          let partida: any;
          if (!this.busquedaExterna)
            partida = (({ Descripción, cantidad, idPartida, noParte, Costo, Venta }) => ({ Descripción, cantidad, idPartida, noParte, Costo, Venta }))(element);
          else
            partida = (({ Descripción, cantidad, idPartida, noParte, Costo, Venta, idAccesorioNuevo, existencia }) => ({ Descripción, cantidad, idPartida, noParte, Costo, Venta, idAccesorioNuevo, existencia }))(element);

          nuevos.push(partida);
        });

        let partidas: string = '<partidas>';
        nuevos.forEach(async (element) => {
          partidas += '<partida>';
          if (this.idEscenario === 1) {

            partidas += '<idProveedor>' + (this.idProveedor == undefined) ? '' : this.idProveedor + '</idProveedor>';
            partidas += '<nombreProveedor>' + (this.nombreProveedor == undefined) ? '' : this.nombreProveedor + '</nombreProveedor>';

            if (!this.busquedaExterna) {
              partidas += '<idAccesorioNuevo>' + this.idAccesorioNuevo + '</idAccesorioNuevo>';
              partidas += '<existencia>0</existencia>';
            }
          }
          else {

            partidas += '<idGrupoUnidad>' + this.idGrupoUnidad + '</idGrupoUnidad>'
              + '<idMarca>' + this.cotizacion.idMarca + '</idMarca>'
              + '<idEmpresa>' + this.cotizacion.idEmpresa + '</idEmpresa>'
              + '<idSucursal>' + this.cotizacion.idSucursal + '</idSucursal>'
              + '<nombreEmpresa>' + this.cotizacion.nombreEmpresa + '</nombreEmpresa>'
              + '<nombreSucursal>' + this.cotizacion.nombreSucursal + '</nombreSucursal>'
              + '<idDireccionFlotillas>' + this.cotizacion.idDireccionFlotillas + '</idDireccionFlotillas>';
          }
          partidas += this.OBJtoXML(element);
          partidas += '</partida>';
        });
        partidas += '</partidas>';
        partidas = partidas.split("Descripción").join("descripcion");//partidas.replace("Descripción","descripcion");
        partidas = partidas.split("Costo").join("costo");
        partidas = partidas.split("Venta").join("venta");
        //partidas = partidas.split("Partida").join("idPartida");//partidas.replace("Partida","idPartida");
        /*
        console.log(nuevos);
        */
        console.log(partidas);
        let solicitudSisco: any;
        if (this.idEscenario === 1) {
          solicitudSisco = {
            "idCotizacion": this.cotizacion.idCotizacion,
            "partidas": partidas,
            "idUsuario": Number(localStorage.getItem('idUsuario')),
            "idGrupoUnidad": this.idGrupoUnidad
          };
        }
        else {
          solicitudSisco = {
            "idCotizacion": this.cotizacion.idCotizacion,
            "partidas": partidas,
            "idUsuario": Number(localStorage.getItem('idUsuario')),
            "comentario": ""
          };
        }

        if (this.idEscenario === 1) {

          this.accesorioCatalogService.guardaSolicitudAccesorioPostAd(solicitudSisco).subscribe((resp: any) => {
            if (resp[0].Success === 1) {
              this.toastrService.success(resp[0].Mensaje, 'Accesorios Sisco');
              this.activeModal.close(true);

              resolve([{ Error: false, Mensaje: resp[0].Mensaje }]);
            }
            else {
              this.toastrService.error('Ocurrio un error al agregar: ' + resp[0].Mensaje, 'Accesorios Sisco');
              resolve([{ Error: true, Mensaje: resp[0].Mensaje }]);
            }
          }, (httpError) => {
            const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
            this.toastrService.error(message, 'Accesorios');
            reject([{ Error: true, Mensaje: message }]);
          });
        }
        else {
          this.accesorioCatalogService.guardaSolicitudAccesorioSISCOPostAd(solicitudSisco).subscribe((resp: any) => {
            if (resp[0].Success === 1) {
              this.toastrService.success(resp[0].Mensaje, 'Accesorios Sisco');
              this.activeModal.close(true);
            }
            else {
              this.toastrService.error('Ocurrio un error al agregar: ' + resp[0].Mensaje, 'Accesorios Sisco');
            }
          }, (httpError) => {
            const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
            this.toastrService.error(message, 'Accesorios');
          });
        }
      }
      else {
        this.toastrService.warning('No existen elementos con cantidades mayores a 0 para agregar.', 'Accesorios Sisco');
        resolve([{ Error: true, Mensaje: 'No existen elementos con cantidades mayores a 0 para agregar.' }]);
      }
    })
  }

  cargaPartidasSisco() {
    this.accesorioCatalogService.getDatosSisco().subscribe(async (datos) => {

      //this.accesorioCatalogService.postSiscoLogin(datos[0].email, datos[0].password, datos[0].application, datos[0].urlLogin).subscribe(async (aut) => {
      // await this.loginSisco(datos[0].email, datos[0].password, datos[0].application, datos[0].urlLogin).then(async (aut: any[]) => {

          let filtroSisco = {
            "idTipoObjeto": datos[0].idTipoObjeto,
            "numeroContrato": datos[0].numeroContrato,
            "idCliente": datos[0].idCliente,
            "idClase": datos[0].idClase,
            "idTipoSolicitud": datos[0].idTipoSolicitud,
            "idMoneda": datos[0].idMoneda
          };

          let token = environment.tokenSisco;
          //aut[0].data.security.token;
          console.log('filtroSisco');
          console.log(filtroSisco);

          this.accesorioCatalogService.getCatalogoAccesoriosSISCO(filtroSisco, token, datos[0].urlGetPartidas).subscribe(async (resp) => {

            if (resp[0].error === "") {
              this.accesoriosSisco = resp[0].recordsets[0];
              this.accesoriosSiscoFiltro = this.accesoriosSisco;

              //cuando se da click en un accesorio del catalogo y se busca por este
              if (this.idEscenario === 1) {
                if (this.busquedaExterna) {
                  console.log('1');
                  this.descripcionesBuscar.forEach(async (element) => {
                    let accesorio = this.accesoriosSisco.filter(f => f.Descripción === element);
                    this.accesoriosSiscoFiltro.push(accesorio);
                  });
                }
                else
                  this.accesoriosSiscoFiltro = this.accesoriosSisco.filter(f => f.Descripción === this.filtroDescripcion);
              }

              this.accesoriosSiscoFiltro.map((obj) => {
                obj.cantidad = 0;
                return obj;
              })

              if (this.busquedaExterna) {
                this.resultadoBusquedaExterna = [{ Error: '', accesoriosSisco: this.accesoriosSiscoFiltro }];
              }
              else {
                if (this.accesoriosSiscoFiltro.length == 0)
                  this.toastrService.info('No existen partidas en el catalogo de SISCO', 'Catalogo de Partidas SISCO');
                this.accesoriosSiscoFiltro = [...this.accesoriosSiscoFiltro];
              }
            }
            else {
              if (this.busquedaExterna)
                return [{ Error: resp[0].error }];

              this.toastrService.error(resp[0].error, 'Catalogo de Partidas SISCO');
            }

          }, (httpError) => {
            const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
            if (this.busquedaExterna)
              return [{ Error: message }];
            this.toastrService.error(message, 'Catalogo de Partidas SISCO');
          });
        // })//LOGIN SISCO
        // .catch(err => {
        //   let error = JSON.parse(err[0].Error);
        //   this.toastrService.error(error.errors[0].description, 'LOGIN SISCO');
        // });
    });
  }

  filterDescripcion() {
    this.accesoriosSiscoFiltro = Object.assign(this.accesoriosSisco, []);
    if (this.searchDescripcion.length > 0) {
      this.accesoriosSiscoFiltro = this.accesoriosSiscoFiltro.filter(item => {
        if (!item.Descripción) {
          return false;
        }
        if (item.Descripción.toUpperCase().startsWith(this.searchDescripcion.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  /*
  buscaDescripcionCatalogo(descripciones: string[]) {
    this.busquedaExterna = true;
    this.idEscenario = 1;
    this.descripcionesBuscar = descripciones;
    this.cargaPartidasSisco();
    return this.resultadoBusquedaExterna;
  }
  */

  agregaCatalogoSiscoDesdeFuera(accesoriosCatalogoSisco: any[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.busquedaExterna = true;
      this.idEscenario = 1;
      this.accesoriosSiscoAgregar = accesoriosCatalogoSisco;

      this.agregarCotizacionSisco().then((res: any[]) => {
        console.log(res);
        resolve([{ Error: false, Mensaje: 'XXXXXXXXXXX' }]);
      })
        .catch(err => reject([{ Error: true, Mensaje: 'Error al guardar.' }]));

    })
  }

  // SISCO - POSTERIORES/ADICIONALES 20210128
  agregaCatalogoSiscoDesdeFueraPostAd(accesoriosCatalogoSisco: any[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.busquedaExterna = true;
      this.idEscenario = 1;
      this.accesoriosSiscoAgregar = accesoriosCatalogoSisco;

      this.agregarCotizacionSiscoPostAd().then((res: any[]) => {
        console.log(res);
        resolve([{ Error: false, Mensaje: 'XXXXXXXXXXX' }]);
      })
        .catch(err => reject([{ Error: true, Mensaje: 'Error al guardar.' }]));

    })
  }

  // async loginSisco(email, password, application, urlLogin): Promise<any[]> {
  //   return new Promise<any[]>((resolve, reject) => {
  //     this.accesorioCatalogService.postSiscoLogin(email, password, application, urlLogin).subscribe(async (aut) => {
  //       resolve(aut);
  //     }, (httpError) => {
  //       const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
  //       reject([{ Error: message }]);
  //     });
  //   });
  // }

}
