import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import {GrupoUnidades} from '../../../models';
import { TrasladosCatalogService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { TransferTableFlotService } from '../transfer.table.service';
import { MapTrasladosComponent } from './map/map.traslados.component';
import { PricingManagerService } from '../../../pricing-manager/pricing.manager.service';

@Component({
  selector: 'app-transfer-table-movs',
  templateUrl: './transfer.table.component.html',
  styleUrls: ['./transfer.table.component.scss'],
  providers: [PricingManagerService]
})
export class TransferTableFlotComponent implements OnInit {

  @ViewChild('transferTableComponent') childTable: TransferTableFlotComponent;
  @ViewChild('mainTable') mainTable: DatatableComponent;
  @Input() grupoUnidades;
  @Input() id;
  @Output() changeParent = new EventEmitter<any>();
  @Output() lastEvent = new EventEmitter<any>();

  rowHeight = 0;
  childrens = 0;
  selected = [];
  childID = 0;
  lastSelected = [];
  constructor(private transferTableService: TransferTableFlotService,
    private trasladosService: TrasladosCatalogService, private toasterService: ToastrService,
    private modalService: NgbModal,public pricingManagerService: PricingManagerService
  ) {
    this.rowHeight =  0;
  }

  ngOnInit() {
    //OCT99 SOLO LECTURA
    if(this.pricingManagerService.perfilSoloLectura)
    this.pricingManagerService.onlyRead = true; 
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
      await this.trasladosService.deleteTrasladoMov(row.idCotizacionTraslado).toPromise();
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

  openModal(row) {
    const modalMap = this.modalService.open(MapTrasladosComponent, { size: 'lg' });
    modalMap.componentInstance.row = row;
    modalMap.result.then((isSaved: boolean) => {
      if (isSaved) {
      }
    });
  }


}
