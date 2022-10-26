import { Component, OnInit } from '@angular/core';
import { DireccionFlotillasSelectService } from '../shared/direccion-flotilla-select/direccion-flotillas-select.service';
import { PricingService } from '../services';
import { Router } from '@angular/router';
import { Cotizacion } from '../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fleet-management',
  templateUrl: './fleet-management.component.html',
  styleUrls: ['./fleet-management.component.scss']
})
export class FleetManagementComponent implements OnInit {

  subcription: Subscription;
  direccionFlotilla: any;
  totalRegistros: number;
  registrosPorPagina = 10;
  numeroPagina = 0;
  cotizacion: Cotizacion;
  cotizaciones: Cotizacion[];
  idDireccionFlotilla: string;

  constructor(private router: Router,
    private pricingService: PricingService,
    private direccionFlotillasSelectServices: DireccionFlotillasSelectService) { }

  ngOnInit() {
    this.subcription = this.direccionFlotillasSelectServices.isSelected.subscribe(async (idDireccionFlotilla: string) => {
      this.idDireccionFlotilla = await idDireccionFlotilla;
      this.pricingService.getPricingsByIdDireccionFlotillas(this.idDireccionFlotilla).subscribe((cotizaciones: any) => {
        this.cotizaciones = cotizaciones;
      });
    });
  }

}
