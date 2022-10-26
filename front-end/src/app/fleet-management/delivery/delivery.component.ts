import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgSelectComponent } from '@ng-select/ng-select';
import { GrupoUnidades, Cotizacion, Traslado, UbicacionTraslado, CotizacionTraslado, Proveedor } from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { PricingService, TrasladosCatalogService, ProviderCatalogService } from 'src/app/services';
import { ExcelService } from 'src/app/services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { TransferTableFlotService } from './transfer.table.service';
import { TransferTableFlotComponent } from './table/transfer.table.component';
import { PricingManagerService } from '../../pricing-manager/pricing.manager.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  providers: [PricingManagerService]

})
export class DeliveryComponent implements OnInit {
  form: FormGroup;

  @ViewChild('mainTable') mainTable: DatatableComponent;
  @ViewChild(TransferTableFlotComponent) trasferTable: TransferTableFlotComponent;
  @ViewChild('selectPartida') public selectPartida: NgSelectComponent;
  @ViewChild('selectLlegada') public selectLlegada: NgSelectComponent;

  public addTagNowRef: (type) => void;
  isLoading = false;

  customForm = {
    unidades: false,
    unidadesDisponibles: false,
    unidadesDisponiblesLabel: 0,
    db: false,
    precioTotal: false,
    costoTotal: false,
    proveedor: false,
    precioUnidad: false,
    costoUnidad: false,
    puntoLlegada: false,
    puntoPartida: false,
    traslado: false
  }


  idTraslado;
  tiposTraslados = [
    {name: 'Impulso Propio', idTipoTraslado: false},
    {name: 'Madrina', idTipoTraslado: true}
  ];
  idTipoTraslado;
  idFlotilla: string;
  idCotizacion: string;
  idLicitacion: string;
  step: number;
  cotizacion: Cotizacion;
  financiera: string;
  grupoUnidades: GrupoUnidades[];
  currentTraslados = [] as any[];
  currentSelected;
  currentEditSelected;
  isGrupoUnidad = true;
  isTraslado = false;
  rutas: Traslado[];
  selected = [];
  forma: FormGroup;
  activo = true;

  expanded: any = {};

  model = { year: 0, month: 0, day: 0 };
  minDate = { year: 0, month: 0, day: 0 };
  unidades = 1;
  idPuntoDePartida;
  idPuntoDeLLegada;
  idProveedor;

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

