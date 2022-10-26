import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Cotizacion, Cliente, ClienteFilter, GrupoUnidades, Traslado } from 'src/app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { PricingService, ClientCatalogService, TrasladosCatalogService, CondionesVentaService } from 'src/app/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ValidateVinComponent } from '../validate-vin/validate-vin.component';
import { equalSegments } from '@angular/router/src/url_tree';

@Component({
  selector: 'app-pricing-viewer-close',
  templateUrl: './pricing-viewer.close.component.html',
  styleUrls: ['./pricing-viewer.close.component.scss'],
})
export class PricingViewerCloseComponent implements OnInit, AfterViewInit {


  @ViewChild('clienteNgSelect') public clienteNgSelect: NgSelectComponent;

  public cotizacion;
  loadClientes = 'Sin Información';

  filter: any = {};

  clienteInfo;
  idCliente;
  nombreCliente;
  clientes: any[] = [];

  orden = '';
  file: any;
  file64;
  isOrden = false;

  isBusy = false;

  //OCT99
  isEjecutando = false;

  clientValue = false;
  progress: any;
  isGenOrder: boolean;
  progressBarModal1: string;
  vinesOcupaodos: any;

  constructor(
    private trasladoService: TrasladosCatalogService,
    private activeModal: NgbActiveModal,
    private sellingService: CondionesVentaService,
    private pricingService: PricingService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private cliCatalogoService: ClientCatalogService
  ) { }

  ngOnInit() {
    this.filter = {
      pagina: 1,
      numeroRegistros: 200,
      rfc: '',
      nombreCompleto: '',
      idFlotilla: this.cotizacion.idDireccionFlotillas,
      idCfdiUnidades: '',
      idCfdiAccesorios: ''
    };
    this.getClientes(this.filter);
  }

  ngAfterViewInit(): void {
  }

  continue() {
    //OCT99
    this.isEjecutando = true;
    if (this.isBusy) {
      return;
    }
    this.isBusy = true;
    const request = {
      idCotizacion: this.cotizacion.idCotizacion,
      numeroOrden: null,
      orden: null
    };
    if (this.isOrden) {
      request.numeroOrden = this.orden;
      request.orden = this.file64;
    }
    const requestFacturacion = {
      idCotizacion: this.cotizacion.idCotizacion,
      idCliente: this.idCliente,
      nombreCliente: this.nombreCliente
    };
    // Cambio P10 - EHJ-COAL
    // Se agrego Validacion de existenia 
    this.pricingService.validaDisponibilidadInventario(this.cotizacion.idCotizacion, this.cotizacion.idDireccionFlotillas)
    .subscribe((valida: any) => {
      if (valida[0].Success !== 1) {
        this.toastrService.warning(valida[0].msg, `Favor de procesar órdenes de compra generadas. No cuenta con existencia en:`)
      }
    });
    // Cambio P07 - EHJ-COAL
    // Se agrego Validacion de existenia 
    this.pricingService.insertaBitacoraUtilidad(this.cotizacion.idCotizacion, 1)
    .subscribe((valida: any) => {
      if (valida[0].Success !== 1) {
        // Se inserto Utilidad
      }
    });
    this.pricingService.validaDisponibilidadCierreCot(this.cotizacion.idCotizacion)
      .subscribe((disp: any) => {
        // console.log(disp[0].Success);
        if (disp[0].Success !== 1) {
          const dirtyVines = disp[0].Success.split(',');
          this.activeModal.close(false);
          this.modalvin(dirtyVines, this.cotizacion.idCotizacion);
          this.isBusy = false;
          this.isEjecutando = false;
        } else {
          this.pricingService.asignarVinesApartados(this.cotizacion.idCotizacion)
            .subscribe(vines => {
              this.isBusy = false;
              this.pricingService.enviarControlDocumental(this.cotizacion.idCotizacion)
                .subscribe(cont => {
                  this.pricingService.enviarProducción(this.cotizacion.idCotizacion)
                    .subscribe(prod => {
                      this.pricingService.cerrarCotizador(request)
                        .subscribe(res => {
                          this.isEjecutando = false;
                          this.toastrService.success('Cotización enviada');
                          this.activeModal.close(false);
                          this.router.navigate(['main/cotizaciones'], {
                            queryParams: { idFlotilla: this.cotizacion.idDireccionFlotillas }
                          });
                            // Cambio bonificaciones - EHJ-COAL
                            this.pricingService.guardaBonificacion(this.cotizacion.idCotizacion)
                            .subscribe((saveBon: any) => {
                              if (saveBon[0].Success !== 1) {
                                this.toastrService.success('Bonificación aplicada');
                              }
                            });
                        }, err => {
                          this.toastrService.error(err.error.message);
                          this.isEjecutando = false;
                        });
                    });
                });
            });
        }
      });
  }

  onFileChange(event) {
    this.file = event.target.files[0];
    const myReader = new FileReader();
    myReader.onloadend = (e) => {
      this.file64 = myReader.result;
    }
    myReader.readAsDataURL(this.file);
  }
  cancel() {
    this.activeModal.close(false);
    this.isEjecutando = false;
  }

  changeValue(value) {
    this.isOrden = value;
  }

  getClientes(filter: any) {
    this.loadClientes = 'Cargando ...';
    this.cliCatalogoService.postClienteFilter(filter).subscribe((res: any) => {
      this.clientes = res.clientes;
      this.loadClientes = 'Sin Información';
    });
  }

  clientesOnSearch($event) {
    const busqueda = $event.term;
    if (busqueda.length > 5) {
      this.filter = {
        pagina: 1,
        numeroRegistros: 100,
        rfc: '',
        nombreCompleto: busqueda,
        idFlotilla: this.cotizacion.idDireccionFlotillas,
        idCfdiUnidades: '',
        idCfdiAccesorios: ''
      };
      this.getClientes(this.filter);
    }
  }

  clientesOnChange($event) {
    this.clienteInfo = $event;
    this.idCliente = $event.idCliente;
    this.nombreCliente = $event.nombreCompleto;
  }

  changeClientValue() {
    if (this.clientValue) {
      this.clienteInfo = null;
      this.idCliente = null;
      this.nombreCliente = null;
    }
    this.clientValue = !this.clientValue;
  }

  isError() {
    if (this.clientValue && !this.clienteInfo) {
      return true;
    } else {
      return false;
    }
  }

  modalvin(vines: any, idCotizacion: string) {
    this.vinesOcupaodos = vines;
   const modalRef = this.modalService.open(ValidateVinComponent, {size: 'sm'});
   modalRef.componentInstance.vinesOcupaodos = this.vinesOcupaodos;
   modalRef.componentInstance.idCotizacion = idCotizacion;
   modalRef.componentInstance.idDireccionFlotillas = this.cotizacion.idDireccionFlotillas;
  }
}
