import { Component, OnInit, ViewChild } from '@angular/core';
import { Marca, Empresa, Sucursal, PaqueteAccesorios } from '../../../models';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BrandService, AccesorioCatalogService } from '../../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CrearEditarPaqueteAccesorioComponent } from '../crear-editar-paquete-accesorio/crear-editar-paquete-accesorio.component';

@Component({
  selector: 'app-paquete-accesorios',
  templateUrl: './paquete-accesorios.component.html',
  styleUrls: ['./paquete-accesorios.component.scss']
})
export class PaqueteAccesoriosComponent implements OnInit {

  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  selectedMarca: string;
  selectedEmpresa: number;
  selectedSucursal: number;
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  paquetesAccesorios: PaqueteAccesorios[];
  nombrePaqueteEliminar: string;
  idPaqueteEliminar: number;
  mensajeErrorEliminar: string;
  nombreEmpresaSelected: string;
  nombreSucursalSelected: string;

  constructor(private brandService: BrandService,
    private accesoriosService: AccesorioCatalogService,
    private toastrService: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: Marca[]) => { this.marcas = data; });
  }

  marcasOnChange(marca: Marca) {
    this.selectedMarca = marca.idMarca;
    this.empresaNgSelect.clearModel();
    this.sucursalNgSelect.clearModel();
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }

  empresaOnChange(empresa: Empresa) {
    this.sucursalNgSelect.clearModel();
    if (empresa == undefined) {
      this.selectedEmpresa = null;
      this.nombreEmpresaSelected = null;
      return;
    }
    this.selectedEmpresa = empresa.idEmpresa;
    this.nombreEmpresaSelected = empresa.nombre;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    if (sucursal == undefined) {
      this.selectedSucursal = null;
      this.nombreSucursalSelected = null;
      return;
    }
    this.selectedSucursal = sucursal.idSucursal;
    this.nombreSucursalSelected = sucursal.nombre;
  }

  openModalDelete(deletePaqueteTemplate: any, paqueteAccesorios: PaqueteAccesorios) {
    this.nombrePaqueteEliminar = paqueteAccesorios.nombre;
    this.idPaqueteEliminar = paqueteAccesorios.idEncPaqueteAccesorio;
    this.modalService.open(deletePaqueteTemplate, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  eliminarPaquete() {
    this.accesoriosService.deletePaqueteAccesorios(this.idPaqueteEliminar).subscribe(() => {
      this.modalService.dismissAll('Paquete Eliminado');
      this.search();
    }, error => {
      this.mensajeErrorEliminar = error.statusText;
    });
  }

  search() {
    if (this.selectedSucursal === undefined) {
      this.toastrService.warning('Debe seleccionar la sucursal', 'Paquete de Accesorios');
      return;
    } else {
      this.accesoriosService.getPaquetesAccesorios(this.selectedSucursal)
        .subscribe((data: PaqueteAccesorios[]) => {
          this.paquetesAccesorios = [];
          data.map(itemData => {
            this.paquetesAccesorios.push(Object.assign(new PaqueteAccesorios(), itemData));
          });
          if (this.paquetesAccesorios.length == 0) {
            this.toastrService.success('No se encontraron Paquetes de Accesorios para esta sucursal',
              'Paquete de Accesorios');
          }
        });
    }
  }

  // TODO Tomar como base para modal
  crearEditarPaquete(paqueteAccesorios: PaqueteAccesorios = null) {
    const paqueteModal = this.modalService.open(CrearEditarPaqueteAccesorioComponent, { size: 'lg' });
    if (paqueteAccesorios == undefined) {
      paqueteAccesorios = new PaqueteAccesorios();
      paqueteAccesorios.idMarca = this.selectedMarca;
      paqueteAccesorios.idEmpresa = this.selectedEmpresa;
      paqueteAccesorios.nombreEmpresa = this.nombreEmpresaSelected;
      paqueteAccesorios.idSucursal = this.selectedSucursal;
      paqueteAccesorios.nombreSucursal = this.nombreSucursalSelected;
      paqueteAccesorios.accesorios = [];
    }
    paqueteModal.componentInstance.paqueteAccesorios = paqueteAccesorios;
    paqueteModal.result.then(wasSaved => {
      if (wasSaved) {
        this.toastrService.success('Paquete guardado correctamente', 'Paquete de Accesorios');
        this.search();
      }
    });
  }

}
