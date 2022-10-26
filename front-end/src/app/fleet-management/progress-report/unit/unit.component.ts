import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalReservedComponent } from 'src/app/catalog/modal-reserved/modal-reserved.component';
import { GrupoUnidades, UnidadBpro, Version, Color, Cotizacion, UnidadInteres, Unidad } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { PricingService, NewUnitsService } from 'src/app/services';
import { NgSelectComponent } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';
import { async } from '@angular/core/testing';
import { ModalUnitFleetComponent } from '../modal-unit/modal-unit.component';
@Component({
  selector: 'app-units',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
  providers: [NewUnitsService]
})
export class UnitFleetComponent implements OnInit {

  currentSelected = 0;
  costoLista = 0;
  unidadesInteresGrupoDel = [] as any[];
  unidadesInteresGrupoSel = [] as any[];
  forma: FormGroup;
  exteriorColors: Color[] = [];
  isLoadingAdd = false;
  interiorColors: Color[] = [];
  versiones: Version[] = [];
  catalogos: UnidadBpro[] = [];
  years: string[] = [];
  selectedCatalogo: string;
  selectedVersion: string;
  selectedYear: string;
  selectedInteriorColor: string;
  selectedExteriorColor: string;
  selectedInteriorColorNombre: string;
  selectedExteriorColorNombre: string;
  selectedClase: string;
  selectedModelo: string;
  selectedCantidad: number;
  selectedPrecio: any;
  rows: Unidad[] = [];
  temp: Unidad[] = [];
  cotizacion: Cotizacion;
  units: number;
  step: number;
  activo = true;

  idCotizacion: string;
  unidades: number;
  nombreEliminar: string;
  idCotizacionEliminar: string;
  idGrupoUnidad: number;

  idFlotilla: string;
  idLicitacion: string;

  unidadesInteresCotizacion: UnidadInteres[];
  unidadesInteresGrupo: UnidadInteres[] = [];

  editing = false;

  isLoading = false;
  selectedCatalogoData;
  verCosto;

  @ViewChild('ngSelectCatalogo') ngSelectCatalogo: NgSelectComponent;
  @ViewChild('ngSelectVersion') ngSelectVersion: NgSelectComponent;
  @ViewChild('ngSelectAnio') ngSelectAnio: NgSelectComponent;
  @ViewChild('ngSelectColorInterior') ngSelectColorInterior: NgSelectComponent;
  @ViewChild('ngSelectColorExterior') ngSelectColorExterior: NgSelectComponent;
  @ViewChild('ngSelectColorModelo') ngSelectColorModelo: NgSelectComponent;
  @ViewChild('ngSelectColorClase') ngSelectColorClase: NgSelectComponent;

  gruposUnidades: GrupoUnidades[];

  modelos: { id: number, nombre: string }[] = [
    {
      id: 1,
      nombre: 'Manual'
    },
    {
      id: 2,
      nombre: 'Automática'
    },
    {
      id: 3,
      nombre: 'CVT'
    }
  ];

  clases: { id: number, nombre: string }[] = [
    {
      id: 1,
      nombre: 'Camioneta'
    },
    {
      id: 2,
      nombre: 'Automóvil'
    },
    {
      id: 3,
      nombre: 'COMERCIAL',
    },
    {
      id: 4,
      nombre: 'PASAJERO'
    }
  ];

  constructor(private newUnitsService: NewUnitsService,
    private router: Router,
    private pricingService: PricingService,
    private activeRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.forma = new FormGroup({
      catalogo: new FormControl(null, [Validators.required]),
      version: new FormControl(null, [Validators.required]),
      anio: new FormControl(null, [Validators.required]),
      interiorColor: new FormControl(null, [Validators.required]),
      exteriorColor: new FormControl(null, [Validators.required]),
      clase: new FormControl(null, [Validators.required]),
      modelo: new FormControl(null, [Validators.required]),
      cantidad: new FormControl(null, [Validators.required]),
      precio: new FormControl(null, [Validators.required])
    });
    this.temp = [...this.rows];

  }

