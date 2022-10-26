import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PricingService } from 'src/app/services';

@Component({
  selector: 'app-info-modal-unidades',
  templateUrl: './info.modal.unidades.component.html',
  styleUrls: ['./info.modal.unidades.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InfoModalUnidadesComponent implements OnInit, AfterViewInit {


  message = 'Error no se pudo generar pedido.';

  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  cancel() {
    this.activeModal.close(false);
  }

  save() {
    this.activeModal.close(false);
  }

}