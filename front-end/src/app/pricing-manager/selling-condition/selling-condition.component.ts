import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Cotizacion, GrupoUnidades, Cfdis, Financieras, DetalleUnidades, AprobacionUtilidadFlotillas, Cliente } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { PricingService, CondionesVentaService, ApproveCatalogService, ClientCatalogService } from 'src/app/services';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CrearEditarSellingConditionComponent } from './crear-editar-selling-condition/crear-editar-selling-condition.component';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification, NotificationUsers, NotificationUnidades } from 'src/app/models/notification.model';
import { GrupoChat } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';
import { SocketNotification } from 'src/app/models/socket.notification.model';
import { SocketNotificationService } from 'src/app/services/socket.notification.service';
import { PricingManagerService } from '../pricing.manager.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-selling-condition',
  templateUrl: './selling-condition.component.html',
  styleUrls: ['./selling-condition.component.scss'],
  providers: [PricingManagerService]
})

export class SellingConditionComponent implements OnInit {

  @ViewChild('groupTable') groupTable: DatatableComponent;

  /* Variables */
  step: number;
  idGrupoUnidad: number;
  idFlotilla: string;
  idLicitacion: string;
  idCotizacion: string;
  cotizacion: Cotizacion;
  isContinue = false;
  //OCT99
  gruposUnidades: Cotizacion;

  /* Originals */
  CfdisCatalogo: Cfdis[] = [];

  /* Copys */
  CfdisRows: any[] = [];

  /* Helpers */
  condicionesIn = [
    { idCondicion: 'C0', nombre: 'CREDITO' },
    { idCondicion: 'C1', nombre: 'CONTADO' }
  ] as any;

  aprobacionUtilidadFlotillas: AprobacionUtilidadFlotillas[] = [];

  expanded: any = {};
  isLoading = false;

  cliente = {
    rfc: '',
    nombreCompleto: '',
    celular: '',
    telefono: '',
    correo: ''
  };

  //SISCO
  closeResult = '';
  mensajeValidacion = '';

