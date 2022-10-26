import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Marca, Empresa, Sucursal, OtroAdicional, PaquetesAdicionales } from '../../models';
import { AdicionalCatalogService, BrandService } from '../../services';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrearEditarPaqueteAdicionalesComponent } from './crear-editar-paquete-adicionales/crear-editar-paquete-adicionales.component';
import { ToastrService } from 'ngx-toastr';
import { PricingManagerService } from 'src/app/pricing-manager/pricing.manager.service';

@Component({
  selector: 'app-adicionales',
  templateUrl: './adicionales.component.html',
  styleUrls: ['./adicionales.component.scss'],
  providers: [PricingManagerService]
})
export class AdicionalesComponent implements OnInit {

  marcas: Marca[];
  marcaSelected: string;
  empresas: Empresa[];
  empresaSelected: number;
  nombreEmpresaSelected: string;
  sucursales: Sucursal[];
  sucursalSelected: Sucursal;
  searchNombre: string;
  nombrePaqueteEliminar: string;
  idPaqueteEliminar: any;
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  rows: OtroAdicional[];
  rowsFiltered: OtroAdicional[];
  paquetesAdicionales: PaquetesAdicionales[];
  paqueteModal: any;
  paquetesConcepto: PaquetesAdicionales[];
  paquetesConceptos: any[];
  precioTotal: number;
  lisItems: any[];
  constructor(private brandService: BrandService,
    private adicionalCatalogService: AdicionalCatalogService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    public pricingManagerService: PricingManagerService) { }

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: Marca[]) => { this.marcas = data; });
  }

  marcasOnChange(marca: Marca) {
    this.marcaSelected = marca.idMarca;
    this.empresaNgSelect.clearModel();
    this.sucursalNgSelect.clearModel();
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }

  empresaOnChange(empresa: Empresa) {
    if (!empresa) {
      return;
    }
    this.empresaSelected = empresa.idEmpresa;
    this.nombreEmpresaSelected = empresa.nombre;
    this.sucursalNgSelect.clearModel();
    this.sucursalSelected = null;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    if (!sucursal) {
      return;
    }
    this.sucursalSelected = sucursal;
  }

  search() {
    this.adicionalCatalogService
      .getConceptos(this.sucursalSelected.idSucursal).subscribe((data: OtroAdicional[]) => {
        this.rows = data;
        this.rowsFiltered = JSON.parse(JSON.stringify(this.rows));
      });
  }

  updateFilter(event: any) {
    if (!this.rows) { return []; }
    if (this.searchNombre === undefined) {
      this.rowsFiltered = this.rows;
    }
    this.rowsFiltered = this.rows.filter(otroAdicional => {
      return otroAdicional.nombre.toLowerCase().includes((this.searchNombre || '').toLowerCase());
    });
  }

  searchPaquetes() {
    if (this.sucursalSelected.idSucursal !== undefined) {
      this.adicionalCatalogService.getPaquetesConcepto(this.sucursalSelected.idSucursal)
        .subscribe((data: PaquetesAdicionales[]) => {
          this.paquetesConcepto = [];
          data.map(itemData => {
            this.paquetesConcepto.push(Object
              .assign(new PaquetesAdicionales(), itemData));
          });
        });

    } else {
      this.toastrService.warning('Debe Seleccionar una Sucursal antes de buscar paquetes', 'Seleccionar una Sucursal');
    }
  }

  crearEditarPaquete(paqueteAdicionales: PaquetesAdicionales = null) {
    if (paqueteAdicionales == undefined) {
      paqueteAdicionales = {
        idEncPaqueteConcepto: null,
        nombre: null,
        descripcion: null,
        idMarca: this.marcaSelected == undefined ? null : this.marcaSelected,
        idEmpresa: this.empresaSelected == undefined ? null : this.empresaSelected,
        idSucursal: this.sucursalSelected == undefined ? null : this.sucursalSelected.idSucursal,
        nombreEmpresa: this.nombreEmpresaSelected == undefined ? null : this.nombreEmpresaSelected,
        nombreSucursal: this.sucursalSelected == undefined ? null : this.sucursalSelected.nombre,
        idUsuarioModificacion: null,
        fechaModificacion: null,
        conceptos: [],
      } as PaquetesAdicionales;
    }
    this.paqueteModal = this.modalService.open(CrearEditarPaqueteAdicionalesComponent, { size: 'lg' });
    this.paqueteModal.componentInstance.paqueteAdicionales = paqueteAdicionales;
  }

  editarPaquete(paqueteAdicionales: PaquetesAdicionales = null) {
    this.paqueteModal = this.modalService.open(CrearEditarPaqueteAdicionalesComponent, { size: 'lg' });
    this.paqueteModal.componentInstance.paqueteAdicionales = paqueteAdicionales;
    this.paqueteModal.componentInstance.idMarca = this.marcaSelected;
    this.paqueteModal.componentInstance.idEmpresa = this.empresaSelected;
    this.paqueteModal.componentInstance.idSucursal = this.sucursalSelected.idSucursal;
    this.paqueteModal.result.then(wasSaved => {
      if (wasSaved) {
        this.toastrService.success('Paquete guardado correctamente', 'Paquete de trámites');
        this.search();
      }
    });
  }

  openModalDelete(deletePaqueteTemplate: any, paqueteAdicionales: PaquetesAdicionales) {
    this.nombrePaqueteEliminar = paqueteAdicionales.nombre;
    this.idPaqueteEliminar = paqueteAdicionales.idEncPaqueteConcepto;
    this.modalService.open(deletePaqueteTemplate, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  eliminarPaquete() {
    this.adicionalCatalogService.deleteConcepto(this.idPaqueteEliminar).subscribe((res) => {
      this.toastrService.success(`El paquete ${this.nombrePaqueteEliminar} fue eliminado`, 'Paquete Eliminado');
      this.modalService.dismissAll('Paquete Eliminado');
      this.searchPaquetes();
    }, (error) => {
      this.toastrService.error('Se produjo un error al intentar eliminar el paquete seleccionado', 'Error al eliminar');
    });
  }

}
