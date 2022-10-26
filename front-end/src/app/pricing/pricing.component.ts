import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DireccionFlotillaSelectComponent } from '../shared/direccion-flotilla-select/direccion-flotilla-select.component';
import { PricingService } from '../services/pricing.service';
import { Cotizacion } from '../models/cotizacion.model';
import { Subscription } from 'rxjs';
import { DireccionFlotillasSelectService } from '../shared/direccion-flotilla-select/direccion-flotillas-select.service';
import { PricingManagerService } from '../pricing-manager/pricing.manager.service';
import { ExcelService } from '../services/excel.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
  providers: [PricingManagerService]
})
export class PricingComponent implements OnInit {

  subcription: Subscription;
  direccionFlotilla: any;
  totalRegistros: number;
  registrosPorPagina = 10;
  numeroPagina = 0;
  cotizacion: Cotizacion;
  cotizaciones: Cotizacion[];
  idDireccionFlotilla: string;
  lastFlotilla: string;
  rol: number;
  idUsuario: number;

  filteredData = [];
  columnsWithSearch: string[] = [];
  data;


  @ViewChild('flotillaSelect') flotillaSelect: DireccionFlotillaSelectComponent;

  constructor(private router: Router,
    private pricingService: PricingService,
    private direccionFlotillasSelectServices: DireccionFlotillasSelectService,
    private route: ActivatedRoute,
    private excelService: ExcelService,
    public pricingManagerService: PricingManagerService
    ) {
  }

  ngOnInit() {
    const objAuth: any = JSON.parse(localStorage.getItem('app_token'));
    this.idUsuario = objAuth.data.user.id;
    this.rol = objAuth.data.security.rol[0].RolId;

    const navEndEvents$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );
    navEndEvents$.subscribe((end: NavigationEnd) => {
      const step = end.urlAfterRedirects.substr(end.urlAfterRedirects.length - 1, 1);
      if (!isNaN(Number(step))) {

      }
    });

    this.subcription = this.direccionFlotillasSelectServices.isSelected.subscribe(async (idDireccionFlotilla: string) => {
      this.idDireccionFlotilla = await idDireccionFlotilla;

      if (this.rol === 50 || this.pricingManagerService.perfilSoloLectura) {
        this.pricingService.getPricingsByIdDireccionFlotillas(this.idDireccionFlotilla).subscribe((cotizaciones: any) => {          
          this.ordenarCotizaciones(cotizaciones);
          
        });
      } else {
        this.pricingService.getPricingsByIdDireccionFlotillasByUser(this.idDireccionFlotilla, this.idUsuario)
          .subscribe((cotizaciones: any) => {
            this.ordenarCotizaciones(cotizaciones);
          });
      }
    });
  }

  ordenarCotizaciones(cotizaciones) {
    const idFlotilla = this.route.snapshot.queryParams['idFlotilla'];
    if (idFlotilla && !this.lastFlotilla) {
      this.idDireccionFlotilla = idFlotilla;
    }
    this.cotizaciones = cotizaciones;
    this.cotizaciones = this.cotizaciones.filter( item => item.status === 'APROBADA' || item.status === 'PEDIDO GENERADO'
    || item.status === 'PEDIDO FACTURADO' || item.status === 'ORDENES DE COMPRA PENDIENTES'
    || item.status === 'ORDENES DE COMPRA COMPLETADAS' || item.status === 'EN PROCESO' 
    || item.status.includes('FACTURAD') || item.status === 'CANCELADA');
    this.data = cotizaciones;
    this.cotizaciones.sort((a, b) => (a.fechaModificacion > b.fechaModificacion) ? -1 :
      ((b.fechaModificacion > a.fechaModificacion) ? 1 : 0));
    if (idFlotilla && !this.lastFlotilla) {
      this.flotillaSelect.idFlotilla = idFlotilla;
      this.lastFlotilla = idFlotilla;
      this.cotizaciones = this.cotizaciones.filter(item => item.idDireccionFlotillas === idFlotilla);
    }
  }

  abrirCotizacion(event, row: Cotizacion) {
    event.preventDefault();
    if (row.idLicitacion == undefined) {
      this.router.navigate(['main/cotizaciones/manager/unidades'], {
        queryParams: {
          idCotizacion: row.idCotizacion,
          idLicitacion: row.idLicitacion,
          idFlotilla: this.idDireccionFlotilla,
          idUsuario: row.idUsuario,
          step: (row.step === 0) ? 1 : row.step
        }
      });
      return;
    }
    if (row.idLicitacion != undefined) {
      this.router.navigate(['main/cotizaciones/manager/registro'], {
        queryParams: {
          idCotizacion: row.idCotizacion,
          idLicitacion: row.idLicitacion,
          idFlotilla: this.idDireccionFlotilla,
          idUsuario: row.idUsuario,
          step: row.step
        }
      });
    }
  }

  agregarNuevaCotizacion() {
    this.direccionFlotilla = this.flotillaSelect.getValue();
    this.router.navigate(['main/cotizaciones/manager/registro'], {
      queryParams: {
        idFlotilla: this.idDireccionFlotilla,
        idUsuario: this.direccionFlotilla.idUsuario,
        step: 0
      }
    });
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
