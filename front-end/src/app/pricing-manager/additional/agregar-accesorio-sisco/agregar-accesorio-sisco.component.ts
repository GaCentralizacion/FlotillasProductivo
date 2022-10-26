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

//SISCO
import { SolicitudCotizacionSisco } from 'src/app/models/accesorio.model';

@Component({
  selector: 'app-agregar-accesorio-sisco',
  templateUrl: './agregar-accesorio-sisco.component.html',
  styleUrls: ['./agregar-accesorio-sisco.component.scss']
})

export class AgregarAccesorioSiscoComponent implements OnInit {

  @Input() cotizacion: Cotizacion;
  @Input() idGrupoUnidad: number;
  @Input() versionUnidad: string;
  @Input() modalGestoria: boolean;
  @Input() idDetalleUnidad: number;

  input = new Cantidad();
  cantidadSeleccionada: any[] = [];

  grupoSelected: GrupoUnidades;
  accesoriosSinPaquete: AccesorioSinPaquete;

  proveedores: Proveedor[] = [];
  accesoriosNuevos: any[] = [];

  //SISCO
  solicitudCotizacionSisco: SolicitudCotizacionSisco;
  descripcionNueva = '';
  cantidadNueva = 1;
  guardaDesdeAfuera = false;

  constructor(
    private pricingService: PricingService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private accesorioCatalogService: AccesorioCatalogService) {
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close(false);
  }

  agregar(){
    if(this.modalGestoria){
      this.agregarAccesorioSiscoPostAd();
    }
    else{
      this.agregarAccesorioSisco();
    }
  }

  agregarAccesorioSisco(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {

      if (this.accesoriosNuevos.length > 0) {

        let partidas = '<partidas>';
        this.accesoriosNuevos.forEach(async (element) => {
          partidas += '<partida><idPartida></idPartida><noParte></noParte>'
            + '<idGrupoUnidad>' + this.idGrupoUnidad + '</idGrupoUnidad>'
            + '<idMarca>' + this.cotizacion.idMarca + '</idMarca>'
            + '<idEmpresa>' + this.cotizacion.idEmpresa + '</idEmpresa>'
            + '<idSucursal>' + this.cotizacion.idSucursal + '</idSucursal>'
            + '<nombreEmpresa>' + this.cotizacion.nombreEmpresa + '</nombreEmpresa>'
            + '<nombreSucursal>' + this.cotizacion.nombreSucursal + '</nombreSucursal>';

            if(!element.precioFrm){partidas +='<precioFrm>0.00</precioFrm>';}
            if(!element.idParte){partidas +='<idParte></idParte>';}

            partidas += '<idDireccionFlotillas>' + this.cotizacion.idDireccionFlotillas + '</idDireccionFlotillas>';
          partidas += this.OBJtoXML(element);
          partidas += '</partida>';
        });
        partidas += '</partidas>';

        let solicitudSisco = {
          "idCotizacion": this.cotizacion.idCotizacion,
          "partidas": partidas,
          "comentario": "",
          "idUsuario": Number(localStorage.getItem('idUsuario'))
        }

        this.accesorioCatalogService.guardaSolicitudAccesorioNuevo(solicitudSisco).subscribe((resp: any) => {
          if (resp[0].Success === 1) {
            if (!this.guardaDesdeAfuera) {              
              this.accesoriosNuevos = [];
              this.activeModal.close(true);
            }
            this.toastrService.success(resp[0].Mensaje, 'Accesorios Sisco');
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
        this.toastrService.warning('No existen elementos para agregar.', 'Accesorios Sisco');
        resolve([{ Error: true, Mensaje: 'No existen elementos para agregar.' }]);
      }

    })
  }

  addPartida() {
    this.accesoriosNuevos.push({ 'cantidad': this.cantidadNueva, 'descripcion': this.descripcionNueva });
    this.accesoriosNuevos = [...this.accesoriosNuevos];
    this.cantidadNueva = 1;
    this.descripcionNueva = '';
  }

  eliminaPartida(rowIndex) {

    this.accesoriosNuevos.splice(rowIndex, 1);
    this.accesoriosNuevos = [...this.accesoriosNuevos];
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


  agregarExterno(acceSoriosSisco: any[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {

      this.guardaDesdeAfuera = true;
      this.accesoriosNuevos = acceSoriosSisco;

      this.agregarAccesorioSisco().then((res: any[]) => {
        resolve([{ Error: false, Mensaje: 'XXXXXXXXXXX' }]);
      })
        .catch(err => reject([{ Error: true, Mensaje: 'Error al guardar.' }]));

    })
  }

  // SISCO - POSTERIORES/ADICIONALES 20210128
  agregarExternoPostAd(acceSoriosSisco: any[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {

      this.guardaDesdeAfuera = true;
      this.accesoriosNuevos = acceSoriosSisco;

      this.agregarAccesorioSiscoPostAd().then((res: any[]) => {
        resolve([{ Error: false, Mensaje: 'XXXXXXXXXXX' }]);
      })
        .catch(err => reject([{ Error: true, Mensaje: 'Error al guardar.' }]));

    })
  }
  // SISCO - POSTERIORES/ADICIONALES 20210128
  agregarAccesorioSiscoPostAd(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {

      if (this.accesoriosNuevos.length > 0) {

        let partidas = '<partidas>';
        this.accesoriosNuevos.forEach(async (element) => {
          partidas += '<partida><idPartida></idPartida><noParte></noParte>'
            + '<idGrupoUnidad>' + this.idGrupoUnidad + '</idGrupoUnidad>'
            + '<idMarca>' + this.cotizacion.idMarca + '</idMarca>'
            + '<idEmpresa>' + this.cotizacion.idEmpresa + '</idEmpresa>'
            + '<idSucursal>' + this.cotizacion.idSucursal + '</idSucursal>'
            + '<nombreEmpresa>' + this.cotizacion.nombreEmpresa + '</nombreEmpresa>'
            + '<nombreSucursal>' + this.cotizacion.nombreSucursal + '</nombreSucursal>';

            if(!element.precioFrm){partidas +='<precioFrm>0.00</precioFrm>';}
            if(!element.idParte){partidas +='<idParte></idParte>';}

            partidas += '<idDireccionFlotillas>' + this.cotizacion.idDireccionFlotillas + '</idDireccionFlotillas>';
          partidas += this.OBJtoXML(element);
          partidas += '</partida>';
        });
        partidas += '</partidas>';

        let solicitudSisco = {
          "idCotizacion": this.cotizacion.idCotizacion,
          "partidas": partidas,
          "comentario": "",
          "idUsuario": Number(localStorage.getItem('idUsuario'))
        }

        this.accesorioCatalogService.guardaSolicitudAccesorioNuevoPostAd(solicitudSisco).subscribe((resp: any) => {
          if (resp[0].Success === 1) {
            if (!this.guardaDesdeAfuera) {              
              this.accesoriosNuevos = [];
              this.activeModal.close(true);
            }
            this.toastrService.success(resp[0].Mensaje, 'Accesorios Sisco');
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
        this.toastrService.warning('No existen elementos para agregar.', 'Accesorios Sisco');
        resolve([{ Error: true, Mensaje: 'No existen elementos para agregar.' }]);
      }

    })
  }

}
