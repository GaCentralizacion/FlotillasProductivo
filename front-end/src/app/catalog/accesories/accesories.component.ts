import { Component, OnInit, ViewChild } from '@angular/core';
import { Marca, Empresa, Sucursal, AccesorioNuevo } from '../../models';
import { AccesorioCatalogService, BrandService } from '../../services';
import { NgSelectComponent } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrearEditarAccesorioComponent } from './crear-editar-accesorio/crear-editar-accesorio.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accesories',
  templateUrl: './accesories.component.html',
  styleUrls: ['./accesories.component.scss']
})
export class AccesoriesComponent implements OnInit {

  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  marcaSelected: Marca;
  sucursalSelected: Sucursal;
  searchIdAccesorio: string;
  searchNombre: string;
  searchModeloAnio: string;
  searchCosto: string;
  searchPrecio: string;
  searchExistencia: string;
  filtroEsNuevo: boolean = null;
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  rows: AccesorioNuevo[];
  rowsFiltered: AccesorioNuevo[];
  empresaSelected: Empresa;
  nombreAccesorioNuevoEliminar: string;
  idAccesorioNuevoEliminar: number;

  constructor(private brandService: BrandService,
    private accesorioCatalogService: AccesorioCatalogService,
    private modalService: NgbModal,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: Marca[]) => { this.marcas = data; });
  }

  marcasOnChange(marca: Marca) {
    this.marcaSelected = marca;
    this.empresaNgSelect.clearModel();
    this.sucursalNgSelect.clearModel();
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }

  empresaOnChange(empresa: Empresa) {
    this.sucursalNgSelect.clearModel();
    this.sucursalSelected = null;
    if (!empresa) {
      return;
    }
    this.empresaSelected = empresa;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    if (!sucursal) {
      return;
    }
    this.sucursalSelected = sucursal;
  }

  search() {
    forkJoin(
      this.accesorioCatalogService.getAccesoriosBproSC(this.marcaSelected.idMarca, this.sucursalSelected.idSucursal),
      this.accesorioCatalogService.getAccesoriosNuevos(this.sucursalSelected.idSucursal)
    ).subscribe((res: any[]) => {
      this.rows = [];
      this.rowsFiltered = [];
      res[0].map(itemBpro => {
        this.rows.push(Object.assign(new AccesorioNuevo(), itemBpro));
      });
      res[1].map(itemBpro => {
        this.rows.push(Object.assign(new AccesorioNuevo(), itemBpro));
      });
      this.rows = this.rows.sort((a: AccesorioNuevo, b: AccesorioNuevo) => {
        if (a.nombre > b.nombre) {
          return 1;
        }
        if (a.nombre < b.nombre) {
          return -1;
        }
        return 0;
      });
      this.rowsFiltered = JSON.parse(JSON.stringify(this.rows));
    });
  }

  updateFilter() {
    if (!this.rows) { this.rows = []; }
    this.rowsFiltered = this.rows.filter(accesorio => {
      return accesorio.nombre.toLowerCase().includes((this.searchNombre || '').toLowerCase()) &&
        accesorio.id.toLowerCase().includes((this.searchIdAccesorio || '').toLowerCase()) &&
        accesorio.modeloAnio.toLowerCase().includes((this.searchModeloAnio || '').toLowerCase()) &&
        accesorio.costo.toString().toLowerCase().includes((this.searchCosto || '').toLowerCase()) &&
        accesorio.precio.toString().toLowerCase().includes((this.searchPrecio || '').toLowerCase()) &&
        (accesorio.existencia == undefined ? 0 : accesorio.existencia).toString()
          .toLowerCase().includes((this.searchExistencia || '').toLowerCase()) &&
        this.filtroEsNuevo == undefined ? true : accesorio.esNuevo == this.filtroEsNuevo;
    });
  }

  crearEditarAccesorio(accesorioNuevo: AccesorioNuevo = null) {
    const accesorioModal = this.modalService.open(CrearEditarAccesorioComponent, { size: 'lg' });
    if (accesorioNuevo == undefined) {
      accesorioNuevo = new AccesorioNuevo();
      accesorioNuevo.idMarca = this.marcaSelected == undefined ? null : this.marcaSelected.idMarca;
      accesorioNuevo.idEmpresa = this.empresaSelected == undefined ? null : this.empresaSelected.idEmpresa;
      accesorioNuevo.nombreEmpresa = this.empresaSelected == undefined ? null : this.empresaSelected.nombre;
      accesorioNuevo.idSucursal = this.sucursalSelected == undefined ? null : this.sucursalSelected.idSucursal;
      accesorioNuevo.nombreSucursal = this.sucursalSelected == undefined ? null : this.sucursalSelected.nombre;
    }
    accesorioModal.componentInstance.accesorioNuevo = accesorioNuevo;
    accesorioModal.result.then(wasSaved => {
      if (wasSaved) {
        this.toastrService.success('Accesorio guardado correctamente', 'Accesorios');
        if (this.sucursalSelected != undefined) {
          this.search();
          this.updateFilter();
        }
      }
    });
  }

  setFiltroEsNuevo(nuevoValor: boolean = null) {
    switch (nuevoValor) {
      case true:
        this.filtroEsNuevo = false;
        break;
      case false:
        this.filtroEsNuevo = null;
        break;
      default:
        this.filtroEsNuevo = true;
    }
    this.updateFilter();
  }

  openModalDelete(deletePaqueteTemplate: any, accesorioNuevo: AccesorioNuevo) {
    this.nombreAccesorioNuevoEliminar = accesorioNuevo.nombre;
    this.idAccesorioNuevoEliminar = accesorioNuevo.idAccesorioNuevo;
    this.modalService.open(deletePaqueteTemplate, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  eliminarAccesorioNuevo() {
    this.accesorioCatalogService.deleteAccesorioNuevo(this.idAccesorioNuevoEliminar).subscribe(() => {
      this.toastrService.success(`El accesorio ${this.nombreAccesorioNuevoEliminar} fue eliminado`, 'Accesorio Eliminado');
      this.modalService.dismissAll('Paquete Eliminado');
      this.search();
      this.updateFilter();
    }, (error) => {
      this.toastrService
        .error('Se produjo un error al intentar eliminar el accesorio seleccionado, es posible que se haya usado en alguna cotización',
          'Error al eliminar');
    });
  }

  getRowClass(accesorioNuevo: AccesorioNuevo) {
    if (accesorioNuevo.esNuevo) {
      return { 'row-orange': true };
    }

  }

}
