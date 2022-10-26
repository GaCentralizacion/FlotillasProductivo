import { Component, OnInit, ViewChild } from '@angular/core';
import { Marca, Financiera, Empresa, Sucursal } from '../../models';
import { BrandService } from '../../services';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {

  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  searchNombre: string;
  marcaSelected: string;
  financieras: Financiera[];
  financierasFilter: Financiera[];
  selectedIdEmpresa: number;
  selectedSucursal: number;

  @ViewChild('marcaNgSelect') public marcaNgSelect: NgSelectComponent;
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;

  constructor(
    private brandService: BrandService
  ) { }

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: Marca[]) => { this.marcas = data; });
  }

  marcasOnChange(marca: Marca) {
    this.empresaNgSelect.clearModel();
    this.sucursalNgSelect.clearModel();
    this.marcaSelected = marca.idMarca;
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }

  empresaOnChange(empresa: Empresa) {
    if (!empresa) {
      return;
    }
    this.sucursalNgSelect.clearModel();
    this.selectedIdEmpresa = empresa.idEmpresa;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    this.financieras = [];
    this.financierasFilter = [];
    if (!sucursal) {
      return;
    }
    this.brandService.getFinancial(sucursal.idSucursal).subscribe((data: Financiera[]) => {
      this.financieras = data;
      this.financierasFilter = JSON.parse(JSON.stringify(this.financieras));
    });
    this.selectedSucursal = sucursal.idSucursal;
  }

  updateFilter(event: any) {
    if (!this.financieras) { return []; }
    if (this.searchNombre === undefined) {
      this.financierasFilter = this.financieras;
    }
    this.financierasFilter = this.financieras.filter(financiera => {
      return financiera.nombre.toLowerCase().includes(this.searchNombre.toLowerCase());
    });
  }
}
