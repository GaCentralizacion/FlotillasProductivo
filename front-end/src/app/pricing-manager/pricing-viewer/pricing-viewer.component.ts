import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Cotizacion, Cliente, ClienteFilter, GrupoUnidades, GrupoUnidadesUnidadInteres,  AprobacionUtilidadFlotillas, Traslado, DetalleUnidades } from 'src/app/models';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { PricingService, ClientCatalogService, ApproveCatalogService, TrasladosCatalogService } from 'src/app/services';
import { PricingViewerEditorComponent } from './conditions/pricing-viewer.conditions.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PricingViewerPDFComponent } from './pdf/pricing-viewer.pdf.component';
import { PricingViewerCloseComponent } from './close/pricing-viewer.close.component';
import { NotificationService } from 'src/app/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { PricingManagerService } from '../pricing.manager.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { Notification } from 'src/app/models/notification.model';
import { BonificacionComponent } from './bonificacion/bonificacion.component';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ValidateVinComponent } from './validate-vin/validate-vin.component';
 
@Component({
  selector: 'app-pricing-viewer',
  templateUrl: './pricing-viewer.component.html',
  styleUrls: ['./pricing-viewer.component.scss'],
  providers: [PricingManagerService],
  encapsulation: ViewEncapsulation.None
})
export class PricingViewerComponent implements OnInit, AfterViewInit {

  @ViewChild(DatatableComponent) mainTable: DatatableComponent;
  @ViewChild('content') content: ElementRef;

  aprobacionUtilidadFlotillas: AprobacionUtilidadFlotillas[] = [];

  isHide = false;
  isFirstTime = true;
  statusCotizacion = 0;
  rowHeight = 0;
  lastRowHeight = 0;
  idCotizacion;
  idFlotilla;
  cotizacion;
  original;
  cliente = {
    rfc: '',
    nombreCompleto: '',
    celular: '',
    telefono: '',
    correo: ''
  };
  grupoUnidades: GrupoUnidades[];
  selected = [];
  currentGrupoUnidad = 0;
  htmlContent;
  isClose = false;
  verUtilidad = false;
  verBonificacion = false;
  isLoading = false;
  contacto = '';
  //OCT99
  gruposUnidades: Cotizacion;
  accesoriosUG: [];
  tramitesUG: [];
  serviciosUnidadUG: [];
  unidadesInteresesUG: GrupoUnidadesUnidadInteres[];
  unidadesGrupo: DetalleUnidades[];

  rutas = [] as any[];

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

  margenUtilidadTraslado = 0;

  config: ScrollToConfigOptions = {
    target: 'INITIAL',
    offset: -200,
    duration: 350
  };


  constructor(
    private router: Router,
    private pricingService: PricingService,
    private route: ActivatedRoute,
    private clientService: ClientCatalogService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private toastSerivce: ToastrService,
    public pricingManagerService: PricingManagerService,
    private approveCatalogService: ApproveCatalogService,
    private trasladoService: TrasladosCatalogService,
    private _scrollToService: ScrollToService
  ) { }

