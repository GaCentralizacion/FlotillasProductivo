import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PricingService, TramiteCatalogService } from 'src/app/services';
import { Cotizacion, TramiteUnidad, AccesorioNuevoUnidad, ServicioUnidadSinPaqueteUnidad, Tramite, Subtramite, ProveedorAdicional } from 'src/app/models';

import {AgregarEditarAccesoriosGrupalComponent} from 'src/app/pricing-manager/additional/agregar-editar-accesorios-grupal/agregar-editar-accesorios-grupal.component';
import {AgregarEditarServicioUnidadGrupalComponent} from 'src/app/pricing-manager/additional/agregar-editar-servicio-unidad-grupal/agregar-editar-servicio-unidad-grupal.component';
import {AgregarEditarTramitesGrupalComponent} from 'src/app/pricing-manager/additional/agregar-editar-tramites-grupal/agregar-editar-tramites-grupal.component';
import { PricingManagerService } from 'src/app/pricing-manager/pricing.manager.service';
import { ConfiguraTipoOrdenAdicionalesComponent } from 'src/app/pricing-manager/additional/configura-tipo-orden-adicionales/configura-tipo-orden-adicionales.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fleet-adicionales-grupal',
  templateUrl: './fleet.adicionales-grupal.component.html',
  styleUrls: ['./fleet.adicionales-grupal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PricingManagerService]
})
export class FleetAdicionalesGrupalComponent implements OnInit {

  @Input() detalleUnidad: any;
  @Input() versionUnidad: string;
  @Input() isFacturado: boolean;


  paquetesTramites: any;
  tramitesSinPaquete: any[];
  paquetesTramitesMovs: any;
  tramitesSinPaqueteMovs: any[];
  paquetesAccesorios: any[];
  accesoriosSinPaquete: any[];
  paquetesAccesoriosMovs: any[];
  accesoriosSinPaqueteMovs: any[];
  paquetesServicioUnidad: any;
  serviciosUnidadSinPaquete: any[];
  paquetesServicioUnidadMovs: any;
  serviciosUnidadSinPaqueteMovs: any[];
  cotizacion: Cotizacion;
  idGrupoUnidad: number;
  itemToDelete: any;
  itemEdit: any;
  modalDelete: string;
  tabSelected: string;
  unidad;
  cantidad: number;
  isLoading = true;

  //OCT99
  //cotizacionUG: Cotizacion;
  //unidadesInteresesUG: GrupoUnidadesUnidadInteres[];
  accesoriosUG: any;
  tramitesUG: any;
  serviciosUnidadUG: any;
  accesoriosMovUG: any;
  tramitesMovUG: any;
  serviciosUnidadMovUG: any;
  modalDeleteAccesorios: any;
  modalEditTramites:any;

  tramitesCoal: any;
  tramiteSelected: Tramite;
  subtramites: Subtramite[];
  subtramiteSelected: Subtramite;
  formTramites:FormGroup;
  idTramiteSelect: any;
  tramiteString: String;
  proveedores: ProveedorAdicional[];
  idSubtramiteSelect:number;
  proveedoresSelected: ProveedorAdicional[] = [];
  precioEditado = 0;
  costoEditado = 0;

  subtramiteSelectedOld: number;
  subtramiteSelectedNew: number;
  subtramiteNgSelect: number;

  // @ViewChild('ngSelectTramite') ngSelectTramite: NgSelectComponent;
  // @ViewChild('subtramiteNgSelect') subtramiteNgSelect: NgSelectComponent;

  constructor(
    private activeModal: NgbActiveModal,
    private toasterService: ToastrService,
    private pricingService: PricingService,
    private modalService: NgbModal,
    public pricingManagerService: PricingManagerService,
    private tramitesService: TramiteCatalogService
  ) {

    this.formTramites = new FormGroup({
      Tramite: new FormControl(''),
      Subtramite: new FormControl('')
    });

  }

  ngOnInit() {
    this.pricingService.getPricingById(this.detalleUnidad.idCotizacion)
      .subscribe((cotizacion: any) => {
        if (cotizacion) {
          this.cotizacion = cotizacion;
          //OCT99 GESTION
          this.pricingService.getAdicionalesGestionbyGrupal(this.cotizacion.idCotizacion, this.detalleUnidad.idGrupoUnidad).subscribe((adicionales: any) => {
            this.accesoriosUG = adicionales[0];
            this.tramitesUG = adicionales[1];
            this.serviciosUnidadUG = adicionales[2];
            this.accesoriosMovUG = adicionales[3];
            this.tramitesMovUG = adicionales[1];
            this.serviciosUnidadMovUG = adicionales[2];
            this.carga();
          });
        }
      });
  }


  openModalCambioProveedor(deleteTemplate: any, itemToEdit: any, modal) {
    this.tramitesService.getTramites(this.cotizacion.idMarca, this.cotizacion.idSucursal,this.cotizacion.idDireccionFlotillas).subscribe((v_tramites: any) => {
      this.tramitesCoal=v_tramites.filter(x=> x.idTramite===itemToEdit.id)
      this.tramiteString=this.tramitesCoal[0].nombre
      this.tramiteOnChange(this.tramitesCoal[0],parseInt(itemToEdit.idSubtramite))
    });
    this.modalEditTramites=this.modalService.open(deleteTemplate, { size: 'lg' });
  }