  constructor(
    private router: Router,
    private clientService: ClientCatalogService,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private pricingService: PricingService,
    private sellingService: CondionesVentaService,
    private notificationService: NotificationService,
    private approveCatalogService: ApproveCatalogService,
    private chatService: ChatService,
    private socketNotification: SocketNotificationService,
    public pricingManagerService: PricingManagerService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.getCfdi();
    this.getParams();

    this.isLoading = true;
    this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      this.isLoading = false
      if (cotizacion.status === 'EN PROCESO') {
        this.pricingManagerService.onlyRead = false;
      } else {
        this.pricingManagerService.onlyRead = true;
      }

      //OCT99 SOLO LECTURA
      if (this.pricingManagerService.perfilSoloLectura)
        this.pricingManagerService.onlyRead = true;

      this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
      this.clientService.getCliente(this.cotizacion.idCliente).subscribe((cliente: Cliente) => {
        this.cliente = cliente;
      });
      this.chatService.getGrupos().subscribe((grupos: GrupoChat[]) => {
        if (grupos.filter(cont => cont.idGrupoChat === cotizacion.idCotizacion).length === 0) {
          this.isContinue = true;
        }
      });

      //OCT99
      this.pricingService.getUnidadesInteresByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        this.gruposUnidades = cotizacion;
      });

    });
    this.approveCatalogService.getDirectionsProfits().subscribe((aprobacionesUtilidad: AprobacionUtilidadFlotillas[]) => {
      this.aprobacionUtilidadFlotillas = aprobacionesUtilidad;
    });
  }

  getValidateGrupoUnidad(cotizacion) {
    let grupoUnidad = [];
    if (cotizacion.gruposUnidades.length > 0) {
      grupoUnidad = cotizacion.gruposUnidades.map(grupo => (grupo !== null && grupo !== '' && grupo !== undefined && grupo.idCondicion));
    }
    return (grupoUnidad.length) ? false : true;
  }

  private getParams() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idFlotilla = params.idFlotilla as string;
      this.idCotizacion = params.idCotizacion as string;
      this.idLicitacion = params.idLicitacion as string;
      this.step = Number(params.step);
    });
  }

  private getCfdi() {
    this.sellingService.getAllCfdi().subscribe(res => {
      this.CfdisCatalogo = Object.assign([], res);
      this.CfdisRows = JSON.parse(JSON.stringify(this.CfdisCatalogo));
    });
  }

  /* Methods helpers */
  toggleExpandRow(row) {
    this.groupTable.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event: { type: string, value: GrupoUnidades }) {
    event.value.isToggled = !event.value.isToggled;
    if (event.value.isToggled) {
      const scrollWidth = this.groupTable.bodyComponent.scroller.parentElement.scrollWidth;
      this.groupTable.bodyComponent.scroller.parentElement.scroll(scrollWidth, 0);
    }
  }

  openModalEditar(item: any) {
    const modalGrupoUnidad = this.modalService.open(CrearEditarSellingConditionComponent);
    modalGrupoUnidad.componentInstance.cotizacion = this.cotizacion;
    if (item.idDetalleUnidad) {
      modalGrupoUnidad.componentInstance.detalleUnidad = item;
    } else {
      modalGrupoUnidad.componentInstance.grupoUnidad = item;
    }
    modalGrupoUnidad.result.then(res => {
      if (res) {
        this.ngOnInit();
      }
    });
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

  private irACotizacion() {
    this.router.navigate(['main/cotizaciones/manager/cotizacion'], {
      queryParams: {
        idFlotilla: this.idFlotilla,
        idLicitacion: this.idLicitacion,
        idCotizacion: this.idCotizacion,
        step: 5
      }
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  continuar(modal) {
    //SISCO
    this.pricingService.validaAccesoriosSisco(this.idCotizacion,2).subscribe(async (resp) => {
      console.log(resp);

      if (resp[0].Success === 0) {

        this.mensajeValidacion = resp[0].Mensaje;

        let activeModal = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

      }
      else {
        const id = JSON.parse(localStorage.getItem('app_token')).data.user.id;
  
        let isCredito = false;
  
        if (this.cotizacion.idCondicion === 'C0') {
          isCredito = true;
        }
  
        let isUnidadesInteres = false;
  
        let unidadesInteres = 0;
        //OCT99
        //this.cotizacion.gruposUnidades.forEach( unidades => {
        this.gruposUnidades.gruposUnidades.forEach(unidades => {
          if (unidades.unidadesInteres.length > 0) {
            isUnidadesInteres = true;
            unidadesInteres += unidades.unidadesInteres.length;
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
        //this.cotizacion.gruposUnidades.forEach( grupoUnidad => {
        this.gruposUnidades.gruposUnidades.forEach(grupoUnidad => {
          grupoUnidad.traslados.forEach(tras => {
            if (tras.utilidadTotal < 5) {
              isMagerTraslado = true;
            }
          });
        });
  
        const aditionalInfo = '  ' + this.cliente.nombreCompleto + ', cotización ' + this.cotizacion.idCotizacion +
          ', monto total de la cotización ' + '$' + this.cotizacion.precioTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
          ' condición de pago ' + this.cotizacion.nombreCondicion +
          ', Iva ' + this.cotizacion.tasaIva + ', Financiera' + this.cotizacion.nombreFinanciera + ', Unidades ' +
          this.cotizacion.gruposUnidades.length;
  
        const notificationUnidades = new NotificationUnidades();
        notificationUnidades.identificador = this.cotizacion.idCotizacion;
        notificationUnidades.descripcion = 'Aprobación de Unidad: ' + unidadesInteres + aditionalInfo;
        notificationUnidades.idSolicitante = id;
        notificationUnidades.idEmpresa = this.cotizacion.idEmpresa + '';
        notificationUnidades.idSucursal = this.cotizacion.idSucursal + '';
        notificationUnidades.linkBPRO = 'http://' + window.location.hostname + ':' + window.location.port
          + '/main/lectura?idCotizacion='
          + this.cotizacion.idCotizacion + '&step=5' + '&idFlotilla=F1';
        notificationUnidades.idTipoNotificacion = 9;
  
        const notification = new Notification();
        notification.idEmpresa = this.cotizacion.idEmpresa + '';
        notification.identificador = this.cotizacion.idCotizacion;
        notification.descripcion = 'Cotizacion de Crédito' + aditionalInfo;
        notification.idSolicitante = id;
        notification.idEmpresa = this.cotizacion.idEmpresa + '';
        notification.idSucursal = this.cotizacion.idSucursal + '';
        notification.linkBPRO = 'http://' + window.location.hostname + ':' + window.location.port
          + '/main/lectura?idCotizacion='
          + this.cotizacion.idCotizacion + '&step=5' + '&idFlotilla=F1';
        notification.idTipoNotificacion = 3;
  
  
  
        const users = [];
        const request = {
          idTipoNotificacion: 3,
          idEmpresa: this.cotizacion.idEmpresa,
          idSucursal: this.cotizacion.idSucursal
        };
        const grupoChat = new GrupoChat();
        grupoChat.idGrupoChat = this.cotizacion.idCotizacion;
        grupoChat.nombreGrupo = this.cotizacion.idCotizacion;
        grupoChat.contactos = [];
        this.chatService.saveGrupoChat(grupoChat).subscribe(response => {
          const contactos = [];
          this.notificationService.getNotificationUsers(request, isCredito).subscribe((user: NotificationUsers[]) => {
            if (user.length > 0) {
              user.forEach(item => {
                const socketNotification = new SocketNotification();
                socketNotification.idGrupoChat = this.cotizacion.idCotizacion;
                socketNotification.idNotificacion = null;
                socketNotification.link = 'http://' + window.location.hostname + ':' + window.location.port
                  + '/main/lectura/cotizacion?idCotizacion=' + this.cotizacion.idCotizacion + '&step=5' + '&idFlotilla=F1';
                socketNotification.idUsuario = item.idUsuario;
                socketNotification.idTipoNotificacion = 3;
                this.socketNotification.sendNotification(socketNotification).subscribe(subs => { });
                contactos.push({
                  idUsuario: item.idUsuario,
                  nombreCompleto: item.nombre,
                  telefono: item.telefono,
                  correo: item.correo
                });
              });
            }
            this.notificationService.getNotificationUsers(request, isUnidadesInteres).subscribe((user2: NotificationUsers[]) => {
              request.idTipoNotificacion = 9;
              if (user2.length > 0) {
                user2.forEach(item => {
                  const socketNotification = new SocketNotification();
                  socketNotification.idGrupoChat = this.cotizacion.idCotizacion;
                  socketNotification.idNotificacion = null;
                  socketNotification.link = 'http://' + window.location.hostname + ':' + window.location.port
                    + '/main/lectura/cotizacion?idCotizacion=' + this.cotizacion.idCotizacion + '&step=5' + '&idFlotilla=F1';
                  socketNotification.idUsuario = item.idUsuario;
                  socketNotification.idTipoNotificacion = 9;
                  this.socketNotification.sendNotification(socketNotification).subscribe(subs => { });
                  if (contactos.filter(cont => cont.idUsuario === item.idUsuario).length === 0) {
                    contactos.push({
                      idUsuario: item.idUsuario,
                      nombreCompleto: item.nombre,
                      telefono: item.telefono,
                      correo: item.correo
                    });
                  }
                });
              }
              request.idTipoNotificacion = 2;
              this.notificationService.getNotificationUsers(request, isUtilidad).subscribe((user3: NotificationUsers[]) => {
                if (user3.length > 0) {
                  user3.forEach(item => {
  
                    const socketNotification = new SocketNotification();
                    socketNotification.idGrupoChat = this.cotizacion.idCotizacion;
                    socketNotification.idNotificacion = null;
                    socketNotification.link = 'http://' + window.location.hostname + ':' + window.location.port
                      + '/main/lectura/cotizacion/cotizacion?idCotizacion=' + this.cotizacion.idCotizacion +
                      '&step=5' + '&idFlotilla=F1';
                    socketNotification.idUsuario = item.idUsuario;
                    socketNotification.idTipoNotificacion = 2;
                    this.socketNotification.sendNotification(socketNotification).subscribe(subs => { });
  
                    if (contactos.filter(cont => cont.idUsuario === item.idUsuario).length === 0) {
                      contactos.push({
                        idUsuario: item.idUsuario,
                        nombreCompleto: item.nombre,
                        telefono: item.telefono,
                        correo: item.correo
                      });
                    }
                  });
                }
                const userToken = JSON.parse(localStorage.getItem('app_token')).data.user;
                contactos.push({
                  idUsuario: userToken.id,
                  nombreCompleto: userToken.fullname,
                  telefono: userToken.phone,
                  correo: userToken.email
                });
                grupoChat.contactos = contactos;
                this.chatService.saveGrupoChat(grupoChat).subscribe(response => {
                  if (this.cotizacion != undefined) {
                    if (this.step < 5) {
                      this.pricingService.updateStep(this.idCotizacion, 5).subscribe(() => {
                        this.irACotizacion();
                      });
                    } else {
                      this.irACotizacion();
                    }
                  }
                });
              });
            });
          });
        });
      }
    });
  }

}
