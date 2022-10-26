import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PricingService } from 'src/app/services';

@Component({
  selector: 'app-info-unidades',
  templateUrl: './info.unidades.component.html',
  styleUrls: ['./info.unidades.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InfoUnidadesComponent implements OnInit, AfterViewInit {


  idGrupoUnidad = '-1';
  idDetalleUnidad = '-1';
  idCotizacion;

  unidades = [] as any[];
  accesorios = [] as any[];

  cancelaciones = [] as any[];

  constructor(
    private activeModal: NgbActiveModal,
    private pricingService: PricingService,
  ) {
  }

  ngOnInit() {
    this.pricingService.getEstatusOrdCompraUnidades(this.idCotizacion, this.idGrupoUnidad, this.idDetalleUnidad).subscribe( (item: any) => {
        this.unidades = item;
    });
    this.pricingService.getEstatusOrdCompraRefacciones(this.idCotizacion, this.idGrupoUnidad, this.idDetalleUnidad).subscribe( (item: any) => {
      this.accesorios = item;
    });
    this.pricingService.statusInstruccionCancelacion(this.idCotizacion).subscribe( (res: any) => {
      this.cancelaciones = res;
    });
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