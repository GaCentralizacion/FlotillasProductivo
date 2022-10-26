import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GrupoUnidades, Cotizacion } from 'src/app/models';
import { ActivatedRoute } from '@angular/router';
import { PricingService } from 'src/app/services';
import { PricingManagerService } from '../../pricing.manager.service';
import { AdditionalService } from '../additional.service';
import { GroupTablesComponent } from '../group-tables/group-tables.component';

@Component({
  selector: 'app-selection-tab',
  templateUrl: './selection-tab.component.html',
  styleUrls: ['./selection-tab.component.scss']
})
export class SelectionTabComponent implements OnInit {
  cotizacion: Cotizacion;
  idCotizacion: string;
  gruposUnidades: GrupoUnidades[];
  @ViewChild(GroupTablesComponent) public grupos: GroupTablesComponent;

  constructor(private route: ActivatedRoute,
    private pricingService: PricingService, private pricingManagerService: PricingManagerService,
    private additionalService: AdditionalService) { }

  ngOnInit() {
    this.additionalService.changeCotizacion.subscribe((item: Cotizacion) => {
      this.gruposUnidades = item.gruposUnidades;
    });
    this.route.queryParams.subscribe(params => {
      this.idCotizacion = params.idCotizacion;
      this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        this.cotizacion = cotizacion;
        if (cotizacion.status === 'EN PROCESO') {
          this.pricingManagerService.onlyRead = false;
        } else {
          this.pricingManagerService.onlyRead = true;
        }

        //OCT99 SOLO LECTURA
        if (this.pricingManagerService.perfilSoloLectura)
          this.pricingManagerService.onlyRead = true;

        this.gruposUnidades = cotizacion.gruposUnidades;
      });
    });
  }

  actualizaGrupos() {
    this.grupos.actualizaGrupos();
  }

}
