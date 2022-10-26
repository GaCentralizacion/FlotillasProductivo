import { Component, OnInit, ViewEncapsulation, ViewChild, QueryList, ViewChildren, ContentChildren, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cotizacion, GrupoUnidades, Proveedor, CotizacionTraslado, CotizacionTrasladoFac, Cfdi, TipoOrden, ProductoCFDI} from '../../models';
import { PricingService, ProviderCatalogService, ClientCatalogService, TramiteCatalogService } from '../../services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TrasladosCatalogService } from 'src/app/services/traslados.service';
import { UbicacionTraslado, Traslado } from '../../models';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { TransferTableComponent } from './table/transfer.table.component';
import { TransferTableService } from './transfer.table.service';
import { DataService } from '../data.service';
import { toDate } from '@angular/common/src/i18n/format_date';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { PricingManagerService } from '../pricing.manager.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
  providers: [PricingManagerService]
})
export class TransferComponent implements OnInit {



  form: FormGroup;
  @ViewChild('mainTable') mainTable: DatatableComponent;
  @ViewChild(TransferTableComponent) trasferTable: TransferTableComponent;
  @ViewChild('selectPartida') public selectPartida: NgSelectComponent;
  @ViewChild('selectLlegada') public selectLlegada: NgSelectComponent;
  @ViewChild('selectCfdi') public selectCfdi: NgSelectComponent;


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
    traslado: false,
    tipoCfdi: false
  }


  onlyRead = false;
  idTraslado;
  tiposTraslados = [
    { name: 'Impulso Propio', idTipoTraslado: false },
    { name: 'Madrina', idTipoTraslado: true }
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

  idTipoOrden: string;
  idCfdi: string;
  tipoOrden: TipoOrden[];
  cfdi: Cfdi;

  expanded: any = {};

  model = { year: 0, month: 0, day: 0 };
  minDate = { year: 0, month: 0, day: 0 };
  unidades = 1;
  idPuntoDePartida;
  idPuntoDeLLegada;
  idProveedor;

  unidadesDisponibles = 0;
  unidadesEdit = 0;
  editando = false;
  primerClick = 0;
  disponiblesGlobal = 0;
  totalUnidadesGrupo = 0;

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

  isFreeTransfer = true;
  enableDisableCheck = true;
  idGrupoUnidad: number = 0;
  idCotizacionTraslado:number=0;
  CfdisCatalogo: any = [];

  ProductoCFDIs : ProductoCFDI[];
  productoCFDIsSelected: ProductoCFDI;
  bandera = 0;
  trasladosProductos = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private pricingService: PricingService,
    private trasladoService: TrasladosCatalogService,
    private providerCatalogService: ProviderCatalogService,
    private toasterService: ToastrService,
    private trasferTableService: TransferTableService,
    private router: Router,
    private scrollToService: ScrollToService,
    public pricingManagerService: PricingManagerService,
    private excelService: ExcelService,
    private catalogoService: ClientCatalogService,
    private tramitesService: TramiteCatalogService,
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
      tipoCfdi: new FormControl(null, [Validators.required]),
      checkCostoCero: new FormControl({ value: 'false', disabled: false }),
      checkProducto: new FormControl({ value: 'false', disabled: false }),
      selectProducto:new FormControl('')
    });
  }

  ngOnInit() {

    //this.initForm();
    this.form.controls.checkCostoCero.setValue(false);
    this.form.controls.checkProducto.setValue(false);
    this.tipoOrden = [
      { idTipoOrden: 'FI', nombre: 'Facturacion Independiente' },
      { idTipoOrden: 'CU', nombre: 'Carga a la Factura' }
    ];


    this.editando = false;
    this.trasferTableService.selectChildrens.subscribe(item => {
      this.trasferTable.growUp(item);
    });

    this.trasferTableService.scrollTO.subscribe(item => {
      this.currentEditSelected = item;
      this.resetValidation();
      this.editando = true;
      this.primerClick = this.primerClick + 1;
      this.unidades = item.cantidad;
      this.unidadesEdit = this.unidades;
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
      this.idCfdi = item.idCfdi;
      /*
      this.idPuntoDePartida = ruta.ubicacionDestino.idUbicacionTraslado;
      this.idPuntoDeLLegada = ruta.ubicacionOrigen.idUbicacionTraslado;
      */
      /*
      if(item.children.length > 0) {
        this.selectPartida.setDisabledState(true);
        this.selectLlegada.setDisabledState(true);
      } else {
        this.selectPartida.setDisabledState(false);
        this.selectLlegada.setDisabledState(false);
      }
      */

      this.idPuntoDePartida = ruta.ubicacionOrigen.idUbicacionTraslado;
      this.idPuntoDeLLegada = ruta.ubicacionDestino.idUbicacionTraslado;
      if (this.selectPartida != undefined) {
        this.selectPartida.setDisabledState(false);
      }
      if (this.selectLlegada != undefined) {
        this.selectLlegada.setDisabledState(false);
      }


      const splits = item.fechaEntrega.toString().split('-', 3);
      this.model.year = Number(splits[0]);
      this.model.month = Number(splits[1]);
      this.model.day = Number(splits[2]);
      this.triggerScrollTo();
    });

    this.trasferTableService.refreshTable.subscribe(item => {
      //OCT99
      this.pricingService.getUnidadesInteresByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        this.grupoUnidades = cotizacion.gruposUnidades;
      });

      this.currentSelected = null;
      if (this.selectPartida != undefined) {
        this.selectPartida.setDisabledState(false);
      }

      this.resetDates();
      //this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      this.pricingService.getGrupoUnidadByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
        //this.grupoUnidades = this.cotizacion.gruposUnidades;
        if (this.isGrupoUnidad) {
          const traslados = this.grupoUnidades.filter(item => {
            return item.idGrupoUnidad === this.selected[0].idGrupoUnidad;
          });
          let missingTraslados = [] as any[];
          missingTraslados = traslados[0].traslados;
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

      //OCT99
      this.pricingService.getUnidadesInteresByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        this.grupoUnidades = cotizacion.gruposUnidades;
      });

      this.isLoading = false;
      if (cotizacion.status === 'EN PROCESO') {
        this.pricingManagerService.onlyRead = false;
        this.onlyRead = false;
      } else {
        //se cambio a false las variables del else para que permita agregar tralados en cualquier momento
        //LBM 12052021
        this.pricingManagerService.onlyRead = false;
        this.onlyRead = false;
      }

      //OCT99 SOLO LECTURA
      if (this.pricingManagerService.perfilSoloLectura)
        this.pricingManagerService.onlyRead = true;

      this.cotizacion = Object.assign(new Cotizacion(), cotizacion);

      localStorage.setItem('cotizacion', JSON.stringify(this.cotizacion));
      this.financiera = this.cotizacion.nombreFinanciera;
      //this.grupoUnidades = this.cotizacion.gruposUnidades;
      this.providerCatalogService.getProviders(this.cotizacion.idSucursal, 'PROTRAS').subscribe((proveedores: Proveedor[]) => {
        this.proveedores = proveedores;

        this.proveedores.forEach(proveedor => {
          proveedor.nombreCompletoIdProveedor = proveedor.idProveedor + ' - ' + proveedor.nombreCompleto;
        });

      });

    });
    this.trasladoService.getUbicacionTraslados().subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
      this.ubicaciones = ubicacionTraslados;
    });
    this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
      this.rutas = rutas;
    });
    this.getCfdiCatalogo();

  }

  GetIsFreeTransfer() {

    this.pricingService.isFreeTransferCOAL( this.cotizacion.idMarca,
                                            this.cotizacion.idCotizacion,
                                            (this.idGrupoUnidad != undefined) ? this.idGrupoUnidad: -1,
                                            (this.idCotizacionTraslado!=undefined) ? this.idCotizacionTraslado : -1
      ).subscribe((res: any) => {
        this.enableDisableCheck = res;
      });
  }

  costoCeroOnChange() {
    this.isFreeTransfer = !this.form.controls.checkCostoCero.value

    if (this.isFreeTransfer===false){
      //checado
      this.form.controls.costoUnidad.setValue(0);
      this.form.controls.precioUnidad.setValue(0);
      this.form.controls.costoTotal.setValue(0);
      this.form.controls.precioTotal.setValue(0);
      this.form.controls.tipoCfdi.setValue("-1");
      this.form.get('tipoCfdi').disable();
      this.bandera=2;

      this.form.controls.checkProducto.reset();
      this.form.controls.selectProducto.reset();
     console.log('else',this.form)

    } else{
      this.form.controls.costoUnidad.reset();
      this.form.controls.precioUnidad.reset();
      this.form.controls.costoTotal.reset();
      this.form.controls.precioTotal.reset();
      this.form.controls.tipoCfdi.reset();
      this.form.get('tipoCfdi').enable();
      this.bandera=0;
      this.form.controls.checkProducto.reset();
       this.form.controls.selectProducto.reset();
      console.log('else',this.form)
    }
  }
  getCfdiCatalogo() {
    this.pricingService
    .cfdiCliente('-1','-1','-1',this.idCotizacion).subscribe((res: any) => {
        const cfdis = res;

        cfdis.map(cfdi => {
          this.CfdisCatalogo.push({"idCfdi":cfdi.CUC_CVEUSOCFDI,"nombre":cfdi.CUC_DESCRIPCION})
        })
        this.cfdi = JSON.parse(JSON.stringify(this.CfdisCatalogo));
    })
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

  setUnidadesDisponibles() {
    let usadas = 0;
    let disponibles = 0;
    if (this.currentSelected && this.currentSelected.idCotizacionTraslado) {
      disponibles = this.currentSelected.cantidad;
      const trasParent = this.currentSelected.children.filter(item => {
        return item.idCotizacionTrasladoPadre == this.currentSelected.idCotizacionTraslado;
      });
      trasParent.forEach(parents => {
        usadas += parents.cantidad;
      });
      disponibles = disponibles - usadas;
    } else {

      disponibles = this.selected[0].cantidad;
      const trasParent = this.selected[0].traslados.filter(item => {
        return item.idCotizacionTrasladoPadre == null;
      });

      trasParent.forEach(parents => {
        usadas += parents.cantidad;
      });
      disponibles = disponibles - usadas;
    }

    this.unidadesDisponibles = disponibles;
  }

  unidadesDisponiblesGlobal() {
    let usadas = 0;
    let disponibles = 0;

    disponibles = this.selected[0].cantidad;
    const trasParent = this.selected[0].traslados.filter(item => {
      return item.idCotizacionTrasladoPadre == null;
    });

    trasParent.forEach(parents => {
      usadas += parents.cantidad;
    });

    if (trasParent.length > 0) {
      console.log(trasParent);
    }
    else {
      usadas = this.unidadesEdit;
    }

    disponibles = disponibles - usadas;
    this.disponiblesGlobal = disponibles;
  }

  somethingChange(event) {
    this.currentTraslados = Object.assign([], this.currentTraslados);
  }

  lastChange(event) {
    if (this.currentEditSelected && this.currentEditSelected.idCotizacionTraslado !== event[0].idCotizacionTraslado) {
      this.selectLlegada.setDisabledState(false);
      this.currentEditSelected = undefined;
    }
    this.currentSelected = event[0];
    //console.log('currentSelected=>',this.currentSelected);

    this.idCotizacionTraslado=undefined;
    this.idGrupoUnidad=undefined
    this.idCotizacionTraslado= this.currentSelected.idCotizacionTraslado
    this.idGrupoUnidad=this.currentSelected.idGrupoUnidad
    this.GetIsFreeTransfer();

    this.selectPartida.setDisabledState(true);
    const ruta = this.rutas.filter(rt => {
      return rt.idTraslado === event[0].idTraslado;
    })[0];
    if (!this.editando) {
      this.idPuntoDePartida = ruta.ubicacionDestino.idUbicacionTraslado;
      this.idPuntoDeLLegada = undefined;
      this.setUnidadesDisponibles();
      this.unidades = this.currentSelected.cantidad;//this.unidadesDisponibles;
    }
    else {
      this.selectPartida.setDisabledState(false);
      this.unidades = this.unidadesEdit;
    }
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

    if (this.primerClick != 1)
      this.editando = false;
    this.primerClick = this.primerClick + 1;
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
      traslado: false,
      tipoCfdi: false,
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

  agregarTraslado(opcion) {
    let validation = true;
    this.resetValidation();
    if (this.idTipoTraslado == null) {
      this.customForm.traslado = true;
      validation = false;
    }
    if (this.unidades < 1) {
      this.customForm.unidades = true;
      validation = false;
    }

    if (this.isFreeTransfer) {
      if (this.costoTotal < 1) {
        this.customForm.costoTotal = true;
        validation = false;
      }
      if (this.costoUnidad < 1) {
        this.customForm.costoUnidad = true;
        validation = false;
      }
      if (this.precioTotal < 0) {
        this.customForm.precioTotal = true;
        validation = false;
      }
      if (this.precioUnidad < 0) {
        this.customForm.precioUnidad = true;
        validation = false;
      }
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
    if (!this.idCfdi) {
      this.customForm.tipoCfdi = true;
      validation = false;
    }

    let usadas = 0;
    let disponibles = 0;
    if (this.currentSelected && this.currentSelected.idCotizacionTraslado) {
      disponibles = this.currentSelected.cantidad;
      const trasParent = this.currentSelected.children.filter(item => {
        return item.idCotizacionTrasladoPadre == this.currentSelected.idCotizacionTraslado;
      });
      trasParent.forEach(parents => {
        usadas += parents.cantidad;
      });
      disponibles = disponibles - usadas;
    } else {
      disponibles = this.selected[0].cantidad;
      const trasParent = this.selected[0].traslados.filter(item => {
        return item.idCotizacionTrasladoPadre == null;
      });
      trasParent.forEach(parents => {
        usadas += parents.cantidad;
      });
      disponibles = disponibles - usadas;
    }

    if (opcion == 1) {
      this.unidadesDisponiblesGlobal();
    }
    else {
      this.unidadesDisponiblesGlobal();
      disponibles = this.currentEditSelected.cantidad + this.disponiblesGlobal;

      let usadasTotales = 0;

      this.currentTraslados.forEach(traslado => {
        usadasTotales += traslado.cantidad;
      });

      disponibles = this.totalUnidadesGrupo - (usadasTotales - this.currentEditSelected.cantidad);
    }

    if ((this.unidades > (disponibles)) && !this.customForm.unidades) {
      this.customForm.unidadesDisponibles = true;
      this.customForm.unidadesDisponiblesLabel = ((disponibles) > 0) ? (disponibles) : 0;
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

    this.idCotizacionTraslado=undefined;
    this.idGrupoUnidad=undefined;

    if (this.currentEditSelected) {
      currentCotizacion = this.currentEditSelected.idCotizacionTraslado;
      parent = this.currentEditSelected.idCotizacionTrasladoPadre;
      this.idCotizacionTraslado= this.currentEditSelected.idCotizacionTraslado
    }

    this.idGrupoUnidad=this.selected[0].idGrupoUnidad

    const traslado = {
      idCotizacionTraslado: currentCotizacion,
      idCotizacionTrasladoPadre: parent,
      idCotizacion: this.idCotizacion,
      idGrupoUnidad: this.selected[0].idGrupoUnidad,
      idTraslado: this.idTraslado,
      cantidad: this.unidades,
      fechaEntrega: this.model.year + '-' + this.model.month.toString().padStart(2, '0') + '-' + this.model.day.toString().padStart(2, '0'),
      costoUnitario: (this.isFreeTransfer) ? Number(this.costoUnidad) : 0,
      precioUnitario: (this.isFreeTransfer) ? Number(this.precioUnidad) : 0,
      costoTotal: (this.isFreeTransfer) ? Number(this.costoTotal) : 0,
      precioTotal: (this.isFreeTransfer) ? Number(this.precioTotal) : 0,
      idProveedor: this.idProveedor,
      idMedioTransporte: this.idTipoTraslado,
      impuestoTransporte: (this.idTipoTraslado) ? Number(((this.precioTotal - (this.precioTotal / (1 + (4 / 100))))).toFixed(2)) : 0,
      nombreProveedor: this.proveedores.filter(pro => {
        return pro.idProveedor === this.idProveedor;
      }
      )[0].nombreCompleto,
      idCfdi: (this.isFreeTransfer) ? this.idCfdi: "",
    } as CotizacionTraslado;
    const fecha = new Date(traslado.fechaEntrega);
    const fechaSinFormato: any = new Date(new Date(traslado.fechaEntrega).setDate(fecha.getDate() + 1));

    traslado.fechaEntrega = fechaSinFormato.getUTCFullYear() + '-'
      + (fechaSinFormato.getUTCMonth() + 1).toString().padStart(2, '0') + '-' +
      fechaSinFormato.getUTCDate().toString().padStart(2, '0');

    
    if (this.bandera != 2){
      if(this.bandera ==1 && this.productoCFDIsSelected) {
        const trasladoFac = [];
        const trasladoUnicoFac = {
          idCotizacionTraslado: 0,
          idCotizacion: this.cotizacion.idCotizacion,
          idGrupoUnidad: this.selected[0].idGrupoUnidad,
          idTraslado: this.idTraslado,
          datosFac: this.productoCFDIsSelected.VALUE.toString(),
          idUsuarioModificacion: 0,
        } as CotizacionTrasladoFac;
          trasladoFac.push(trasladoUnicoFac);
          this.tramitesService.guardaDatosFacTraslado(trasladoFac).subscribe(() => {});
        }else{
          this.toasterService.warning('Seleccione clave de producto');
          return;
        }
    }


    this.trasladoService.saveTraslado(this.idPuntoDePartida, this.idPuntoDeLLegada, traslado).subscribe(item => {
      //this.idCotizacionTraslado= this.currentSelected.idCotizacionTraslado
      this.GetIsFreeTransfer();
      this.resetForm();
      if (this.selectLlegada) {
        this.selectLlegada.setDisabledState(false);
      }

      //OCT99
      this.pricingService.getUnidadesInteresByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        this.grupoUnidades = cotizacion.gruposUnidades;
      });

      this.currentEditSelected = undefined;
      //this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      this.pricingService.getGrupoUnidadByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        this.resetDates();
        this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
        //this.grupoUnidades = this.cotizacion.gruposUnidades;
        if (this.isGrupoUnidad) {
          const traslados = this.grupoUnidades.filter(item => {
            return item.idGrupoUnidad === this.selected[0].idGrupoUnidad;
          });
          let missingTraslados = [] as any[];
          missingTraslados = traslados[0].traslados;
          this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
            this.rutas = rutas;
            missingTraslados.forEach(tras => {
              const ruta = this.rutas.filter(rt => {
                return rt.idTraslado === tras.idTraslado;
              })[0];
              tras.ubicacionDestino = ruta.ubicacionDestino.nombre;
              tras.ubicacionOrigen = ruta.ubicacionOrigen.nombre;
            });
            this.currentTraslados = this.list_to_tree(missingTraslados);
          });
          this.trasladosProductos = traslados[0].traslados;
        }
      });
      this.toasterService.success('Traslado Guardado');
      //this.ngOnInit();
    }
      , err => this.toasterService.error('Error al actualizar: ' + err.error.message + ' query:  ' + err.error.query)
    );
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
    this.idCfdi = undefined;

    this.form.controls.checkCostoCero.setValue(false);
    this.isFreeTransfer = true;

    this.form.controls.tipoCfdi.reset();
    this.form.get('tipoCfdi').enable();

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
    const ubicacion = {
      idUbicacionTraslado: null,
      nombre: type,
      descripcion: type,
      direccion: null
    };
    ubTraslado.push(ubicacion);
    this.trasladoService.saveUbicacionTraslados(ubTraslado).subscribe((res) => {
      this.trasladoService.getUbicacionTraslados().subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
        this.ubicaciones = ubicacionTraslados;
        const getCurrentValue = this.ubicaciones.filter(item => {
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

  // TrasladoCostoCeroOnChange(event){
  //   console.log(event);
  // }

  onSelect(event) {
    //console.log('onSelect: ');
    /*
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
    */
    this.totalUnidadesGrupo = event.selected[0].cantidad;

    this.currentSelected = [];
    this.currentEditSelected = undefined;
    this.editando = false;
    if (this.selectPartida) {
      this.selectPartida.setDisabledState(false);
    }
    this.resetValues();
    if (this.trasferTable) {
      this.trasferTable.resetValues();
    }
    this.setUnidadesDisponibles();
    this.unidades = this.unidadesDisponibles;

    const missingTraslados = this.selected[0].traslados;


    //console.log('this.selected[0]=>',this.selected[0]);
    this.idGrupoUnidad=undefined;
    this.idCotizacionTraslado=undefined;
    this.idGrupoUnidad = this.selected[0].idGrupoUnidad;
    this.idCotizacionTraslado=this.selected[0].idCotizacionTraslado
    this.GetIsFreeTransfer();
    this.bandera=0;
    this.form.controls.checkProducto.reset();
    this.form.controls.selectProducto.reset();

    missingTraslados.forEach(tras => {
      const ruta = this.rutas.filter(rt => {
        return rt.idTraslado === tras.idTraslado;
      })[0];
      tras.ubicacionDestino = ruta.ubicacionDestino.nombre;
      tras.ubicacionOrigen = ruta.ubicacionOrigen.nombre;
    });

    this.currentTraslados = this.list_to_tree(missingTraslados);
    this.idPuntoDeLLegada = undefined;
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
    const config: ScrollToConfigOptions = {
      offset: (this.currentTraslados.length * 40 * -1) - 40
    };
    this.scrollToService.scrollTo(config);
  }

  exportExcel() {
    this.excelService.exportAsExcelFile(this.grupoUnidades, 'traslados');
  }

  isFirstTransfer() {
    if (!this.isFreeTransfer) {
      // this.precioUnidad = 0;
      // this.costoUnidad = 0;
      // return true;
      if (this.currentSelected.idCotizacionTraslado) {
        return false;
      } else {
        if (this.selected[0].traslados.length > 0) {
          return false;
        } else {
          this.precioUnidad = 0;
          this.costoUnidad = 0;
          return true;
        }
      }
    } else {
      return false;
    }
  }

  visualizaComboProductos(){
    
    if(this.form.value.checkProducto == true){
        this.tramitesService.getCatalogoDatosFac('-1','Traslado').subscribe((ProductoCFDIs: ProductoCFDI[]) => {
          console.log(ProductoCFDIs)
          if(ProductoCFDIs[0].VALUE !='0'){
            this.ProductoCFDIs = ProductoCFDIs;
            this.bandera = 1
            }
        });
    }else{
      this.ProductoCFDIs = [];
      this.bandera = 0
    }
  }

  productoOnChange(ProductoCFDI:ProductoCFDI){
    this.productoCFDIsSelected = ProductoCFDI;
  }

  /*
  tipoOrdenOnChange(tipoOrden: TipoOrden) {
    if (tipoOrden) {
      this.idTipoOrden = tipoOrden.idTipoOrden;

      if (tipoOrden.idTipoOrden === 'CU') {
        this.idCfdi = undefined;
        this.activo = true;
        //this.cfdiNgSelect.setDisabledState(true);
      } else {
        this.idCfdi = undefined;
        this.activo = false;
        //this.cfdiNgSelect.setDisabledState(false);
      }
    }
    else {
      this.idCfdi = undefined;
      this.activo = false;
      //this.cfdiNgSelect.setDisabledState(true);
    }
  }
  */

}
