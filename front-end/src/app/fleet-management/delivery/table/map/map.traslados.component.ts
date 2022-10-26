import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PricingService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map-traslados',
  templateUrl: './map.traslados.component.html',
  styleUrls: ['./map.traslados.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapTrasladosComponent implements OnInit, AfterViewInit {

  row;

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


  save() {
    this.activeModal.close(false);
  }

}