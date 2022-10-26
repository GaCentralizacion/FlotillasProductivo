import { Component, OnInit } from '@angular/core';
import { BrandService, ProviderCatalogService } from '../../services';
import { TipoProveedor, Proveedor, Marca, Sucursal, Empresa } from '../../models';

@Component({
  selector: 'app-provider-catalog',
  templateUrl: './provider-catalog.component.html',
  styleUrls: ['./provider-catalog.component.scss'],
  providers: [BrandService, ProviderCatalogService]
})
export class ProviderCatalogComponent implements OnInit {

  sucursales: Sucursal[];
  marcas: Marca[];
  empresas: Empresa[];
  selectedSucursal: number;
  selectedTipoProveedor = '';
  rows: Proveedor[];
  rowsFiltered: Proveedor[];
  searchNombre = '';
  searchRFC = '';
  searchCorreo = '';
  tiposProveedor: TipoProveedor[];

  constructor(private brandService: BrandService, private providerService: ProviderCatalogService) { }

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: Marca[]) => { this.marcas = data; });
    this.tiposProveedor = this.providerService.getProviderTypes();
  }

  marcasOnChange($event) {
    this.brandService.getCompany($event.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }

  empresaOnChange($event) {
    this.brandService.getBranchOffice($event.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange($event) {
    this.selectedSucursal = $event.idSucursal;
  }

  tipoProveedorOnChange(tipoProveedor: TipoProveedor) {
    this.selectedTipoProveedor = tipoProveedor.idTipoProveedor;
  }

  search(event) {
    event.preventDefault();
    this.providerService.getProviders(this.selectedSucursal, this.selectedTipoProveedor).subscribe((data: Proveedor[]) => {
      this.rows = data;
      this.rowsFiltered = JSON.parse(JSON.stringify(data));
    });
  }

  updateFilter(event) {
    if (!this.rowsFiltered) { this.rowsFiltered = []; return; }
    if (!this.searchNombre) { return; }
    if (!this.searchRFC) { return; }
    if (!this.searchCorreo) { return; }

    this.rowsFiltered = this.rows.filter(proveedor => {
      return proveedor.nombreCompleto.toLowerCase().includes(this.searchNombre.toLowerCase()) &&
        proveedor.rfc.toLowerCase().includes(this.searchRFC.toLowerCase()) &&
        proveedor.correo.toLowerCase().includes(this.searchCorreo.toLowerCase());
    });
  }

}
