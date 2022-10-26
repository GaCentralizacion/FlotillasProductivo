import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

import { PricingService } from './../../../services/pricing.service';
import { NewUnitsService } from './../../../services/new-units.service';
import { NotificationService } from './../../../services/notification.service';
import { UnidadInteres } from 'src/app/models';


@Component({
  selector: 'app-validate-vin',
  templateUrl: './validate-vin.component.html',
  styleUrls: ['./validate-vin.component.scss']
})
export class ValidateVinComponent implements OnInit {
  @Input()
  vinesOcupaodos: string;
  idCotizacion: string;
  idDireccionFlotillas: string;
  unidadInteres: any[] = [];
  variable: any[] = [];



  constructor(
    private activeModal: NgbActiveModal,
    private pricingService: PricingService,
    private toastrService: ToastrService,
    private newUnitsService: NewUnitsService,
    private router: Router,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.obtenUnidadInteres();

  }

  cancel() {
    this.activeModal.close(false);
  }

  generaOCContinua() {
      // console.log(this.vinesOcupaodos);
        this.pricingService.deleteUnidadInteres(this.idCotizacion, this.vinesOcupaodos)
        .subscribe(
          (res) => {
            this.toastrService.success(`Puede Cerrar la cotización`, `CAMBIOS REALIZADOS`);
              window.location.reload();
              this.activeModal.close(false);
              this.toastrService.warning('Se produjo un error con la Notificacion de Unidad', 'ERROR 500');
          }, (err) => {
            this.toastrService.warning('Se produjo un error al eliminar el grupo', 'ERROR 500');
          });
  }
  selectOthersUnits() {
     // console.log(this.vinesOcupaodos);
      this.pricingService.deleteUnidadInteres(this.idCotizacion, this.vinesOcupaodos)
      .subscribe(
        (res) => {
          if (res === 1) {
             // chk 02 - jul - 20 pongo la notificacion en status 0 para que se vuelva aenviar
             this.pricingService.udp1erNotificacion(this.idCotizacion, 0).
             subscribe((resp1erNoti) => {
              this.toastrService.success(`Puede seleecionar otros VIN´es`, `VIN´es LIBERADOS`);
              this.router.navigate(['main/cotizaciones/manager/unidades'], {
              queryParams: {
                idFlotilla: this.idDireccionFlotillas,
                idCotizacion: this.idCotizacion,
                step: '1'  }
              });
             }, (err) => {
               this.toastrService.warning('Se produjo un error con la Notificacion de Unidad', 'ERROR 500');
             });
          } else {
            window.location.reload();
            this.toastrService.error(`Error al liberar los VIN´es`, `VIN´es LIBERADOS`);
          }

          this.activeModal.close(false);
        }, (err) => {
          this.toastrService.warning('Se produjo un error al eliminar el grupo', 'ERROR 500');
        });
  // });
  }

  obtenUnidadInteres() {
    this.newUnitsService.getUnidadesInteres(this.idCotizacion)
    .subscribe((unidadInteres: any) => {
      const dirtyVines = this.vinesOcupaodos.split(',');
      dirtyVines.forEach((dirtyVin, index) => {
        const variable: any = {};
        if (dirtyVin === unidadInteres[index].vin) {
          variable.idGrupoUnidad = unidadInteres[index].idGrupoUnidad;
          variable.catalogo = unidadInteres[index].catalogo;
          variable.descripcion = unidadInteres[index].descripcion;          
          variable.anio = ' - Año: ' + unidadInteres[index].anio + ' - VIN: ' + unidadInteres[index].vin;
          this.unidadInteres.push(variable);
        }
      });
    });
  }

}
