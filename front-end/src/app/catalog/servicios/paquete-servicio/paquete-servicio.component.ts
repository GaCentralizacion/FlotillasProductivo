import { Component, OnInit, ViewChild } from '@angular/core';
import { Marca, Empresa, Sucursal, UnidadBpro } from '../../../models';
import { BrandService } from '../../../services/brand.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrdenesCatalogService, NewUnitsService } from 'src/app/services';
import { PaqueteServicio } from 'src/app/models/servicioUnidad.model';
import { CrearEditarPaqueteServicioComponent } from '../crear-editar-paquete-servicio/crear-editar-paquete-servicio.component';
import { PricingManagerService } from 'src/app/pricing-manager/pricing.manager.service';

@Component({
  selector: 'app-paquete-servicio',
  templateUrl: './paquete-servicio.component.html',
  styleUrls: ['./paquete-servicio.component.scss'],
  providers: [PricingManagerService]
})
export class PaqueteServicioComponent implements OnInit {

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
  @ViewChild('catalogoNgSelect') public catalogoNgSelect: NgSelectComponent;
  paquetesServicio: any[];
  nombrePaqueteEliminar: string;
  idPaqueteEliminar: number;
  mensajeErrorEliminar: string;
  selectedCatalogo: string;
  catalogos: UnidadBpro[];
  selectedAnio: string;
  anio = new Date().getFullYear();

  constructor(private brandService: BrandService,
    private newUnitsService: NewUnitsService,
    private serviceUnit: OrdenesCatalogService,
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
    this.catalogoNgSelect.clearModel();
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }

  empresaOnChange(empresa: Empresa) {
    this.sucursalNgSelect.clearModel();
    this.catalogoNgSelect.clearModel();
    if (empresa == undefined) {
      return;
    }
    this.selectedEmpresa = empresa.idEmpresa;
    this.selectedNombreEmpresa = empresa.nombre;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    this.catalogoNgSelect.clearModel();
    if (sucursal == undefined) {
      return;
    }
    this.selectedSucursal = sucursal.idSucursal;
    this.selectedNombreSucursal = sucursal.nombre;
    this.newUnitsService.getCatalogo(this.selectedEmpresa)
      .subscribe((data: UnidadBpro[]) => {
        this.catalogos = JSON.parse(JSON.stringify(data));
      });
  }

  catalogoOnChange(catalogo: UnidadBpro) {
    if (catalogo == undefined) {
      return;
    }
    this.selectedCatalogo = catalogo.idUnidadBpro;
  }

  search() {
    if (this.selectedSucursal === undefined || this.selectedCatalogo === undefined || this.selectedAnio === undefined) {
      this.toastrService.warning('Debe Completar todos los campos', 'INFORMACIÓN INCOMPLETA');
      return;
    } else {
      this.serviceUnit.getPaqueteServicio(this.selectedSucursal, this.selectedCatalogo, this.selectedAnio)
        .subscribe((data: PaqueteServicio[]) => {
          this.paquetesServicio = [];
          data.map(itemData => {
            this.paquetesServicio.push(Object.assign(new PaqueteServicio(), itemData));
          });
          if (this.paquetesServicio !== undefined) {
            if (this.paquetesServicio.length > 0) {
              this.toastrService.success(`Se encontraron ${this.paquetesServicio.length} paquetes para este modelo de vehiculo`,
                `${this.paquetesServicio.length} PAQUETES`);
            } else {
              this.toastrService.success('No se lograron encontrar registros que coincidan con las caracteristicas requeridas',
                'NO SE ENCONTRARON COINCIDENCIAS');
            }
          }
        });
    }
  }

  crearEditarPaquete(paqueteServicio: PaqueteServicio = null) {
    const paqueteModal = this.modalService.open(CrearEditarPaqueteServicioComponent, { size: 'lg' });
    if (paqueteServicio == undefined) {
      paqueteServicio = new PaqueteServicio();
      paqueteServicio.serviciosUnidad = [];
      paqueteServicio.idMarca = this.selectedMarca == undefined ? null : this.selectedMarca;
      paqueteServicio.idEmpresa = this.selectedEmpresa == undefined ? null : this.selectedEmpresa;
      paqueteServicio.idSucursal = this.selectedSucursal == undefined ? null : this.selectedSucursal;
      paqueteServicio.nombreEmpresa = this.selectedNombreEmpresa == undefined ? null : this.selectedNombreEmpresa;
      paqueteServicio.nombreSucursal = this.selectedNombreSucursal == undefined ? null : this.selectedNombreSucursal;
      paqueteServicio.catalogo = this.selectedCatalogo == undefined ? null : this.selectedCatalogo;
      paqueteServicio.anio = this.selectedAnio == undefined ? null : this.selectedAnio.toString();
    }
    paqueteModal.componentInstance.paqueteServicio = paqueteServicio;
    paqueteModal.result.then(wasSaved => {
      if (wasSaved) {
        this.toastrService.success('Paquete guardado correctamente', 'Paquete de Servicio');
        if (this.selectedSucursal != undefined && this.selectedCatalogo != undefined && this.selectedAnio != undefined) {
          this.search();
        }
      }
    });
  }

  openModalDelete(deletePaqueteTemplate: any, paqueteServicio: PaqueteServicio) {
    this.nombrePaqueteEliminar = paqueteServicio.nombre;
    this.idPaqueteEliminar = paqueteServicio.idEncPaqueteServicioUnidad;
    this.modalService.open(deletePaqueteTemplate, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  eliminarPaquete() {
    this.serviceUnit.deletePaqueteServicio(this.idPaqueteEliminar).subscribe(() => {
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