  tramiteOnChange(tramite: Tramite,idSubtramite:number) {
    this.tramiteSelected = tramite;
    if (this.subtramiteSelectedOld === undefined){
      this.subtramiteSelectedOld = idSubtramite;
    }

    this.proveedores = [];
    if (tramite != undefined) {
      this.tramitesService.getSubtramites(this.cotizacion.idMarca,this.cotizacion.idSucursal,this.tramiteSelected.idTramite)
      .subscribe((subtramites: Subtramite[]) => {
        this.subtramites = subtramites;
        this.idSubtramiteSelect=idSubtramite
        this.formTramites.controls.Subtramite.setValue(idSubtramite)
        this.subtramiteOnChange();
      });
    }
  }


  subtramiteOnChange() {
    this.proveedores = [];
      this.tramitesService.getProveedorSubtramite(this.cotizacion.idMarca,this.cotizacion.idSucursal,String(this.idSubtramiteSelect)).subscribe((proveedores: ProveedorAdicional[]) => {
          this.proveedores = proveedores;
          console.log(this.proveedores);
          this.proveedoresSelected = [];
          this.precioEditado = this.proveedores[0].precio;
          this.costoEditado = this.proveedores[0].costo;
          this.subtramiteSelectedNew = this.idSubtramiteSelect
        });
  }

  guardarCambioProveedor() {
    if (this.costoEditado == 0 || this.costoEditado == null || this.costoEditado == undefined) {
      this.toasterService.warning(`Debe capturar un costo diferente de 0.`, `Validación de Tramite`);
      return true;
    }
    this.guardarTramite();
  }

  guardarTramite(){
    const tramiteUnico = {
      tipo: '1', //TRAMITES
      idCotizacion: this.cotizacion.idCotizacion,
      idTramite:  this.tramitesCoal[0].idTramite,
      idSubtramiteOld: this.subtramiteSelectedOld,
      proveedorNew: this.proveedoresSelected[0].idProveedor,
      importeNew: this.precioEditado,//this.proveedoresSelected[0].precio,
      idSubtramiteNew: this.subtramiteSelectedNew,
   }

    this.pricingService.saveCambioDeProveedor(tramiteUnico).subscribe(res=>{
      this.toasterService.success("se guardo correctamente","Trámites y Gestión")
      },(httpError)=> {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
    this.toasterService.error(message, 'Trámites y Gestión');
    }),
    this.modalEditTramites.close(true);
  }



  isDeleteTramites(tra) {
    if (!this.paquetesTramitesMovs) {
      return false;
    }
    let isDeleteB = false;
    this.paquetesTramitesMovs.forEach(item => {
      if (item.idEncPaqueteTramite === tra.idEncPaqueteTramite && item.tipoMovimiento === 'B') {
        isDeleteB = true;
      }
    });
    return isDeleteB;
  }

  isDeleteServicios(tra) {
    if (!this.paquetesServicioUnidadMovs) {
      return false;
    }
    let isDeleteB = false;
    this.paquetesServicioUnidadMovs.forEach(item => {
      if (item.idEncPaqueteServicioUnidad === tra.idEncPaqueteServicioUnidad && item.tipoMovimiento === 'B') {
        isDeleteB = true;
      }
    });
    return isDeleteB;
  }

  isDeleteTramitesUni(tra) {
    if (!this.tramitesSinPaqueteMovs) {
      return false;
    }
    let isDeleteB = false;
    this.tramitesSinPaqueteMovs.forEach(item => {
      if (item.id === tra.id && item.tipoMovimiento === 'B') {
        isDeleteB = true;
      }
    });
    return isDeleteB;
  }

  isDeleteServiciosUni(tra) {
    return false;
  }


  isDeletePaq(paq) {
    if (!this.paquetesAccesoriosMovs) {
      return false;
    }
    let isDeleteB = false;
    this.paquetesAccesoriosMovs.forEach(item => {
      if (item.idEncPaqueteAccesorio === paq.idEncPaqueteAccesorio && item.tipoMovimiento === 'B') {
        isDeleteB = true;
      }
    });
    return isDeleteB;
  }

  isDelete(paquete) {
    if (!this.accesoriosSinPaqueteMovs) {
      return false;
    }
    let isDeleteB = false;
    this.accesoriosSinPaqueteMovs.forEach(item => {
      if (item.idParte === paquete.idParte && item.tipoMovimiento === 'B') {
        isDeleteB = true;
      }
    });
    return isDeleteB;
  }
  // INSERTA TRAMITES, ACCESORIOS Y OR SERV ADICIONALES
  // Funcion para Agregar Utilidad
  carga() {
    let grupoSeleccionado = this.cotizacion.gruposUnidades.filter(f => f.idGrupoUnidad === this.detalleUnidad.idGrupoUnidad);
    this.idGrupoUnidad = this.detalleUnidad.idGrupoUnidad;
    this.unidad = grupoSeleccionado[0]
      .detalleUnidades.filter(f => f.idDetalleUnidad === this.detalleUnidad.idDetalleUnidad);

    // Funcion para Agregar Utilidad
    if (this.tabSelected === undefined) {
      this.tabSelected = 'tramites'
    }
    if (this.tabSelected === 'tramites') {
      this.cargaTramites();
        // Tramites Utilidad - EHJ-COAL
        this.pricingService.insertaBitacoraUtilidadAdicionales(this.cotizacion.idCotizacion, 14 )
        .subscribe((valida: any) => {
          if (valida[0].Success !== 1) {
          // Se inserto Utilidad
          }
        });
    } else if (this.tabSelected === 'accesorios') {
      this.cargaAccesorios();
        // Accesorios Utilidad - EHJ-COAL
        this.pricingService.insertaBitacoraUtilidadAdicionales(this.cotizacion.idCotizacion, 13 )
        .subscribe((valida: any) => {
          if (valida[0].Success !== 1) {
          // Se inserto Utilidad
          }
        });
    } else if (this.tabSelected === 'servicios') {
      this.cargaServicios();
       // Accesorios Utilidad - EHJ-COAL
       this.pricingService.insertaBitacoraUtilidadAdicionales(this.cotizacion.idCotizacion, 15 )
       .subscribe((valida: any) => {
         if (valida[0].Success !== 1) {
         // Se inserto Utilidad
         }
       });
    }
  }