  constructor(
    private activeRoute: ActivatedRoute,
    private pricingService: PricingService,
    private trasladoService: TrasladosCatalogService,
    private providerCatalogService: ProviderCatalogService,
    private toasterService: ToastrService,
    private trasferTableService: TransferTableFlotService,
    private router: Router,
    private excelService: ExcelService,
    public pricingManagerService: PricingManagerService
  ) {
    this.resetDates();
     this.addTagNowRef = this.saveTraslado.bind(this);
     this.form = new FormGroup({
      unidades: new FormControl(null, [Validators.required]),
      db: new FormControl(null, [Validators.required]),
      precioTotal: new FormControl(null, [Validators.required]),
      costoTotal: new FormControl(null, [Validators.required]),
      proveedor: new FormControl(null, [Validators.required]),
      precioUnidad: new FormControl(null, [Validators.required]),
      costoUnidad: new FormControl(null, [Validators.required]),
      puntoLlegada: new FormControl(null, [Validators.required]),
      puntoPartida: new FormControl(null, [Validators.required]),
      tipoTraslado: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.trasferTableService.selectChildrens.subscribe( item => {
      this.trasferTable.growUp(item);
    });
    this.trasferTableService.scrollTO.subscribe( item => {
      this.currentEditSelected = item;
      this.resetValidation();
      this.unidades = item.cantidad;
      this.idTipoTraslado = item.idMedioTransporte;
      this.costoTotal = item.costoTotal;
      this.costoUnidad = item.costoUnitario;
      this.idProveedor = item.idProveedor;
      this.precioTotal = item.precioTotal;
      this.precioUnidad = item.precioUnitario;
      this.idTraslado = item.idTraslado;
      const ruta = this.rutas.filter(rt => {
        return rt.idTraslado === item.idTraslado;
      })[0];
      this.idPuntoDePartida = ruta.ubicacionDestino.idUbicacionTraslado;
      this.idPuntoDeLLegada = ruta.ubicacionOrigen.idUbicacionTraslado;

      if(item.children.length > 0) {
        this.selectPartida.setDisabledState(true);
        this.selectLlegada.setDisabledState(true);
      } else {
        this.selectPartida.setDisabledState(false);
        this.selectLlegada.setDisabledState(false);
      }

      const splits = item.fechaEntrega.toString().split('-', 3);
      this.model.year = Number(splits[0]);
      this.model.month = Number(splits[1]);
      this.model.day = Number(splits[2]);
      this.triggerScrollTo();
    });
    this.trasferTableService.refreshTable.subscribe( item => {
      this.currentSelected = null;
      this.selectPartida.setDisabledState(false);
      this.resetDates();
      //this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      this.pricingService.getGrupoUnidadByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {  
        this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
        this.grupoUnidades = this.cotizacion.gruposUnidades;
        if (this.isGrupoUnidad) {
            const traslados = this.grupoUnidades.filter(item => {
              return item.idGrupoUnidad === this.selected[0].idGrupoUnidad;
            });
            let missingTraslados = [] as any[];
            missingTraslados = traslados[0].traslados;
            missingTraslados = missingTraslados.filter( item2 => {
              return item2.activo === true;
            });
            this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
              this.rutas = rutas;
              this.currentTraslados = this.list_to_tree(missingTraslados);
            });
        }
      });
    });
    this.getParams();
    this.isLoading = true;
    //this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
    this.pricingService.getGrupoUnidadByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {  
      this.isLoading = false;
      this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
      localStorage.setItem('cotizacion', JSON.stringify(this.cotizacion));
      this.financiera = this.cotizacion.nombreFinanciera;
      this.grupoUnidades = this.cotizacion.gruposUnidades;
      this.providerCatalogService.getProviders(this.cotizacion.idSucursal, 'PROTRAS').subscribe((proveedores: Proveedor[]) => {
          this.proveedores = proveedores;
      });
    });
    this.trasladoService.getUbicacionTraslados().subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
      this.ubicaciones = ubicacionTraslados;
    });
    this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
      this.rutas = rutas;
    });
  }

  resetDates() {
    const date = new Date();
    this.model.year = date.getFullYear();
    this.model.month = date.getMonth() + 1;
    this.model.day = date.getDate();
    this.minDate.year = date.getFullYear();
    this.minDate.month = date.getMonth() + 1;
    this.minDate.day = date.getDate();
  }

  somethingChange(event) {
    this.currentTraslados = Object.assign([], this.currentTraslados);
  }

  lastChange(event) {
    if(this.currentEditSelected && this.currentEditSelected.idCotizacionTraslado !== event[0].idCotizacionTraslado) {
        this.selectLlegada.setDisabledState(false);
        this.currentEditSelected = undefined;
    }
    this.currentSelected = event[0];
    this.selectPartida.setDisabledState(true);
    const ruta = this.rutas.filter(rt => {
      return rt.idTraslado === event[0].idTraslado;
    })[0];
    this.idPuntoDePartida = ruta.ubicacionDestino.idUbicacionTraslado;

    const splits = this.currentSelected.fechaEntrega.toString().split('-', 3);
    this.minDate.year = Number(splits[0]);
    this.minDate.month = Number(splits[1]);
    this.minDate.day = Number(splits[2]);
    const d = new Date(Number(splits[0]), Number(splits[1]) - 1, Number(splits[2]));
    const toDay = new Date();
    if (d.getTime() < toDay.getTime()) {
      this.model.year = toDay.getFullYear();
      this.model.month = toDay.getMonth() + 1;
      this.model.day = toDay.getDate();
    } else {
      this.model = { year: Number(splits[0]), month: Number(splits[1]), day: Number(splits[2]) };
    }
  }

  private getParams() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idFlotilla = params.idFlotilla as string;
      this.idCotizacion = params.idCotizacion as string;
      this.idLicitacion = params.idLicitacion as string;
      this.step = Number(params.step);
    });
  }

  onSearchPuntoP(event) {
    this.isPuntoDePartida = true;
    this.isPuntoDeLLegada = false;
  }

  onSearchPuntoL(event) {
    this.isPuntoDePartida = false;
    this.isPuntoDeLLegada = true;
  }


  resetValidation() {
  this.customForm = {
    unidades: false,
    unidadesDisponibles: false,
    unidadesDisponiblesLabel: 0,
    db: false,
    precioTotal: false,
    costoTotal: false,
    proveedor: false,
    precioUnidad: false,
    costoUnidad: false,
    puntoLlegada: false,
    puntoPartida: false,
    traslado: false
  }
}

  getTotalChild(row) {
    let total = 0;
    if (row.children && row.children.length > 0) {
        row.children.forEach(
          item => {
              total += this.getTotalChild(item);
          });
    }
    total += row.cantidad;
    return total;
  }

  agregarTrasladoMovs() {
    let validation = true;
    this.resetValidation();
    if (this.idTipoTraslado == null) {
      this.customForm.traslado = true;
      validation = false;
    }
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


    let usadas = 0;
    let disponibles = 0;
    if (this.currentSelected && this.currentSelected.idCotizacionTraslado) {
      disponibles = this.currentSelected.cantidad;
      const trasParent = this.currentSelected.children.filter( item => {
        return item.idCotizacionTrasladoPadre == this.currentSelected.idCotizacionTraslado;
      });
      trasParent.forEach( parents => {
        usadas += parents.cantidad;
      });
      disponibles = disponibles - usadas;
    } else {
      disponibles = this.selected[0].cantidad;
      const trasParent = this.selected[0].traslados.filter( item => {
        return item.idCotizacionTrasladoPadre == null;
      });
      trasParent.forEach( parents => {
        usadas += parents.cantidad;
      });
      disponibles = disponibles - usadas;
    }

    if ((this.unidades > disponibles) && !this.customForm.unidades) {
      this.customForm.unidadesDisponibles = true;
      this.customForm.unidadesDisponiblesLabel = (disponibles > 0) ? disponibles : 0;
      validation = false;
    }

    if (!validation) {
      return;
    }

    let parent = null;
    if (this.currentSelected) {
      parent = this.currentSelected.idCotizacionTraslado;
    }

    let currentCotizacion = null;
    if (this.currentEditSelected) {
     currentCotizacion = this.currentEditSelected.idCotizacionTraslado;
     parent = this.currentEditSelected.idCotizacionTrasladoPadre;
    }

    const traslado =  {
      idCotizacionTraslado: currentCotizacion,
      idCotizacionTrasladoPadre: parent,
      idCotizacion: this.idCotizacion,
      idGrupoUnidad: this.selected[0].idGrupoUnidad,
      idTraslado: this.idTraslado,
      cantidad: this.unidades,
      fechaEntrega: this.model.year + '-' + this.model.month.toString().padStart(2, '0') + '-' + this.model.day.toString().padStart(2, '0'),
      costoUnitario: Number(this.costoUnidad),
      precioUnitario: Number(this.precioUnidad),
      costoTotal: Number(this.costoTotal),
      precioTotal: Number(this.precioTotal),
      idProveedor: this.idProveedor,
      idMedioTransporte: this.idTipoTraslado,
      impuestoTransporte: (this.idTipoTraslado) ? Number(((this.precioTotal - (this.precioTotal / ( 1 + ( 4 / 100 ) ) ))).toFixed(2)) : 0,
      nombreProveedor: this.proveedores.filter(pro => {
        return pro.idProveedor === this.idProveedor; }
        )[0].nombreCompleto,
    }  as CotizacionTraslado;
    const fecha = new Date(traslado.fechaEntrega);
    const fechaSinFormato: any = new Date(new Date(traslado.fechaEntrega).setDate(fecha.getDate() + 1));

    traslado.fechaEntrega = fechaSinFormato.getUTCFullYear() + '-'
                                + (fechaSinFormato.getUTCMonth() + 1).toString().padStart(2, '0') + '-' +
                                    fechaSinFormato.getUTCDate().toString().padStart(2, '0');

    this.trasladoService.saveTrasladoMov(this.idPuntoDePartida, this.idPuntoDeLLegada, traslado ).subscribe( item => {
      this.resetForm();
      if (this.selectLlegada) {
        this.selectLlegada.setDisabledState(false);
      }
      this.currentEditSelected = undefined;

      //this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      this.pricingService.getGrupoUnidadByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {    
        this.resetDates();
        this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
        this.grupoUnidades = this.cotizacion.gruposUnidades;
        if (this.isGrupoUnidad) {
            const traslados = this.grupoUnidades.filter(item => {
              return item.idGrupoUnidad === this.selected[0].idGrupoUnidad;
            });
            let missingTraslados = [] as any[];
            missingTraslados = traslados[0].traslados;
            this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
              this.rutas = rutas;
              missingTraslados.forEach( tras => {
                const ruta = this.rutas.filter(rt => {
                  return rt.idTraslado === tras.idTraslado;
                })[0];
                tras.ubicacionDestino = ruta.ubicacionDestino.nombre;
                tras.ubicacionOrigen = ruta.ubicacionOrigen.nombre;
              });
              this.currentTraslados = this.list_to_tree(missingTraslados);
            });
        }
      });
      this.toasterService.success('Traslado Guardado');
    });
  }


  agregarTraslado() {
    let validation = true;
    this.resetValidation();
    if (this.idTipoTraslado == null) {
      this.customForm.traslado = true;
      validation = false;
    }
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


    let usadas = 0;
    let disponibles = 0;
    if (this.currentSelected) {
      usadas = this.getTotalChild(this.currentSelected) - this.currentSelected.cantidad;
      disponibles = this.currentSelected.cantidad - usadas;
    }

    if ((this.unidades > disponibles) && !this.customForm.unidades) {
      this.customForm.unidadesDisponibles = true;
      this.customForm.unidadesDisponiblesLabel = disponibles;
      validation = false;
    }

    if (!validation) {
      return;
    }

    let parent = null;
    if (this.currentSelected) {
      parent = this.currentSelected.idCotizacionTraslado;
    }

    let currentCotizacion = null;
    if (this.currentEditSelected) {
     currentCotizacion = this.currentEditSelected.idCotizacionTraslado;
     parent = this.currentEditSelected.idCotizacionTrasladoPadre;
    }

    const traslado =  {
      idCotizacionTraslado: currentCotizacion,
      idCotizacionTrasladoPadre: parent,
      idCotizacion: this.idCotizacion,
      idGrupoUnidad: this.selected[0].idGrupoUnidad,
      idTraslado: this.idTraslado,
      cantidad: this.unidades,
      fechaEntrega: this.model.year + '-' + this.model.month.toString().padStart(2, '0') + '-' + this.model.day.toString().padStart(2, '0'),
      costoUnitario: Number(this.costoUnidad),
      precioUnitario: Number(this.precioUnidad),
      costoTotal: Number(this.costoTotal),
      precioTotal: Number(this.precioTotal),
      idProveedor: this.idProveedor,
      idMedioTransporte: this.idTipoTraslado,
      impuestoTransporte: (this.idTipoTraslado) ? Number(((this.precioTotal - (this.precioTotal / ( 1 + ( 4 / 100 ) ) ))).toFixed(2)) : 0,
      nombreProveedor: this.proveedores.filter(pro => {
        return pro.idProveedor === this.idProveedor; }
        )[0].nombreCompleto,
    }  as CotizacionTraslado;
    const fecha = new Date(traslado.fechaEntrega);
    const fechaSinFormato: any = new Date(new Date(traslado.fechaEntrega).setDate(fecha.getDate() + 1));

    traslado.fechaEntrega = fechaSinFormato.getUTCFullYear() + '-'
                                + (fechaSinFormato.getUTCMonth() + 1).toString().padStart(2, '0') + '-' +
                                    fechaSinFormato.getUTCDate().toString().padStart(2, '0');

    this.trasladoService.saveTrasladoMov(this.idPuntoDePartida, this.idPuntoDeLLegada, traslado ).subscribe( item => {
      this.resetForm();
      if (this.selectLlegada) {
        this.selectLlegada.setDisabledState(false);
      }
      this.currentEditSelected = undefined;
      //this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      this.pricingService.getGrupoUnidadByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {  
        this.resetDates();
        this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
        this.grupoUnidades = this.cotizacion.gruposUnidades;
        if (this.isGrupoUnidad) {
            const traslados = this.grupoUnidades.filter(item => {
              return item.idGrupoUnidad === this.selected[0].idGrupoUnidad;
            });
            let missingTraslados = [] as any[];
            missingTraslados = traslados[0].traslados;
            missingTraslados = missingTraslados.filter( item2 => {
              return item2.activo === true;
            });
            this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
              this.rutas = rutas;
              missingTraslados.forEach( tras => {
                const ruta = this.rutas.filter(rt => {
                  return rt.idTraslado === tras.idTraslado;
                })[0];
                tras.ubicacionDestino = ruta.ubicacionDestino.nombre;
                tras.ubicacionOrigen = ruta.ubicacionOrigen.nombre;
              });
              this.currentTraslados = this.list_to_tree(missingTraslados);
            });
        }
      });
      this.toasterService.success('Traslado Guardado');
    });
  }

  resetForm() {
    this.precioTotal = 0;
    this.costoTotal = 0;
    this.idTipoTraslado = undefined;
    this.costoUnidad = 0
    this.precioUnidad = 0
    this.idProveedor = undefined;
    this.idPuntoDeLLegada = undefined;
    this.idPuntoDePartida = undefined;
    this.unidades = 1;
  }

  continuar() {
    this.activo = false;
    if (this.cotizacion != undefined) {
      if (this.step < 4) {
        this.pricingService.updateStep(this.idCotizacion, 4).subscribe(() => {
          this.irATraslados();
          this.activo = true;
        });
      } else {
        this.irATraslados();
        this.activo = true;
      }
    }
  }

  private irATraslados() {
    this.router.navigate(['main/cotizaciones/manager/condiciones'], {
      queryParams: {
        idFlotilla: this.idFlotilla,
        idLicitacion: this.idLicitacion,
        idCotizacion: this.idCotizacion,
        step: 4
      }
    });
  }



  saveTraslado(type) {
    const ubTraslado: UbicacionTraslado[] = [];
    const ubicacion =  {
      idUbicacionTraslado: null,
      nombre: type,
      descripcion: type,
      direccion: null
    };
    ubTraslado.push(ubicacion);
    this.trasladoService.saveUbicacionTraslados(ubTraslado).subscribe((res) => {
      this.trasladoService.getUbicacionTraslados().subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
        this.ubicaciones = ubicacionTraslados;
        const getCurrentValue = this.ubicaciones.filter( item => {
          return type.toUpperCase() === item.nombre.toUpperCase();
        });
        if (this.isPuntoDePartida) {
          this.idPuntoDePartida = getCurrentValue[0].idUbicacionTraslado;
        } else {
          this.idPuntoDeLLegada = getCurrentValue[0].idUbicacionTraslado;
        }
        this.toasterService.success('Ubicacion guardada');
      });
  });
  }

  onSelect(event) {
    this.currentSelected = [];
    this.currentEditSelected = undefined;
    if (this.selectPartida) {
    this.selectPartida.setDisabledState(false);
    }
    this.resetValues();
    if (this.trasferTable) {
      this.trasferTable.resetValues();
    }
    let missingTraslados = this.selected[0].traslados;
    missingTraslados = missingTraslados.filter( item => {
      return item.activo === true;
    });
    missingTraslados.forEach( tras => {
      const ruta = this.rutas.filter(rt => {
        return rt.idTraslado === tras.idTraslado;
      })[0];
      tras.ubicacionDestino = ruta.ubicacionDestino.nombre;
      tras.ubicacionOrigen = ruta.ubicacionOrigen.nombre;
    });
    this.currentTraslados = this.list_to_tree(missingTraslados);
  }

  resetValues() {    
    this.currentEditSelected = undefined;
    this.resetValidation();
    if (this.selectLlegada) {
     this.selectLlegada.setDisabledState(false);
    }
    this.resetForm();
  }
  changeCostoUnidad(value) {
    this.costoTotal = value * this.unidades;
  }

  changePrecioUnidad(value) {
    this.precioTotal = value * this.unidades;
  }

  changeCostoTotal(value) {
    this.costoUnidad = value / this.unidades;
  }

  changePrecioTotal(value) {
    this.precioUnidad = value / this.unidades;
  }

  changeUnidad() {
    this.precioTotal = this.precioUnidad * this.unidades;
    this.costoTotal = this.costoUnidad * this.unidades;
  }

  toggleExpandRow(row) {
    this.mainTable.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(evento: { type: string, value: GrupoUnidades }) {
    evento.value.isToggled = !evento.value.isToggled;
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

  findTraslado(event) {
    if (!this.rutas) {
      return;
    }
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

  public triggerScrollTo() {
  }

  exportExcel() {
    this.excelService.exportAsExcelFile(this.grupoUnidades, 'traslados');
  }


}