  ngOnInit() {

    this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
      this.rutas = rutas;
    });
    const token = JSON.parse(localStorage.getItem('app_token'));
    const cotizacionModule = token.data.permissions.modules.find(m => m.name == 'Cotizaciones');
    if (cotizacionModule) {
      this.verUtilidad = cotizacionModule.objects.some(o => o.name == 'verUtilidad');
      this.verBonificacion = cotizacionModule.objects.some(o => o.name == 'verBonificacion');
    }
    this.getParams();
    this.approveCatalogService.getDirectionsProfits().subscribe((aprobacionesUtilidad: AprobacionUtilidadFlotillas[]) => {
      this.aprobacionUtilidadFlotillas = aprobacionesUtilidad;
    });

    this.pricingService.obtieneMargenUtilidadTraslado(this.idFlotilla)
          .subscribe((disp: any) => {
            this.margenUtilidadTraslado = disp;
          });
    this.getCotizacionesById();        
  }

  ngAfterViewInit(): void { }

  editBonificacion(row) {
    const modalNot = this.modalService.open(BonificacionComponent);
    modalNot.componentInstance.cotizacion = this.cotizacion;
    modalNot.componentInstance.catalogo = row.catalogo;
    modalNot.componentInstance.anio = row.anio;
    modalNot.componentInstance.idGrupoUnidad = row.idGrupoUnidad;
    modalNot.componentInstance.bonificacionCurrent = row.bonificacion;
    modalNot.componentInstance.ID = row.idBonificacion;
    modalNot.result.then((isSaved: boolean) => {
      this.getCotizacionesById();
    });
  }


  getParams() {
    this.route.queryParams.subscribe(params => {
      this.idFlotilla = params.idFlotilla;
      this.idCotizacion = params.idCotizacion;
    });
  }

  onSelect(event) {
  }

  getCotizacionesById() {
    this.isLoading = true;
    this.pricingService.getUnidadesInteresGrupoByIdCotizacion(this.idCotizacion).subscribe((unidadesInteres: any) => {
        this.unidadesInteresesUG = unidadesInteres;
    });

    this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {

      this.isLoading = false;
      if (cotizacion.status === 'EN PROCESO') {
        this.pricingManagerService.onlyRead = false;
      } else {
        this.pricingManagerService.onlyRead = true;
      }

      //OCT99 SOLO LECTURA
      if(this.pricingManagerService.perfilSoloLectura)
        this.pricingManagerService.onlyRead = true;

      this.isClose = true;
      this.cotizacion = cotizacion;
      //OCT99
      this.pricingService.getUnidadesCierreByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {  
        this.gruposUnidades = cotizacion;        
        this.cotizacion.grupoUnidades = this.gruposUnidades.gruposUnidades;

      //});

      this.searchNoti();
      this.original = cotizacion.clienteOriginal;
     // if (cotizacion.status !== 'EN PROCESO') {
        // chk ValidateVinComponent
        this.pricingService.validaDisponibilidadCierreCot(cotizacion.idCotizacion)
          .subscribe((disp: any) => {
            // console.log(disp[0].Success);
            if (disp[0].Success !== 1 && cotizacion.status === 'EN PROCESO') {
              const dirtyVines = disp[0].Success; // .Success.split(',');
              this.modalvin(dirtyVines, this.cotizacion.idCotizacion);
            } else {
              // proceso orriginal
              if (cotizacion.notificacion === false) {
                const ngbModalOptions: NgbModalOptions = {
                  backdrop: 'static',
                  keyboard: false,
                  size: 'lg'
                };

                const aditionalInfo = '  ' + this.cliente.nombreCompleto + ', cotización ' + this.cotizacion.idCotizacion +
                  ', monto total de la cotización ' + '$' + this.cotizacion.precioTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
                  ' condición de pago ' + this.cotizacion.nombreCondicion +
                  ', Iva ' + this.cotizacion.tasaIva + ', Financiera' + this.cotizacion.nombreFinanciera + ', Unidades ' +
                  this.gruposUnidades.gruposUnidades.length;  
                  //OCT99
                  //this.cotizacion.gruposUnidades.length;

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
                notification.idTipoNotificacion = 17;

                if (cotizacion.notificacion === false && this.isFirstTime) {


                  ///////////////////////

                  let isUnidadesInteres = false;

                  let unidadesInteres = 0;
                  //OCT99
                  //this.cotizacion.gruposUnidades.forEach(unidades => {
                  /*
                  this.gruposUnidades.gruposUnidades.forEach(unidades => {  
                    if (unidades.unidadesInteres.length > 0) {
                      isUnidadesInteres = true;
                      unidadesInteres += unidades.unidadesInteres.length;
                    }
                  });
                  */
                  this.unidadesInteresesUG.forEach(unidades => {  
                    if (unidades.unidadesIntereses > 0) {
                      isUnidadesInteres = true;
                      unidadesInteres += unidades.unidadesIntereses;
                      }                      
                  });

                  let isUtilidad = false;

                  const utilidad = ((this.cotizacion.precioTotal - this.cotizacion.costoTotal) / this.cotizacion.costoTotal) * 100;

                  const usuarioAprobacion = this.aprobacionUtilidadFlotillas.filter(item => item.idUsuario === id);
                  if (usuarioAprobacion.length > 0) {
                    if (usuarioAprobacion[0].margenUtilidad > utilidad) {
                      isUtilidad = true;
                    }
                  }
                  
                  let isMagerTraslado = false;
                  //OCT99
                  //this.cotizacion.gruposUnidades.forEach(grupoUnidad => {
                  this.gruposUnidades.gruposUnidades.forEach(grupoUnidad => {  
                    grupoUnidad.traslados.forEach(tras => {
                      if (tras.utilidadTotal < this.margenUtilidadTraslado) {
                        isMagerTraslado = true;
                      }
                    });
                  });

                  let cargoUnidad = false;
                  if (cotizacion.tipoOrden === 'CU' && cotizacion.tipoCargoUnidad === 'Suma') {
                    cargoUnidad = true;
                  }


                  let isCredito = false;
                  if (cotizacion.idCondicion === 'C0') {
                    isCredito = true;
                  }

                  ///////////////////////


                  ///////////////////////
                  // chk -> Verifico el status en la tabla de Cotizacion si es 0 envio de nuvo la notificaicon
                  this.pricingService.status1erNotificacion(cotizacion.idCotizacion)
                  .subscribe(val => {
                    console.log('>>> esatus noti Dania ', val['notificacionCot1er']);
                    if (val['notificacionCot1er'] === 0) {
                      this.notificationService.createNotification(notification, true)
                      .subscribe(
                        res => {
                          this.notificationService.getNotification(cotizacion.idCotizacion, 17)
                          .subscribe(resp => {
                            console.log('>>>> Respuesta crear noti', resp);
                            if (resp[0].length > 0) {
                              // chk marco la notificacion de dania como enviada
                              this.pricingService.udp1erNotificacion(cotizacion.idCotizacion, 1)
                              .subscribe(resp1 => {});
                              this.statusCotizacion = resp[0][0].not_estatus;
                            }
                          });
                        });
                    } else {
                    this.notificationService.getNotification(cotizacion.idCotizacion, 17).subscribe(val => {
                      if (val[0].length != 0){
                        if(val[0][0].not_estatus === 3) {
                        const modalNot = this.modalService.open(NotificationsComponent, ngbModalOptions);
                        modalNot.componentInstance.cotizacion = this.cotizacion;
                        modalNot.componentInstance.isUnidadesInteres = isUnidadesInteres;
                        modalNot.componentInstance.isUtilidad = isUtilidad;
                        modalNot.componentInstance.isMagerTraslado = isMagerTraslado;
                        modalNot.componentInstance.cargoUnidad = cargoUnidad;
                        modalNot.componentInstance.isCredito = isCredito;


                        modalNot.result.then((isSaved: boolean) => {
                          if (isSaved) {


                            let isUnidadesInteresP = false;

                            let unidadesInteresP = 0;
                            //OCT99
                            //this.cotizacion.gruposUnidades.forEach(unidades => {
                            /*
                            this.gruposUnidades.gruposUnidades.forEach(unidades => {
                              if (unidades.unidadesInteres.length > 0) {
                                isUnidadesInteresP = true;
                                unidadesInteresP += unidades.unidadesInteres.length;
                              }
                            });
                            */
                            this.unidadesInteresesUG.forEach(unidades => {
                              if (unidades.unidadesIntereses > 0) {
                                isUnidadesInteresP = true;
                                unidadesInteresP += unidades.unidadesIntereses;
                              }
                            });

                            let isUtilidadP = false;

                            const utilidadP = (
                              (this.cotizacion.precioTotal - this.cotizacion.costoTotal) / this.cotizacion.costoTotal) * 100;
                            const usuarioAprobacionP = this.aprobacionUtilidadFlotillas.filter(item => item.idUsuario === id);
                            if (usuarioAprobacionP.length > 0) {
                              if (usuarioAprobacionP[0].margenUtilidad > utilidadP) {
                                isUtilidadP = true;
                              }
                            }

                            let isMagerTrasladoP = false;
                            //OCT99
                            //this.cotizacion.gruposUnidades.forEach(grupoUnidad => {
                            this.gruposUnidades.gruposUnidades.forEach(grupoUnidad => {
                              grupoUnidad.traslados.forEach(tras => {
                                if (tras.utilidadTotal < this.margenUtilidadTraslado) {
                                  isMagerTrasladoP = true;
                                }
                              });
                            });

                            let cargoUnidadP = false;
                            if (cotizacion.tipoOrden === 'CU' && cotizacion.tipoCargoUnidad === 'Suma') {
                              cargoUnidadP = true;
                            }
                            let isCreditoP = false;
                            if (cotizacion.idCondicion === 'C0') {
                              isCreditoP = true;
                            }

                            notification.idTipoNotificacion = 9;
                            this.notificationService.createNotification(notification, isUnidadesInteresP).subscribe(res1 => {
                              // chk - 06 jun 2020 GA cambio este servicio y se debe de enviar idempresa, idsucursal
                              notification.idTipoNotificacion = 2;
                              this.notificationService.createNotification(notification, isUtilidadP).subscribe(res2 => {
                                notification.idTipoNotificacion = 12;
                                this.notificationService.createNotification(notification, isMagerTrasladoP).subscribe(res3 => {
                                  notification.idTipoNotificacion = 18;
                                  this.notificationService.createNotification(notification, cargoUnidadP).subscribe(res4 => {
                                    notification.idTipoNotificacion = 3;
                                    this.notificationService.createNotification(notification, isCreditoP).subscribe(res5 => {
                                      this.searchNoti();
                                      this.isFirstTime = false;
                                      this.ngOnInit();
                                    });
                                  });
                                });
                              });
                            });
                          }
                        });
                      }
                    }
                    });
                    }
                  });

                }

              }
               // console.log(this.statusCotizacion);
              //OCT99
              //this.grupoUnidades = cotizacion.gruposUnidades;
              this.grupoUnidades = this.gruposUnidades.gruposUnidades;              
              this.clientService.getCliente(this.cotizacion.idCliente).subscribe((cliente: Cliente) => {
                this.cliente = cliente;
              });
              this.clientService.getCliente(this.cotizacion.idClienteContacto).subscribe((cliente: Cliente) => {
                this.contacto = cliente.nombreCompleto;
              });
            }
          });

      });//OCT99 cierre de getUnidadesInteresByIdCotizacion   
     // }

    });
  }

  openEditor() {
    const modalEntrega = this.modalService.open(PricingViewerEditorComponent, { size: 'lg' });
    modalEntrega.componentInstance.idCotizacion = this.idCotizacion;
    modalEntrega.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.ngOnInit();
        this.selected = [];
      }
    });
  }

  apartados(row){
    var newArray: GrupoUnidadesUnidadInteres[]; 
    newArray = this.unidadesInteresesUG.filter(function (el){
        return el.idGrupoUnidad = row.idGrupoUnidad; 
    });
    
    return newArray[0].unidadesIntereses;
    //return 99;
  }


  toggleExpandRow(row) {
    this.pricingService.getDetalleUnidadGrupoByIdCotizacionGrupo(row.idCotizacion,row.idGrupoUnidad).subscribe((unidadesGrupo: any) => {
      if (this.currentGrupoUnidad !== row.idGrupoUnidad) {
        if (this.currentGrupoUnidad > 0) {
          this.mainTable.rowDetail.collapseAllRows();
        }
      }
      this.mainTable.rowDetail.toggleExpandRow(row);
      //this.rowHeight = (row.detalleUnidades.length * 33) + 20;
      //this.lastRowHeight = (row.detalleUnidades.length * 33) + 20;
      this.rowHeight = (unidadesGrupo.length * 33) + 20;
      this.lastRowHeight = (unidadesGrupo.length * 33) + 20;
      this.currentGrupoUnidad = row.idGrupoUnidad;
    });
  }

  exportPDF(type) {
    if (this.statusCotizacion !== 3) {
      return;
    }
    const config: ScrollToConfigOptions = {
      offset: -1000
    };
    this._scrollToService.scrollTo(config);
    const modalPDF = this.modalService.open(PricingViewerPDFComponent, { size: 'lg' });
    modalPDF.componentInstance.cotizacion = this.cotizacion;
    modalPDF.componentInstance.type = type;
    modalPDF.componentInstance.emailClient = this.cliente.correo;
    modalPDF.componentInstance.verUtilidad = this.verUtilidad;
    modalPDF.componentInstance.isDirector = false;
    modalPDF.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.ngOnInit();
        this.selected = [];
      }
    });
  }

  missingAprob() {
    if (!this.cotizacion) {
      return;
    }
    let missing = false;
    if (this.cotizacion.notificacion === false) {
      return true;
    }
    if (this.isNotCredito) {
      if (this.isNotCreditoLabel !== 3) {
        missing = true;
      }
    }
    if (this.isNotUnidades) {
      if (this.isNotUnidadesLabel !== 3) {
        missing = true;
      }
    }
    if (this.isNotTraslados) {
      if (this.isNotTrasladosLabel !== 3) {
        missing = true;
      }
    }
    if (this.isNotUtilidad) {
      if (this.isNotUtilidadLabel !== 3) {
        missing = true;
      }
    }
    if (this.isNotCU) {
      if (this.isNotCULabel !== 3) {
        missing = true;
      }
    }
    if (this.statusCotizacion !== 3) {
      missing = true;
    }
    return missing;
  }

  searchNoti() {
    this.notificationService.getNotification(this.cotizacion.idCotizacion, 3).subscribe(res => {
      if (res[0].length > 0) {
        if (res[0][0].not_estatus) {
          this.isNotCredito = true;
          this.isNotCreditoLabel = res[0][0].not_estatus;
        }
      }
    });
    this.notificationService.getNotification(this.cotizacion.idCotizacion, 9).subscribe(res => {
      if (res[0].length > 0) {
        if (res[0][0].not_estatus) {
          this.isNotUnidades = true;
          this.isNotUnidadesLabel = res[0][0].not_estatus;
        }
      }
    });
    this.notificationService.getNotification(this.cotizacion.idCotizacion, 12).subscribe(res => {
      if (res[0].length > 0) {
        if (res[0][0].not_estatus) {
          this.isNotTraslados = true;
          this.isNotTrasladosLabel = res[0][0].not_estatus;
        }
      }
    });
    this.notificationService.getNotification(this.cotizacion.idCotizacion, 2).subscribe(res => {
      if (res[0].length > 0) {
        if (res[0][0].not_estatus) {
          this.isNotUtilidad = true;
          this.isNotUtilidadLabel = res[0][0].not_estatus;
        }
      }
    });
    this.notificationService.getNotification(this.cotizacion.idCotizacion, 17).subscribe(res => {
      if (res[0].length > 0) {
        if (res[0][0].not_estatus) {
          this.statusCotizacion = res[0][0].not_estatus;
        }
      }
    });
    this.notificationService.getNotification(this.cotizacion.idCotizacion, 18).subscribe(res => {
      if (res[0].length > 0) {
        if (res[0][0].not_estatus) {
          this.isNotCU = true;
          this.isNotCULabel = res[0][0].not_estatus;
        }
      }
    });
  }
  
  getUtilidadTotal(unidades) {
    let total = 0;
    unidades.serviciosUnidad.forEach(ser => {
      total += (ser.precio);
    });
    unidades.tramites.forEach(ser => {
      total += ser.precio;
    });
    unidades.accesorios.forEach(ser => {
      total += (ser.precio * ser.cantidad);
    });
    return total;
  }
  