  cargaTramites() {
    this.paquetesTramites = [];
    this.tramitesSinPaquete = [];
    this.paquetesTramitesMovs = [];
    this.tramitesSinPaqueteMovs = [];
    //OCT99
    //this.unidad[0].tramites.forEach(element => {
    this.tramitesUG.forEach(element => {
      if (element.idEncPaqueteTramite !== null) {
        if (this.paquetesTramites.find(f => f.idEncPaqueteTramite === element.idEncPaqueteTramite)) {
          const index = this.paquetesTramites.findIndex(f => f.idEncPaqueteTramite === element.idEncPaqueteTramite);
          this.paquetesTramites[index].precioTotal = this.paquetesTramites[index].precioTotal + element.precio;
          this.paquetesTramites[index].cantidad = this.paquetesTramites[index].cantidad + 1;
          this.paquetesTramites[index].nombresDetalle = this.paquetesTramites[index].nombresDetalle + ', ' + element.nombreTramite;

        } else {
          this.paquetesTramites.push({
            nombre: element.nombreTramite, descripcion: element.nombreSubtramite, precioTotal: element.precio, id: element.idTramite,
            idEncPaqueteTramite: element.idEncPaqueteTramite, cantidad: 1, idProveedor: element.idProveedor, costo: element.costo,
            idSubtramite: element.idSubtramite, nombreProveedor: element.nombreProveedor, nombresDetalle: element.nombreTramite
          });
        }

      } else {
        //if(element.estatusBPRO === true && element.tipoMovimiento != 'B')
        if (element.Verifica != null && element.tipoMovimiento != 'B')
          this.tramitesSinPaquete.push({
            id: element.idTramite, nombreSubtramite: element.nombreSubtramite, idProveedor: element.idProveedor,
            precio: element.precio, nombreTramite: element.nombreTramite, idEncPaqueteTramite: element.idEncPaqueteTramite,
            costo: element.costo, idSubtramite: element.idSubtramite, nombreProveedor: element.nombreProveedor,
            cancelado: element.cancelado, cantidad: element.cantidad,cambiaProveedor: element.cambiaProveedor
          });
      }
    });
    //OCT99
    //if (this.unidad[0].tramitesMov.length > 0) {
    //this.unidad[0].tramitesMov.forEach(element => {
    if (this.tramitesMovUG.length > 0) {
      this.tramitesMovUG.forEach(element => {
        //if (element.estatusBPRO === false) {
        if (element.Verifica === null) {
          if (element.idEncPaqueteTramite !== null) {
            this.paquetesTramitesMovs.push({
              nombre: element.nombreTramite, descripcion: element.nombreSubtramite, precioTotal: element.precio,
              idEncPaqueteTramite: element.idEncPaqueteTramite, cantidad: 1, idProveedor: element.idProveedor, costo: element.costo,
              idSubtramite: element.idSubtramite, nombreProveedor: element.nombreProveedor, id: element.idTramite,
              tipoMovimiento: element.tipoMovimiento
            });
          } else {
            this.tramitesSinPaqueteMovs.push({
              id: element.idTramite, nombreSubtramite: element.nombreSubtramite, idProveedor: element.idProveedor,
              precio: element.precio, nombreTramite: element.nombreTramite, idEncPaqueteTramite: element.idEncPaqueteTramite,
              costo: element.costo, idSubtramite: element.idSubtramite, nombreProveedor: element.nombreProveedor,
              tipoMovimiento: element.tipoMovimiento, cantidad: element.cantidad,cambiaProveedor: element.cambiaProveedor
            });
          }
        }
      });
    }

    this.isLoading = false;

  }

