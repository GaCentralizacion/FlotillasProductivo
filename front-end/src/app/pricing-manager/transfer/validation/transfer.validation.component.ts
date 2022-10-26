import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TransferTableService} from '../transfer.table.service';
import { TrasladosCatalogService, PricingService, ProviderCatalogService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Traslado, Cotizacion, Proveedor, UbicacionTraslado, CotizacionTraslado } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';
import { PricingManagerService } from '../../pricing.manager.service';

@Component({
  selector: 'app-transfer-validation',
  templateUrl: './transfer.validation.component.html',
  styleUrls: ['./transfer.validation.component.scss'],
  providers: [PricingManagerService]
})
export class TransferValidationComponent implements OnInit {

  public row;
  idCotizacionTraslado;
  idCotizacionTrasladoPadre;
  cotizacion: Cotizacion;
  form: FormGroup;
  customForm = {
    unidades: false,
    db: false,
    precioTotal: false,
    costoTotal: false,
    proveedor: false,
    precioUnidad: false,
    costoUnidad: false,
    puntoLlegada: false,
    puntoPartida: false,
  };
  idTraslado;
  rutas: Traslado[];
  model = { year: 0, month: 0, day: 0 };
  minDate = { year: 0, month: 0, day: 0 };
  unidades = 1;
  idPuntoDePartida;
  idPuntoDeLLegada;
  idProveedor;
  idCotizacion;
  idGrupoUnidad;
  costoUnidad = 0;
  precioUnidad = 0;
  precioTotal = 0;
  costoTotal = 0;
  ubicaciones = [];
  proveedores = [];
  puntoDePartidaB = '';
  isPuntoDePartida = true;
  puntoDeLLegadaB = '';
  isPuntoDeLLegada = true;


