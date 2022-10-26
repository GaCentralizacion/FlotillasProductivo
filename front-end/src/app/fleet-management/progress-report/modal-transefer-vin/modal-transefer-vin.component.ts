import { Component, OnInit, ViewEncapsulation, ViewChild, QueryList, ViewChildren, ContentChildren, ANALYZE_FOR_ENTRY_COMPONENTS, Input, } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cotizacion, GrupoUnidades, Proveedor, CotizacionTraslado, Cfdi, TipoOrden, } from "../../../models";
import { PricingService, ProviderCatalogService, ClientCatalogService, } from "../../../services";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TrasladosCatalogService } from "src/app/services/traslados.service";
import { UbicacionTraslado, Traslado } from "../../../models";
import { ToastrService } from "ngx-toastr";
import { DatatableComponent, ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { TransferTableVinComponent } from "./transfer-table-vin/transfer-table-vin.component";
import { TransferTableService } from "./transfer.table.service";
import { DataService } from "../../../pricing-manager/data.service";
import { toDate } from "@angular/common/src/i18n/format_date";
import { NgSelectComponent } from "@ng-select/ng-select";
import {
  ScrollToService,
  ScrollToConfigOptions,
} from "@nicky-lenaers/ngx-scroll-to";
import { PricingManagerService } from "./../../../pricing-manager/pricing.manager.service";
import { ExcelService } from "src/app/services/excel.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-modal-transefer-vin",
  templateUrl: "./modal-transefer-vin.component.html",
  styleUrls: ["./modal-transefer-vin.component.scss"],
  providers: [PricingManagerService],
})
export class ModalTranseferVinComponent implements OnInit {
  isFreeTransfer = false;

  form: FormGroup;
  @ViewChild("mainTable") mainTable: DatatableComponent;
  @ViewChild(TransferTableVinComponent) trasferTable: TransferTableVinComponent;
  @ViewChild("selectPartida") public selectPartida: NgSelectComponent;
  @ViewChild("selectLlegada") public selectLlegada: NgSelectComponent;
  @ViewChild("selectCfdi") public selectCfdi: NgSelectComponent;
  @Input() VinesSelected;
  @Input() edicion = false;
  @Input() idCotizacionTraslado = 0;
  @Input() idSucursal;
  @Input() idMarca;
  public addTagNowRef: (type) => void;
  isLoading = false;

  customForm = {
    unidades: false,
    unidadesDisponibles: false,
    unidadesDisponiblesLabel: 0,
    fecha: false,
    precioTotal: false,
    costoTotal: false,
    proveedor: false,
    precioUnidad: false,
    costoUnidad: false,
    puntoLlegada: false,
    puntoPartida: false,
    traslado: false,
    tipoCfdi: false,
  };

  onlyRead = false;
  idTraslado;
  tiposTraslados = [
    { name: "Impulso Propio", idTipoTraslado: false },
    { name: "Madrina", idTipoTraslado: true },
  ];
  idTipoTraslado;
  idFlotilla: string;
  idCotizacion: string;
  idLicitacion: string;
  step: number;
  cotizacion: Cotizacion;
  financiera: any;
  grupoUnidades: GrupoUnidades[];
  currentTraslados = [] as any[];
  currentSelected;
  currentEditSelected;
  isGrupoUnidad = true;
  isTraslado = false;
  rutas: Traslado[];
  selected = [];
  selected2 = [];
  forma: FormGroup;
  activo = true;

  idTipoOrden: string;
  idCfdi: string;
  tipoOrden: TipoOrden[];
  cfdi: Cfdi;

  expanded: any = {};

  model = { year: 0, month: 0, day: 0 };
  minDate = { year: 0, month: 0, day: 0 };
  unidades = 0;
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
  puntoDePartidaB = "";
  isPuntoDePartida = true;
  puntoDeLLegadaB = "";
  isPuntoDeLLegada = true;