  cargaAccesorios() {
    this.paquetesAccesorios = [];
    this.accesoriosSinPaquete = [];
    this.paquetesAccesoriosMovs = [];
    this.accesoriosSinPaqueteMovs = [];
    //OCT99
    //this.unidad[0].accesorios.forEach(element => {
    this.accesoriosUG.forEach(element => {
      this.accesoriosSinPaquete.push({
        cantidad: element.cantidad, idAccesorioNuevo: element.idAccesorioNuevo, idDetPaqueteAccesorio: element.idDetPaqueteAccesorio,
        nombre: element.nombre, precio: element.precio, idEncPaqueteAccesorio: element.idEncPaqueteAccesorio,
        idTipoProveedor: element.idTipoProveedor, idProveedor: element.idProveedor, nombreProveedor: element.nombreProveedor,
        idParte: element.idParte, modeloAnio: element.modeloAnio, costo: element.costo, tipoMovimiento: element.tipoMovimiento
      });
      /*
      if (element.idEncPaqueteAccesorio !== null) {
        if (this.paquetesAccesorios.find(f => f.idEncPaqueteAccesorio === element.idEncPaqueteAccesorio)) {
          const index = this.paquetesAccesorios.findIndex(f => f.idEncPaqueteAccesorio === element.idEncPaqueteAccesorio);
          this.paquetesAccesorios[index].precioTotal = this.paquetesAccesorios[index].precioTotal + element.precio;
          this.paquetesAccesorios[index].cantidad = this.paquetesAccesorios[index].cantidad + element.cantidad;
          this.paquetesAccesorios[index].descripcion = this.paquetesAccesorios[index].descripcion + ', ' + element.idParte;
          this.paquetesAccesorios[index].nombresDetalle = this.paquetesAccesorios[index].nombresDetalle + ', ' + element.nombre;

        } else {

          this.paquetesAccesorios.push({
            cantidad: element.cantidad, precioTotal: element.precio, descripcion: element.idParte,
            nombre: element.nombre, idEncPaqueteAccesorio: element.idEncPaqueteAccesorio,
            idDetPaqueteAccesorio: element.idDetPaqueteAccesorio,
            idTipoProveedor: element.idTipoProveedor, idProveedor: element.IdProveedor, nombreProveedor: element.nombreProveedor,
            idParte: element.idParte, modeloAnio: element.modeloAnio, costo: element.costo,
            nombresDetalle: element.nombre
          });
        }

      } else {
        if (element.estatusBPRO === true && element.tipoMovimiento != 'B')
          this.accesoriosSinPaquete.push({
            cantidad: element.cantidad, idAccesorioNuevo: element.idAccesorioNuevo, idDetPaqueteAccesorio: element.idDetPaqueteAccesorio,
            nombre: element.nombre, precio: element.precio, idEncPaqueteAccesorio: element.idEncPaqueteAccesorio,
            idTipoProveedor: element.idTipoProveedor, idProveedor: element.idProveedor, nombreProveedor: element.nombreProveedor,
            idParte: element.idParte, modeloAnio: element.modeloAnio, costo: element.costo, tipoMovimiento: element.tipoMovimiento
          });
      }*/
    });
    //OCT99
    //if (this.unidad[0].accesoriosMov.length > 0) {
    //this.unidad[0].accesoriosMov.forEach(element => {
    if (this.accesoriosMovUG.length > 0) {
        this.accesoriosMovUG.forEach(element => {
          this.accesoriosSinPaqueteMovs.push({
            cantidad: element.cantidad, idAccesorioNuevo: element.idAccesorioNuevo, idDetPaqueteAccesorio: element.idDetPaqueteAccesorio,
            nombre: element.nombre, precio: element.precio, idEncPaqueteAccesorio: element.idEncPaqueteAccesorio,
            idTipoProveedor: element.idTipoProveedor, idProveedor: element.IdProveedor, nombreProveedor: element.nombreProveedor,
            idParte: element.idParte, modeloAnio: element.modeloAnio, costo: element.costo,
            tipoMovimiento: element.tipoMovimiento, enCompras: element.enCompras, tipoOrden: element.tipoOrden,
            estatusSolicitud: element.estatusSolicitud, observaciones: element.observaciones, existencia: element.existencia,
            nEstatus: element.nEstatus
        });
        /*
        if (element.estatusBPRO === false) {
          if (element.idEncPaqueteAccesorio !== null) {
            this.paquetesAccesoriosMovs.push({
              cantidad: element.cantidad, precioTotal: element.precio, descripcion: element.idParte,
              nombre: element.nombre, idEncPaqueteAccesorio: element.idEncPaqueteAccesorio,
              idDetPaqueteAccesorio: element.idDetPaqueteAccesorio,
              idTipoProveedor: element.idTipoProveedor, idProveedor: element.IdProveedor, nombreProveedor: element.nombreProveedor,
              idParte: element.idParte, modeloAnio: element.modeloAnio, costo: element.costo,
              tipoMovimiento: element.tipoMovimiento
            });
          } else {
            this.accesoriosSinPaqueteMovs.push({
              cantidad: element.cantidad, idAccesorioNuevo: element.idAccesorioNuevo, idDetPaqueteAccesorio: element.idDetPaqueteAccesorio,
              nombre: element.nombre, precio: element.precio, idEncPaqueteAccesorio: element.idEncPaqueteAccesorio,
              idTipoProveedor: element.idTipoProveedor, idProveedor: element.IdProveedor, nombreProveedor: element.nombreProveedor,
              idParte: element.idParte, modeloAnio: element.modeloAnio, costo: element.costo,
              tipoMovimiento: element.tipoMovimiento, enCompras: element.enCompras, tipoOrden: element.tipoOrden,
              estatusSolicitud: element.estatusSolicitud, observaciones: element.observaciones, existencia: element.existencia,
              nEstatus: element.nEstatus
            });
          }
        }*/
      });
    }

  }

