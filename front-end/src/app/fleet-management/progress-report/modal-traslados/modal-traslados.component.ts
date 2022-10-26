import { Component, OnInit, AfterViewInit, ViewChild, Input } from "@angular/core";
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";
import { PricingService } from "src/app/services";
import { Cotizacion, Traslado } from "src/app/models";
import { ActivatedRoute } from "@angular/router";
import { TrasladosCatalogService } from "../../../services/traslados.service";
import { ModalTranseferVinComponent } from "../modal-transefer-vin/modal-transefer-vin.component";
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: "app-modal-traslados",
  templateUrl: "./modal-traslados.component.html",
  styleUrls: ["./modal-traslados.component.scss"],
  providers: [TrasladosCatalogService],
})
export class ModalTrasladosComponent implements OnInit {

  @Input() detalleUnidad: any;
  @Input() versionUnidad: string;
  @ViewChild('ctdTabset') ctdTabset;
  // public cotizacion: Cotizacion;
  public unidad;
  public unidadesNuevas;
  public unidadesNuevasOriginal;

  public selectedRows = [] as any[];
  public originalPedidas = [] as any[];

  public apartarUnidades = [] as any[];
  public desapartarUnidades = [] as any[];

  @Input() bProStatus: any;
  @Input() idSucursal: number;
  @Input() idMarca: number;

  modalEliminaTraslado: any = null;
  filtroGrupos: number[] = [];
  radioFiltro: number = 0;

  public vines;
  activo = false;
  allRowsSelectedX = false;
  searchVin = '';
  tabActiva = '1';
  unidadesOriginal = [] as any[];
  unidades = [] as any[];
  idTrasladoTrasladoSelected = 0;
  idTrasladoUnidadSelected = 0;
  tasladoAeliminar: any;

  filterdescripcion = "";
  filterExt = "";
  filterInt = "";
  filterMarca = "";
  filterModelo = "";
  filterClase = "";
  filterDesc = "";
  filterAno = "";
  filterCompra = "";
  filterVin = "";
  filterAgencia = "";
  filterSegmento = "";
  filterAntiguedad = "";
  filterCatalogo = "";
  idCotizacion: string;
  selected = [];
  idLicitacion: string;
  step: number;
  isLoading = false;
  Cotizacion: Cotizacion;

  traslados = [] as any[];
  gruposUnidad = [] as any[];
  SelectionTypeUnidad = SelectionType;
  SelectionTypeTraslado = SelectionType;
  VinesSelcc: any[] = [];

  constructor(
    private trasladosCatalogService: TrasladosCatalogService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toasterService: ToastrService,
    private catalogService: PricingService,
    private activeRoute: ActivatedRoute,
    private pricingService: PricingService
  ) { }

  private getParams() {
    this.activeRoute.queryParams.subscribe((params) => {
      this.idCotizacion = params.idCotizacion as string;
      this.idLicitacion = params.idLicitacion as string;
    });
  }

  ngOnInit() {
    this.getParams();
    const token = JSON.parse(localStorage.getItem("app_token"));
    const cotizacionModule = token.data.permissions.modules.find(
      (m) => m.name == "Cotizaciones"
    );
    /* if (cotizacionModule) {
      this.verCosto = cotizacionModule.objects.some(o => o.name == 'verCosto');
    } */

    this.obtieneUnidadesConfiguradas();
    this.obtieneTrasladosConfigurados();

    this.isLoading = true;
    this.trasladosCatalogService
      .getListaVinesTraslados(this.idCotizacion)
      .subscribe((data: any) => {
        let carros: any = [{}];
        this.isLoading = false;
        carros = data;
        this.vines = carros;
      });

    if (this.bProStatus.ucu_idpedidobpro) {
      this.tabActiva = '2';
    }
    this.ctdTabset.select(this.tabActiva);
  }

  obtieneUnidadesConfiguradas() {
    this.trasladosCatalogService.getListaUnidadesConfiguradas(this.idCotizacion)
      .subscribe((data: any) => {
        this.unidadesOriginal = data;
        this.unidades = this.unidadesOriginal;
        this.gruposUnidad = this.unidadesOriginal.map(item => item.idGrupoUnidad).filter((value, index, self) => self.indexOf(value) === index);
      });
  }

