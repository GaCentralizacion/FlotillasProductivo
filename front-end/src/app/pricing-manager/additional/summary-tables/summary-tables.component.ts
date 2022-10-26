import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { columnsByPin } from '@swimlane/ngx-datatable/release/utils';
import { PricingService } from 'src/app/services';
import { Cotizacion, GrupoUnidades } from 'src/app/models';
import { AdditionalService } from '../additional.service';

@Component({
  selector: 'app-summary-tables',
  templateUrl: './summary-tables.component.html',
  styleUrls: ['./summary-tables.component.scss']
})
export class SummaryTablesComponent implements OnInit {

  @Input() type: string;
  @Input() cotizaciones;


  rows =  [] as any[];

  constructor(private modalService: NgbModal,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private additionlService: AdditionalService) { }

  ngOnInit() {

    let currentRows = [] as any[];
    this.cotizaciones.forEach(element => {
      currentRows.push(Object.assign([], element));
    });

    switch(this.type) {
      case 'SinAdicionales': {
        currentRows = currentRows.filter( item => {
          return item.paquetesAccesorios.length === 0
          && item.paquetesServicioUnidad.length === 0 && item.paquetesTramites.length === 0
          && item.accesoriosSinPaquete.length === 0
          && item.serviciosUnidadSinPaquete.length === 0 && item.tramitesSinPaquete.length === 0;
        });
        currentRows.forEach( item => {
          item.paquetes = 0;
          item.tramites = 0;
          item.adicionales = 0;
        });
        this.rows = Object.assign([], currentRows);
         break;
      }
      case 'Tramites': {
        currentRows = currentRows.filter( item => {
          return item.tramitesSinPaquete.length > 0 || item.paquetesTramites.length > 0;
        });
        currentRows.forEach( item => {
            item.paquetes = item.paquetesTramites.length;
            item.tramites = item.tramitesSinPaquete.length;
            item.adicionales = 0;
            item.tramitesSinPaquete.forEach( tra => {
              item.adicionales += tra.precio;
            });
            item.paquetesTramites.forEach( paq => {
              item.tramites += paq.tramites.length;
                paq.tramites.forEach( tra => {
                  item.adicionales += tra.precio;
                });
            });
            item.adicionales = item.adicionales * item.cantidad;
        });
        this.rows = Object.assign([], currentRows);
         break;
      }
      case 'Accesorios': {
        currentRows = currentRows.filter( item => {
          return item.accesoriosSinPaquete.length > 0 || item.paquetesAccesorios.length > 0;
        });
        currentRows.forEach( item => {
          item.paquetes = item.paquetesAccesorios.length;
          item.accesorios = item.accesoriosSinPaquete.length;
          item.adicionales = 0;
          item.accesoriosSinPaquete.forEach( acce => {
            item.adicionales += acce.precio;
          });
          item.paquetesAccesorios.forEach( paq => {
            item.accesorios += paq.accesorios.length;
            paq.accesorios.forEach( tra => {
              item.adicionales += tra.precio;
            });
          });
          item.adicionales = item.adicionales * item.cantidad;
        });
        this.rows = Object.assign([], currentRows);
        break;
      }
      case 'Ordenes': {
        currentRows = currentRows.filter( item => {
          return item.paquetesServicioUnidad.length > 0 || item.serviciosUnidadSinPaquete.length > 0;
        });
        currentRows.forEach( item => {
          item.paquetes = item.paquetesServicioUnidad.length;
          item.ordenes = item.serviciosUnidadSinPaquete.length;
          item.adicionales = 0;
          item.serviciosUnidadSinPaquete.forEach( ser => {
            item.adicionales += ser.precio;
          });
          item.paquetesServicioUnidad.forEach( paq => {
            item.ordenes += paq.serviciosUnidad.length;
            paq.serviciosUnidad.forEach( tra => {
              item.adicionales += tra.precio;
            });
          });
          item.adicionales = item.adicionales * item.cantidad;
        });
        this.rows = Object.assign([], currentRows);
        break;
      }
      case 'Total': {
        currentRows.forEach( item => {
          item.totAdicionales = 0;
          item.subTotal = item.cantidad * item.precio;
          item.tramitesSinPaquete.forEach( tra => {
            item.totAdicionales += tra.precio;
          });
          item.paquetesTramites.forEach( paq => {
              paq.tramites.forEach( tra => {
                item.totAdicionales += tra.precio;
              });
          });
          item.accesoriosSinPaquete.forEach( acce => {
            item.totAdicionales += acce.precio;
          });
          item.paquetesAccesorios.forEach( paq => {
            paq.accesorios.forEach( tra => {
              item.totAdicionales += tra.precio;
            });
          });
          item.serviciosUnidadSinPaquete.forEach( ser => {
            item.totAdicionales += ser.precio;
          });
          item.paquetesServicioUnidad.forEach( paq => {
            paq.serviciosUnidad.forEach( tra => {
              item.totAdicionales += tra.precio;
            });
          });
          item.totAdicionales = item.totAdicionales * item.cantidad;
          item.total = item.totAdicionales + item.subTotal;
        });
        this.rows = Object.assign([], currentRows);
        break;
      }
      default: {
         console.error('Not supported ' + this.type);
         break;
      }
   }

  }

  getTotal() {
    let total = 0;
    if (this.type !== 'Total') {
      this.rows.forEach( item => {
        total += item.adicionales;
      });
    } else {
        this.rows.forEach( item => {
        total += item.total;
      });
    }
    return total;
  }



}

