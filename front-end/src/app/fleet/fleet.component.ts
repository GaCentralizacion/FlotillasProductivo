import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DireccionFlotillaSelectComponent } from '../shared/direccion-flotilla-select/direccion-flotilla-select.component';
import { PricingService } from '../services/pricing.service';
import { Cotizacion } from '../models/cotizacion.model';
import { Subscription } from 'rxjs';
import { DireccionFlotillasSelectService } from '../shared/direccion-flotilla-select/direccion-flotillas-select.service';
import { ExcelService } from '../services/excel.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {
  subcription: Subscription;
  cotizaciones: Cotizacion[];
  idDireccionFlotilla: string;
  lastFlotilla: string;
  @ViewChild('flotillaSelect') flotillaSelect: DireccionFlotillaSelectComponent;

  filteredData = [];
  columnsWithSearch: string[] = [];
  data;
  consultarCotizacion;


  constructor(private router: Router,
    private pricingService: PricingService,
    private direccionFlotillasSelectServices: DireccionFlotillasSelectService,
    private route: ActivatedRoute,
    private excelService: ExcelService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.subcription = this.direccionFlotillasSelectServices.isSelected.subscribe(async (idDireccionFlotilla: string) => {
      this.idDireccionFlotilla = await idDireccionFlotilla;
      const idFlotilla = this.route.snapshot.queryParams['idFlotilla'];
      if (idFlotilla && !this.lastFlotilla) {
        this.idDireccionFlotilla = idFlotilla;
      }
      this.pricingService.getPricingsByIdDireccionFlotillas(this.idDireccionFlotilla).subscribe((cotizaciones: any) => {
        this.data = cotizaciones;
        this.cotizaciones = cotizaciones;
        this.cotizaciones = this.cotizaciones.filter(item => item.status === 'APROBADA' || item.status === 'PEDIDO GENERADO'
          || item.status === 'PEDIDO FACTURADO' || item.status === 'ORDENES DE COMPRA PENDIENTES'
          || item.status === 'ORDENES DE COMPRA COMPLETADAS' || item.status.includes('FACTURAD')
          || item.status === 'CANCELADA');
        this.cotizaciones.sort((a, b) => (a.fechaModificacion > b.fechaModificacion) ? -1 :
          ((b.fechaModificacion > a.fechaModificacion) ? 1 : 0));
        if (idFlotilla && !this.lastFlotilla) {
          this.flotillaSelect.idFlotilla = idFlotilla;
          this.lastFlotilla = idFlotilla;
          this.cotizaciones = this.cotizaciones.filter(item => item.idDireccionFlotillas === idFlotilla);
        }
      });
    });
  }

  detalleCotizacion(event, row, templateModal) {

    event.preventDefault();
    this.consultarCotizacion = row;

    if (row.status === 'CANCELADA') {
      const result = this.modalService.open(templateModal);
    }
    else {
      this.router.navigate(['/main/gestionFlotilla/manager/unidades'], {
        queryParams: {
          idCotizacion: row.idCotizacion,
          idLicitacion: row.idLicitacion,
          idFlotilla: this.idDireccionFlotilla,
          idUsuario: row.idUsuario
        }
      });
    }
  }

  cotizacionesDetalle(templateModal){
    event.preventDefault();

    this.modalService.dismissAll(templateModal);
    
    if (this.consultarCotizacion.idLicitacion == undefined) {
      this.router.navigate(['main/cotizaciones/manager/unidades'], {
        queryParams: {
          idCotizacion: this.consultarCotizacion.idCotizacion,
          idLicitacion: this.consultarCotizacion.idLicitacion,
          idFlotilla: this.idDireccionFlotilla,
          idUsuario: this.consultarCotizacion.idUsuario,
          step: (this.consultarCotizacion.step === 0) ? 1 : this.consultarCotizacion.step
        }
      });
    }
    if (this.consultarCotizacion.idLicitacion != undefined) {
      this.router.navigate(['main/cotizaciones/manager/registro'], {
        queryParams: {
          idCotizacion: this.consultarCotizacion.idCotizacion,
          idLicitacion: this.consultarCotizacion.idLicitacion,
          idFlotilla: this.idDireccionFlotilla,
          idUsuario: this.consultarCotizacion.idUsuario,
          step: this.consultarCotizacion.step
        }
      });
    }
  }

  exportExcel() {
    this.excelService.exportAsExcelFile(this.cotizaciones, 'cotizaciones');
  }

  filterDatatable(event) {
    
    this.cotizaciones = this.data;
    // get the value of the key pressed and make it lowercase
    let filter = event.target.value.toLowerCase();
    this.filteredData = this.data;
    this.columnsWithSearch = Object.keys(this.cotizaciones[0]);

    // assign filtered matches to the active datatable
    this.cotizaciones = this.filteredData.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < this.columnsWithSearch.length; i++) {
        var colValue = item[this.columnsWithSearch[i]];

        // if no filter OR colvalue is NOT null AND contains the given filter
        if (!filter || (!!colValue && colValue.toString().toLowerCase().indexOf(filter) !== -1)) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
  }

}
