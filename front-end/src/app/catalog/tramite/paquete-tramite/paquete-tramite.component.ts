import { Component, OnInit, ViewChild } from '@angular/core';
import { Marca, Empresa, Sucursal, PaqueteTramite } from '../../../models';
import { BrandService } from '../../../services/brand.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TramiteCatalogService } from '../../../services/tramite-catalog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrearEditarPaqueteTramiteComponent } from '../crear-editar-paquete-tramite/crear-editar-paquete-tramite.component';
import { ToastrService } from 'ngx-toastr';
import { PricingManagerService } from 'src/app/pricing-manager/pricing.manager.service';

@Component({
  selector: 'app-paquete-tramite',
  templateUrl: './paquete-tramite.component.html',
  styleUrls: ['./paquete-tramite.component.scss'],
  providers: [PricingManagerService]
})
export class PaqueteTramiteComponent implements OnInit {

  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  selectedMarca: string;
  selectedEmpresa: number;
  selectedSucursal: number;
  selectedNombreEmpresa: string;
  selectedNombreSucursal: string;
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  paquetesTramite: PaqueteTramite[];
  nombrePaqueteEliminar: string;
  idPaqueteEliminar: number;
  mensajeErrorEliminar: string;

  constructor(private brandService: BrandService,
    private tramiteService: TramiteCatalogService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    public pricingManagerService: PricingManagerService) { }

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
      return;
    }
    this.selectedEmpresa = empresa.idEmpresa;
    this.selectedNombreEmpresa = empresa.nombre;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    if (sucursal == undefined) {
      return;
    }
    this.selectedSucursal = sucursal.idSucursal;
    this.selectedNombreSucursal = sucursal.nombre;
  }

  search() {
    this.tramiteService.getPaquetesTramite(this.selectedSucursal).subscribe((data: PaqueteTramite[]) => {
      this.paquetesTramite = [];
      data.map(itemData => {
        this.paquetesTramite.push(Object.assign(new PaqueteTramite(), itemData));
      });
    });
  }

  crearEditarPaquete(paqueteTramite: PaqueteTramite = null) {
    if (paqueteTramite == undefined) {
      paqueteTramite = new PaqueteTramite();
      paqueteTramite.tramites = [];
      paqueteTramite.idMarca = this.selectedMarca;
      paqueteTramite.idEmpresa = this.selectedEmpresa;
      paqueteTramite.nombreEmpresa = this.selectedNombreEmpresa;
      paqueteTramite.idSucursal = this.selectedSucursal;
      paqueteTramite.nombreSucursal = this.selectedNombreSucursal;
    }
    const paqueteModal = this.modalService.open(CrearEditarPaqueteTramiteComponent, { size: 'lg' });
    paqueteModal.componentInstance.paqueteTramite = paqueteTramite;
    paqueteModal.result.then(wasSaved => {
      if (wasSaved) {
        this.toastrService.success('Paquete guardado correctamente', 'Paquete de trámites');
        this.search();
      }
    });
  }

  openModalDelete(deleteTemplate: any, paqueteTramite: PaqueteTramite) {
    this.nombrePaqueteEliminar = paqueteTramite.nombre;
    this.idPaqueteEliminar = paqueteTramite.idEncPaqueteTramite;
    this.modalService.open(deleteTemplate, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  eliminarPaquete() {
    this.tramiteService.deletePaqueteTramite(this.idPaqueteEliminar).subscribe(() => {
      this.modalService.dismissAll('Archivo Eliminado');
      this.search();
    }, error => {
      this.mensajeErrorEliminar = error.statusText;
    });
  }

  closeMessageEliminar() {
    this.mensajeErrorEliminar = null;
  }

}