  obtieneTrasladosConfigurados() {
    this.trasladosCatalogService.getListadoTrasladosCotizacion(this.idCotizacion)
      .subscribe((data: any) => {
        this.traslados = data;
      });
  }

  ngAfterViewInit(): void { }

  filterHeader() {
    this.unidades = Object.assign(this.unidadesOriginal, []);
    if (this.searchVin.length > 0) {
      this.unidades = this.unidades.filter(item => {
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

  isMissingVin() {
    let missing = false;
    this.unidad.detalleUnidades.forEach((du) => {
      if (du.vin == null || du.vin.length < 1) {
        missing = true;
      }
    });
    return missing;
  }

  cancel() {
    this.activeModal.close(false);
  }

  save() { }

  onCheckboxChangeX(event, row) {
    row.isSelected = event.currentTarget.checked;

    if (!event.currentTarget.checked) {
      this.allRowsSelectedX = false;
    }
    else {
      let aux1 = this.unidades.filter(item => item.isSelected);
      let aux2 = this.unidades.filter(item => item.vin);

      if (aux1.length == aux2.length)
        this.allRowsSelectedX = true;
      this.VinesSelcc.push(row);
    }
  }

  selectFnx() {
    for (var i = 0; i < this.unidades.length; i++) {
      if (this.allRowsSelectedX) {
        this.unidades[i].isSelected = false;
      }
      else {
        if (!this.unidades[i].isSelected) {
          if (this.unidades[i].vin && (!this.unidades[i].idCotizacionTraslado && !this.unidades[i].idCotizacionTrasladoPost))
            this.unidades[i].isSelected = true;
          if (this.unidades[i].isSelected != undefined) {
            this.VinesSelcc.push(this.unidades[i]);
          }
        }
      }
    }
    this.allRowsSelectedX = !this.allRowsSelectedX;
  }

  vaciarCheckPrev() {
    //chk marzo 1 21k | hago clic en cerrar el modal de agregar traslados a vines
    this.VinesSelcc = [];
    this.VinesSelcc.length = 0;
    this.unidades[1].isSelected = false;
    this.allRowsSelectedX = false;
    for (var i = 0; i < this.unidades.length; i++) {
      this.unidades[i].isSelected = false;
    }
  }

  openModalEditComponent(opcion, VinesSelected?) {
    if (VinesSelected == undefined)
      VinesSelected = this.VinesSelcc;
    let Arreglo: any[] = [];
    // console.log('modal-traslado component - seleccion >>>> ', VinesSelected);
    // console.log('modal-traslado component - Arreglo >>>>>>>', Arreglo);
    if (VinesSelected.length == 0 && Arreglo.length == 0) {
      this.toasterService.warning('No se slecciono ningun VIN', 'Traslados posteriores');
    } else {

      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      };

      const modalGrupoUnidad = this.modalService.open(ModalTranseferVinComponent, ngbModalOptions);
      Arreglo.push(VinesSelected);
      modalGrupoUnidad.componentInstance.VinesSelected = Arreglo;
      modalGrupoUnidad.componentInstance.idSucursal = this.idSucursal;
      modalGrupoUnidad.componentInstance.idMarca = this.idMarca;
      //OCT 99 20210308 edicion de traslados posteriores
      if (opcion == 1)
        modalGrupoUnidad.componentInstance.edicion = true;
      modalGrupoUnidad.componentInstance.idCotizacionTraslado = VinesSelected.idCotizacionTraslado;

      modalGrupoUnidad.result
        .then((result) => {
          this.obtieneTrasladosConfigurados();
          this.obtieneUnidadesConfiguradas();
          //chk - 07 ene 21k envio el success desde el modal del  vin para recargar
          //console.log('modal-traslado component - >>>modal vines al cerrar modal', result);
          if (result == 'Success') {
            this.vaciarCheckPrev();
          }
          if (result == false) this.vaciarCheckPrev();
        });
    }
  }

  openModalDelete(traslado, modal) {
    this.tasladoAeliminar = traslado;
    this.modalEliminaTraslado = this.modalService.open(modal, { size: 'lg' });
  }

  eliminarTraslado() {
    this.trasladosCatalogService.eliminaTrasladoPosteriorMov(this.tasladoAeliminar.idCotizacionTraslado).subscribe((res: any) => {
      if (res[0].Success === 1) {
        this.toasterService.success(res[0].Mensaje);
        this.modalEliminaTraslado.close();
        this.obtieneTrasladosConfigurados();
        this.obtieneUnidadesConfiguradas();

        // Cambio P07 - EHJ-COAL
        // Se agrego Validacion de existenia
        this.pricingService.insertaBitacoraUtilidadPosteriores(this.idCotizacion, 11)
          .subscribe((valida: any) => {
            if (valida[0].Success !== 1) {
              // Se inserto Utilidad
            }
          });

      }
      else {
        this.toasterService.warning(res[0].Mensaje);
      }
    }, (err) => {
      this.toasterService.error(`Se produjo un error al intenar eliminar el traslado.`);
    });
  }

  onSelectUnidad({ selected }) {
    console.log('Select unidad', selected, this.selected);
    this.idTrasladoTrasladoSelected = 0;
    this.idTrasladoUnidadSelected = this.selected[0].idCotizacionTrasladoPost;
  }

  onActivateUnidad(event) {
    console.log('Activate unidad', event);
  }

  onSelectTraslado({ selected }) {
    console.log('Select traslado', selected, this.selected);
    this.idTrasladoUnidadSelected = 0;
    this.idTrasladoTrasladoSelected = this.selected[0].idCotizacionTraslado;
  }

  onActivateTraslado(event) {
    console.log('Activate traslado', event);
  }

  limpiaFiltros() {
    this.obtieneUnidadesConfiguradas();
    this.filtroGrupos = [];
    this.radioFiltro = 0;
  }

  filtroSeleccionado(grupo) {
    if (this.filtroGrupos.indexOf(grupo) > -1)
      return true;
    else
      return false;
  }

  cambioFiltroRadio(event) {
    this.radioFiltro = event.target.value;
    this.filtraGrupoVins();
  }

  fitraGrupo(grupo, event) {

    if (event.currentTarget.checked) {
      this.filtroGrupos.push(grupo);
    }
    else {
      let index = this.filtroGrupos.indexOf(grupo);
      if (index > -1)
        this.filtroGrupos.splice(index, 1);
    }

    this.filtraGrupoVins();
  }

  enviaTrasladosBPRO() {
    // Valida Notificaciones
    this.pricingService.validaNotificacionUtilidad(this.idCotizacion, 5)
      .subscribe((valida2: any) => {
        if (valida2[0].Success !== 1) {

          let traslado = { idCotizacion: this.idCotizacion };

          this.trasladosCatalogService.postGuardaTrasladoPosterior(traslado).subscribe((res: any) => {
            console.log(res);
            if (res[0].Success === 1) {
              this.obtieneTrasladosConfigurados();
              if (res[0].Mensaje)
                this.toasterService.success(res[0].Mensaje);
              else
                this.toasterService.success('Traslados enviados a BPRO.');
            } else {
              //this.toasterService.warning(res[0].Mensaje);
              this.toasterService.error('Error al agregar Traslado.');
            }
          }, (err) => {
            console.log(err);
            this.toasterService.error(`Se produjo un error al intenar enviar Traslados a BPRO`);
          });
        } else {
          this.toasterService.warning(valida2[0].msg, `Traslado no procesado, se afecto la utilidad. Favor de solicitar autorizacion:`)
        }
      });
  }

  filtraGrupoVins() {

    if (this.filtroGrupos.length === 0 && this.radioFiltro === 0)
      this.unidades = this.unidadesOriginal;
    else {
      this.unidades = this.unidadesOriginal.filter(item => this.filtroGrupos.indexOf(item.idGrupoUnidad) > -1);

      console.log(this.radioFiltro);

      switch (this.radioFiltro) {
        /*
        case 1: //TODOS
          this.unidades = this.unidades.filter(item => item.isSelected);
          break;
          */
        case 2://SELECCIONADOS
          this.unidades = this.unidades.filter(item => item.isSelected);
          break;
        case 3://NO SELECCIONADOS
          this.unidades = this.unidades.filter(item => !item.isSelected);
          break;
      }
    }
  }
}