  cargaServicios() {
    this.paquetesServicioUnidad = [];
    this.serviciosUnidadSinPaquete = [];
    this.paquetesServicioUnidadMovs = [];
    this.serviciosUnidadSinPaqueteMovs = [];
    //OCT99
    //this.unidad[0].serviciosUnidad.forEach(element => {
    this.serviciosUnidadUG.forEach(element => {
      if (element.idEncPaqueteServicioUnidad !== null) {
        if (this.paquetesServicioUnidad.find(f => f.idEncPaqueteServicioUnidad === element.idEncPaqueteServicioUnidad)) {
          const index = this.paquetesServicioUnidad.findIndex(f => f.idEncPaqueteServicioUnidad === element.idEncPaqueteServicioUnidad);
          this.paquetesServicioUnidad[index].cantidad = this.paquetesServicioUnidad[index].cantidad + 1;
          this.paquetesServicioUnidad[index].descripcion = this.paquetesServicioUnidad[index].descripcion + ',' + element.catalogo;
          this.paquetesServicioUnidad[index].precioTotal = this.paquetesServicioUnidad[index].precioTotal + element.precio;
          this.paquetesServicioUnidad[index].nombresDetalle = this.paquetesServicioUnidad[index].nombresDetalle + ', ' + element.nombre;
        } else {
          this.paquetesServicioUnidad.push({
            cantidad: 1, descripcion: element.catalogo, precioTotal: element.precio, nombre: element.nombre,
            idEncPaqueteServicioUnidad: element.idEncPaqueteServicioUnidad,
            anio: element.anio, catalogo: element.catalogo, costo: element.costo, nombresDetalle: element.nombre
          });
        }
      } else {
        //if (element.estatusBPRO === true && element.tipoMovimiento != 'B')
        if (element.Verifica != null && element.tipoMovimiento != 'B')
          this.serviciosUnidadSinPaquete.push({
            idServicioUnidad: element.idServicioUnidad, descripcion: element.catalogo, precioTotal: element.precio, nombre: element.nombre,
            anio: element.anio, catalogo: element.catalogo, costo: element.costo, cantidad: element.cantidad
          });
      }
    });

    //OCT99
    //if (this.unidad[0].serviciosUnidadMov.length > 0) {
    //  this.unidad[0].serviciosUnidadMov.forEach(element => {
    if (this.serviciosUnidadMovUG.length > 0) {
      this.serviciosUnidadMovUG.forEach(element => {
        //if (element.estatusBPRO === false) {
        if (element.Verifica == null) {
          if (element.idEncPaqueteServicioUnidad !== null) {
            this.paquetesServicioUnidadMovs.push({
              cantidad: 1, descripcion: element.catalogo, precioTotal: element.precio, nombre: element.nombre,
              idEncPaqueteServicioUnidad: element.idEncPaqueteServicioUnidad,
              anio: element.anio, catalogo: element.catalogo, costo: element.costo, tipoMovimiento: element.tipoMovimiento
            });
          } else {
            this.serviciosUnidadSinPaqueteMovs.push({
              idServicioUnidad: element.idServicioUnidad, descripcion: element.catalogo, precioTotal: element.precio,
              nombre: element.nombre, anio: element.anio, catalogo: element.catalogo, costo: element.costo,
              tipoMovimiento: element.tipoMovimiento
            });
          }
        }
      });
    }
  }

  openModalDelete(deleteTemplate: any, itemToDelete: any, modal) {

    if (this.isDelete(itemToDelete) && itemToDelete.idEncPaqueteAccesorio == null && modal === 'accesorios') {
      return;
    } else if (this.isDeletePaq(itemToDelete) && modal === 'accesorios') {
      return;
    } else if (this.isDeleteTramitesUni(itemToDelete) && itemToDelete.idEncPaqueteTramite == null && modal === 'tramites') {
      return;
    } else if (this.isDeleteTramites(itemToDelete) && modal === 'tramites') {
      return;
    } else if (this.isDeleteServiciosUni(itemToDelete) && itemToDelete.idEncPaqueteServicioUnidad == null && modal === 'servicios') {
      return;
    } else if (this.isDeleteServicios(itemToDelete) && modal === 'servicios') {
      return;
    }
    this.modalDelete = modal;
    this.itemToDelete = itemToDelete;
    //this.modalService.open(deleteTemplate);

    this.modalDeleteAccesorios = this.modalService.open(deleteTemplate, { size: 'lg' });
    /*
    this.modalDeleteAccesorios.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.toasterService.success('Accesorios Configurados', 'Cotización');
        this.ngOnInit();
      }
    });
    */
  }

  openModalEdit(editTemplate: any, itemEdit: any) {
    if (this.isDelete(itemEdit) && itemEdit.idEncPaqueteAccesorio == null) {
      return;
    } else if (this.isDeletePaq(itemEdit)) {
      return;
    }
    this.itemEdit = itemEdit;
    this.modalService.open(editTemplate, { size: 'sm' });
  }