  unidadesVin: string[];
  unidadesVin2: any[];
  allRowsSelectedX = false;
  selectedRows = [] as any[];
  searchVin = '';
  SelectionTypeUnidad2 = SelectionType;
  gruposUnidad = [] as any[];
  idUsuario = 0;
  SelectedQuantity: number;
  CfdisCatalogo: any = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private pricingService: PricingService,
    private trasladoService: TrasladosCatalogService,
    private providerCatalogService: ProviderCatalogService,
    private toasterService: ToastrService,
    private trasferTableService: TransferTableService,
    private router: Router,
    private scrollToService: ScrollToService,
    public  pricingManagerService: PricingManagerService,
    private excelService: ExcelService,
    private catalogoService: ClientCatalogService,
    private activeModal: NgbActiveModal,
    private trasladosCatalogService: TrasladosCatalogService,
  ) {
    this.resetDates();
    this.addTagNowRef = this.saveTraslado.bind(this);
    this.form = new FormGroup({
      unidades: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      precioTotal: new FormControl(null, [Validators.required]),
      costoTotal: new FormControl(null, [Validators.required]),
      proveedor: new FormControl(null, [Validators.required]),
      precioUnidad: new FormControl(null, [Validators.required]),
      costoUnidad: new FormControl(null, [Validators.required]),
      puntoLlegada: new FormControl(null, [Validators.required]),
      puntoPartida: new FormControl(null, [Validators.required]),
      tipoTraslado: new FormControl(null, [Validators.required]),
      tipoCfdi: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    const userInformation = JSON.parse(localStorage.getItem('app_token'));
    this.idUsuario = userInformation.data.user.id;
    this.tipoOrden = [
      { idTipoOrden: "FI", nombre: "Facturacion Independiente" },
      { idTipoOrden: "CU", nombre: "Carga a la Factura" },
    ];
   
    this.editando = false;
    this.trasferTableService.selectChildrens.subscribe((item) => {
      this.trasferTable.growUp(item);
    });
    this.trasferTableService.scrollTO.subscribe((item) => {
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
      const ruta = this.rutas.filter((rt) => {
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
      this.selectPartida.setDisabledState(false);
      this.selectLlegada.setDisabledState(false);

      const splits = item.fechaEntrega.toString().split("-", 3);
      this.model.year = Number(splits[0]);
      this.model.month = Number(splits[1]);
      this.model.day = Number(splits[2]);
      this.triggerScrollTo();
    });
    
    
    this.trasferTableService.refreshTable.subscribe((item) => {
      // OCT99
      this.trasladosCatalogService.getListaUnidadesConfiguradas(this.idCotizacion)
        .subscribe((data: any) => {
          this.grupoUnidades = data;
        });
      this.currentSelected = null;
      this.selectPartida.setDisabledState(false);
      this.resetDates();

          //this.grupoUnidades = this.cotizacion.gruposUnidades;
          if (this.isGrupoUnidad) {
            let missingTraslados = [] as any[];
            const idCotizacionTrasladoPost = this.VinesSelected[0].idCotizacionTrasladoPost;
              this.trasladoService.getListadoTrasladoDetallePost(this.idCotizacion, idCotizacionTrasladoPost)
              .subscribe((trasladoPost: Traslado[]) => {
                //this.currentTraslados = trasladoPost;
                missingTraslados = trasladoPost;
              });

            this.trasladoService.getTraslados()
              .subscribe((rutas: Traslado[]) => {
                this.rutas = rutas;
                this.currentTraslados = this.list_to_tree(missingTraslados);
              });
          }
    });
    
    this.getParams();
    this.isLoading = true;
    //chk consulto traslado de la tabla de relacion
    // this.unidadesVin2 = cotizacion.gruposUnidades[0].detalleUnidades; // chk recupera lso viene spara la tabla
    this.trasladosCatalogService.getListaUnidadesConfiguradas(this.idCotizacion)
      .subscribe((data: any) => {

        this.unidadesVin2 = data;

        if (this.VinesSelected[0].length != undefined) this.selectFnxVin2();
        else this.selectFnxVin(); // deja los check en disabled

        this.FixonSelect(data);
      });
          /* //OCT99
          this.pricingService
            .getUnidadesInteresByIdCotizacion(this.idCotizacion)
            .subscribe((cotizacion: Cotizacion) => {
              this.grupoUnidades = cotizacion.gruposUnidades;
              this.FixonSelect(this.grupoUnidades);
            }); */
          this.isLoading = false;
          this.onlyRead = false;

          this.pricingService.isFreeTransfer(this.idMarca)
            .subscribe((res: any) => {
              this.isFreeTransfer = res;
            });
          //localStorage.setItem("cotizacion", JSON.stringify(this.cotizacion));
          this.financiera =  JSON.parse(localStorage.getItem("cotizacion"));
          if (this.financiera!= undefined){
            this.getCfdiCatalogo(this.financiera.idCotizacion);
          }
          

          //this.grupoUnidades = this.cotizacion.gruposUnidades;
          this.providerCatalogService.getProviders(this.idSucursal, "PROTRAS")
            .subscribe((proveedores: Proveedor[]) => {
              this.proveedores = proveedores;

              this.proveedores.forEach((proveedor) => {
                proveedor.nombreCompletoIdProveedor =
                  proveedor.idProveedor + " - " + proveedor.nombreCompleto;
            });
          });

    this.trasladoService.getUbicacionTraslados()
      .subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
        this.ubicaciones = ubicacionTraslados;
      });
    this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
      this.rutas = rutas;
    });
    if (this.edicion) {
      this.trasladoService.getObtenerDatosEdicionTrasladoPost(this.idCotizacion, this.idCotizacionTraslado).subscribe((traslado: any[]) => {
        const splits = traslado[0].fechaEntrega.toString().split("-", 3);
        this.minDate.year = Number(splits[0]);
        this.minDate.month = Number(splits[1]);
        this.minDate.day = Number(splits[2]);

        this.unidades = traslado[0].cantidad;
        this.costoUnidad = traslado[0].costoUnitario;
        this.costoTotal = traslado[0].costoTotal;
        this.precioUnidad = traslado[0].precioUnitario;
        this.precioTotal = traslado[0].precioTotal;
        this.idTipoTraslado = traslado[0].idMedioTransporte;
        this.idCfdi = traslado[0].idCfdi;
        this.idProveedor = traslado[0].idProveedor;
        this.idPuntoDePartida = traslado[0].idUbicacionOrigen;
        this.idPuntoDeLLegada = traslado[0].idUbicacionDestino;
        console.log('traslado[0].idUbicacionDestino');
        console.log(traslado[0].idUbicacionDestino);

        if (traslado.length > 0)
          this.currentTraslados = this.list_to_tree(traslado);
      });
    }
    
   
  }

  filterHeader() {
    if (this.searchVin.length > 0) {
      this.unidadesVin2 = this.unidadesVin2.filter(item => {
        if (!item.vin) {
          return false;
        }
        if (item.vin.toUpperCase().includes(this.searchVin.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  getCfdiCatalogo(idCotizacion:string) {
    this.pricingService
      .cfdiCliente('-1','-1','-1',idCotizacion)
        .subscribe((res: any) => {
          const cfdis = res;
          //this.cfdi = cfdi;
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
      const trasParent = this.currentSelected.children.filter((item) => {
        return (
          item.idCotizacionTrasladoPadre ==
          this.currentSelected.idCotizacionTraslado
        );
      });
      trasParent.forEach((parents) => {
        usadas += parents.cantidad;
      });
      disponibles = disponibles - usadas;
    } else {
      disponibles = this.SelectedQuantity;
      const trasParent = this.selected[0].traslados.filter((item) => {
        return item.idCotizacionTrasladoPadre == null;
      });

      trasParent.forEach((parents) => {
        usadas += parents.cantidad;
      });
      disponibles = disponibles - usadas;
    }

    this.unidadesDisponibles = disponibles;
  }

  unidadesDisponiblesGlobal() {
    let usadas = 0;
    let disponibles = 0;

    disponibles = this.SelectedQuantity;
    const trasParent = this.selected[0].traslados.filter((item) => {
      return item.idCotizacionTrasladoPadre == null;
    });

    trasParent.forEach((parents) => {
      usadas += parents.cantidad;
    });

    if (trasParent.length > 0) {
      console.log(trasParent);
    } else {
      usadas = this.unidadesEdit;
    }

    disponibles = disponibles - usadas;
    this.disponiblesGlobal = disponibles;
  }

  somethingChange(event) {
    this.currentTraslados = Object.assign([], this.currentTraslados);
  }

  lastChange(event) {
    if (
      this.currentEditSelected &&
      this.currentEditSelected.idCotizacionTraslado !==
      event[0].idCotizacionTraslado
    ) {
      this.selectLlegada.setDisabledState(false);
      this.currentEditSelected = undefined;
    }
    this.currentSelected = event[0];
    this.selectPartida.setDisabledState(true);
    const ruta = this.rutas.filter((rt) => {
      return rt.idTraslado === event[0].idTraslado;
    })[0];
    if (!this.editando) {
      this.idPuntoDePartida = ruta.ubicacionDestino.idUbicacionTraslado;
      this.idPuntoDeLLegada = undefined;
      this.setUnidadesDisponibles();
      this.unidades = this.currentSelected.cantidad; //this.unidadesDisponibles;
    } else {
      this.selectPartida.setDisabledState(false);
      this.unidades = this.unidadesEdit;
    }
    const splits = this.currentSelected.fechaEntrega.toString().split("-", 3);
    this.minDate.year = Number(splits[0]);
    this.minDate.month = Number(splits[1]);
    this.minDate.day = Number(splits[2]);
    const d = new Date(
      Number(splits[0]),
      Number(splits[1]) - 1,
      Number(splits[2])
    );
    const toDay = new Date();
    if (d.getTime() < toDay.getTime()) {
      this.model.year = toDay.getFullYear();
      this.model.month = toDay.getMonth() + 1;
      this.model.day = toDay.getDate();
    } else {
      this.model = {
        year: Number(splits[0]),
        month: Number(splits[1]),
        day: Number(splits[2]),
      };
    }

    if (this.primerClick != 1) this.editando = false;
    this.primerClick = this.primerClick + 1;
  }

  private getParams() {
    this.activeRoute.queryParams.subscribe((params) => {
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
      fecha: false,
      precioTotal: false,
      costoTotal: false,
      proveedor: false,
      precioUnidad: false,
      costoUnidad: false,
      puntoLlegada: false,
      puntoPartida: false,
      traslado: false,
      tipoCfdi: false,
    };
  }

  getTotalChild(row) {
    let total = 0;
    if (row.children && row.children.length > 0) {
      row.children.forEach((item) => {
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

    if (!this.model) {
      this.customForm.fecha = true;
      validation = false;
    }

    if (isNaN(Date.parse('' + this.model.year + '' + (this.model.month < 10)?'0':'' + this.model.month + '' + (this.model.day < 10)?'0':'' + this.model.day))) {
      this.customForm.fecha = true;
      validation = false;
    }

    let usadas = 0;
    let disponibles = 0;
    if (this.currentSelected && this.currentSelected.idCotizacionTraslado) {
      disponibles = this.currentSelected.cantidad;
      const trasParent = this.currentSelected.children.filter((item) => {
        return (
          item.idCotizacionTrasladoPadre ==
          this.currentSelected.idCotizacionTraslado
        );
      });
      trasParent.forEach((parents) => {
        usadas += parents.cantidad;
      });
      disponibles = disponibles - usadas;
    } else {
      disponibles = this.SelectedQuantity;
      const trasParent = this.selected[0].traslados.filter((item) => {
        return item.idCotizacionTrasladoPadre == null;
      });
      trasParent.forEach((parents) => {
        usadas += parents.cantidad;
      });
      disponibles = disponibles - usadas;
    }

    if (opcion == 1) {
      this.unidadesDisponiblesGlobal();
    } else {
      this.unidadesDisponiblesGlobal();
      disponibles = this.currentEditSelected.cantidad + this.disponiblesGlobal;

      let usadasTotales = 0;

      this.currentTraslados.forEach((traslado) => {
        usadasTotales += traslado.cantidad;
      });

      disponibles =
        this.totalUnidadesGrupo -
        (usadasTotales - this.currentEditSelected.cantidad);
    }

    if (this.unidades > disponibles && !this.customForm.unidades) {
      this.customForm.unidadesDisponibles = true;
      /* this.customForm.unidadesDisponiblesLabel =
      disponibles > 0 ? disponibles : 0;
      validation = false;*/
    }

    if (!validation) {
      return;
    }

    let parent = 0;

    if (this.currentSelected) {
      parent = this.currentSelected.idCotizacionTraslado;
      if (parent == undefined) parent = 0;
    }

    let currentCotizacion = null;
    if (this.currentEditSelected) {
      currentCotizacion = this.currentEditSelected.idCotizacionTraslado;
      parent = this.currentEditSelected.idCotizacionTrasladoPadre;
    }

    let recordsets: string = '<Vins>';
    this.selected2.forEach(async (element) => {
      recordsets += '<partida>';
      recordsets += '<vin>' + this.OBJtoXML(element.vin) + '</vin>';
      recordsets += '<idGrupoUnidad>' + element.idGrupoUnidad + '</idGrupoUnidad>';
      recordsets += '</partida>';
    });
    recordsets += '</Vins>';

    const traslado = {
      idCotizacionTraslado: currentCotizacion,
      idCotizacionTrasladoPadre: parent,
      idCotizacion: this.idCotizacion,
      idGrupoUnidad: this.selected[0].idGrupoUnidad,
      idTraslado: ((this.idTraslado === null) || (!this.idTraslado)) ? 0 : this.idTraslado,
      cantidad: this.unidades, //chk - 07 ene 2021 cambio se envia cantidad
      fechaEntrega:
        this.model.year +
        "-" +
        this.model.month.toString().padStart(2, "0") +
        "-" +
        this.model.day.toString().padStart(2, "0"),
      costoUnitario: Number(this.costoUnidad),
      precioUnitario: Number(this.precioUnidad),
      costoTotal: Number(this.costoTotal),
      precioTotal: Number(this.precioTotal),
      idProveedor: this.idProveedor,
      idMedioTransporte: this.idTipoTraslado,
      impuestoTransporte: this.idTipoTraslado ? Number((this.precioTotal - this.precioTotal / (1 + 4 / 100)).toFixed(2)) : 0,
      nombreProveedor: this.proveedores.filter((pro) => {
        return pro.idProveedor === this.idProveedor;
      })[0].nombreCompleto,
      idCfdi: this.idCfdi,
      vins: recordsets,
      idUsuario: this.idUsuario,
      utilidadTotal: 0,
      tipoOrden: this.idCfdi,
      idUbicacionOrigen: this.idPuntoDePartida,
      idUbicacionDestino: this.idPuntoDeLLegada
    };

    const fecha = new Date(traslado.fechaEntrega);
    const fechaSinFormato: any = new Date(
      new Date(traslado.fechaEntrega).setDate(fecha.getDate() + 1)
    );

    traslado.fechaEntrega =
      fechaSinFormato.getUTCFullYear() +
      "-" +
      (fechaSinFormato.getUTCMonth() + 1).toString().padStart(2, "0") +
      "-" +
      fechaSinFormato.getUTCDate().toString().padStart(2, "0");

    this.trasladoService.postInsertaTrasladosMovs(traslado)
      .subscribe((data) => {
        console.log('>>>>> postInsertaTrasladosMovs', data);
        console.log('>>> Traslado padre ',parent);
        console.log('>>>>> Seleccion de la tabla de abojo', this.VinesSelected[0].idCotizacionTrasladoPost);
        let idCotizacionTrasladoPost = this.VinesSelected[0].idCotizacionTrasladoPost;
        if (data[0].Success == 1 || data[0].Success == '1') {
          if(parent == 0){
            idCotizacionTrasladoPost = data[0].idCotizacionTraslado;
          } else {
            if(idCotizacionTrasladoPost === undefined){
              idCotizacionTrasladoPost = parent;
            }
          }

          this.resetForm();
          if (this.selectLlegada) {
            this.selectLlegada.setDisabledState(false);
          }

          //OCT99
             /* this.pricingService
                .getUnidadesInteresByIdCotizacion(this.idCotizacion)
                .subscribe((cotizacion: Cotizacion) => {
                  this.grupoUnidades = cotizacion.gruposUnidades;
                }); */
                this.currentEditSelected = undefined;
                //this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
                /* this.pricingService
                  .getGrupoUnidadByIdCotizacion(this.idCotizacion)
                  .subscribe((cotizacion: Cotizacion) => { */
                    this.resetDates();
                   //this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
                    //this.grupoUnidades = this.cotizacion.gruposUnidades;
                    this.trasladosCatalogService.getListaUnidadesConfiguradas(this.idCotizacion)
                    .subscribe((datos: any) => {
                      this.grupoUnidades = datos;
                    });

                    console.log('this.isGrupoUnidad',this.isGrupoUnidad);
                    if (this.isGrupoUnidad) {
                      /*  const traslados = this.grupoUnidades.filter((item) => {
                        return item.idGrupoUnidad === this.selected.idGrupoUnidad;
                      }); */
                      let missingTraslados = [] as any[];
                        this.trasladoService.getListadoTrasladoDetallePost(this.idCotizacion, idCotizacionTrasladoPost)
                        .subscribe((trasladoPost: Traslado[]) => {
                          missingTraslados = trasladoPost;
                        });

                this.trasladoService.getTraslados()
                  .subscribe((rutas: Traslado[]) => {
                    this.rutas = rutas;
                    missingTraslados.forEach((tras) => {
                      const ruta = this.rutas.filter((rt) => {
                        return rt.idTraslado === tras.idTraslado;
                      })[0];
                      tras.ubicacionDestino = ruta.ubicacionDestino.nombre;
                      tras.ubicacionOrigen = ruta.ubicacionOrigen.nombre;
                    });
                    this.currentTraslados = this.list_to_tree(missingTraslados);
                  });
              }
          this.pricingManagerService.onlyRead = true;
          //this.activeModal.close('Success');
          this.toasterService.success("Traslado Guardado");

           // Cambio P07 - EHJ-COAL
          // Se agrego Validacion de existenia
          this.pricingService.insertaBitacoraUtilidadPosteriores(this.idCotizacion, 10 )
          .subscribe((valida: any) => {
            if (valida[0].Success !== 1) {
              // Se inserto Utilidad
            }
          });

        } else {
          this.toasterService.warning(`Error ${data[0].Mensaje}`, 'Traslados');
        }
      },
        (err) =>
          this.toasterService.error(
            "Error al actualizar: " +
            err.error.message +
            " query:  " +
            err.error.query
          )
      )
  }

  async editarTraslado(opcion) {
    await this.validaDatos()
      .then(async (valido: boolean) => {

        let usadas = 0;
        let disponibles = 0;
        if (this.currentSelected && this.currentSelected.idCotizacionTraslado) {
          disponibles = this.currentSelected.cantidad;
          const trasParent = this.currentSelected.children.filter((item) => {
            return (
              item.idCotizacionTrasladoPadre ==
              this.currentSelected.idCotizacionTraslado
            );
          });
          trasParent.forEach((parents) => {
            usadas += parents.cantidad;
          });
          disponibles = disponibles - usadas;
        } else {
          disponibles = this.SelectedQuantity;
          const trasParent = this.selected[0].traslados.filter((item) => {
            return item.idCotizacionTrasladoPadre == null;
          });
          trasParent.forEach((parents) => {
            usadas += parents.cantidad;
          });
          disponibles = disponibles - usadas;
        }

        if (opcion == 1) {
          this.unidadesDisponiblesGlobal();
        } else {
          this.unidadesDisponiblesGlobal();
          disponibles = this.currentEditSelected.cantidad + this.disponiblesGlobal;

          let usadasTotales = 0;

          this.currentTraslados.forEach((traslado) => {
            usadasTotales += traslado.cantidad;
          });

          disponibles =
            this.totalUnidadesGrupo -
            (usadasTotales - this.currentEditSelected.cantidad);
        }

        if (this.unidades > disponibles && !this.customForm.unidades) {
          this.customForm.unidadesDisponibles = true;
        }

        if (!valido) {
          return;
        }

        let parent = 0;

        if (this.currentSelected) {
          parent = this.currentSelected.idCotizacionTraslado;
          if (parent == undefined) parent = 0;
        }

        let currentCotizacion = null;
        if (this.currentEditSelected) {
          currentCotizacion = this.currentEditSelected.idCotizacionTraslado;
          parent = this.currentEditSelected.idCotizacionTrasladoPadre;
        }

        let recordsets: string = '<Vins>';
        this.selected2.forEach(async (element) => {
          recordsets += '<partida>';
          recordsets += '<vin>' + this.OBJtoXML(element.vin) + '</vin>';
          recordsets += '<idGrupoUnidad>' + element.idGrupoUnidad + '</idGrupoUnidad>';
          recordsets += '</partida>';
        });
        recordsets += '</Vins>';

        const traslado = {
          idCotizacionTraslado: (!currentCotizacion) ? this.idCotizacionTraslado : currentCotizacion,
          idCotizacionTrasladoPadre: parent,
          idCotizacion: this.idCotizacion,
          idGrupoUnidad: this.selected[0].idGrupoUnidad,
          idTraslado: ((this.idTraslado === null) || (!this.idTraslado)) ? 0 : this.idTraslado,
          cantidad: this.unidades, //chk - 07 ene 2021 cambio se envia cantidad
          fechaEntrega:
            this.model.year +
            "-" +
            this.model.month.toString().padStart(2, "0") +
            "-" +
            this.model.day.toString().padStart(2, "0"),
          costoUnitario: Number(this.costoUnidad),
          precioUnitario: Number(this.precioUnidad),
          costoTotal: Number(this.costoTotal),
          precioTotal: Number(this.precioTotal),
          idProveedor: this.idProveedor,
          idMedioTransporte: this.idTipoTraslado,
          impuestoTransporte: this.idTipoTraslado ? Number((this.precioTotal - this.precioTotal / (1 + 4 / 100)).toFixed(2)) : 0,
          nombreProveedor: this.proveedores.filter((pro) => {
            return pro.idProveedor === this.idProveedor;
          })[0].nombreCompleto,
          idCfdi: this.idCfdi,
          vins: recordsets,
          idUsuario: this.idUsuario,
          utilidadTotal: 0,
          tipoOrden: this.idCfdi,
          idUbicacionOrigen: this.idPuntoDePartida,
          idUbicacionDestino: this.idPuntoDeLLegada
        };

        console.log('traslado: ');
        console.log(traslado);

        const fecha = new Date(traslado.fechaEntrega);
        const fechaSinFormato: any = new Date(
          new Date(traslado.fechaEntrega).setDate(fecha.getDate() + 1)
        );

        traslado.fechaEntrega =
          fechaSinFormato.getUTCFullYear() +
          "-" +
          (fechaSinFormato.getUTCMonth() + 1).toString().padStart(2, "0") +
          "-" +
          fechaSinFormato.getUTCDate().toString().padStart(2, "0");

        this.trasladoService.postEditaTrasladosMovs(traslado)
          .subscribe((data) => {
            console.log(data);
            if (data[0].Success == 1 || data[0].Success == '1') {
              this.resetForm();
              if (this.selectLlegada) {
                this.selectLlegada.setDisabledState(false);
              }

              //OCT99
              /* this.pricingService
                .getUnidadesInteresByIdCotizacion(this.idCotizacion)
                .subscribe((cotizacion: Cotizacion) => {
                  this.grupoUnidades = cotizacion.gruposUnidades;
                }); */
              this.currentEditSelected = undefined;
              //this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
              /* this.pricingService
                .getGrupoUnidadByIdCotizacion(this.idCotizacion)
                .subscribe((cotizacion: Cotizacion) => { */
                  this.resetDates();
                 //this.cotizacion = Object.assign(new Cotizacion(), cotizacion);
                  //this.grupoUnidades = this.cotizacion.gruposUnidades;
                  this.trasladosCatalogService.getListaUnidadesConfiguradas(this.idCotizacion)
                  .subscribe((datos: any) => {
                    this.grupoUnidades = datos;
                  });

                  if (this.isGrupoUnidad) {
                    let missingTraslados = [] as any[];
                    const idCotizacionTrasladoPost = this.VinesSelected[0].idCotizacionTrasladoPost;

                    this.trasladoService.getListadoTrasladoDetallePost(this.idCotizacion, idCotizacionTrasladoPost)
                    .subscribe((datos: any) => {
                      missingTraslados = datos;
                    });

                    this.trasladoService.getTraslados()
                      .subscribe((rutas: Traslado[]) => {
                        this.rutas = rutas;
                        console.log(">>>> inicio el foreach de edicion traslado", idCotizacionTrasladoPost);

                        missingTraslados.forEach((tras) => {
                          console.log('>>>> foreach de edicion ',tras)
                          const ruta = this.rutas.filter((rt) => {
                            return rt.idTraslado === tras.idTraslado;
                          })[0];
                          tras.ubicacionDestino = ruta.ubicacionDestino.nombre;
                          tras.ubicacionOrigen = ruta.ubicacionOrigen.nombre;
                        });
                        this.currentTraslados = this.list_to_tree(missingTraslados);
                      });
                  }
                //});
              this.pricingManagerService.onlyRead = true;
              //this.activeModal.close('Success');
              this.toasterService.success("Traslado Actualizado");
            } else {
              this.toasterService.warning(`Error ${data[0].Mensaje}`, 'Traslados');
            }
          },
            (err) =>
              this.toasterService.error(
                "Error al actualizar: " +
                err.error.message +
                " query:  " +
                err.error.query
              )
          )
      })
      .catch(err => {
        let error = JSON.parse(err[0].Error);
        this.toasterService.error(error.errors[0].description, 'Validación de datos');
      }
      );
  }

  async validaDatos(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
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

        if (!this.model) {
          this.customForm.fecha = true;
          validation = false;
        }

        if (isNaN(Date.parse('' + this.model.year + '' + (this.model.month < 10)?'0':'' + this.model.month + '' + (this.model.day < 10)?'0':'' + this.model.day))) {
          this.customForm.fecha = true;
          validation = false;
        }
        resolve(validation);
      }
      catch (error) {
        this.toasterService.error("Error al validar datos: " + error.message);
        reject(false);
      }
    });
  }

  resetForm() {
    this.precioTotal = 0;
    this.costoTotal = 0;
    this.idTipoTraslado = undefined;
    this.costoUnidad = 0;
    this.precioUnidad = 0;
    this.idProveedor = undefined;
    this.idPuntoDeLLegada = undefined;
    this.idPuntoDePartida = undefined;
    this.unidades = 1;
    this.idCfdi = undefined;
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
    this.router.navigate(["main/cotizaciones/manager/condiciones"], {
      queryParams: {
        idFlotilla: this.idFlotilla,
        idLicitacion: this.idLicitacion,
        idCotizacion: this.idCotizacion,
        step: 4,
      },
    });
  }

  saveTraslado(type) {
    const ubTraslado: UbicacionTraslado[] = [];
    const ubicacion = {
      idUbicacionTraslado: null,
      nombre: type,
      descripcion: type,
      direccion: null,
    };
    ubTraslado.push(ubicacion);
    this.trasladoService.saveUbicacionTraslados(ubTraslado).subscribe((res) => {
      this.trasladoService
        .getUbicacionTraslados()
        .subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
          this.ubicaciones = ubicacionTraslados;
          const getCurrentValue = this.ubicaciones.filter((item) => {
            return type.toUpperCase() === item.nombre.toUpperCase();
          });
          if (this.isPuntoDePartida) {
            this.idPuntoDePartida = getCurrentValue[0].idUbicacionTraslado;
          } else {
            this.idPuntoDeLLegada = getCurrentValue[0].idUbicacionTraslado;
          }
          this.toasterService.success("Ubicacion guardada");
        });
    });
  }

  FixonSelect(unidades) {
    this.selected = unidades;
    this.SelectedQuantity = this.selected.length;
    this.totalUnidadesGrupo = Math.max.apply(Math, unidades.map(function(o: { idGrupoUnidad: any; }) { return o.idGrupoUnidad; }));

    this.currentSelected = [];
    this.currentEditSelected = undefined;
    this.editando = false;
    if (this.selectPartida) {
      this.selectPartida.setDisabledState(false);
    }
    //this.resetValues();
    if (this.trasferTable) {
      this.trasferTable.resetValues();
    }
    /* this.setUnidadesDisponibles();
    this.unidades = 0; // this.unidadesDisponibles;*/
    this.trasladosCatalogService.getListarTrasladosPosteriores(this.idCotizacion)
      .subscribe((datos: any) => {
        const missingTraslados = datos;
        this.selected.map((obj) =>{
          obj.traslados =  datos;
        });
        console.log(">>>< MAP traslados", this.selected);

        missingTraslados.forEach((tras) => {
          const ruta = this.rutas.filter((rt) => {
            return rt.idTraslado === tras.idTraslado;
          })[0];
          tras.nombreDestino = ruta.ubicacionDestino.nombre;
          tras.nombreOrigen = ruta.ubicacionOrigen.nombre;
        });
      });

      if (!this.edicion) {
        const idCotizacionTrasladoPost = this.VinesSelected[0].idCotizacionTrasladoPost;
        if(idCotizacionTrasladoPost != undefined){
          this.trasladoService.getListadoTrasladoDetallePost(this.idCotizacion, idCotizacionTrasladoPost)
          .subscribe((trasladoPost: Traslado[]) => {
            //this.currentTraslados = trasladoPost;
            this.currentTraslados = this.list_to_tree(trasladoPost);
          });
        }
      }
      //this.currentTraslados = this.list_to_tree(missingTraslados);
    //this.idPuntoDeLLegada = undefined;
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

  onDetailToggle(evento: { type: string; value: GrupoUnidades }) {
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
      if (
        node.idCotizacionTrasladoPadre &&
        node.idCotizacionTrasladoPadre !== "0"
      ) {
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
      const traslado = this.rutas.filter((item) => {
        return (
          item.idUbicacionDestino === this.idPuntoDeLLegada &&
          item.idUbicacionOrigen === this.idPuntoDePartida &&
          item.idProveedor === this.idProveedor
        );
      });
      if (traslado && traslado[0]) {
        this.costoUnidad = traslado[0].costoUnitario;
        this.precioUnidad = traslado[0].precioUnitario;
        this.precioTotal = this.precioUnidad * this.unidades;
        this.costoTotal = this.costoUnidad * this.unidades;
        this.idTraslado = traslado[0].idTraslado;
      } else {
        this.limpiaTraslado();
      }
    } else {
      this.limpiaTraslado();
    }
  }

  limpiaTraslado() {
    this.idTraslado = null;
    this.costoUnidad = 0;
    this.precioTotal = 0;
    this.costoTotal = 0;
    this.precioUnidad = 0;
  }

  public triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      offset: this.currentTraslados.length * 40 * -1 - 40,
    };
    this.scrollToService.scrollTo(config);
  }

  exportExcel() {
    this.excelService.exportAsExcelFile(this.grupoUnidades, "traslados");
  }

  isFirstTransfer() {
    if (!this.isFreeTransfer) {
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
  cerrarModal() {
    this.resetValues();
    this.activeModal.close(false);
  }

  onCheckboxChangeX(event, row) {
    row.isSelected = event.currentTarget.checked;

    if (!event.currentTarget.checked) {
      this.allRowsSelectedX = false;
      this.unidades = this.unidades - 1;
      // chk - 07 ene 2021 elimino el check deseleccionado
      this.selected2.splice(this.selected2.indexOf(row), 1);
    }
    else {
      let aux1 = this.unidadesVin2.filter(item => item.isSelected);
      let aux2 = this.unidadesVin2.filter(item => item.vin);

      if (aux1.length == aux2.length)
        this.allRowsSelectedX = true;
      this.unidades = this.unidades + 1;
      // chk - 07 ene 2021 agrego el check seleccionado
      this.selected2.push(row);
    }
  }

  selectFnx() {
    let total = 0;
    for (var i = 0; i < this.unidadesVin2.length; i++) {
      if (this.allRowsSelectedX) {
        this.selected2 = [];
        this.unidadesVin2[i].isSelected = false;
      }
      else {
        if (!this.unidadesVin2[i].isSelected) {
          if (this.unidadesVin2[i].vin)
            this.unidadesVin2[i].isSelected = true;
          total++;
        }
      }
    }
    this.unidades = total;
    this.allRowsSelectedX = !this.allRowsSelectedX;
  }

  selectFnxVin() { // chk - visualiza viene de la lupa
    let total = 0;
    for (var i = 0; i < this.unidadesVin2.length; i++) {
      if (this.unidadesVin2[i].vin === this.VinesSelected[0].vin) {
        this.selected2.push(this.unidadesVin2[i]);
        this.unidadesVin2[i].isSelected = true;
        total++;
      }
    }
    this.unidades = 0;
    this.pricingManagerService.onlyRead = true;
    this.allRowsSelectedX = !this.allRowsSelectedX;
  }

  selectFnxVin2() { // no es lupa
    let total = 0;
    for (var o = 0; o < this.VinesSelected[0].length; o++) {
      for (var i = 0; i < this.unidadesVin2.length; i++) {
        if (this.unidadesVin2[i].vin === this.VinesSelected[0][o].vin) {
          this.selected2.push(this.unidadesVin2[i]);
          this.unidadesVin2[i].isSelected = true;
          total++;
        }
      }
    }
    this.unidades = total;
    this.pricingManagerService.onlyRead = true;
    this.allRowsSelectedX = !this.allRowsSelectedX;
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
