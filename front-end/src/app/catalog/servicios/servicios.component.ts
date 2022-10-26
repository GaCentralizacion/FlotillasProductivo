import { Component, OnInit, ViewChild } from '@angular/core';
import { BrandService, OrdenesCatalogService, NewUnitsService } from '../../services';
import { Marca, Empresa, Sucursal, ServicioUnidad, UnidadBpro } from 'src/app/models';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
  providers: [BrandService, NewUnitsService]
})
export class ServiciosComponent implements OnInit {

  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  rows: ServicioUnidad[];
  selectedSucursal: number;
  selectedIdEmpresa: number;
  selectedCatalogo: string;
  catalogos: UnidadBpro[];
  selectedAnio: any;
  anio = new Date().getFullYear();

  @ViewChild('marcaNgSelect') public marcaNgSelect: NgSelectComponent;
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;


  constructor(private brandService: BrandService,
    private newUnitsService: NewUnitsService,
    private serviceUnit: OrdenesCatalogService) { }

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: Marca[]) => { this.marcas = data; });
  }

  marcasOnChange(marca: Marca) {
    this.empresaNgSelect.clearModel();
    this.sucursalNgSelect.clearModel();
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
    if (!sucursal) {
      return;
    }
    this.selectedSucursal = sucursal.idSucursal;
    this.newUnitsService.getCatalogo(this.selectedIdEmpresa)
      .subscribe(data => {
        this.catalogos = JSON.parse(JSON.stringify(data));
      });
  }

  catalogoOnChange(catalogo: UnidadBpro) {
    this.selectedCatalogo = catalogo.idUnidadBpro;
  }

  search() {
    this.serviceUnit.getServicios(this.selectedSucursal, this.selectedCatalogo, this.selectedAnio)
      .subscribe((data: ServicioUnidad[]) => {
        this.rows = JSON.parse(JSON.stringify(data));
      });
  }
}
