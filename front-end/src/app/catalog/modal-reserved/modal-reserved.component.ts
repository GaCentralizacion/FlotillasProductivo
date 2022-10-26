import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewUnitsService } from 'src/app/services/new-units.service';
import { UnidadInteres, GrupoUnidades, UnidadInteresFilter } from '../../models';

@Component({
  selector: 'app-modal-reserved',
  templateUrl: './modal-reserved.component.html',
  styleUrls: ['./modal-reserved.component.scss']
})
export class ModalReservedComponent implements OnInit {

  @Input() unidadesInteresGrupoUnidad: UnidadInteres[];
  unidadesInteresGrupoUnidadFiltered: UnidadInteres[];

  searchAnio: string;
  searchModelo: string;
  searchColorInterior: string;
  searchColorExterior: string;
  searchClase: string;
  searchCatalogo: string;

  constructor(private newUnitsService: NewUnitsService, public activeModal: NgbActiveModal, ) { }

  ngOnInit() {
    this.unidadesInteresGrupoUnidadFiltered = JSON.parse(JSON.stringify(this.unidadesInteresGrupoUnidad));
  }

  updateFilter() {
    if (!this.unidadesInteresGrupoUnidad) {
      return;
    }
    this.unidadesInteresGrupoUnidadFiltered = this.unidadesInteresGrupoUnidad.filter(ui => {
      return ui.anio.toLowerCase().includes((this.searchAnio || '').toLowerCase()) &&
        ui.modelo.toLowerCase().includes((this.searchModelo || '').toLowerCase()) &&
        ui.colorInterior.toLowerCase().includes((this.searchColorInterior || '').toLowerCase()) &&
        ui.colorExterior.toString().toLowerCase().includes((this.searchColorExterior || '').toLowerCase()) &&
        ui.colorExterior.toString().toLowerCase().includes((this.searchColorExterior || '').toLowerCase()) &&
        ui.clase.toString().toLowerCase().includes((this.searchClase || '').toLowerCase()) &&
        ui.catalogo.toString().toLowerCase().includes((this.searchCatalogo || '').toLowerCase());

    });
  }
}
