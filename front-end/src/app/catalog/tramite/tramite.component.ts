import { Component, OnInit, ViewChild } from '@angular/core';
import { BrandService, TramiteCatalogService } from '../../services';
import { Marca, Sucursal, Empresa, Subtramite, Tramite, ProveedorAdicional } from '../../models';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-tramite',
  templateUrl: './tramite.component.html',
  styleUrls: ['./tramite.component.scss'],
  providers: [BrandService, TramiteCatalogService]
})
export class TramiteComponent implements OnInit {

  marcas: Marca[];
  empresas: Empresa[];
  tramites: Tramite[];
  sucursales: Sucursal[];
  subtramites: Subtramite[];
  rows: ProveedorAdicional[];
  selectedSucursal: number;
  selectedMarca: string;
  selectedTramite: string;
  selectedSubtramite: string;
  searchNombre = '';
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  @ViewChild('tramiteNgSelect') public tramiteNgSelect: NgSelectComponent;
  @ViewChild('subtramiteNgSelect') public subtramiteNgSelect: NgSelectComponent;

  constructor(private brandService: BrandService, private tramiteService: TramiteCatalogService) { }

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: Marca[]) => { this.marcas = data });
  }

  marcasOnChange(marca: Marca) {
    this.empresaNgSelect.clearModel();
    this.sucursalNgSelect.clearModel();
    this.tramiteNgSelect.clearModel();
    this.subtramiteNgSelect.clearModel();
    this.selectedMarca = marca.idMarca;
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }

  empresaOnChange(empresa: Empresa) {
    this.sucursalNgSelect.clearModel();
    this.tramiteNgSelect.clearModel();
    this.subtramiteNgSelect.clearModel();
    if (empresa == undefined) {
      return;
    }
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    this.tramiteNgSelect.clearModel();
    this.subtramiteNgSelect.clearModel();
    if (sucursal == undefined) {
      return;
    }
    this.selectedSucursal = sucursal.idSucursal;
    this.tramiteService.getTramites(this.selectedMarca, this.selectedSucursal).subscribe((data: Tramite[]) => { this.tramites = data; });
  }

  tramiteOnChange(tramite: Tramite) {
    this.subtramiteNgSelect.clearModel();
    if (tramite == undefined) {
      return;
    }
    this.selectedTramite = tramite.idTramite;
    this.tramiteService.getSubtramites(this.selectedMarca, this.selectedSucursal, this.selectedTramite)
      .subscribe((data: Subtramite[]) => { this.subtramites = data; });
  }

  subtramiteOnChange(subtramite: Subtramite) {
    this.selectedSubtramite = subtramite.idSubtramite;
  }

  search(event) {
    event.preventDefault();
    this.tramiteService.getProveedorSubtramite(this.selectedMarca, this.selectedSucursal, this.selectedSubtramite)
      .subscribe((data: ProveedorAdicional[]) => {
        this.rows = JSON.parse(JSON.stringify(data));
      });
  }

  updateFilter(event) {
    if (!this.rows) { return []; }
    if (!this.searchNombre) { this.rows; }


    const temp = this.rows.filter(car => {
      return car.nombreCompleto.toLowerCase().includes(this.searchNombre.toLowerCase());


    });

    this.rows = temp;

    if (event.key === 'Backspace') {
      this.tramiteService.getProveedorSubtramite(this.selectedMarca, this.selectedSucursal, this.selectedSubtramite).subscribe(data => {
        this.rows = JSON.parse(JSON.stringify(data));
      });
    }
  }

}