  openModalPaquetes() {
    const modalTramites = this.modalService.open(AgregarEditarTramitesGrupalComponent, { size: 'lg' });
    modalTramites.componentInstance.idGrupoUnidad = this.idGrupoUnidad;
    modalTramites.componentInstance.cotizacion = this.cotizacion;
    modalTramites.componentInstance.modalGestoria = true;
    //modalTramites.componentInstance.idDetalleUnidad = this.detalleUnidad.idDetalleUnidad;

    modalTramites.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.toasterService.success('Trámites y Gestión configurados', 'Cotización');
        this.ngOnInit();
      }
    });

  }

  openModalAccesorios() {
    const modalAccesorios = this.modalService.open(AgregarEditarAccesoriosGrupalComponent, { size: 'lg' });
    modalAccesorios.componentInstance.idGrupoUnidad = this.idGrupoUnidad;
    modalAccesorios.componentInstance.cotizacion = this.cotizacion;
    modalAccesorios.componentInstance.modalGestoria = true;
    modalAccesorios.componentInstance.idDetalleUnidad = this.detalleUnidad.idDetalleUnidad;
    modalAccesorios.componentInstance.versionUnidad = this.versionUnidad;
    modalAccesorios.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.toasterService.success('Accesorios configurados', 'Cotización');
        this.ngOnInit();
      }
    });

  }

  openModalServicios() {
    const modalServicios = this.modalService.open(AgregarEditarServicioUnidadGrupalComponent, { size: 'lg' });
    modalServicios.componentInstance.idGrupoUnidad = this.idGrupoUnidad;
    modalServicios.componentInstance.cotizacion = this.cotizacion;
    modalServicios.componentInstance.modalGestoria = true;
    modalServicios.componentInstance.idDetalleUnidad = this.detalleUnidad.idDetalleUnidad;
    modalServicios.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.toasterService.success('Órdenes de servicio configurados', 'Cotización');
        this.ngOnInit();
      }
    });
  }

  cancel() {
    this.activeModal.close(false);
  }
 // Funcion para Eliminar Utilidad
  deleteItem(tipoMovimiento) {
    if (this.modalDelete === 'tramites') {
      this.deleteTramite(tipoMovimiento);
       this.pricingService.insertaBitacoraUtilidadAdicionales(this.cotizacion.idCotizacion, 24 )
        .subscribe((valida: any) => {
          if (valida[0].Success !== 1) {
            // Se inserto Utilidad
          }
        });
    } else if (this.modalDelete === 'accesorios') {
      this.deleteAccesorios(tipoMovimiento);
      // Se agrego Validacion de existenia OK
      this.pricingService.insertaBitacoraUtilidadAdicionales(this.cotizacion.idCotizacion, 23 )
        .subscribe((valida: any) => {
          if (valida[0].Success !== 1) {
            // Se inserto Utilidad
          }
        });
    } else if (this.modalDelete === 'servicios') {
      this.deleteServicios(tipoMovimiento);
       // Se agrego Validacion de existenia OK
       this.pricingService.insertaBitacoraUtilidadAdicionales(this.cotizacion.idCotizacion, 25 )
       .subscribe((valida: any) => {
         if (valida[0].Success !== 1) {
           // Se inserto Utilidad
         }
       });
    }
  }

  deleteTramite(tipoMovimiento) {
    const requestTramite = {
      idCotizacion: this.cotizacion.idCotizacion,
      idGrupoUnidad: this.idGrupoUnidad,
      idDetalleUnidad: this.detalleUnidad.idDetalleUnidad,
      idTramite: this.itemToDelete.id,
      vin: this.detalleUnidad.vin,
      idSubtramite: this.itemToDelete.idSubtramite
    };

    /*
    if (this.cotizacion.status === 'PEDIDO GENERADO') {
      this.pricingService.cancelarTramiteDePedido(requestTramite).subscribe( res => {
        this.modalService.dismissAll();
        this.toasterService.success('Trámites eliminados', 'Cotización');
       });
      return;
    }

    if (this.detalleUnidad.vin == null ) {
       this.pricingService.cancelarTramiteSinVin(requestTramite).subscribe( res => {
          console.log(res);
       });
       this.modalService.dismissAll();
       this.toasterService.success('Trámites eliminados', 'Cotización');
       return;
    }
    */
    const tramites = [];

    const tramite = {
      idCotizacion: this.cotizacion.idCotizacion,
      idGrupoUnidad: this.idGrupoUnidad,
      idDetalleUnidad: this.detalleUnidad.idDetalleUnidad,
      idEncPaqueteTramite: this.itemToDelete.idEncPaqueteTramite,
      idTramite: this.itemToDelete.id,
      idSubtramite: this.itemToDelete.idSubtramite,
      idProveedor: this.itemToDelete.idProveedor,
      nombreTramite: this.itemToDelete.nombreTramite ? this.itemToDelete.nombreTramite : this.itemToDelete.nombre,
      nombreSubtramite: this.itemToDelete.nombreSubtramite ? this.itemToDelete.nombreSubtramite : this.itemToDelete.descripcion,
      nombreProveedor: this.itemToDelete.nombreProveedor,
      costo: this.itemToDelete.costo,
      precio: this.itemToDelete.precio ? this.itemToDelete.precio : this.itemToDelete.precioTotal,
      tipoMovimiento: 'A',
      idUsuarioModificacion: 0,
      fechaModificacion: new Date(),
    } as TramiteUnidad;
    tramites.push(tramite);

    this.pricingService.deleteCotizacionUnidadTramiteGrupal(this.cotizacion.idCotizacion,
      this.idGrupoUnidad, this.detalleUnidad.idDetalleUnidad, tramites).subscribe(() => {
        this.modalService.dismissAll();
        this.toasterService.success('Trámites eliminados', 'Cotización');
      }, (httpError) => {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
        this.toasterService.error(message, 'Trámites y Gestión');
      });

  }

  editItem(tipoMovimiento) {
    const accesoriosSinPaqueteNuevo = [];

    const accesorio = {
      idCotizacion: this.cotizacion.idCotizacion,
      idGrupoUnidad: this.idGrupoUnidad,
      idDetalleUnidad: this.detalleUnidad.idDetalleUnidad,
      idAccesorio: '', //cual es?
      idEncPaqueteAccesorio: this.itemEdit.idEncPaqueteAccesorio,
      idDetPaqueteAccesorio: this.itemEdit.idDetPaqueteAccesorio,
      idAccesorioNuevo: this.itemEdit.idAccesorioNuevo,
      nombre: this.itemEdit.nombre,
      idTipoProveedor: this.itemEdit.idTipoProveedor,
      idProveedor: this.itemEdit.idProveedor,
      nombreProveedor: this.itemEdit.nombreProveedor,
      idParte: this.itemEdit.idParte,
      modeloAnio: this.itemEdit.modeloAnio,
      cantidad: this.cantidad,
      costo: this.itemEdit.costo,
      precio: this.itemEdit.precio,
      tipoMovimiento,
      idUsuarioModificacion: 0,
      fechaModificacion: new Date()
    } as AccesorioNuevoUnidad;
    accesoriosSinPaqueteNuevo.push(accesorio);

    this.pricingService.saveCotizacionUnidadAccesorioMovs(this.cotizacion.idCotizacion,
      this.idGrupoUnidad, this.detalleUnidad.idDetalleUnidad, accesoriosSinPaqueteNuevo).subscribe(() => {
        this.modalService.dismissAll();
        this.toasterService.success('Accesorios editados', 'Cotización');
      }, (httpError) => {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
        this.toasterService.error(message, 'Accesorios');
      });

  }

  deleteAccesorios(tipoMovimiento) {
    /*
    const requestAccesorio = {
      idCotizacion: this.cotizacion.idCotizacion,
      idGrupoUnidad: this.idGrupoUnidad,
      idDetalleUnidad: this.detalleUnidad.idDetalleUnidad,
      idParte: this.itemToDelete.idParte,
      idAccesorioNuevo: this.itemToDelete.idAccesorioNuevo,
      idAccesorio: this.itemToDelete.idAccesorio,
      vin: this.detalleUnidad.vin
    };

    if (this.cotizacion.status === 'PEDIDO GENERADO') {
      this.pricingService.cancelarAccesorioDePedido(requestAccesorio).subscribe( res => {
        this.modalService.dismissAll();
        this.toasterService.success('Accesorios eliminados', 'Cotización');
      });
      return;
    }

    if (this.detalleUnidad.vin == null ) {
      this.pricingService.cancelarAccesorioSinVin(requestAccesorio).subscribe( res => {
        console.log(res);
        const accesoriosSinPaqueteNuevo = [];

        const accesorio = {
          idCotizacion: this.cotizacion.idCotizacion,
          idGrupoUnidad: this.idGrupoUnidad,
          idDetalleUnidad: this.detalleUnidad.idDetalleUnidad,
          idAccesorio: '', //cual es?
          idEncPaqueteAccesorio: this.itemToDelete.idEncPaqueteAccesorio,
          idDetPaqueteAccesorio: this.itemToDelete.idDetPaqueteAccesorio,
          idAccesorioNuevo: this.itemToDelete.idAccesorioNuevo,
          nombre: this.itemToDelete.nombre,
          idTipoProveedor: this.itemToDelete.idTipoProveedor,
          idProveedor: this.itemToDelete.idProveedor,
          nombreProveedor: this.itemToDelete.nombreProveedor,
          idParte: this.itemToDelete.idParte,
          modeloAnio: this.itemToDelete.modeloAnio,
          cantidad: this.itemToDelete.cantidad,
          costo: this.itemToDelete.costo,
          precio: this.itemToDelete.precio,
          tipoMovimiento,
          idUsuarioModificacion: 0,
          fechaModificacion: new Date()
        } as AccesorioNuevoUnidad;
        accesoriosSinPaqueteNuevo.push(accesorio);

        this.pricingService.saveCotizacionUnidadAccesorioMovs(this.cotizacion.idCotizacion,
          this.idGrupoUnidad, this.detalleUnidad.idDetalleUnidad, accesoriosSinPaqueteNuevo).subscribe(() => {
            this.modalService.dismissAll();
            this.toasterService.success('Accesorios eliminados', 'Cotización');
        }, (httpError) => {
            const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
            this.toasterService.error(message, 'Accesorios');
        });
      });
      return;
    }*/
    const accesoriosSinPaqueteNuevo = [];

    const accesorio = {
      idCotizacion: this.cotizacion.idCotizacion,
      idGrupoUnidad: this.idGrupoUnidad,
      idDetalleUnidad: this.detalleUnidad.idDetalleUnidad,
      idAccesorio: '', //cual es?
      idEncPaqueteAccesorio: this.itemToDelete.idEncPaqueteAccesorio,
      idDetPaqueteAccesorio: this.itemToDelete.idDetPaqueteAccesorio,
      idAccesorioNuevo: this.itemToDelete.idAccesorioNuevo,
      nombre: this.itemToDelete.nombre,
      idTipoProveedor: this.itemToDelete.idTipoProveedor,
      idProveedor: this.itemToDelete.idProveedor,
      nombreProveedor: this.itemToDelete.nombreProveedor,
      idParte: this.itemToDelete.idParte,
      modeloAnio: this.itemToDelete.modeloAnio,
      cantidad: this.itemToDelete.cantidad,
      costo: this.itemToDelete.costo,
      precio: this.itemToDelete.precio,
      tipoMovimiento: 'B',//this.itemToDelete.tipoMovimiento,
      idUsuarioModificacion: 0,
      fechaModificacion: new Date()
    } as AccesorioNuevoUnidad;
    accesoriosSinPaqueteNuevo.push(accesorio);

    this.pricingService.deleteGestionUnidadAccesorioGrupal(this.cotizacion.idCotizacion,
      this.idGrupoUnidad, this.detalleUnidad.idDetalleUnidad, accesoriosSinPaqueteNuevo).subscribe(() => {
        //this.modalService.dismissAll();
        this.modalDeleteAccesorios.close();
        this.toasterService.success('Accesorios eliminados', 'Cotización');
        this.ngOnInit();
      }, (httpError) => {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
        this.toasterService.error(message, 'Accesorios');
      });
  }

  deleteServicios(tipoMovimiento) {
    /*
    const requestServicio = {
      idCotizacion: this.cotizacion.idCotizacion,
      idGrupoUnidad: this.idGrupoUnidad,
      idDetalleUnidad: this.detalleUnidad.idDetalleUnidad,
      idServicioUnidad: this.itemToDelete.idServicioUnidad,
      vin: this.detalleUnidad.vin,
    };

    if (this.cotizacion.status === 'PEDIDO GENERADO') {
      this.pricingService.cancelarServicioDePedido(requestServicio).subscribe( res => {
        this.modalService.dismissAll();
        this.toasterService.success('Servicios eliminados', 'Cotización');
      });
      return;
    }


    if (this.detalleUnidad.vin == null ) {
        this.pricingService.cancelarServicioSinVin(requestServicio).subscribe( res => {
          console.log(res);
        });
        this.modalService.dismissAll();
        this.toasterService.success('Servicios eliminados', 'Cotización');
        return;
    }
    */
    const serviciosUnidadPorGuardar = [];

    const servicioUnidad = {
      idCotizacion: this.cotizacion.idCotizacion,
      idGrupoUnidad: this.idGrupoUnidad,
      idDetalleUnidad: this.detalleUnidad.idDetalleUnidad,
      idEncPaqueteServicioUnidad: this.itemToDelete.idEncPaqueteServicioUnidad ? this.itemToDelete.idEncPaqueteServicioUnidad : null,
      idServicioUnidad: this.itemToDelete.idServicioUnidad ? this.itemToDelete.idServicioUnidad : '',
      catalogo: this.itemToDelete.catalogo,
      anio: this.itemToDelete.anio,
      nombre: this.itemToDelete.nombre,
      descripcion: this.itemToDelete.descripcion,
      costo: this.itemToDelete.costo,
      precio: this.itemToDelete.precioTotal,
      tipoMovimiento: 'A',
      idUsuarioModificacion: 0,
      fechaModificacion: new Date()
    } as ServicioUnidadSinPaqueteUnidad;
    serviciosUnidadPorGuardar.push(servicioUnidad);

    this.pricingService.deleteCotizacionUnidadServicioGrupal(this.cotizacion.idCotizacion,
      this.idGrupoUnidad, this.detalleUnidad.idDetalleUnidad, serviciosUnidadPorGuardar).subscribe(() => {
        this.modalService.dismissAll();
        this.toasterService.success('Servicios eliminados', 'Cotización');
      }, (httpError) => {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
        this.toasterService.error(message, 'Servicios');
      });
  }

  onTabChange(e) {
    this.tabSelected = e.nextId;


    if (this.tabSelected === 'tramites') {
      this.cargaTramites();
    } else if (this.tabSelected === 'accesorios') {
      this.cargaAccesorios();
    } else if (this.tabSelected === 'servicios') {
      this.cargaServicios();
    }
  }

  openConfiguraAdicionalesTipoOrden(tipoAdicional) {

    if (tipoAdicional==='ACCESORIOS'){
      this.pricingService.validaUnidadFacturada(this.cotizacion.idCotizacion).subscribe((resp:any) => {
        let tipoAdicionalAux='';
        if (resp[0].Success === 1){
          tipoAdicionalAux='ACCESORIOS_AD'
        } else{
          tipoAdicionalAux='ACCESORIOS'
        }
        if (tipoAdicionalAux.length>0){
          const modalTipoOrden = this.modalService.open(ConfiguraTipoOrdenAdicionalesComponent, { size: 'lg' });
          modalTipoOrden.componentInstance.idGrupoUnidad = this.detalleUnidad.idGrupoUnidad;
          modalTipoOrden.componentInstance.cantidad = this.cantidad;
          modalTipoOrden.componentInstance.tipoAdicional = tipoAdicionalAux;
          modalTipoOrden.componentInstance.idCotizacion = this.cotizacion.idCotizacion;
          modalTipoOrden.componentInstance.modalGestoria = true;
          modalTipoOrden.result.then((isSaved: boolean) => {
            if (isSaved) {
              //this.refreshData();
              this.ngOnInit();
            }
          });
        }
      }, (httpError) => {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
         this.toasterService.error(message, 'accesorios');
      });
    } else {
      const modalTipoOrden = this.modalService.open(ConfiguraTipoOrdenAdicionalesComponent, { size: 'lg' });
      modalTipoOrden.componentInstance.idGrupoUnidad = this.detalleUnidad.idGrupoUnidad;
      modalTipoOrden.componentInstance.cantidad = this.cantidad;
      modalTipoOrden.componentInstance.tipoAdicional = tipoAdicional;
      modalTipoOrden.componentInstance.idCotizacion = this.cotizacion.idCotizacion;
      modalTipoOrden.componentInstance.modalGestoria = true;
      modalTipoOrden.result.then((isSaved: boolean) => {
        if (isSaved) {
          //this.refreshData();
          this.ngOnInit();
        }
      });
    }



  }
}
