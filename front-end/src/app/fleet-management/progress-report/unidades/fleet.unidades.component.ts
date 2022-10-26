import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PricingService } from 'src/app/services';
import { Cotizacion, UnidadesGestion, ApartarVines } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fleet-unidades',
  templateUrl: './fleet.unidades.component.html',
  styleUrls: ['./fleet.unidades.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FleetUnidadesComponent implements OnInit, AfterViewInit {

  public cotizacion: Cotizacion;
  public unidad;
  public unidadesNuevas;
  public unidadesNuevasOriginal;

  public selectedRows = [] as any[];
  public originalPedidas = [] as any[];

  public apartarUnidades = [] as any[];
  public desapartarUnidades = [] as any[];
  activo = true;

  filterExt = '';
  filterInt = '';
  filterMarca = '';
  filterModelo = '';
  filterClase = '';
  filterDesc = '';
  filterAno = '';
  filterCompra = '';
  filterVin = '';
  filterAgencia = '';
  filterSegmento = '';
  filterAntiguedad = '';
  filterCatalogo = '';
  idCotizacion: string;
  selected = [];

  constructor(
    private activeModal: NgbActiveModal,
    private toasterService: ToastrService,
    private catalogService: PricingService,
    private activeRoute: ActivatedRoute,
    private pricingService: PricingService
  ) {
    this.activeRoute.queryParams.subscribe(params => {
      this.idCotizacion = params.idCotizacion as string;
    });
  }

  ngOnInit() {
    this.catalogService.getUnidadesNuevas(this.cotizacion.idEmpresa, this.cotizacion.idSucursal).subscribe((items: any) => {
      let itemsFiltrados: any = [{}];
      itemsFiltrados = items;
      itemsFiltrados = itemsFiltrados.filter(f => f.estatusUnidad !== 'PEDIDA');
      itemsFiltrados = itemsFiltrados.filter(f => f.idCotizacion === this.idCotizacion);
      itemsFiltrados = itemsFiltrados.filter(f => f.anio === this.unidad.anio);
      itemsFiltrados = itemsFiltrados.filter(f => f.catalogo === this.unidad.catalogo);
      const nuevoItm = itemsFiltrados;
      this.unidadesNuevasOriginal = nuevoItm;
      this.unidadesNuevas = itemsFiltrados.sort((a, b) => {
        if (a.idCotizacion === null) {
          return 1;
        } else {
          return -1;
        }
        return 0;
      });
    });
  }

  ngAfterViewInit(): void {
  }

  cancel() {
    this.activeModal.close(false);
  }

  save() {
    this.selectedRows = [];
    this.unidadesNuevas.forEach( unidades => {
      if (unidades.isSelected === true) {
        this.selectedRows.push(unidades);
      }
    });
        this.activo = false;
        const unidadesGestion = [] as ApartarVines[];
        if (this.selectedRows.length > 0) {
          this.selectedRows.forEach(item => {
            const unidadGestion = new ApartarVines();
            unidadGestion.idCotizacion = this.cotizacion.idCotizacion;
            unidadGestion.vin = item.vin;
            unidadGestion.idGrupoUnidad = this.unidad.idGrupoUnidad;
            unidadGestion.idDetalleUnidad = this.unidad.detalleUnidades.filter( rtn => {
              return rtn.vin == null;
            })[0].idDetalleUnidad;
            unidadesGestion.push(unidadGestion);
            this.unidad.detalleUnidades.forEach (uni => {
              if (uni.idDetalleUnidad === unidadGestion.idDetalleUnidad) {
                uni.vin = unidadGestion.vin;
              }
            });
          });
          this.pricingService.asignarVinDetalleUnidad(unidadesGestion).subscribe(
            res => {
              this.activo = true;
              this.activeModal.close(true);
              this.toasterService.success('Vins apartados correctamente');
                // Cambio bonificaciones - EHJ-COAL
                this.pricingService.guardaBonificacion(this.idCotizacion)
                .subscribe((saveBon: any) => {
                  if (saveBon[0].Success !== 1) {
                    this.toasterService.success('Bonificación aplicada');
                }
              });
            }, err => {
              this.activo = true;
              this.activeModal.close(false);
              this.toasterService.error(err.error.error);
            });
        } else {
          this.activo = true;
        }
  }

  filterHeader(event) {
    this.unidadesNuevas = Object.assign(this.unidadesNuevasOriginal, []);
    if (this.filterExt.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.colorExterior.toUpperCase().startsWith(this.filterExt.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterInt.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.colorInterior.toUpperCase().startsWith(this.filterInt.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterMarca.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.marca.toUpperCase().startsWith(this.filterMarca.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterModelo.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.modelo.toUpperCase().startsWith(this.filterModelo.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterClase.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.clase.toUpperCase().startsWith(this.filterClase.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterDesc.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.descripcion.toUpperCase().startsWith(this.filterDesc.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterAno.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.anio.toUpperCase().startsWith(this.filterAno.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterCompra.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.clasificacionTipoCompra.toUpperCase().startsWith(this.filterCompra.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterVin.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.vin.toUpperCase().startsWith(this.filterVin.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterAgencia.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.agencia.toUpperCase().startsWith(this.filterAgencia.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterSegmento.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.segmento.toUpperCase().startsWith(this.filterSegmento.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterAntiguedad.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.antiguedad.toString().toUpperCase().startsWith(this.filterAntiguedad.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterCatalogo.length > 0) {
      this.unidadesNuevas = this.unidadesNuevas.filter(item => {
        if (item.catalogo == null) { return false; }
        if (item.catalogo.toUpperCase().startsWith(this.filterCatalogo.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
  }


  onCheckboxChange(event, row) {
    row.isSelected = event.currentTarget.checked;
  }


  isMissingVin() {
    let missing = false;
    this.unidad.detalleUnidades.forEach( du => {
      if (du.vin == null || du.vin.length < 1) {
        missing = true;
      }
    });
    return missing;
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  getAvailable() {
    let conutMissing = 0;
    let countSelected = 0;
    this.unidad.detalleUnidades.forEach( du => {
      if (du.vin == null || du.vin.length < 1) {
        conutMissing++;
      }
    });
    this.unidadesNuevas.forEach( unidades => {
      if (unidades.isSelected === true) {
        countSelected++;
      }
    });
    return (countSelected === conutMissing);
  }
  selectFn() {
    let total = 0;
    for (var i = 0; i < this.unidadesNuevas.length; i++)
      if(!this.unidadesNuevas[i].isSelected){
        this.unidadesNuevas[i].isSelected = true;
        total++;
      }
  }

}
