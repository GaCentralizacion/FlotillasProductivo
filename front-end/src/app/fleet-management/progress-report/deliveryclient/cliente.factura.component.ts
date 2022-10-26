import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PricingService } from 'src/app/services';

@Component({
  selector: 'app-cliente-factura.',
  templateUrl: './cliente.factura.component.html',
  styleUrls: ['./cliente.factura.component.scss'],
})
export class ClienteFacturaComponent implements OnInit, AfterViewInit {

  constructor(
    private activeModal: NgbActiveModal,
    private toasterService: ToastrService,
    private pricingService: PricingService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  cancel() {
  }

  save() {
  }

}
