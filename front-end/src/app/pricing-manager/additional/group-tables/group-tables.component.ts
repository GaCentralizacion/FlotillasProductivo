import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  GrupoUnidades, Cotizacion, Accesorio, PaqueteAccesorios, PaqueteTramite,
  TramiteSinPaquete, AccesorioSinPaquete, PaqueteServicio, ServicioUnidadSinPaquete
} from 'src/app/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PricingService, AccesorioCatalogService } from 'src/app/services';
import { AgregarEditarTramitesComponent } from '../agregar-editar-tramites/agregar-editar-tramites.component';
import { ActivatedRoute } from '@angular/router';
import { AgregarEditarAccesoriosComponent } from '../agregar-editar-accesorios/agregar-editar-accesorios.component';
import { AgregarEditarServicioUnidadComponent } from '../agregar-editar-servicio-unidad/agregar-editar-servicio-unidad.component';
import { Observable } from 'rxjs';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { SidebarToggleService } from '../../../header/sidebar-toggle-service.service';
import { PricingManagerService } from '../../pricing.manager.service';
import { AdditionalService } from '../additional.service';
import { ConfiguraTipoOrdenComponent } from '../configura-tipo-orden/configura-tipo-orden.component';
import { ConfiguraTipoOrdenAdicionalesComponent } from '../configura-tipo-orden-adicionales/configura-tipo-orden-adicionales.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-group-tables',
  templateUrl: './group-tables.component.html',
  styleUrls: ['./group-tables.component.scss'],
  providers: [PricingManagerService]
})
export class GroupTablesComponent implements OnInit {
  @Input() gruposUnidades: GrupoUnidades[];
  @Input() actualTab: string;
  @ViewChild('groupTable') groupTable: DatatableComponent;
  selected = [];
  lastSelected;
  tramiteSelected = [];
  tramiteFiltered = [];
  serviciosSelected = [];
  serviciosFiltered = [];
  expanded: any = {};
  timeout: any;
  accesorios: Accesorio[] = [];
  buscarText = '';
  cotizacion: Cotizacion;
  idGrupoUnidad: number;
  paquetesAccesorios: PaqueteAccesorios[];
  accesoriosSinPaquete: AccesorioSinPaquete[];
  paquetesTramites: PaqueteTramite[];
  tramitesSinPaquete: TramiteSinPaquete[];
  paquetesServicioUnidad: PaqueteServicio[];
  serviciosUnidadSinPaquete: ServicioUnidadSinPaquete[];
  itemToDelete: any;
  observacionesSisco: string;

  constructor(private modalService: NgbModal,
    private pricingService: PricingService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    public pricingManagerService: PricingManagerService,
    private additionalService: AdditionalService,
    private accesorioCatalogService: AccesorioCatalogService) { }

  ngOnInit() {
    this.gruposUnidades = [] as any[];
    this.paquetesAccesorios = [];
    this.accesoriosSinPaquete = [];
    this.paquetesTramites = [];
    this.tramitesSinPaquete = [];
    this.paquetesServicioUnidad = [];
    this.serviciosUnidadSinPaquete = [];
    this.additionalService.changeCotizacion.subscribe(item => {
      this.cotizacion = item;
      this.changeSelect(item.gruposUnidades);
    });
    this.route.queryParamMap.subscribe(params => {
      const idCotizacion = params.get('idCotizacion');
      //this.pricingService.getPricingById(idCotizacion)
      this.pricingService.getGrupoUnidadByIdCotizacion(idCotizacion)
        .subscribe((cotizacion: Cotizacion) => {
          if (cotizacion) {
            this.additionalService.changeCotizacion.emit(cotizacion);
            this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
            if (cotizacion.status === 'EN PROCESO') {
              this.pricingManagerService.onlyRead = false;
            } else {
              this.pricingManagerService.onlyRead = true;
            }

            //OCT99 SOLO LECTURA
            if (this.pricingManagerService.perfilSoloLectura)
              this.pricingManagerService.onlyRead = true;
          }
        });
    });
  }

