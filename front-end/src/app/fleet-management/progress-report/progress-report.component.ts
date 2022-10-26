import { Component, OnInit, ViewChild } from '@angular/core';
import { Cotizacion, GrupoUnidades, Cfdis } from 'src/app/models';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CondionesVentaService, PricingService, ClientCatalogService, AccesorioCatalogService } from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FleetUnidadesComponent } from './unidades/fleet.unidades.component';
import { FleetAdicionalesComponent } from './adicionales/fleet.adicionales.component';
import { FleetAdicionalesGrupalComponent } from './adicionales-grupal/fleet.adicionales-grupal.component';
import { ToastrService } from 'ngx-toastr';
import { InfoUnidadesComponent } from './info/info.unidades.component';
import { LeyendaUnidadesComponent } from './leyenda/leyenda.unidades.component';
import { CrearEditarSellingConditionComponent } from 'src/app/pricing-manager/selling-condition/crear-editar-selling-condition/crear-editar-selling-condition.component';
import { InfoModalUnidadesComponent } from './infoModal/info.modal.unidades.component';
import { UnitFleetComponent } from './unit/unit.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ConfiguraTipoOrdenComponent } from '../../pricing-manager/additional/configura-tipo-orden/configura-tipo-orden.component';
import { PricingManagerService } from 'src/app/pricing-manager/pricing.manager.service';
import { TransferComponent } from './transfer/transfer.component';
import { ModalTrasladosComponent } from './modal-traslados/modal-traslados.component';
import { ModalUtilidadComponent} from './modal-utilidad/modal-utilidad.component';
import { ModalTranseferVinComponent } from './modal-transefer-vin/modal-transefer-vin.component';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification.model';
import { environment } from '../../../environments/environment.prod'
//SISCO
import { SolicitudCotizacionSisco } from 'src/app/models/accesorio.model';
@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.scss'],
  providers: [PricingManagerService]
})
export class ProgressReportComponent implements OnInit {

  @ViewChild(DatatableComponent) groupTable: DatatableComponent;

  bProStatus;

  isMissing = true;
  isGenOrder = false;
  isPost = false;
  filter: any = {};

  cotizacion: Cotizacion;
  idFlotilla: string;
  currentSelected = [];
  idLicitacion: string;
  idCotizacion: string;
  /* Originals */
  CfdisCatalogo: Cfdis[] = [];
  progress: any;
  mdlSampleIsOpen = false;
  ordenesCompletadas = false;
  isDelete = true;

  modalDelete: string;
  aprobacion: string;
  aprobacion2: string;
  aprobacion3: string;
  aprobacion4: string;
  aprobacion5: string;
  aprobacion6: string;
  
  banderaBotonUtilidad: number = 0;
  idUsuario: number;
  

  rowHeight = 500;
  /* Copys */
  CfdisRows: any[] = [];
  condicionesIn = [
    { idCondicion: 'C0', nombre: 'CREDITO' },
    { idCondicion: 'C1', nombre: 'CONTADO' }
  ] as any;

  gruposUnidades = [] as any[];

  cancelResonse = [] as any[];
  isPedido = false;
  isFacturado = false;
  isLoading = true;


  isGenPedido = false;

  updatePedidoToken = false;
  seleccionados = 0;
  //OCT99
  isRegresaCotizacion = false;
  isRegresandoCotizacion = false;
  resumenGrupal = "";
  resumenCotizacion = "";
  todasFacturadas = 0;
  estatusCotizacion = 0; //UNIDADES-> [0: faltan por facturar, 1: todas facturadas]
  activaAccesorios = false;
  // CHK
  existeSisco = false;
  enviandoSisco = false;
  OrdenASISCO: Object;
  ordenesSisco = true;
  mensajeValidacion: string;

  // notificaciones EH COAL
  statusCotizacion = 0;
  gruposUnidadesNot: Cotizacion;

  cliente = {
    rfc: '',
    nombreCompleto: '',
    celular: '',
    telefono: '',
    correo: ''
  };

  isNotUtilidad = false;
  isNotUtilidadLabel = 0;
  isNotTraslados = false;
  isNotTrasladosLabel = 0;
  isNotUnidades = false;
  isNotUnidadesLabel = 0;
  isNotCredito = false;
  isNotCreditoLabel = 0;
  isNotCU = false;
  isNotCULabel = 0;

  constructor(private selingService: CondionesVentaService,
    private activeRoute: ActivatedRoute, private pricingService: PricingService,
    private modalService: NgbModal, private toastrService: ToastrService,
    private cliCatalogoService: ClientCatalogService,
    private router: Router,
    public pricingManagerService: PricingManagerService,
    private accesorioCatalogService: AccesorioCatalogService,
    private notificationService: NotificationService,
    private toastSerivce: ToastrService,
  ) { }

