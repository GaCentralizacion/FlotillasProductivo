import { Component, OnInit, ViewChild } from '@angular/core';
import { Cotizacion, Cliente, ClienteFilter, GrupoUnidades } from 'src/app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { PricingService, ClientCatalogService } from 'src/app/services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-pricing-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @ViewChild('contactoNgSelect') public contactoNgSelect: NgSelectComponent;

  clienteInfo;
  idCliente;
  originalCliente;
  nombreCliente;
  nombreClienteOriginal;
  clientes: any[] = [];
  cotizacion;
  loadClientes = 'Sin Información';
  filter: any = {};
  clientValue = false;
  currentValue = '';
  clientesFis = [] as any[];
  isLoadingCotacto = false;

  //Facturacion Adicionales
  clientAdicionalesValue = false;
  clientesAdicionales: any[] = [];
  idClienteFacturaAdicionales;
  nombreClienteAdicionales = '';
  numeroOCAdicionales = '';
  nombreClienteAuxiliar = '';

  isUnidadesInteres;
  isUtilidad;
  isMagerTraslado;
  cargoUnidad;
  isCredito;
  customSearchFn = '';
  idContacto;


  constructor(
    private router: Router,
    private pricingService: PricingService,
    private route: ActivatedRoute,
    private clientService: ClientCatalogService,
    private activeModal: NgbActiveModal,
    private toasterService: ToastrService,
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
    this.idCliente = this.cotizacion.idCliente;
    this.originalCliente = this.cotizacion.idCliente;
    this.nombreCliente = this.cotizacion.nombreCliente;
    this.nombreClienteOriginal = this.cotizacion.nombreCliente;
    //Facturacion Adicionales
    this.getClientesAdicionales(this.filter);
    this.nombreClienteAdicionales = this.cotizacion.nombreCliente;
  }

  save() {
    const requestFacturacion = {
      idCotizacion: this.cotizacion.idCotizacion,
      idCliente: (this.idCliente) ? this.idCliente : this.originalCliente,
      nombreCliente: (this.nombreCliente) ? this.nombreCliente : this.nombreClienteOriginal,
      idContacto: this.idContacto,
      idClienteFacturaAdicionales: (!this.idClienteFacturaAdicionales) ? this.cotizacion.idCliente : this.idClienteFacturaAdicionales,
      numeroOCAdicionales: this.numeroOCAdicionales,
    };
    
    this.pricingService.adicionalesFacturacion(requestFacturacion).subscribe(adiResponse => {
      this.pricingService.clienteFacturacion(requestFacturacion).subscribe(clientResponse => {
        this.pricingService.documentosVencidos(this.cotizacion.idCotizacion, this.idCliente).subscribe(res => {
          console.log(res);
          this.pricingService.creditoLimiteCliente(this.cotizacion.idCotizacion, this.idCliente).subscribe(resp => {
            console.log(resp);
          });
        });
        this.pricingService.notificaionEnviada(this.cotizacion.idCotizacion).subscribe(res => {
          this.activeModal.close(true);
        });
      });
    });
  }

  cancel() {
    this.activeModal.close(false);
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
    this.nombreClienteAuxiliar = $event.nombreCompleto;
    if(!this.clientAdicionalesValue){
      this.idClienteFacturaAdicionales = $event.idCliente;
      this.nombreClienteAdicionales = $event.nombreCompleto;
    }
  }

  clientesAdicionalesOnChange($event) {
    //this.clienteInfo = $event;
    this.idClienteFacturaAdicionales = $event.idCliente;
    //this.nombreCliente = $event.nombreCompleto;
  }

  clientesAdicionalesOnSearch($event) {
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

  getClientesAdicionales(filter: any) {
    this.cliCatalogoService.postClienteFilter(filter).subscribe((res: any) => {
      this.clientesAdicionales = res.clientes;
    });
  }

  changeClientValue() {
    if (this.clientValue) {
      this.clienteInfo = null;
      this.idCliente = null;
      this.nombreCliente = null;
      this.idContacto = null;
      this.nombreClienteAuxiliar = '';

      if (!this.clientAdicionalesValue) {
        this.idClienteFacturaAdicionales = this.cotizacion.idCliente;
        this.nombreClienteAdicionales = this.cotizacion.nombreCliente;
      }

    }
    this.clientValue = !this.clientValue;
  }
  //Factura Adicionales
  changeClientAdicionalValue() {
    
    if (this.clientAdicionalesValue) {
      this.idClienteFacturaAdicionales = null;

      if(this.clientValue){
        this.idClienteFacturaAdicionales = this.idCliente;
        this.nombreClienteAdicionales = (this.nombreClienteAuxiliar != '')?this.nombreClienteAuxiliar:this.cotizacion.nombreCliente;
      }
    }
    
    this.clientAdicionalesValue = !this.clientAdicionalesValue;
  }

  searchContacto(event) {
    this.currentValue = event.term;
  }

  getClientesFis() {
    this.isLoadingCotacto = true;
    this.pricingService.getClientesFis(this.currentValue, 'FIS').subscribe((res: any) => {
      this.clientesFis = res;
      this.isLoadingCotacto = false;
      this.contactoNgSelect.open();
    });
  }

  isMissingFields() {
    const missing = false;
    if (this.clientValue) {
      if (!this.idCliente || !this.idContacto) {
        return true;
      }
    }
    //Facturacion Adicionales
    if (this.clientAdicionalesValue) {
      if (!this.idClienteFacturaAdicionales)
        return true;
    }
    return missing;
  }

  contactoOnChange(value: any) {
    if (value !== undefined) {
      this.idContacto = value.idCliente;
    }
  }

}
