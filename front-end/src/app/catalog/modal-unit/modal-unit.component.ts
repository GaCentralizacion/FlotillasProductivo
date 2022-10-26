import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewUnitsService, PricingService } from '../../services';
import { UnidadInteres, GrupoUnidades, Unidad } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-unit',
  templateUrl: './modal-unit.component.html',
  styleUrls: ['./modal-unit.component.scss'],
  providers: [NewUnitsService]
})
export class ModalUnitComponent implements OnInit {
  @Input() unidadesInteresGrupoPreSel;
  @Input() unidadesInteresSeleccionadas: UnidadInteres[];
  unidadesInteresNoSeleccionadas = [] as UnidadInteres[];
  unidadesInteresSeleccionada = [] as UnidadInteres[];
  @Input() grupoUnidades: GrupoUnidades;
  @Input() idDireccionFlotillas: string;
  @Input() idEmpresa: number;
  @Input() idSucursal: number;
  @Input() maxUnits;
  @Input() updateidGrupoUnidad: number;

  isLoading = true;
  masterChecked = false;

  closeResult: string;
  rows: UnidadInteres[];
  sum: number;
  status = false;
  index: any;
  allRowsSelected: any;
  saveModal: boolean;

  constructor(public activeModal: NgbActiveModal, private newUnitsService: NewUnitsService,
    private pricingService: PricingService, private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.updateFilter();
  }

  updateFilter() {
    this.newUnitsService.getNewUnits(Number(this.idEmpresa), this.idSucursal)
      .subscribe((data: Unidad[]) => {
        this.isLoading = false;
        const temp = data.filter(car => {
          let cModelo = this.grupoUnidades.modelo;
          if (cModelo.startsWith('Aut')) {
            cModelo = 'AUTOMATICA';
          }
          return car.anio.toLowerCase().includes(this.grupoUnidades.anio) &&
            car.modelo.toLowerCase().includes(cModelo.toLowerCase()) &&
            car.idColorInterior.toLowerCase().includes(this.grupoUnidades.idColorInterior.toLowerCase()) &&
            car.idColorExterior.toLowerCase().includes(this.grupoUnidades.idColorExterior.toLowerCase()) &&
            car.clase.toLowerCase().includes(this.grupoUnidades.clase.replace('á', 'a').replace('ó', 'o').toLowerCase()) &&
            //car.descripcion.toLowerCase().includes(this.grupoUnidades.versionUnidad.toLowerCase()) &&
            //car.catalogo.toLowerCase().includes(this.grupoUnidades.catalogo.toLowerCase()) &&
            car.catalogo.toLowerCase() == this.grupoUnidades.catalogo.toLowerCase() &&
            car.idCotizacion == null && car.estatusUnidad !== 'PEDIDA';
        });
        this.rows = [];
        temp.map(item => {
          const unidadInteresItem = JSON.parse(JSON.stringify(item)) as UnidadInteres;
          unidadInteresItem.idCotizacion = this.grupoUnidades.idCotizacion;
          unidadInteresItem.idDireccionFlotillas = this.idDireccionFlotillas;
          unidadInteresItem.idGrupoUnidad = this.grupoUnidades.idGrupoUnidad;
          unidadInteresItem.idEmpresa = this.idEmpresa;
          unidadInteresItem.isSelected = this.unidadesInteresSeleccionadas.some(ui => ui.idInventario == unidadInteresItem.idInventario);
          this.rows.push(unidadInteresItem);
        });

        let total = 0;
        this.unidadesInteresGrupoPreSel.forEach(item => {
          this.rows.forEach(row => {
            if (item.idInventario === row.idInventario) {
                if(total < this.maxUnits){
                  row.isSelected = true;
                  total++;
                }
            }
          });
        });

        this.rows.sort(this.compare);
        this.masterChecked = this.isMaxCheck();
      });
  }

  compare(a, b) {
    if (a.isSelected && !b.isSelected) {
      return -1;
    }
    if (!a.isSelected && b.isSelected) {
      return 1;
    }
    return 0;
  }

  onCheckboxChangeFn3(event, row) {
    row.isSelected = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.pricingService.validaVinAsignados([{ vin: row.vin, idCotizacion: row.idCotizacion, idGrupoUnidad: this.updateidGrupoUnidad }])
        .subscribe(res => {
          this.saveModal = true;
        }, err => {
          this.toastrService.error(err.error.error);
          this.saveModal = false;
          row.isSelected = false;
        }
        );
    }
  }

  isMaxCheck() {
    let count = 0;
    this.rows.forEach(item => {
      if (item.isSelected) {
        count += 1;
      }
    });
    this.masterChecked = (count >= this.maxUnits);
    return count >= this.maxUnits;
  }

  onSelect({ selected }) {
    const selectedUnits = selected as UnidadInteres[];
    if (!selectedUnits) {
      return;
    }
    const lastItemSelected = selectedUnits[selectedUnits.length - 1];
    lastItemSelected.isSelected = true;
    let aux = [];
    if (this.unidadesInteresSeleccionadas.length > 0) {
      aux = [...this.unidadesInteresSeleccionadas
        .slice(0, this.unidadesInteresSeleccionadas.length - 1)];
    }
    const itemsExists = aux.filter(ui => ui.idInventario == lastItemSelected.idInventario).length > 0;
    if (itemsExists) {
      this.unidadesInteresSeleccionadas = this.unidadesInteresSeleccionadas.filter(ui => ui.idInventario != lastItemSelected.idInventario);
    } else {
      aux.push(lastItemSelected);
      this.unidadesInteresSeleccionadas = aux;
    }
  }

  cancelar() {
    this.activeModal.dismiss();
  }

  reservar() {
    this.rows.forEach(item => {
      if (item.isSelected) {
        this.unidadesInteresSeleccionada.push(item);
      } else {
        this.unidadesInteresNoSeleccionadas.push(item);
      }
    });
    this.activeModal.close({ sel: this.unidadesInteresSeleccionada, des: this.unidadesInteresNoSeleccionadas });
  }

  selectFn() {
    if (this.masterChecked)
      for (var i = 0; i < this.rows.length; i++)
        this.rows[i].isSelected = !this.masterChecked;
    else {
      let checadas = this.rows.filter(element =>element.isSelected === true);
      let total = checadas.length;
      
      for (var i = 0; total < this.maxUnits; i++) {
            if(!this.rows[i].isSelected){
              this.rows[i].isSelected = true;
              total++;
            }
      }
    }

  }

}