  onPage() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => { }, 100);
  }

  toggleExpandRow(row) {
    this.groupTable.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(evento: { type: string, value: GrupoUnidades }) {
    evento.value.isToggled = !evento.value.isToggled;
    if (evento.value.isToggled) {
      //      const scrollWidth = this.groupTable.bodyComponent.scroller.parentElement.scrollWidth;
      //      this.groupTable.bodyComponent.scroller.parentElement.scroll(scrollWidth, 0);
    }
  }

  changeSelect(grupoUnidades) {
    if (this.lastSelected) {
      this.selected[0] = grupoUnidades.filter(item => {
        return item.idGrupoUnidad === this.lastSelected.idGrupoUnidad;
      })[0];
      if (this.selected[0]) {
        this.onSelectFake(this.selected);
      }
    }
  }

  onSelectFake(selected) {
    this.idGrupoUnidad = selected[0].idGrupoUnidad;
    this.paquetesAccesorios = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == selected[0].idGrupoUnidad).paquetesAccesorios.map(pa => {
      this.paquetesAccesorios.push(Object.assign(new PaqueteAccesorios(), pa));
    });
    this.accesoriosSinPaquete = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == selected[0].idGrupoUnidad).accesoriosSinPaquete.map(asp => {
      this.accesoriosSinPaquete.push(Object.assign(new AccesorioSinPaquete(), asp));
    });

    this.paquetesTramites = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == selected[0].idGrupoUnidad).paquetesTramites.map(pt => {
      this.paquetesTramites.push(Object.assign(new PaqueteTramite(), pt));
    });
    this.tramitesSinPaquete = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == selected[0].idGrupoUnidad).tramitesSinPaquete.map(tsp => {
      this.tramitesSinPaquete.push(Object.assign(new TramiteSinPaquete(), tsp));
    });
    this.paquetesServicioUnidad = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == selected[0].idGrupoUnidad).paquetesServicioUnidad.map(psu => {
      this.paquetesServicioUnidad.push(Object.assign(new PaqueteServicio(), psu));
    });
    this.serviciosUnidadSinPaquete = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == selected[0].idGrupoUnidad).serviciosUnidadSinPaquete.map(susp => {
      this.serviciosUnidadSinPaquete.push(Object.assign(new ServicioUnidadSinPaquete(), susp));
    });
  }

  onSelect({ selected }) {
    if (selected[0]) {
      this.lastSelected = selected[0];
    }
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.idGrupoUnidad = selected[0].idGrupoUnidad;
    this.paquetesAccesorios = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == this.idGrupoUnidad).paquetesAccesorios.map(pa => {
      this.paquetesAccesorios.push(Object.assign(new PaqueteAccesorios(), pa));
    });
    this.accesoriosSinPaquete = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == this.idGrupoUnidad).accesoriosSinPaquete.map(asp => {
      this.accesoriosSinPaquete.push(Object.assign(new AccesorioSinPaquete(), asp));
    });

    this.paquetesTramites = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == this.idGrupoUnidad).paquetesTramites.map(pt => {
      this.paquetesTramites.push(Object.assign(new PaqueteTramite(), pt));
    });
    this.tramitesSinPaquete = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == this.idGrupoUnidad).tramitesSinPaquete.map(tsp => {
      this.tramitesSinPaquete.push(Object.assign(new TramiteSinPaquete(), tsp));
    });
    this.paquetesServicioUnidad = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == this.idGrupoUnidad).paquetesServicioUnidad.map(psu => {
      this.paquetesServicioUnidad.push(Object.assign(new PaqueteServicio(), psu));
    });
    this.serviciosUnidadSinPaquete = [];
    this.cotizacion.gruposUnidades.find(gu => gu.idGrupoUnidad == this.idGrupoUnidad).serviciosUnidadSinPaquete.map(susp => {
      this.serviciosUnidadSinPaquete.push(Object.assign(new ServicioUnidadSinPaquete(), susp));
    });
  }

  openModalPaquetes(agregarATodos = false) {
    if (this.actualTab === 'accesorios') {
      const modalAccesorios = this.modalService.open(AgregarEditarAccesoriosComponent, { size: 'lg' });
      modalAccesorios.componentInstance.cotizacion = this.cotizacion;
      if (!agregarATodos) {
        modalAccesorios.componentInstance.idGrupoUnidad = this.idGrupoUnidad;
      }
      modalAccesorios.result.then((isSaved: boolean) => {
        if (isSaved) {
          this.toastrService.success('Accesorios configurados', 'Cotización');
          this.ngOnInit();
        }
      });
    }

    if (this.actualTab === 'tramites') {
      const modalTramites = this.modalService.open(AgregarEditarTramitesComponent, { size: 'lg' });
      modalTramites.componentInstance.cotizacion = this.cotizacion;
      if (!agregarATodos) {
        modalTramites.componentInstance.idGrupoUnidad = this.idGrupoUnidad;
      }
      modalTramites.result.then((isSaved: boolean) => {
        if (isSaved) {
          this.toastrService.success('Trámites y Gestión configurados', 'Cotización');
          this.ngOnInit();
        }
      });
    }

    if (this.actualTab === 'serviciosUnidad') {
      const modalServiciosUnidad = this.modalService.open(AgregarEditarServicioUnidadComponent, { size: 'lg' });
      modalServiciosUnidad.componentInstance.cotizacion = this.cotizacion;
      if (!agregarATodos) {
        modalServiciosUnidad.componentInstance.idGrupoUnidad = this.idGrupoUnidad;
      }
      modalServiciosUnidad.result.then((isSaved: boolean) => {
        if (isSaved) {
          this.toastrService.success('Órdenes de servicio configuradas', 'Cotización');
          this.ngOnInit();
        }
      });
    }

    if (this.actualTab === 'conceptos') {
    }
  }

  openModalDelete(deleteTemplate: any, itemToDelete: any) {
    this.itemToDelete = itemToDelete;
    this.modalService.open(deleteTemplate);
  }

  openModalObservaciones(observacionesTemplate: any, accesorioSisco: any) {
    this.observacionesSisco = accesorioSisco.observaciones;
    this.modalService.open(observacionesTemplate);
  }

  openModalTipoOrden(GrupoUnidad: GrupoUnidades) {
    //this.itemToDelete = grupoUnidad;    
    const modalTipoOrden = this.modalService.open(ConfiguraTipoOrdenComponent, { size: 'sm' });
    modalTipoOrden.componentInstance.GrupoUnidad = GrupoUnidad;
    modalTipoOrden.componentInstance.idCotizacion = this.cotizacion.idCotizacion;
    modalTipoOrden.componentInstance.modalGestoria = false;
    modalTipoOrden.componentInstance.edit = this.pricingManagerService.onlyRead
    modalTipoOrden.result.then((isSaved: boolean) => {
      if (isSaved) {
        //this.refreshData();
        this.ngOnInit();
      }
    });
  }

  openConfiguraAdicionalesTipoOrden(tipoAdicional) {
    const modalTipoOrden = this.modalService.open(ConfiguraTipoOrdenAdicionalesComponent, { size: 'sm' });
    let grupo = this.gruposUnidades.filter(element => element.idGrupoUnidad == this.idGrupoUnidad);

    modalTipoOrden.componentInstance.idGrupoUnidad = this.idGrupoUnidad;
    modalTipoOrden.componentInstance.cantidad = grupo[0].cantidad;
    modalTipoOrden.componentInstance.tipoAdicional = tipoAdicional;
    modalTipoOrden.componentInstance.idCotizacion = this.cotizacion.idCotizacion;
    modalTipoOrden.componentInstance.modalGestoria = false;
    modalTipoOrden.result.then((isSaved: boolean) => {
      if (isSaved) {
        //this.refreshData();
        this.ngOnInit();
      }
    });
  }

  actualizaGrupos() {
    this.ngOnInit();
  }

  deleteItem() {
    this.modalService.dismissAll();
    let servicioEliminacion: Observable<any> = null;
    if (this.itemToDelete instanceof PaqueteAccesorios) {
      servicioEliminacion = this.pricingService
        .deleteCotizacionGrupoPaqueteAccesorio(this.cotizacion.idCotizacion,
          this.idGrupoUnidad, this.itemToDelete.idEncPaqueteAccesorio);
    }
    if (this.itemToDelete instanceof AccesorioSinPaquete) {

      if (this.itemToDelete.enCompras === 1 || this.itemToDelete.enCompras === 2) {

        let accesorioSisco = {
          "idCotizacion": this.itemToDelete.idCotizacion,
          "idGrupoUnidad": this.itemToDelete.idGrupoUnidad,
          "idAccesorioNuevo": this.itemToDelete.idAccesorioNuevo,
          "idParte": this.itemToDelete.idParte,
          "nombreAccesorio": this.itemToDelete.nombre
        };
        servicioEliminacion = this.accesorioCatalogService.eliminaAccesorioSisco(accesorioSisco);

      }
      else {
        servicioEliminacion = this.pricingService
          .deleteCotizacionGrupoAccesorioSinPaquete(this.itemToDelete);
      }
    }
    if (this.itemToDelete instanceof PaqueteTramite) {
      servicioEliminacion = this.pricingService
        .deleteCotizacionGrupoPaqueteTramite(this.cotizacion.idCotizacion,
          this.idGrupoUnidad,
          this.itemToDelete.idEncPaqueteTramite);
    }
    if (this.itemToDelete instanceof TramiteSinPaquete) {
      servicioEliminacion = this.pricingService
        .deleteCotizacionGrupoTramiteSinPaquete(this.itemToDelete);
    }
    if (this.itemToDelete instanceof PaqueteAccesorios) {
      servicioEliminacion = this.pricingService
        .deleteCotizacionGrupoPaqueteAccesorio(this.cotizacion.idCotizacion,
          this.idGrupoUnidad,
          this.itemToDelete.idEncPaqueteAccesorio);
    }
    if (this.itemToDelete instanceof AccesorioSinPaquete) {
      if (this.itemToDelete.enCompras === 1 || this.itemToDelete.enCompras === 2) {

        let accesorioSisco = {
          "idCotizacion": this.itemToDelete.idCotizacion,
          "idGrupoUnidad": this.itemToDelete.idGrupoUnidad,
          "idAccesorioNuevo": this.itemToDelete.idAccesorioNuevo,
          "idParte": this.itemToDelete.idParte,
          "nombreAccesorio": this.itemToDelete.nombre
        };
        servicioEliminacion = this.accesorioCatalogService.eliminaAccesorioSisco(accesorioSisco);
      }
      else {
        servicioEliminacion = this.pricingService
          .deleteCotizacionGrupoAccesorioSinPaquete(this.itemToDelete);
      }
    }
    if (this.itemToDelete instanceof PaqueteServicio) {
      servicioEliminacion = this.pricingService
        .deleteCotizacionGrupoPaqueteServicioUnidad(this.cotizacion.idCotizacion,
          this.idGrupoUnidad,
          this.itemToDelete.idEncPaqueteServicioUnidad);
    }
    if (this.itemToDelete instanceof ServicioUnidadSinPaquete) {
      servicioEliminacion = this.pricingService
        .deleteCotizacionGrupoServicioUnidadSinPaquete(this.itemToDelete);
    }

    if (servicioEliminacion != undefined) {
      servicioEliminacion.subscribe((respElimina) => {
        this.toastrService.success('Se eliminó la configuración correctamente', 'Adicionales');
        this.idGrupoUnidad = null;

        try {
          if (respElimina[0].idSolicitud) {
            this.accesorioCatalogService.getDatosSisco().toPromise().then((datos) => {
              // this.loginSisco(datos[0].email, datos[0].password, datos[0].application, datos[0].urlLogin).then(async (aut: any[]) => {
                  let token = environment.tokenSisco;
                  //aut[0].data.security.token;
                  const paramsProcesar = {
                    idSolicitud: respElimina[0].idSolicitud,
                    idTipoSolicitud: datos[0].idTipoSolicitud,
                    idClase: datos[0].idClase,
                    rfcEmpresa: datos[0].rfcEmpresa,
                    idCliente: datos[0].idCliente,
                    numeroContrato: datos[0].numeroContrato,
                  };

                  this.accesorioCatalogService.postDelSolicitudCompra(paramsProcesar, token, datos[0].urlPostDelSolicitudCompra, this.itemToDelete.idCotizacion).subscribe(async (respSisco) => {
                    this.ngOnInit();
                  });
                //});
            });
          }
          else {
            this.ngOnInit();
          }
        }
        catch {
          this.ngOnInit();
        }

      }, (httpError) => {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
        this.toastrService.error(message, 'Adicionales');
      });
    }
  }

  calTramitesSinPaquete(item) {
    let total = 0;
    item.tramitesSinPaquete.forEach(tra => {
      total += tra.precio;
    });
    return total * item.cantidad;
  }

  calpaquetesTramites(item) {
    let total = 0;
    item.paquetesTramites.forEach(paq => {
      paq.tramites.forEach(tra => {
        total += tra.precio;
      });
    });
    return total * item.cantidad;
  }

  calcSubTotalTramites(row) {
    return this.calpaquetesTramites(row) + this.calTramitesSinPaquete(row);
  }

  calAccesoriosSinPaquete(item) {
    let total = 0;
    item.accesoriosSinPaquete.forEach(acce => {
      total += acce.precio;
    });
    return total * item.cantidad;
  }

  calPaquetesAccesorios(item) {
    let total = 0;
    item.paquetesAccesorios.forEach(paq => {
      item.accesorios += paq.accesorios.length;
      paq.accesorios.forEach(tra => {
        total += tra.precio;
      });
    });
    return total * item.cantidad;
  }

  calcSubTotalAccesorios(row) {
    return this.calAccesoriosSinPaquete(row) + this.calPaquetesAccesorios(row);
  }

  calcServiciosUnidadSinPaquete(item) {
    let total = 0;
    item.serviciosUnidadSinPaquete.forEach(ser => {
      total += ser.precio;
    });
    return total * item.cantidad;
  }

  calcPaquetesServicioUnidad(item) {
    let total = 0;
    item.paquetesServicioUnidad.forEach(paq => {
      paq.serviciosUnidad.forEach(tra => {
        total += tra.precio;
      });
    });
    return total * item.cantidad;
  }

  calcSubTotalServicios(row) {
    return this.calcServiciosUnidadSinPaquete(row) + this.calcPaquetesServicioUnidad(row);
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