/*
  getUtilidadTotal(unidades) {
    this.pricingService.getAdicionalesCierrebyIdCotizacionGrupoUnidad(unidades.idCotizacion,unidades.idGrupoUnidad).subscribe((adicionales: any) => {
      
      var accesorios = adicionales[0];
      var tramites = adicionales[1];
      var servicios = adicionales[2];
      
      let total = 0;
      servicios.forEach(ser => {
        total += (ser.precio);
      });
      tramites.forEach(ser => {
        total += ser.precio;
      });
      accesorios.forEach(ser => {
        total += (ser.precio * ser.cantidad);
      });
      return total;
    });
  } */ 

  /*
  expandRow(unidades, row) {
    const current = unidades.expand;
    this.rowHeight = this.lastRowHeight;
    row.detalleUnidades.forEach(unidad => {
      if (unidad.expand) {
        unidad.expand = false;
      }
    });
    if (current) {
      unidades.expand = false;
    } else {
      unidades.expand = true;
      this.rowHeight += (unidades.tramites.length * 33) + 20 + (unidades.accesorios.length * 33) + (unidades.serviciosUnidad.length * 33);
    }
  }
*/
  expandRow(unidades, row) {

    this.pricingService.getAdicionalesCierrebyIdCotizacionGrupoUnidad(row.idCotizacion,row.idGrupoUnidad).subscribe((adicionales: any) => { 
      //console.log('expandRow - > unidades');
      //console.log(unidades);
      this.pricingService.getDetalleUnidadGrupoByIdCotizacionGrupo(row.idCotizacion,row.idGrupoUnidad).subscribe((unidadesGrupo: any) => {
       
        //this.unidadesGrupo = unidadesGrupo;

        unidades.accesorios = adicionales[0];
        unidades.tramites = adicionales[1];
        unidades.serviciosUnidad = adicionales[2];

        this.accesoriosUG = unidades.accesorios;      
        this.tramitesUG = unidades.tramites;
        this.serviciosUnidadUG = unidades.serviciosUnidad;

        /*
        console.log('this.accesoriosUG');
        console.log(this.accesoriosUG);
        console.log('this.tramitesUG');
        console.log(this.tramitesUG);
        console.log('this.serviciosUnidadUG');
        console.log(this.serviciosUnidadUG);
        */
        const current = unidades.expand;
        this.rowHeight = this.lastRowHeight;
        //row.detalleUnidades.forEach(unidad => {
        unidadesGrupo.forEach(unidad => {
          if (unidad.expand) {
            unidad.expand = false;
          }
        });
        if (current) {
          unidades.expand = false;
        } else {
          unidades.expand = true;
          //this.rowHeight += (unidades.tramites.length * 33) + 20 + (unidades.accesorios.length * 33) + (unidades.serviciosUnidad.length * 33);
          this.rowHeight += (this.tramitesUG.length * 33) + 20 + (this.accesoriosUG.length * 33) + (this.serviciosUnidadUG.length * 33);
        }
      });
    });
  }

  onDetailToggle(evento: { type: string, value: GrupoUnidades }) {
    if (evento.value.isToggled === undefined) {
      return;
    }
    evento.value.isToggled = !evento.value.isToggled;
    if (evento.value.isToggled) {
      const scrollWidth = this.mainTable.bodyComponent.scroller.parentElement.scrollWidth;
      this.mainTable.bodyComponent.scroller.parentElement.scroll(scrollWidth, 0);
    }
  }
  //OCT99
  muestraUnidadesGrupo(evento: { type: string, value: GrupoUnidades }) {
    //console.log('muestraUnidadesGrupo');
    //console.log(evento.value.idGrupoUnidad);

    this.pricingService.getDetalleUnidadGrupoByIdCotizacionGrupo(this.idCotizacion,evento.value.idGrupoUnidad).subscribe((unidadesGrupo: any) => {
       
      this.unidadesGrupo = unidadesGrupo;

      if (evento.value.isToggled === undefined) {
        return;
      }
      evento.value.isToggled = !evento.value.isToggled;
      if (evento.value.isToggled) {
        const scrollWidth = this.mainTable.bodyComponent.scroller.parentElement.scrollWidth;
        this.mainTable.bodyComponent.scroller.parentElement.scroll(scrollWidth, 0);
      }
    });
    
  }

  cargoAccesorios(unidades) {
    let total = 0;
    /*
    unidades.accesorios.forEach(element => {
      total += (element.cantidad * element.precio);
    });
    */
    return total;
  }

  cargoServicios(unidades) {
    let total = 0;
    /*
    unidades.serviciosUnidad.forEach(servicios => {
      total += (((servicios.cantidad) ? servicios.cantidad : 1) * servicios.precio);
    });
    */
    return total;
  }

  cargoTramites(unidades) {
    let total = 0;
    /*
    unidades.tramites.forEach(tra => {
      total += (((tra.cantidad) ? tra.cantidad : 1) * tra.precio);
    });
    
    /*
    this.tramitesUG.forEach(tra => {
      total += (((tra.cantidad) ? tra.cantidad : 1) * tra.precio);
    });
    */

    return total;
  }

  cargoSubTotal(unidades) {
    return this.cargoAccesorios(unidades) + this.cargoServicios(unidades) + this.cargoTramites(unidades);
  }

  closeCot() {
    const modalPDF = this.modalService.open(PricingViewerCloseComponent, { size: 'lg' });
    modalPDF.componentInstance.cotizacion = this.cotizacion;
    modalPDF.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.ngOnInit();
        this.selected = [];
      }
    });

  }

  getTotal() {
    let total = 0;
    //OCT99
    //this.cotizacion.gruposUnidades.forEach(row => {
    this.gruposUnidades.gruposUnidades.forEach(row => {  
      total += (row.precioTotalTotal);
    });
    return total;
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
      this.gruposUnidades.gruposUnidades.length;
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

  getNombreUbicacion(idTraslado, type) {
    if (this.rutas.length > 0 && idTraslado) {
      const ruta = this.rutas.filter(rt => {
        return rt.idTraslado === idTraslado;
      })[0];
      if (type === 'Destino') {
        return ruta.ubicacionDestino.nombre;
      } else {
        return ruta.ubicacionOrigen.nombre;
      }
    } else {
      return '';
    }
  }

  getTraslados(row) {
    const childs = this.list_to_tree(row);
    return childs;
  }

  list_to_tree(list) {
    const map = {};
    let node;
    const roots = [];

    for (let i = 0; i < list.length; i += 1) {
      map[list[i].idCotizacionTraslado] = i;
      list[i].children = [];
    }

    for (let i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.idCotizacionTrasladoPadre && node.idCotizacionTrasladoPadre !== '0') {
        list[map[node.idCotizacionTrasladoPadre]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  showHide() {
    this.isHide = !this.isHide;
  }

  modalvin(vines: string, idCotizacion: string) {
    const modalRef = this.modalService.open(ValidateVinComponent, { size: 'sm' });
    modalRef.componentInstance.vinesOcupaodos = vines;
    modalRef.componentInstance.idCotizacion = idCotizacion;
    modalRef.componentInstance.idDireccionFlotillas = this.cotizacion.idDireccionFlotillas;
  }

}