  private getParams() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idCotizacion = params.idCotizacion as string;
      this.idLicitacion = params.idLicitacion as string;
      this.step = Number(params.step);
    });
  }

  ngOnInit() {
    this.getParams();
    const token = JSON.parse(localStorage.getItem('app_token'));
    const cotizacionModule = token.data.permissions.modules.find(m => m.name == 'Cotizaciones');
    if (cotizacionModule) {
      this.verCosto = cotizacionModule.objects.some(o => o.name == 'verCosto');
    }
    this.isLoading = true;
    this.newUnitsService.getCotizacionId(this.idCotizacion).subscribe((data: Cotizacion) => {
      this.isLoading = false;
      this.cotizacion = data;
      this.getCatalogo();
    });

    this.newUnitsService.getUnidadesInteres(this.idCotizacion).subscribe((data: UnidadInteres[]) => {
      this.unidadesInteresCotizacion = data;
      this.newUnitsService.getUnidadesInteres(this.idCotizacion).subscribe((data: UnidadInteres[]) => {
        this.unidadesInteresCotizacion = data;
      }, (error) => {
        this.toastrService.error('Error al obtener unidades de interés: ' + JSON.stringify(error), 'Error');
      });
    }, (error) => {
      this.toastrService.error('Error al obtener la cotización: ' + JSON.stringify(error), 'Error');
    });
  }

  openInfoModal(item: GrupoUnidades) {
    const modalRef = this.modalService.open(ModalReservedComponent, { size: 'lg' });
    modalRef.componentInstance.unidadesInteresGrupoUnidad = item.unidadesInteres;
  }

  openModalUnidadesInteres() {
    this.unidadesInteresGrupo = [] as any[];
    const modalRef = this.modalService.open(ModalUnitFleetComponent, { size: 'lg' });
    modalRef.componentInstance.unidadesInteresGrupoPreSel = this.unidadesInteresGrupoSel;

    const grupoUnidades: GrupoUnidades = {
      idCotizacion: this.idCotizacion,
      idGrupoUnidad: this.idGrupoUnidad,
      catalogo: this.selectedCatalogo,
      anio: this.selectedYear,
      clase: this.selectedClase,
      modelo: this.selectedModelo,
      versionUnidad: this.selectedVersion,
      idColorInterior: this.selectedInteriorColor,
      colorInterior: this.selectedInteriorColorNombre,
      idColorExterior: this.selectedExteriorColor,
      colorExterior: this.selectedExteriorColorNombre,
      cantidad: this.selectedCantidad,
      precio: this.selectedPrecio,
      costo: Number((this.costoLista) ? this.costoLista : 0),
      idCondicion: null,
      idIva: null,
      tasaIva: null,
      idFinanciera: null,
      nombreFinanciera: null,
      colorInteriorFacturacion: null,
      colorExteriorFacturacion: null,
      idCfdi: null,
      idCfdiAdicionales: null,
      tipoOrden: null,
      leyendaFactura: null,
      fechaHoraPromesaEntrega: null,
      costoTotal: null,
      precioTotal: null,
      utilidadBruta: null,
      idUsuarioModificacion: null,
      fechaModificacion: null,
      detalleUnidades: [],
      unidadesInteres: [],
      paquetesAccesorios: [],
      accesoriosSinPaquete: [],
      paquetesTramites: [],
      tramitesSinPaquete: [],
      paquetesServicioUnidad: [],
      serviciosUnidadSinPaquete: [],
      isToggled: false,
      traslados: [],
    } as any;
    if (this.unidadesInteresGrupo == undefined || this.unidadesInteresGrupo.length == 0) {
      this.unidadesInteresGrupo = this.unidadesInteresCotizacion.filter(uic => uic.idGrupoUnidad == this.idGrupoUnidad);
    }
    modalRef.componentInstance.maxUnits = this.selectedCantidad;
    modalRef.componentInstance.unidadesInteresSeleccionadas = this.unidadesInteresGrupo;
    modalRef.componentInstance.grupoUnidades = grupoUnidades;
    modalRef.componentInstance.idDireccionFlotillas = this.cotizacion.idDireccionFlotillas;
    modalRef.componentInstance.idEmpresa = this.cotizacion.idEmpresa;
    modalRef.componentInstance.idSucursal = this.cotizacion.idSucursal;
    modalRef.result.then((unidadesSeleccionadasModal: any) => {
      this.unidadesInteresGrupoDel = unidadesSeleccionadasModal.des;
      this.unidadesInteresGrupoSel = unidadesSeleccionadasModal.sel;
    });
  }

  autoSearch() {
    this.newUnitsService.getNewUnits(Number(this.cotizacion.idEmpresa), this.cotizacion.idSucursal)
      .subscribe(data => {
        this.rows = JSON.parse(JSON.stringify(data));
        const temp = this.rows.filter((car: Unidad) => {
          let cModelo = this.selectedModelo;
          if (cModelo.startsWith('Aut')) {
            cModelo = 'AUTOMATICA';
          }
          return car.anio.toLowerCase().includes(this.selectedYear) &&
            car.descripcion.toLowerCase().includes(this.selectedVersion.toLowerCase()) &&
            car.idColorInterior.toLowerCase().includes(this.selectedInteriorColor.toLowerCase()) &&
            car.idColorExterior.toLowerCase().includes(this.selectedExteriorColor.toLowerCase()) &&
            car.catalogo.toLowerCase().includes(this.selectedCatalogo.toLowerCase()) &&
            car.modelo.toLowerCase().includes(cModelo.toLowerCase()) &&
            car.clase.toLowerCase().includes(this.selectedClase.replace('á', 'a').replace('ó', 'o').toLowerCase()) &&
            car.idCotizacion == null && car.estatusUnidad !== 'PEDIDA';
        });
        this.rows = temp;
        this.units = temp.length;
      });
  }

  getCantidad(selectedCantidad) {
    if (selectedCantidad) {
      return selectedCantidad;
    } else {
      return 0;
    }
  }

  getCatalogo() {
    this.newUnitsService.getCatalogo(this.cotizacion.idEmpresa)
      .subscribe((data: UnidadBpro[]) => {
        this.catalogos = data;

      });
  }

  catalogoOnChange(catalogo: UnidadBpro): Promise<boolean> {
    this.unidadesInteresGrupoDel = [];
    this.unidadesInteresGrupoSel = [];
    this.ngSelectColorModelo.handleClearClick();
    this.ngSelectColorClase.handleClearClick();
    this.ngSelectVersion.handleClearClick();
    this.ngSelectColorModelo.setDisabledState(true);
    this.ngSelectColorClase.setDisabledState(true);
    this.ngSelectVersion.setDisabledState(true);
    this.selectedPrecio = 0;
    this.costoLista = 0;
    this.units = 0;
    this.clases = [...[]];
    this.modelos = [...[]];
    return new Promise<boolean>((resolve, reject) => {
      if (catalogo == undefined) {
        resolve(false);
        return;
      }
      this.ngSelectVersion.clearModel();
      this.ngSelectAnio.clearModel();
      this.ngSelectColorInterior.clearModel();
      this.ngSelectColorExterior.clearModel();
      this.selectedCatalogo = catalogo.idUnidadBpro;
      this.newUnitsService.getVersiones(this.cotizacion.idEmpresa, this.selectedCatalogo)
        .subscribe((data: any[]) => {
          this.selectedCatalogoData = data;
          const yearsNew = [] as any[];
          data.forEach( dat => {
            yearsNew.push(dat.modelo);
          });
          this.years = [...yearsNew];
          resolve(true);
        });
    });
  }

  versionOnChange(version: Version) {
    this.unidadesInteresGrupoDel = [];
    this.unidadesInteresGrupoSel = [];
  }

  yearOnChange(anio: string) {
    this.unidadesInteresGrupoDel = [];
    this.unidadesInteresGrupoSel = [];
    this.selectedClase = null;
    this.selectedVersion = null;
    this.selectedModelo = null;
    this.ngSelectColorModelo.setDisabledState(false);
    this.ngSelectColorClase.setDisabledState(false);
    this.ngSelectVersion.setDisabledState(false);
    return new Promise<boolean>((resolve, reject) => {

      if (anio == undefined) {
        resolve(false);
        return;
      }

      this.newUnitsService.getCostoCatalago(this.cotizacion.idSucursal + '', this.selectedCatalogo, anio).subscribe( res => {
        this.costoLista = res[0].Costo;
      });
      this.ngSelectColorInterior.clearModel();
      this.ngSelectColorExterior.clearModel();
      this.selectedYear = anio;
      this.newUnitsService.getModelos(this.cotizacion.idEmpresa, this.selectedCatalogo, this.selectedYear)
      .subscribe((data: any[]) => {
        console.log(data[0]);

        const newDescs = [] as any[];
        const newDesc = {id: 1, nombre: data[0].descripcion};
        this.selectedVersion = data[0].descripcion;
        newDescs.push(newDesc);
        this.versiones = [...newDescs];
        setTimeout( () => {
          this.ngSelectVersion.select(this.ngSelectVersion.itemsList.items[0]);
        }, 500);

        const newClases = [] as any[];
        const newClase = {id: 1, nombre: data[0].clase};
        this.selectedClase = data[0].clase;
        newClases.push(newClase);
        this.clases = [...newClases];
        setTimeout( () => {
          this.ngSelectColorClase.select(this.ngSelectColorClase.itemsList.items[0]);
        }, 500);

        const newModelos = [] as any[];
        const newModelo = {id: 1, nombre: data[0].transmision};
        this.selectedModelo = data[0].transmision;
        newModelos.push(newModelo);
        this.modelos = [...newModelos];
        setTimeout( () => {
          this.ngSelectColorModelo.select(this.ngSelectColorModelo.itemsList.items[0]);
        }, 500);
        this.ngSelectVersion.setDisabledState(true);
        this.ngSelectColorModelo.setDisabledState(true);
        this.ngSelectColorClase.setDisabledState(true);  
        resolve(true);
      });
      forkJoin(
        this.newUnitsService.getInterioresColors(this.cotizacion.idEmpresa, this.selectedCatalogo, Number(this.selectedYear)),
        this.newUnitsService.getExteriorColors(this.cotizacion.idEmpresa, this.selectedCatalogo, Number(this.selectedYear))
      ).subscribe((dataArray: any[]) => {
        this.ngSelectColorExterior.clearModel();
        this.interiorColors = dataArray[0].map(data => { data.fullLabel = data.nombre + ' - ' +  data.idColor; return data; });
        this.exteriorColors = dataArray[1].map(data => { data.fullLabel = data.nombre + ' - ' +  data.idColor; return data; });

        resolve(true);
      });
    });
  }

  interiorColorOnChange(color: Color) {
    this.unidadesInteresGrupoDel = [];
    this.unidadesInteresGrupoSel = [];
    if (color == undefined) {
      return;
    }
    this.selectedInteriorColor = color.idColor;
    this.selectedInteriorColorNombre = color.nombre;
    if (this.selectedClase != undefined && this.selectedModelo != undefined) {
      this.autoSearch();
    }
  }

  exteriorColorOnChange(color: Color) {
    this.unidadesInteresGrupoDel = [];
    this.unidadesInteresGrupoSel = [];
    if (color == undefined) {
      return;
    }
    this.selectedExteriorColor = color.idColor;
    this.selectedExteriorColorNombre = color.nombre;
    if (this.selectedClase != undefined && this.selectedModelo != undefined) {
      this.autoSearch();
    }
  }

  claseOnChange(clase: { id: number, nombre: string }) {
    this.unidadesInteresGrupoDel = [];
    this.unidadesInteresGrupoSel = [];
    this.selectedClase = clase.nombre;
  }

  modeloOnChange(modelo: { id: number, nombre: string }) {
    this.unidadesInteresGrupoDel = [];
    this.unidadesInteresGrupoSel = [];
    this.selectedModelo = (modelo.nombre != undefined) ? modelo.nombre:null;
    this.autoSearch();
  }

  cancel() {
    this.activeModal.close(false);
    this.editing = false;
    this.ngSelectCatalogo.setDisabledState(false);
    this.ngSelectCatalogo.clearModel();
    this.ngSelectVersion.clearModel();
    this.ngSelectAnio.clearModel();
    this.ngSelectColorInterior.clearModel();
    this.ngSelectColorExterior.clearModel();
    this.ngSelectColorModelo.clearModel();
    this.ngSelectColorClase.clearModel();
    this.idGrupoUnidad = null;
    this.selectedPrecio = null;
    this.selectedCantidad = null;
    this.selectedClase = null;
    this.selectedModelo = null;
    this.selectedInteriorColor = null;
    this.selectedInteriorColorNombre = null;
    this.selectedExteriorColor = null;
    this.selectedExteriorColorNombre = null;
    this.selectedVersion = null;
    this.selectedCantidad = 1;
    this.units = 0;
  }

  saveItem(value) {
    this.currentSelected = 0;
    this.editing = false;
    this.ngSelectCatalogo.setDisabledState(false);
    if (value) {
      this.idGrupoUnidad = null;
    }
    this.isLoadingAdd = true;
    if (this.cotizacion.unidades) {
      const sumaGruposUnidades = this.cotizacion.gruposUnidades
        .reduce((a, b) => a + (b.cantidad || 0), 0) + this.selectedCantidad;
      if (sumaGruposUnidades > this.cotizacion.unidades) {
        this.toastrService
          .warning(`La cantidad supera lo solicitado en la cotización: ${this.cotizacion.unidades} unidades`, 'Grupo de Unidades');
          this.isLoadingAdd = false;
        return;
      }
    }
    const grupoUnidades = new GrupoUnidades();
    grupoUnidades.idCotizacion = this.idCotizacion;
    grupoUnidades.idGrupoUnidad = this.idGrupoUnidad ? this.idGrupoUnidad : null;
    grupoUnidades.catalogo = this.selectedCatalogo;
    grupoUnidades.anio = this.selectedYear;
    grupoUnidades.clase = this.selectedClase;
    grupoUnidades.modelo = this.selectedModelo;
    grupoUnidades.versionUnidad = this.selectedVersion;
    grupoUnidades.idColorInterior = this.selectedInteriorColor;
    grupoUnidades.colorInterior = this.selectedInteriorColorNombre;
    grupoUnidades.idColorExterior = this.selectedExteriorColor;
    grupoUnidades.colorExterior = this.selectedExteriorColorNombre;
    grupoUnidades.cantidad = this.selectedCantidad;
    grupoUnidades.precio = Number(this.selectedPrecio);
    grupoUnidades.costo = Number((this.costoLista) ? this.costoLista : 0);
    grupoUnidades.idCondicion = this.cotizacion.idCondicion;
    grupoUnidades.idFinanciera = this.cotizacion.idFinanciera;
    grupoUnidades.nombreFinanciera = this.cotizacion.nombreFinanciera;
    grupoUnidades.idCfdi = this.cotizacion.idCfdi;
    grupoUnidades.idCfdiAdicionales = this.cotizacion.idCfdiAdicionales;
    grupoUnidades.idIva = this.cotizacion.idIva;
    grupoUnidades.tasaIva = this.cotizacion.tasaIva;
    grupoUnidades.colorExteriorFacturacion = grupoUnidades.colorExterior;
    grupoUnidades.colorInteriorFacturacion = grupoUnidades.colorInterior;
    this.saveGrupoUnidades(grupoUnidades, value);
    }

  saveGrupoUnidades(grupoUnidades: GrupoUnidades, value: boolean) {

    const vins = [] as any[];
    this.unidadesInteresGrupoSel.forEach(vin => {
      vins.push({vin: vin.vin});
    });

    this.pricingService.validaVinAsignados(vins).subscribe( res => {

    if (grupoUnidades != undefined) {


      this.pricingService.crearGrupoUnidad(this.cotizacion.idCotizacion
        , this.cotizacion.gruposUnidades.length + 1, this.unidadesInteresGrupoSel).subscribe(() => {

            this.pricingService.saveGrupoUnidadesPost(grupoUnidades).subscribe((grupoUnidadesSaved: GrupoUnidades) => {
              this.isLoadingAdd = false;
              this.unidadesInteresGrupo.map(uig => {
                uig.idGrupoUnidad = grupoUnidadesSaved.idGrupoUnidad;
              });
              this.unidadesInteresGrupoDel = [];
              this.unidadesInteresGrupoSel = [];
              this.isLoadingAdd = false;
              this.toastrService.success('Se guardó el grupo de unidades de forma correcta', 'Grupo de Unidades');
              this.selectedVersion = null;
              this.units = null;
              this.forma.reset();
              this.unidadesInteresGrupo = [];
              this.activeModal.close(true);
            });

        }, (error) => {
          this.activeModal.close(false);
          this.toastrService.error('Error al guardar las unidades reservadas ' + error.error.error, 'Error');
        });

    } else {
      this.isLoadingAdd = false;
      this.toastrService.warning('Debe asignar las unidades a los grupos correspondientes', 'INFORMACIÓN IMCOMPLETA');
    }

    }, err => {
      this.isLoadingAdd = false;
      this.activeModal.close(false);
      this.toastrService.error(err.error.error);
    });
  }

  openModalContinue(refreshTemplate) {
    const modal = this.modalService.open(refreshTemplate, { ariaLabelledBy: 'modal-basic-title', centered: true });
    modal.result.then((value: any) => {
      if (value === true) {
        this.editing = false;
        this.sendGroupdetails(refreshTemplate);
      }
    });
  }


  sendGroupdetails(refreshTemplate) {
    if (this.editing) {
      this.openModalContinue(refreshTemplate);
      return;
    }
    this.activo = false;
    const grupoDetalleUnidad = [];
    if (this.cotizacion.gruposUnidades.length > 0) {
      this.cotizacion.gruposUnidades.map(ele => {
        const item = {
          idCotizacion: ele.idCotizacion,
          idGrupoUnidad: ele.idGrupoUnidad,
          cantidad: ele.cantidad
        };
        grupoDetalleUnidad.push(item);
      });
      this.pricingService.saveDetalleUnidades(grupoDetalleUnidad,'GESTION').subscribe((res) => {
        this.activo = true;
        this.activeModal.close(true);
        this.toastrService.success(`Se almacenaron los registros de forma satisfactoria`,
          `RESPUESTA EXISTOSO`);
        if (this.cotizacion != undefined) {
          if (this.step < 2) {
//            this.pricingService.updateStep(this.idCotizacion, 2).subscribe(async (update) => { });
          }
/*          this.router.navigate(['main/cotizaciones/manager/adicionales'], {
            queryParams: {
              idFlotilla: this.idFlotilla,
              idLicitacion: this.idLicitacion,
              idCotizacion: this.idCotizacion,
              step: 2
            }
          });*/
        }
      }, (err) => {
        this.toastrService.error(`Se produjo un error al intentar almacenar el detalle de los grupos en la cotización`, `ERROR`);
      });
    }
  }

  openModalDelete(event, deleteTemplate: any, grupoUnidad: GrupoUnidades) {
    event.preventDefault();
    this.nombreEliminar = grupoUnidad.versionUnidad;
    this.idCotizacionEliminar = grupoUnidad.idCotizacion;
    this.idGrupoUnidad = grupoUnidad.idGrupoUnidad;
    this.modalService.open(deleteTemplate, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }


  deleteGrupo() {
    this.pricingService.deleteGruposUnidades(this.idCotizacionEliminar, this.idGrupoUnidad).subscribe(
      (res) => {
        this.ngOnInit();
        this.toastrService.success(`Se elimino el grupo de unidades`, `GRUPO ELIMINADO`);
      }, (err) => {
        this.toastrService.warning('Se produjo un error al eliminar el grupo', 'ERROR 500');
      });
    this.modalService.dismissAll('Archivo Eliminado');
  }

  getIdColor(idColorExterior: string) {
    const idColor = this.exteriorColors.find(color => color.idColor === idColorExterior);
    return (idColor) ? idColor.idColor : null;
  }


  getInventario() {
    return (this.unidadesInteresGrupoSel.length === 0) ? this.currentSelected : this.unidadesInteresGrupoSel.length;
  }


  focusInput() {
    if (this.selectedCatalogoData && this.selectedYear) {
      console.log(this.selectedCatalogoData);
      this.selectedPrecio = this.selectedCatalogoData.filter( catD => {
        return catD.modelo === this.selectedYear;
      })[0].precioLista;
    }
  }

}