  constructor(private transferTableService: TransferTableService,
    private trasladosService: TrasladosCatalogService, private toasterService: ToastrService,
    private modalService: NgbModal, private pricingService: PricingService,private providerCatalogService: ProviderCatalogService,
    private activeRoute: ActivatedRoute, private activeModal: NgbActiveModal, public pricingManagerService: PricingManagerService
  ) {
    this.getParams();
    //this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
    this.pricingService.getGrupoUnidadByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {  
      this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
      this.providerCatalogService.getProviders(this.cotizacion.idSucursal, 'PROTRAS').subscribe((proveedores: Proveedor[]) => {
          this.proveedores = proveedores;
      });
    });
    this.trasladosService.getUbicacionTraslados().subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
      this.ubicaciones = ubicacionTraslados;
    });
  }

  private getParams() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idCotizacion = params.idCotizacion as string;
    });
  }

  ngOnInit() {
    this.idCotizacionTraslado = this.row.idCotizacionTraslado;
    this.idCotizacionTrasladoPadre = this.row.idCotizacionTrasladoPadre;
    this.costoTotal = this.row.costoTotal;
    this.costoUnidad = this.row.costoUnitario;
    this.precioTotal = this.row.precioTotal;
    this.precioUnidad = this.row.precioUnitario;
    this.idProveedor = this.row.idProveedor;
    this.idTraslado = this.row.idTraslado;
    this.unidades = this.row.cantidad;
    this.idGrupoUnidad  = this.row.idGrupoUnidad;
    const splits = this.row.fechaEntrega.toString().split('-', 3);

    this.minDate.year = Number(splits[0]);
    this.minDate.month = Number(splits[1]);
    this.minDate.day = Number(splits[2]);

    this.model.year = Number(splits[0]);
    this.model.month = Number(splits[1]);
    this.model.day = Number(splits[2]);

    this.trasladosService.getTraslados().subscribe((rutas: Traslado[]) => {
      this.rutas = rutas;
      const ruta = this.rutas.filter(rt => {
          return rt.idTraslado === this.idTraslado;
        })[0];
        this.idPuntoDeLLegada = ruta.idUbicacionOrigen;
        this.idPuntoDePartida = ruta.idUbicacionDestino;
    });
}

  changeCostoUnidad(value) {
    this.costoTotal = this.costoUnidad * this.unidades;
  }

  onSearchPuntoP(event) {
    this.isPuntoDePartida = true;
    this.isPuntoDeLLegada = false;
  }

  onSearchPuntoL(event) {
    this.isPuntoDePartida = false;
    this.isPuntoDeLLegada = true;
  }

  changePrecioUnidad(value) {
    this.precioTotal = this.precioUnidad * this.unidades;
  }

  changeCostoTotal(value) {
    this.costoUnidad = this.costoTotal / this.unidades;
  }

  changePrecioTotal(value) {
    this.precioUnidad = this.precioTotal / this.unidades;
  }

  changeUnidad() {
    this.precioTotal = this.precioUnidad * this.unidades;
    this.costoTotal = this.costoUnidad * this.unidades;
  }

  findTraslado(event) {
    if (this.idPuntoDeLLegada && this.idPuntoDePartida && this.idProveedor) {
      const traslado = this.rutas.filter(item => {
          return item.idUbicacionDestino === this.idPuntoDeLLegada
          && item.idUbicacionOrigen === this.idPuntoDePartida
          && item.idProveedor === this.idProveedor;

      });
      if (traslado && traslado[0]) {
        this.costoUnidad = traslado[0].costoUnitario;
        this.precioUnidad = traslado[0].precioUnitario;
        this.precioTotal = this.precioUnidad * this.unidades;
        this.costoTotal = this.costoUnidad * this.unidades;
        this.idTraslado = traslado[0].idTraslado;
      } else {
        this.idTraslado = null;
      }
    } else {
      this.idTraslado = null;
    }
  }

  resetValidation() {
    this.customForm = {
      unidades: false,
      db: false,
      precioTotal: false,
      costoTotal: false,
      proveedor: false,
      precioUnidad: false,
      costoUnidad: false,
      puntoLlegada: false,
      puntoPartida: false,
    };
  }


  agregarTraslado() {
    let validation = true;
    this.resetValidation();
    if ( this.unidades < 1) {
      this.customForm.unidades = true;
      validation = false;
    }
    if ( this.costoTotal < 1) {
      this.customForm.costoTotal = true;
      validation = false;
    }
    if ( this.costoUnidad < 1) {
      this.customForm.costoUnidad = true;
      validation = false;
    }
    if ( this.precioTotal < 1) {
      this.customForm.precioTotal = true;
      validation = false;
    }
    if ( this.precioUnidad < 1) {
      this.customForm.precioUnidad = true;
      validation = false;
    }
    if (!this.idProveedor) {
      this.customForm.proveedor = true;
      validation = false;
    }
    if (!this.idPuntoDeLLegada) {
      this.customForm.puntoLlegada = true;
      validation = false;
    }
    if (!this.idPuntoDePartida) {
      this.customForm.puntoPartida = true;
      validation = false;
    }

    if (!validation) {
      return;
    }

    const traslado = <CotizacionTraslado> {
      idCotizacionTraslado: this.idCotizacionTraslado,
      idCotizacionTrasladoPadre: this.idCotizacionTrasladoPadre,
      idCotizacion: this.idCotizacion,
      idGrupoUnidad: this.idGrupoUnidad,
      idTraslado: this.idTraslado,
      cantidad: this.unidades,
      fechaEntrega: this.model.year + '-' + this.model.month.toString().padStart(2, '0') + '-' + this.model.day.toString().padStart(2, '0'),
      costoUnitario: Number(this.costoUnidad),
      precioUnitario: Number(this.precioUnidad),
      costoTotal: Number(this.costoTotal),
      precioTotal: Number(this.precioTotal),
      idProveedor: this.idProveedor,
      nombreProveedor: this.proveedores.filter(pro => {
        return pro.idProveedor === this.idProveedor; }
        )[0].nombreCompleto,
    };
    this.trasladosService.saveTraslado(this.idPuntoDePartida, this.idPuntoDeLLegada, traslado ).subscribe( item => {
      this.activeModal.close(false);
      this.toasterService.success('Traslado Editado');
      this.transferTableService.refreshTable.emit();
    });
  }
}
