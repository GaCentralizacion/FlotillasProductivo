import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import {GrupoUnidades} from '../../../../models';
import {TransferTableService} from '../transfer.table.service';
import { TrasladosCatalogService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgregarEditarAccesoriosComponent } from  './../../../../pricing-manager/additional/agregar-editar-accesorios/agregar-editar-accesorios.component';
import { TransferValidationComponent } from '../validation/transfer.validation.component';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { PricingManagerService } from './../../../../pricing-manager/pricing.manager.service';

@Component({
  selector: 'app-transfer-table',
  templateUrl: './transfer.table.component.html',
  styleUrls: ['./transfer.table.component.scss'],
  providers: [PricingManagerService]
})
export class TransferTableComponent implements OnInit {

  @ViewChild('transferTableComponent') childTable: TransferTableComponent;
  @ViewChild('mainTable') mainTable: DatatableComponent;
  @Input() grupoUnidades;
  @Input() id;
  @Input() onlyRead = false;
  @Output() changeParent = new EventEmitter<any>();
  @Output() lastEvent = new EventEmitter<any>();
  @Input() bProStatus: any;

  rowHeight = 0;
  childrens = 0;
  selected = [];
  childID = 0;
  lastSelected = [];
  constructor(private transferTableService: TransferTableService,
    private trasladosService: TrasladosCatalogService, private toasterService: ToastrService,
    private modalService: NgbModal,
    public pricingManagerService: PricingManagerService
  ) {
    this.rowHeight =  0;
  }

  ngOnInit() {
    //OCT99 SOLO LECTURA
    if(this.pricingManagerService.perfilSoloLectura){
      this.pricingManagerService.onlyRead = true; 
      this.onlyRead = true;
    }
  }

  openModalEditComponent(row) {
    /*const modalAccesorios = this.modalService.open(TransferValidationComponent, { size: 'lg' });
    modalAccesorios.componentInstance.row = row;
    modalAccesorios.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.toasterService.success('Traslado  Actualizado');
        this.ngOnInit();
        this.selected = [];
      }
    });*/
    this.transferTableService.scrollTO.emit(row);
  }

  resetValues() {
    this.selected = [];
    if (this.childTable) {
      this.childTable.resetValues();
    }
  }
  growUp(grow) {
    this.rowHeight += grow * 90;
    if (this.childTable) {
      this.childTable.growUp(grow);
    }
  }

  onSelect(event) {
    this.transferTableService.rootSelect.emit(true);
    if (this.selected[0]) {
    this.rowHeight =  65 + this.selected[0].children.length * 60;
  }
    if (this.lastSelected[0] &&
      (this.lastSelected[0].idCotizacionTraslado !== event.selected[0].idCotizacionTraslado)){
        this.changeParent.emit();
        this.lastEvent.emit(event.selected);
    } else {
      this.lastEvent.emit(event.selected);
    }
    if (!this.lastSelected[0]) {
      this.lastEvent.emit(event.selected);
    }
    this.lastSelected = event.selected;
    if (this.childTable) {
        this.childTable.cleanSelect();
    }
  }

  somethingChange(event) {
    this.grupoUnidades = Object.assign([], this.grupoUnidades);
  }

  lastChange(event) {
    this.lastEvent.emit(event);
  }


  cleanSelect() {
    this.selected = [];
    this.rowHeight =  0;
  }

  toggleExpandRow(row) {
    if (row.children.length > 0) {
      this.mainTable.rowDetail.toggleExpandRow(row);
    }
  }

  onDetailToggle(evento) {
    evento.value.isToggled = !evento.value.isToggled;
    if (evento.value.isToggled) {
      this.childID = evento.value.id;
      this.transferTableService.selectChildrens.emit(evento.value.children.length);
    } else {
      this.transferTableService.selectChildrens.emit(evento.value.children.length * -1);
    }
  }

  listenerSelected() {
    this.selected = [];
  }

  trashRow(row) {
    let objects = this.getChildrens(row);
    objects = objects.sort((a, b) => {
      if (a.idCotizacionTraslado > b.idCotizacionTraslado) {
        return -1;
      }
      if (a.idCotizacionTraslado < b.idCotizacionTraslado) {
        return 1;
      }
      return 0;
    });
    this.deleteChildren(objects);
    this.transferTableService.refreshTable.emit();
    this.toasterService.success('Traslado  Eliminado');
  }

  editRow(row) {
  }

  async deleteChildren(rows) {
    rows.forEach(async row => {
      await this.trasladosService.deleteTraslado(row.idCotizacionTraslado).toPromise();
    });
  }

  getChildrens(row) {
    const childrens = [];
    childrens.push(row);
    if ( row.children ) {
      row.children.forEach( child => {
        const childs = this.getChildrens(child);
        childs.forEach (c => {
          childrens.push(c);
          });
      });
    }
    return childrens;
  }

}
