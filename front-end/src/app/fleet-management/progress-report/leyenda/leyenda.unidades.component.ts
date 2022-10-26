import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PricingService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leyenda-unidades',
  templateUrl: './leyenda.unidades.component.html',
  styleUrls: ['./leyenda.unidades.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LeyendaUnidadesComponent implements OnInit, AfterViewInit {

  leyenda = '';
  idCotizacion;
  idDetalleUnidad;
  idUnidad;

  constructor(
    private activeModal: NgbActiveModal,
    private toasterService: ToastrService,
    private catalogService: PricingService,
    private activeRoute: ActivatedRoute,
    private pricingService: PricingService
  ) {
  }

  ngOnInit() {
    this.pricingService.getLeyendaFactura(this.idCotizacion, this.idUnidad, this.idDetalleUnidad).subscribe((res: any) => {
      this.leyenda = res.message;
    });
  }

  ngAfterViewInit(): void {
  }

  cancel() {
    this.activeModal.close(false);
  }

  save() {
    const leyenda = {
       idCotizacion: this.idCotizacion,
       idGrupoUnidad: this.idUnidad,
       idDetalleUnidad: this.idDetalleUnidad,
       leyendaFactura: this.leyenda
    };
    this.pricingService.saveLeyendaDetalleUnidad(leyenda).subscribe(res => {
      this.toasterService.success('Registro actualizado');
      this.activeModal.close(false);
    });
  }

}