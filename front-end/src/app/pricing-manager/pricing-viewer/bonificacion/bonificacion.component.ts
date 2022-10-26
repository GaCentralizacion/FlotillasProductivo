import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PricingService, ClientCatalogService } from 'src/app/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-pricing-bonificacion',
  templateUrl: './bonificacion.component.html',
  styleUrls: ['./bonificacion.component.scss']
})
export class BonificacionComponent implements OnInit {

  @ViewChild('contactoNgSelect') public contactoNgSelect: NgSelectComponent;

  clienteInfo;
  idCliente;
  nombreCliente;
  clientes: any[] = [];
  cotizacion;
  loadClientes = 'Sin Información';
  filter: any = {};
  clientValue = false;
  currentValue = '';
  clientesFis = [] as any[];
  isLoadingCotacto = false;


  isUnidadesInteres;
  isUtilidad;
  isMagerTraslado;
  cargoUnidad;
  isCredito;

  catalogo;
  anio;
  bonificaciones = [] as any[];
  bonificacion;
  idGrupoUnidad;
  bonificacionCurrent;
  ID;
  idBonificacion;

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
    this.pricingService.getBonificacion(this.cotizacion.idSucursal, this.catalogo, this.anio).subscribe( (bon: any) => {
      console.log(bon);
      if (this.bonificacionCurrent != null) {
        this.bonificacion = this.bonificacionCurrent;
      }
      this.bonificaciones = bon;
      setTimeout( () => {
        const itemCatalog = this.contactoNgSelect.itemsList.items.filter( item => {
          return ( <any> item.value).ID === this.ID;
        });
        this.contactoNgSelect.select(itemCatalog[0]);
      }, 1200);
    });
  }

  save() {
    const request = {
      idCotizacion: this.cotizacion.idCotizacion,
      bonificacion: this.bonificacion,
      idGrupoUnidad: this.idGrupoUnidad,
      idBonificacion: this.idBonificacion
    };
    this.pricingService.actualizarBonificacion(request).subscribe( res => {
      this.toasterService.success('Bonificación actualizada');
      this.activeModal.close(true);
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
    this.bonificacion = $event.Bonificacion;
    this.idBonificacion = ($event.ID);
  }

  changeClientValue() {
    if (this.clientValue) {
      this.clienteInfo = null;
      this.idCliente = null;
      this.nombreCliente = null;
    }
    this.clientValue = !this.clientValue;
  }

}