  ngOnInit() {
    
    this.gruposUnidades = [] as any[];
    this.getCfdi();
    this.getParams();
    this.pricingService.validaOrdenesDeCompra(this.idCotizacion).subscribe((res: any) => {
      this.isGenOrder = res;
    });

        //OCT99
    this.validaRegresarCotizacion();
    this.verificaUnidadesFacturadas();

    this.pricingService.cancelacionProcesada(this.idCotizacion).subscribe((res: any) => {
      this.cancelResonse = res;
    });

    this.pricingService.getPedidoBproStatus(this.idCotizacion).subscribe(res => {
      this.bProStatus = res;
    });

    this.isUpdatePedido();
    this.isUpdateGen();

    this.isDelete = this.pricingService.getStatusDelete(this.idCotizacion);
    this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      this.isLoading = false;
      this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
      this.isMissinVin();
      if (this.cotizacion.status === 'PEDIDO GENERADO') {
        this.isPedido = true;
      }

      if (this.cotizacion.status === 'ORDENES DE COMPRA COMPLETADAS' || this.cotizacion.status === 'APROBADA') {
        this.ordenesCompletadas = true;
      }

      if (this.cotizacion.status === 'PEDIDO GENERADO' || this.cotizacion.status === 'PEDIDO FACTURADO') {
        //       this.isFacturado = true;
      }

      this.cotizacion.gruposUnidades.forEach((uni: any) => {
        const cUni = uni;
        cUni.detalleUnidades = cUni.detalleUnidades.filter(item => {
          return item.tipoMovimiento !== 'B';
        });
        if (cUni.detalleUnidades.length > 0) {
          cUni.cantidad = cUni.detalleUnidades.length;
          cUni.total = cUni.detalleUnidades.length * cUni.precio;
          this.gruposUnidades.push(cUni);
        }
      });

      this.consultaEstatus();
    });
    this.pricingService.getFacturacionUnidades(this.idCotizacion).subscribe((unidades) => {
    });

    // Valida si existen ordenes pendientes sisco
    this.existeSisco2();
    this.estatusSisco();
    this.validaAgregarAccesoriosPostAd();
    this.obtenNotificacion();
    const objAuth: any = JSON.parse(localStorage.getItem('app_token'));
    this.idUsuario = objAuth.data.user.id;
    this.validaBotonUtilidad();
  }

  //OCT99
  private validaRegresarCotizacion() {
    this.pricingService.getValidaRegresaCotizacion(this.idCotizacion).subscribe((res: any) => {
      this.isRegresaCotizacion = res[0].Success;
    });
  }

  //OCT99 20210118 consulta estatus de cotizacion
  private consultaEstatus() {
    this.pricingService.consultaEstatusCotizacion(this.idCotizacion).subscribe((res: any) => {
      this.estatusCotizacion = res[0].estatusFac;
    });
  }

  private getCfdi() {
    this.selingService.getAllCfdi().subscribe(res => {
      this.CfdisCatalogo = Object.assign([], res);
      this.CfdisRows = JSON.parse(JSON.stringify(this.CfdisCatalogo));
    });
  }

  estatusSisco() {
    this.pricingService.estatusSisco(this.idCotizacion).subscribe((data) => {
      if (data[0].Success == 0) { //Error hay pendientes | Existen Solicitudes de SISCO que deben atenderse.
        this.ordenesSisco = false;
      } if (data[0].Success == 1) { // Exito no hay pendientes |  No hay registros para compras en esta cotización
        this.ordenesSisco = true;
      }
    });

  }

  existeSisco2() {
    // Valida si existen ordenes pendientes sisco
    this.pricingService.existenSisco(this.idCotizacion).subscribe((data) => {
      if (data[0].Mensaje) { //mensaje error
        this.existeSisco = false;
      } else { //si existen
        this.existeSisco = true;
        this.OrdenASISCO = data;
        this.enviandoSisco = false;
      }
    });
  }

  isNotCan(vin) {
    let isNot = true;
    if (vin == null) {
      return isNot;
    }
    if (this.cancelResonse == null || this.cancelResonse.length == 0) {
      return isNot;
    }
    this.cancelResonse.forEach(can => {
      if (can.Vin === vin && can.Estatus === 3) {
        isNot = false;
      }
    });
    return isNot;
  }


  isRed(vin) {
    let isRed = false;
    if (vin == null) {
      return isRed;
    }
    if (this.cancelResonse == null || this.cancelResonse.length == 0) {
      return isRed;
    }
    this.cancelResonse.forEach(can => {
      if (can.Vin === vin && can.Estatus === 2) {
        isRed = true;
      }
    });
    return isRed;
  }

  /* Methods helpers */
  toggleExpandRow(row) {
    this.rowHeight = (row.detalleUnidades.length * 32) + 10;
    this.groupTable.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event: { type: string, value: GrupoUnidades }) {
    event.value.isToggled = !event.value.isToggled;
    if (event.value.isToggled) {
      const scrollWidth = this.groupTable.bodyComponent.scroller.parentElement.scrollWidth;
      this.groupTable.bodyComponent.scroller.parentElement.scroll(scrollWidth, 0);
    }
  }

  getCfdfiName(item) {
    const cfdiSeleted = this.CfdisRows.find(cfdi => {
      return cfdi.idCfdi === item;
    });
    return cfdiSeleted ? cfdiSeleted.nombre : '';
  }

  getCondicion(item) {
    const condicionSelected = this.condicionesIn.find(condicion => {
      return condicion.idCondicion === item;
    });
    return condicionSelected ? condicionSelected.nombre : '';
  }

  private getParams() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idFlotilla = params.idFlotilla as string;
      this.idCotizacion = params.idCotizacion as string;
      this.idLicitacion = params.idLicitacion as string;
    });
  }
  //Asigna Vines
  openModalNuevas(row) {
    const modalPDF = this.modalService.open(FleetUnidadesComponent, { size: 'lg' });
    modalPDF.componentInstance.cotizacion = this.cotizacion;
    modalPDF.componentInstance.unidad = row;
    modalPDF.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.ordenesCompletadas = false;
        this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
          this.isLoading = false;
          this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
          this.isMissinVin();
          if (this.cotizacion.status === 'PEDIDO GENERADO') {
            this.isPedido = true;
          }
          if (this.cotizacion.status === 'ORDENES DE COMPRA COMPLETADAS' || this.cotizacion.status === 'APROBADA') {
            this.ordenesCompletadas = true;
          }
          if (this.cotizacion.status === 'PEDIDO GENERADO' || this.cotizacion.status === 'PEDIDO FACTURADO') {
            //       this.isFacturado = true;
          }
          this.cotizacion.gruposUnidades.forEach((uni: any) => {
            const cUni = uni;
            cUni.detalleUnidades = cUni.detalleUnidades.filter(item => {
              return item.tipoMovimiento !== 'B';
            });
            if (cUni.detalleUnidades.length > 0) {
              cUni.cantidad = cUni.detalleUnidades.length;
              cUni.total = cUni.detalleUnidades.length * cUni.precio;
              this.gruposUnidades.push(cUni);
            }
          });
        });
      }
    });
  }

  openModalTipoOrden(row) {
    const modalTipoOrden = this.modalService.open(ConfiguraTipoOrdenComponent, { size: 'sm' });
    modalTipoOrden.componentInstance.GrupoUnidad = row;
    modalTipoOrden.componentInstance.idCotizacion = this.cotizacion.idCotizacion;
    modalTipoOrden.componentInstance.modalGestoria = true;
    modalTipoOrden.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.refreshData();
      }
    });
  }

  openModalEdit(row, detalleUnidad, val) {
    if (this.currentSelected.length > 0) {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      };
      const modalEdit = this.modalService.open(FleetAdicionalesComponent, ngbModalOptions);
      modalEdit.componentInstance.versionUnidad = row.versionUnidad;
      modalEdit.componentInstance.detalleUnidad = detalleUnidad;
      modalEdit.componentInstance.isFacturado = this.isFacturado;
      modalEdit.result.then((isSaved: boolean) => {
        this.pricingService.validaOrdenesDeCompra(this.idCotizacion).subscribe((res: any) => {
          this.isGenOrder = res;
        });
        if (isSaved) {
        }
      });
    }
  }

  openModalEditGrupo(row) {
    if (!this.bProStatus && !this.bProStatus.ucu_idpedidobpro) {
      this.toastrService.warning('Aun no existe Pedido BPRO para poder agregar POSTERIORES.');
    } else {

      if (this.currentSelected.length > 0) {
        const ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false,
          size: 'lg'
        };

        const modalEdit = this.modalService.open(FleetAdicionalesGrupalComponent, ngbModalOptions);
        modalEdit.componentInstance.versionUnidad = row.versionUnidad;
        modalEdit.componentInstance.detalleUnidad = row.detalleUnidades[0];
        modalEdit.componentInstance.isFacturado = this.isFacturado;
        modalEdit.result.then((isSaved: boolean) => {
          this.refreshData();
          this.pricingService.validaOrdenesDeCompra(this.idCotizacion).subscribe((res: any) => {
            this.isGenOrder = res;
            this.isPost = false;
          });
          if (isSaved) {

          }
        });
      }
    }
  }

  showInfo(idUnidad) {
    const modalEdit = this.modalService.open(InfoUnidadesComponent, { size: 'sm' });
    modalEdit.componentInstance.idGrupoUnidad = (idUnidad) ? idUnidad : '-1';
    modalEdit.componentInstance.idCotizacion = this.cotizacion.idCotizacion;
    modalEdit.result.then((isSaved: boolean) => {
      if (isSaved) {
      }
    });
  }

  showInfoDetail(detalleUnidad, idUnidad, idDetalleUnidad, val) {
    const modalEdit = this.modalService.open(InfoUnidadesComponent, { size: 'sm' });
    modalEdit.componentInstance.idGrupoUnidad = (idUnidad) ? idUnidad : '-1';
    modalEdit.componentInstance.idCotizacion = this.cotizacion.idCotizacion;
    modalEdit.componentInstance.idDetalleUnidad = idDetalleUnidad;
    modalEdit.result.then((isSaved: boolean) => {
      if (isSaved) {
      }
    });
  }

  genOrder() {
    this.pricingService.validaNotificacionUtilidad(this.cotizacion.idCotizacion, 1)
    .subscribe((notf: any) => {
      if (notf[0].Success !== 1) {
          // Cambio P10 - EHJ-COAL
          // Se agrego Validacion de existenia 
          this.pricingService.validaDisponibilidadInventarioPost(this.cotizacion.idCotizacion, this.cotizacion.idDireccionFlotillas)
          .subscribe((inv: any) => {
            if (inv[0].Success !== 1) {
              this.toastrService.warning(inv[0].msg, `Favor de procesar órdenes de compra generadas. No cuenta con existencia en:`)
            }
          });
         
          this.pricingService.generarPedidoMovBproTraslado(this.idCotizacion).subscribe(res => {
          this.isPedido = true;
          this.isGenOrder = false;
          this.isUpdatePedido();
          this.isUpdateGen();
          this.toastrService.success('Ordenes generadas');
         
          // this.pricingService.confirmaCancelacionAccesorio(this.cotizacion.idCotizacion, this.cotizacion.idDireccionFlotillas)
          // .subscribe((conf: any) => {
          //   if (conf[0].Success !== 1) {
          //     this.toastrService.warning(conf[0].msg, `Accesorios modificados. Se cancelo OC de los idParte:`)
          //   }
          // });

          this.refreshData();

          });

        } else {
          this.toastrService.warning(notf[0].msg, `Posteriores no procesados, se afectó la utilidad. Favor de solicitar autorizaciónn`)
        }
    });
  }

  getOrderPost() {
    this.pricingService.validaNotificacionUtilidad(this.cotizacion.idCotizacion, 1)
    .subscribe((notPost: any) => {
      if (notPost[0].Success !== 1) {
          // Cambio P10 - EHJ-COAL
          // Se agrego Validacion de existenia 
          this.pricingService.validaDisponibilidadInventarioPost(this.cotizacion.idCotizacion, this.cotizacion.idDireccionFlotillas)
          .subscribe((dispInv: any) => {
            if (dispInv[0].Success !== 1) {
              this.toastrService.warning(dispInv[0].msg, `Favor de procesar órdenes de compra generadas. No cuenta con existencia en:`)
              }
            });
          this.pricingService.cambiaStatusCotizacionUnidadesPosterior(this.idCotizacion).subscribe((res: any) => {
            console.log(res);
              if (res[0].Success === 1) {
                this.isPost = true;
                this.isUpdatePedido();
                this.isUpdateGen();
                this.validaAgregarAccesoriosPostAd();
                this.toastrService.success('Movimientos adicionales generados');

                // this.pricingService.confirmaCancelacionAccesorio(this.cotizacion.idCotizacion, this.cotizacion.idDireccionFlotillas)
                // .subscribe((conf: any) => {
                //   if (conf[0].Success !== 1) {
                //     this.toastrService.warning(conf[0].msg, `Accesorios modificados. Se cancelo OC de los idParte:`)
                //   }
                // });

                this.refreshData();

              }else {
                this.toastrService.warning(res[0].Error);
              }
            }, err => {
              this.toastrService.error(err.error.error);
            });          
        } else {
          this.toastrService.warning(notPost[0].msg, `Adicionales no procesados, se afectó la utilidad. Favor de solicitar autorización`)
      }
    });
  }

  genPedido(template) {
    const result = this.modalService.open(template);
    result.result.then((isSaved: boolean) => {
      if (isSaved) {

        // Validamos perfiles
        this.pricingService.validaPerfiles(this.cotizacion.idCotizacion).subscribe((res1: any) => {
          this.mensajeValidacion = res1[0].msg;
          if (res1[0].Success !== 1) {

            // Validamos limite de credito
            this.pricingService.validaLimiteCredito(this.cotizacion.idCotizacion).subscribe((res2: any) => {
              this.mensajeValidacion = res2[0].msg;
              if (res2[0].Success !== 1) {

                // Validamos existencia
                this.pricingService.validaDisponibilidadFolio(this.cotizacion.idCotizacion, this.cotizacion.idDireccionFlotillas).subscribe((Folio: any) => {
                  if (Folio[0].Success !== 1) {

                    //Generamos pedido
                    this.pricingService.generacionDePedidoFlotillaBpro(this.idCotizacion, (this.cotizacion.status === 'APROBADA' ? 0 : 1)).subscribe((res: any) => {
                      if (res === true) {
                        this.validaRegresarCotizacion();
                        this.isUpdatePedido();
                        this.isUpdateGen();
                        this.ordenesCompletadas = false;
                        this.toastrService.success('Pedido Generado');
                        this.isPedido = true;
                      } else if (res === false) {
                        this.modal();
                      } else {

                      }
                    }, err => {
                      this.toastrService.error(err.error.error);
                    });
                  } else {
                    this.toastrService.warning(Folio[0].msg, `Validación de pedido. Favor de procesar los pedidos:`)
                  }
                });
              } else {
                this.toastrService.warning(this.mensajeValidacion, `Validación de credito`)
              }
            })
          } else {
            this.toastrService.warning(this.mensajeValidacion, `Validación de perfiles`)
          }
        });
      }
    });
  }

  regresarCotizacionModal(template) {
    const result = this.modalService.open(template);
    result.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.isRegresandoCotizacion = true;
        this.pricingService.getRegresaCotizacion(this.idCotizacion).subscribe((res: any) => {
          if (res[0].Success === 1) {
            this.toastrService.success('Se ha cancelado el grupo correctamente');
            this.router.navigate(['main/cotizaciones'], {
              queryParams: { idFlotilla: this.cotizacion.idDireccionFlotillas }
            });
          } else if (res[0].Success === 0) {
            this.toastrService.error('Se ha producido un error al intentar cancelar el grupo unidad. No se realizo ningun cambio.');
            //this.modal();
          } else {
          }
        }, err => {
          this.toastrService.error(err.error.error);
        });
      }
      else {
        this.toastrService.info('No se ha cancelado el grupo.');
      }
    });
  }

  //OCT99
  openModalCancelarGrupo(row, template) {

    this.pricingService.getResumenPreCancelaGrupoUnidad(this.idCotizacion, row.idGrupoUnidad).subscribe((resumen: any) => {
      const result = this.modalService.open(template);
      this.resumenGrupal = resumen[0].Success;
      result.result.then((isSaved: boolean) => {
        if (isSaved) {
          //this.isRegresandoCotizacion = true;
          this.pricingService.getCancelaGrupoUnidad(this.idCotizacion, row.idGrupoUnidad).subscribe((res: any) => {
            if (res[0].Success == 1) {
              this.toastrService.success('Se ha cancelado el grupo de la cotización correctamente: ' + res[0].Mensaje);
              this.refreshData();
            } else if (res[0].Success == 0) {
              this.toastrService.error('Se ha producido un error al intentar cancelar el grupo de unidad: ' + res[0].Mensaje);
              //this.modal();
            } else {
            }
          }, err => {
            this.toastrService.error(err.error.error);
          });
        }
        else {
          this.toastrService.info('No se ha cancelado el grupo.');
        }
      });
    }, err => {
      this.toastrService.error(err.error.error);
    });
  }

  //OCT99
  cancelarCotizacionModal(template) {
    this.pricingService.getResumenPreCancelaCotizacion(this.idCotizacion).subscribe((resumen: any) => {
      const result = this.modalService.open(template);
      this.resumenCotizacion = resumen[0].Success;
      result.result.then((isSaved: boolean) => {
        if (isSaved) {
          //this.isRegresandoCotizacion = true;
          this.pricingService.getCancelaCotizacion(this.idCotizacion).subscribe((res: any) => {
            if (res[0].Success == "1") {
              this.toastrService.success('Se ha cancelado la cotización correctamente');
              this.router.navigate(['main/cotizaciones'], {
                queryParams: { idFlotilla: this.cotizacion.idDireccionFlotillas }
              });
            } else {
              this.toastrService.error('Se ha producido un error al intentar cancelar la cotización: ' + res[0].Success);
            }
          }, err => {
            this.toastrService.error(err.error.error);
          });
        }
        else {
          this.toastrService.info('No se ha cancelado la cotización.');
        }
      });
    }, err => {
      this.toastrService.error(err.error.error);
    });
  }

  modal() {
    const modalLeyenda = this.modalService.open(InfoModalUnidadesComponent, { size: 'sm' });
    modalLeyenda.result.then((isSaved: boolean) => {
      if (isSaved) {
      }
    });
  }

  printDetalleUnidad(detalleUnidad) {
  }

  checkValue(row, detalleUnidad, event) {
    detalleUnidad.isCheck = event.currentTarget.checked;
    this.seleccionados += (detalleUnidad.isCheck) ? +1 : -1;
  }

  isMissinVin() {
    this.isMissing = false;
    this.cotizacion.gruposUnidades.forEach(uni => {
      uni.detalleUnidades.forEach(du => {
        if ((du.vin == null || du.vin.length < 1) && du.tipoMovimiento !== 'B') {
          this.isMissing = true;
        }
      });
    });
  }

  deleteDePedido(isAll) {
    const requestsSinFacturar = [] as any[];
    const requestsFacturar = [] as any[];
    this.cotizacion.gruposUnidades.forEach(uni => {
      uni.detalleUnidades.forEach((det: any) => {
        if (det.isCheck) {
          const request = {
            idCotizacion: this.cotizacion.idCotizacion,
            idGrupoUnidad: uni.idGrupoUnidad,
            idDetalleUnidad: det.idDetalleUnidad,
            vin: det.vin
          };
          if (det.estatus !== 'Facturada') {
            requestsSinFacturar.push(request);
          } else if (det.estatus === 'Facturada') {
            requestsFacturar.push(request);
          }
        }
      });
    });
    if (requestsSinFacturar.length === 0 && requestsFacturar.length === 0) {
      return;
    }
    if (isAll) {
      if (requestsFacturar.length > 0) {
        this.pricingService.cancelarUnidadesDePedido(requestsFacturar).subscribe(res => {
          this.toastrService.success('Registros eliminados');
          this.refreshData();
        });
      }
      if (requestsSinFacturar.length > 0) {
        this.deleteItems();
      }
    } else {
      this.pricingService.cancelarUnidadesDePedidoAll(requestsFacturar).subscribe(res => {
        this.toastrService.success('Registros eliminados');
        this.refreshData();
      });
    }
  }

  deleteItems() {
    const requests = [] as any[];
    this.cotizacion.gruposUnidades.forEach(uni => {
      uni.detalleUnidades.forEach((det: any) => {
        if (det.isCheck) {
          const request = {
            idCotizacion: this.cotizacion.idCotizacion,
            idGrupoUnidad: uni.idGrupoUnidad,
            idDetalleUnidad: det.idDetalleUnidad,
            procesadoBpro: 0,
            tipoMovimiento: 'B'
          };
          if (det.estatus !== 'Facturada') {
            requests.push(request);
          }
        }
      });
    });
    if (requests.length === 0) {
      return;
    }

    this.pricingService.deleteStatusProcesadoBpro(requests).subscribe(res => {
      this.toastrService.success('Registros eliminados');
      this.refreshData();
    });
  }

  crearOrden(progressBarModal) {
    const result = this.modalService.open(progressBarModal);
    this.progress = { nombre: '25% Cargando Trámites', porcentaje: '25%' };
    result.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.isGenOrder = true;
      }
    });
  }


  openLeyendaFactura(unidad, detalleUnidad, val) {
    if (unidad.estatus === 'Facturada') {
      return;
    }
    if (val === true) {
      return;
    }

    const modalLeyenda = this.modalService.open(LeyendaUnidadesComponent, { size: 'sm' });
    modalLeyenda.componentInstance.idCotizacion = this.cotizacion.idCotizacion;
    modalLeyenda.componentInstance.idDetalleUnidad = detalleUnidad;
    modalLeyenda.componentInstance.idUnidad = unidad;
    modalLeyenda.result.then((isSaved: boolean) => {
      if (isSaved) {
      }
    });
  }


  openModalEditar(item, val) {
    if (item.estatus === 'Facturada') {
      return;
    }
    if (val) {
      return;
    }
    const modalGrupoUnidad = this.modalService.open(CrearEditarSellingConditionComponent);
    modalGrupoUnidad.componentInstance.cotizacion = this.cotizacion;
    modalGrupoUnidad.componentInstance.detalleUnidad = item;
    modalGrupoUnidad.componentInstance.isNew = false;
    modalGrupoUnidad.result.then(res => {
      if (res) {
        this.refreshData();
      }
    });
  }

  cancelarFacturas() {
    const requests = [] as any[];
    this.cotizacion.gruposUnidades.forEach(uni => {
      uni.detalleUnidades.forEach((det: any) => {
        if (det.isCheck) {
          const request = {
            idCotizacion: this.cotizacion.idCotizacion,
            idGrupoUnidad: uni.idGrupoUnidad,
            idDetalleUnidad: det.idDetalleUnidad,
            procesadoBpro: 3,
            tipoMovimiento: 'C'
          };
          if (det.estatus === 'Facturada') {
            requests.push(request);
          }
        }
      });
    });
    if (requests.length === 0) {
      return;
    }
    this.pricingService.cancelarStatusProcesadoBpro(requests).subscribe(res => {
      this.toastrService.success('Factura(s) canceladas');
      this.refreshData();
    });

  }

  refreshData() {
    this.seleccionados = 0;
    this.gruposUnidades = [];
    this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
      this.isMissinVin();
      this.pricingService.cancelacionProcesada(this.idCotizacion).subscribe((res: any) => {
        this.cancelResonse = res;
      });
      if (this.cotizacion.status === 'PEDIDO GENERADO') {
        this.isPedido = true;
      }
      this.cotizacion.gruposUnidades.forEach((uni: any) => {
        const cUni = uni;
        cUni.detalleUnidades = cUni.detalleUnidades.filter(item => {
          return item.tipoMovimiento !== 'B';
        });
        if (cUni.detalleUnidades.length > 0) {
          cUni.cantidad = cUni.detalleUnidades.length;
          cUni.total = cUni.detalleUnidades.length * cUni.precio;
          this.gruposUnidades.push(cUni);
        }
      });
      this.gruposUnidades = [...this.gruposUnidades];
    });
    //chk ene 29 21k | validar SISCO
    // Fucnion valida si hay mas sisco
    this.existeSisco2();
    this.estatusSisco();
    this.isUpdatePedido();
    this.isUpdateGen();
    this.validaAgregarAccesoriosPostAd();
  }

  consolidacionFlotillasBpro() {
    this.pricingService.consolidacionFlotillasBpro(this.idCotizacion).subscribe(res => {
      this.isPedido = true;
      this.toastrService.success('Pedido Generado');
    });
  }

  openModalDelete(deleteTemplate: any, itemToDelete: any, modal) {

    if (this.seleccionados < 1) {
      this.toastrService.warning('No se ha seleccionado ninguna unidad para quitar.');
    }
    else {
      this.modalDelete = modal;
      const result = this.modalService.open(deleteTemplate);
      result.result.then((isSaved: any) => {
        if (isSaved === true || isSaved === 'all') {
          if (this.cotizacion.status === 'PEDIDO GENERADO') {
            this.deleteDePedido((isSaved === 'all') ? true : false);
          } else {
            this.deleteItems();
            this.cancelarFacturas();
          }
        }
      });
    }
  }

  addUnidades() {
    const modalGrupoUnidad = this.modalService.open(UnitFleetComponent);
    modalGrupoUnidad.result.then(res => {
      if (res) {
        this.refreshData();
      }
    });
  }

  addTraslado(row) {
    // let modalGrupoUnidad: any;
    // if(this.bProStatus>0){
    //const modalTraslados = this.modalService.open(ModalTrasladosComponent, { size: 'lg' });
    const modalTraslados = this.modalService.open(ModalTrasladosComponent, {size: 'lg', windowClass : 'trasladosModalClass' });
    modalTraslados.componentInstance.bProStatus = this.bProStatus;
    modalTraslados.componentInstance.idSucursal = this.cotizacion.idSucursal;
    modalTraslados.componentInstance.idMarca = this.cotizacion.idMarca;

    // } else {
    // const  modalGrupoUnidad = this.modalService.open(TransferComponent, { size: 'lg' });
    // }

    modalTraslados.result.then(res => {
      if (res) {
        this.refreshData();
      }
    });
  }

  muestraUtilidad(){
    // aquí vamos a cargar modal de utilidad
    const modalTraslados = this.modalService.open(ModalUtilidadComponent, {size: 'lg', windowClass : 'utilidadModalClass' });
    modalTraslados.componentInstance.idCotizacion = this.cotizacion.idCotizacion;
  }

  updatePedido() {
    // Cambio P10 - EHJ-COAL Mayo 31
          // Se agrego Validacion de existenia 
          this.pricingService.validaDisponibilidadInventarioPostUpdate(this.cotizacion.idCotizacion, this.cotizacion.idDireccionFlotillas)
          .subscribe((Folioupd: any) => {
            console.log(Folioupd)
            if (Folioupd[0].Success === 1) {
                this.pricingService.actualizarDePedidoFlotillaBpro(this.idCotizacion).subscribe(res => {
                this.isUpdatePedido();
                this.isUpdateGen();
                this.validaAgregarAccesoriosPostAd();
                this.toastrService.success('Pedido actualizado');
              }, err => {
                this.toastrService.error('Se ha producido un error al actualizar el pedido.');
            });
          }else{
          this.toastrService.warning(Folioupd[0].msg, `Validación de pedido.`)
        } 
    });
  }
  // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
  verificaUnidadesFacturadas() {
    this.pricingService.verificaUnidadesFacturadas(this.idCotizacion).subscribe((res: any) => {
      this.todasFacturadas = res.cotizacionFacturada;
    });
  }

  // OCT 99 20210215 GESTION - Agregar accesorios en Posteriores/Adicionales 1: activa , 0: desactiva
  validaAgregarAccesoriosPostAd() {
    this.pricingService.validaAgregarAccesoriosPostAd(this.idCotizacion).subscribe((res: any) => {
      this.activaAccesorios = res[0].Success;
    });
  }

  isUpdatePedido() {
    this.pricingService.getOrdenCompraPendientes(this.idCotizacion).subscribe((res: any) => {
      this.updatePedidoToken = res;
      if (this.updatePedidoToken) {
        this.pricingService.flotillasEvalua(this.idCotizacion).subscribe((res: any) => {

        });
      }
    });
  }

  isUpdateGen() {
    this.pricingService.verificarEnviadoBpro(this.idCotizacion).subscribe((res: any) => {
      this.isGenPedido = res;
    });
  }

  agregarCotizacionSisco() {
    this.enviandoSisco = true;

    //    this.accesorioCatalogService.getAccesoriosSISCO(this.idCotizacion).subscribe(async (respSisco: any) => {
    let respSisco: any;
    respSisco = this.OrdenASISCO;

    let dateTime = new Date()
    //console.log(dateTime.getFullYear + '-' + dateTime.getMonth + '-' + dateTime.getDay + ' ' + dateTime.toTimeString());
    let date = ("0" + dateTime.getDate()).slice(-2);
    // current month
    let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
    // current year
    let year = dateTime.getFullYear();
    // prints date in YYYY-MM-DD format
    let fecha = year + "-" + month + "-" + date + " " + dateTime.toLocaleTimeString();
    console.log('>>> respSisco', respSisco);
    this.accesorioCatalogService.getDatosSisco().subscribe(async (datos) => {

      //this.accesorioCatalogService.postSiscoLogin(datos[0].email, datos[0].password, datos[0].application, datos[0].urlLogin).subscribe(async (aut) => {
      // await this.loginSisco(datos[0].email, datos[0].password, datos[0].application, datos[0].urlLogin).then(async (aut: any[]) => {

          let token = environment.tokenSisco; 
          //aut[0].data.security.token;

          respSisco.forEach(async (accesorioSISCO) => {

            let solicitudSisco = new (SolicitudCotizacionSisco);

            solicitudSisco.rfcEmpresa = datos[0].rfcEmpresa;
            solicitudSisco.idCliente = datos[0].idCliente;
            solicitudSisco.numeroContrato = datos[0].numeroContrato;
            solicitudSisco.idCentroCosto = 0;
            solicitudSisco.idCentroCostoFolio = "";
            solicitudSisco.idObjeto = datos[0].idObjeto;
            solicitudSisco.idTipoObjeto = datos[0].idTipoObjeto;
            solicitudSisco.idClase = datos[0].idClase;
            solicitudSisco.idTipoSolicitud = datos[0].idTipoSolicitud;
            solicitudSisco.fecha = fecha;
            solicitudSisco.Propiedades = "";
            solicitudSisco.partidas = (accesorioSISCO.partidas === null) ? "" : accesorioSISCO.partidas;
            solicitudSisco.partidasNuevas = (accesorioSISCO.partidasNuevas === null) ? "" : accesorioSISCO.partidasNuevas;//"<partidas><partida><cantidad>5</cantidad><descripcion>Espejo X-Plus Flotilla</descripcion></partida></partidas>";
            solicitudSisco.comentarios = "Prueba alta solicitud Flotilla";
            solicitudSisco.idEmpresaBPRO = 0;
            solicitudSisco.idSucursalBPRO = 0;
            solicitudSisco.idAreaBPRO = 0;
            solicitudSisco.idUsuario=datos[0].idUsuario;

            console.log(solicitudSisco);

            this.accesorioCatalogService.postInsSolicitudCompra(solicitudSisco, token, datos[0].urlPostInsSolicitudCompra).subscribe(async (respSisco) => {

              if (respSisco[0].error === "") {

                let respuestas = respSisco[0].recordsets;

                let recordsets: string = '<recordsets>';

                respuestas.forEach(async (element) => {
                  recordsets += '<recordset>';
                  recordsets += this.OBJtoXML(element);
                  recordsets += '<idSolCompras>' + accesorioSISCO.idSolCompras + '</idSolCompras>';
                  recordsets += '</recordset>';
                });
                recordsets += '</recordsets>';

                let solicitudSiscoRespuesta = {
                  "idCotizacion": this.idCotizacion,
                  "respuesta": recordsets
                };

                console.log('recordset:');
                console.log(solicitudSiscoRespuesta);

                this.accesorioCatalogService.guardaSISCOSolicitudFlotillasPostAd(solicitudSiscoRespuesta).subscribe(async (respSiscoAvanza) => {

                  respuestas[0].forEach(element => {

                    //console.log(recordsets);

                    this.toastrService.info('Orden GENERADA en SISCO: ' + element.numeroOrden, 'Envio a SISCO');

                    if (element.error == "") {

                      let solicitudSiscoAvanza = {
                        "idSolicitud": element.idSolicitud,
                        "idTipoSolicitud": datos[0].idTipoSolicitud,
                        "idClase": datos[0].idClase,
                        "rfcEmpresa": datos[0].rfcEmpresa,
                        "idCliente": datos[0].idCliente,
                        "numeroContrato": datos[0].numeroContrato,
                        "pasoAvanza": (element.tipoSolicitudBPRO === "EM") ? "EstudioMercado" : "Cotizacion",
                        "faseAvanza": (element.tipoSolicitudBPRO === "EM") ? "Solicitud" : "Proceso"
                      };

                      this.accesorioCatalogService.PutAvanzaOrdenEspecifico(solicitudSiscoAvanza, token, datos[0].urlPutAvanzaOrdenEspecifico).subscribe(async (respSiscoAvanza) => {

                        this.toastrService.show('Orden AVANZADA en SISCO: ' + element.numeroOrden, 'Envio a SISCO');

                      });
                    }
                  });//foreach
                  //this.modalService.dismissAll();
                  //this.avanzaStepTraslados();
                });
              }
              else {
                this.toastrService.error('Ocurro un error al realizar la Solicitud en SISCO: ' + respSisco[0].error, 'Envio a SISCO');
              }

            },
              error => {
                //this.toastrService.error('Ocurro un error al realizar la Solicitud en SISCO: ' + error.message, 'Envio a SISCO');
                this.toastrService.error('Ocurro un error al realizar la Solicitud en SISCO: ' + error.error.excepcion.originalError.info.message, 'Envio a SISCO');
              });

          });//foreach accesorios
          this.modalService.dismissAll();
          // this.avanzaStepTraslados();
        // })//LOGIN SISCO
        // .catch(err => {
        //   let error = JSON.parse(err[0].Error);
        //   this.toastrService.error(error.errors[0].description, 'LOGIN SISCO');
        // });
    });
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

  actualiza() {
    this.refreshData();
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

  //Notificaciones EH
  obtenNotificacion(){
    this.pricingService.obtenNotificacion(this.idCotizacion).subscribe(resp => {
      this.aprobacion = resp[0].aprobacion;
      this.aprobacion2 = resp[1].aprobacion;
      this.aprobacion3 = resp[2].aprobacion;
      this.aprobacion4 = resp[3].aprobacion;
      this.aprobacion5 = resp[4].aprobacion;
      this.aprobacion6 = resp[5].aprobacion;
    });
  }

 getNameStatsu(value, type) {
    if (value === -1) {
      return 'Enviada';
    }
    if (value === 1) {
      return 'Pendiente';
    } else if (value === 2) {
      return 'En aprobacion';
    } else if (value === 3) {
      return 'Aprobado';
    } else if (value === 4) {
      return 'Rechazado';
    } else if (value === 5) {
      return 'Cancelado';
    } else if (value === 6) {
      return 'En Revisión';
    }
  }
  
  sendNot(value) {
    if (value === 17) {
      this.statusCotizacion = -1;
    } else if (value === 2) {
      this.isNotUtilidadLabel = -1;
    } else if (value === 9) {
      this.isNotUnidadesLabel = -1;
    } else if (value === 12) {
      this.isNotTrasladosLabel = -1;
    } else if (value === 3) {
      this.isNotCreditoLabel = -1;
    } else if (value === 18) {
      this.isNotCULabel = -1;
    }
    const aditionalInfo = '  ' + this.cliente.nombreCompleto + ', cotización ' + this.cotizacion.idCotizacion +
      ', monto total de la cotización ' + '$' + this.cotizacion.precioTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
      ' condición de pago ' + this.cotizacion.nombreCondicion +
      ', Iva ' + this.cotizacion.tasaIva + ', Financiera' + this.cotizacion.nombreFinanciera + ', Unidades ' +
      this.gruposUnidadesNot.gruposUnidades.length;
      //this.cotizacion.gruposUnidades.length;
      //OCT99
    const id = JSON.parse(localStorage.getItem('app_token')).data.user.id;
    const notification = new Notification();
    // chk - 06 jun 2020 GA cambio este servicio y se debe de enviar idempresa, idsucursal
    notification.idEmpresa = this.cotizacion.idEmpresa + '';
    notification.identificador = this.cotizacion.idCotizacion;
    notification.descripcion = 'Cotizacion: ' + aditionalInfo;
    notification.idSolicitante = id;
    notification.idEmpresa = this.cotizacion.idEmpresa + '';
    notification.idSucursal = this.cotizacion.idSucursal + '';
    notification.linkBPRO = 'http://' + window.location.hostname + ':' + window.location.port
      + '/main/lectura?idCotizacion='
      + this.cotizacion.idCotizacion + '&step=5' + '&idFlotilla=F1';
    notification.idTipoNotificacion = value;
    this.notificationService.createNotification(notification, true).subscribe(
      res => {
        this.toastSerivce.success('Notificación enviada');
      });
  }


  validaBotonUtilidad() {
    this.pricingService.validaBotonUtilidad(this.idUsuario)
    .subscribe((notf: any) => {
      if (notf[0].Success !== 1) {
        this.banderaBotonUtilidad = 1
      }
    })
  }

}
