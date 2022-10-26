import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PricingService, NewUnitsService } from 'src/app/services';
import { Unidad } from 'src/app/models';

@Component({
  selector: 'app-pricing-search',
  templateUrl: './search.unit.component.html',
  styleUrls: ['./search.unit.component.scss']
})
export class SearchUnitComponent implements OnInit {

  empresa = 4;
  sucursal = 6;
  rows = [] as any[];
  originalRows = [] as any[];

  vin = '';

  constructor(private router: Router,
    private pricingService: PricingService, private newUnitsService: NewUnitsService) {
  }

  ngOnInit() {
  }

  searchUnit() {
    this.newUnitsService.getNewUnits(Number(this.empresa), this.sucursal)
      .subscribe(data => {
        this.rows = JSON.parse(JSON.stringify(data));
        this.originalRows = JSON.parse(JSON.stringify(data));
        this.rows = this.rows.filter((car: Unidad) => {
          return car.idCotizacion == null;
        });
        this.originalRows = this.originalRows.filter((car: Unidad) => {
          return car.idCotizacion == null;
        });
      });
  }

  searchValue(event) {
    this.rows = this.originalRows.filter(item => {
      if (item.vin.toUpperCase().startsWith(event.toUpperCase())) {
        return true;
      } else {
        return false;
      }
    });
  }

  changeEmpresa(event) {
    this.empresa = event;
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

  changeSucursal(event) {
    this.sucursal = event;
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        


}
