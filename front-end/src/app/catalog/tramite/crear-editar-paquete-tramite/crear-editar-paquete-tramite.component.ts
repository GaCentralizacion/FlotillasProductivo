import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Sucursal, Empresa, Marca, PaqueteTramite, ProveedorAdicional, Tramite, Subtramite, DetallePaqueteTramite } from '../../../models';
import { BrandService, TramiteCatalogService } from '../../../services';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-editar-paquete-tramite',
  templateUrl: './crear-editar-paquete-tramite.component.html',
  styleUrls: ['./crear-editar-paquete-tramite.component.scss']
})
export class CrearEditarPaqueteTramiteComponent implements OnInit {

  forma: FormGroup;

  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  @Input() paqueteTramite: PaqueteTramite;
  proveedoresSelected: ProveedorAdicional[] = [];
  proveedores: ProveedorAdicional[] = [];
  @ViewChild('marcaNgSelect') public marcaNgSelect: NgSelectComponent;
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  @ViewChild('tramiteNgSelect') public tramiteNgSelect: NgSelectComponent;
  @ViewChild('subtramiteNgSelect') public subtramiteNgSelect: NgSelectComponent;
  tramites: Tramite[];
  subtramites: Subtramite[];
  idTramite: string;
  idSubtramite: string;
  nombreTramite: string;
  nombreSubtramite: string;
  nombreProveedor: string;
  nombreSucursal: string;

  constructor(private brandService: BrandService,
    private toastrService: ToastrService,
    private tramiteService: TramiteCatalogService,
    private activeModal: NgbActiveModal) {
    this.forma = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required])
    });
  }

  isValidForm() {
    return this.forma.valid && this.paqueteTramite.tramites && this.paqueteTramite.tramites.length > 0;
  }

  ngOnInit() {
    this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => { this.marcas = dataMarcas; });
    if (this.paqueteTramite.idMarca != undefined) {
      this.marcasOnChange({ idMarca: this.paqueteTramite.idMarca });
    }
    if (this.paqueteTramite.idEmpresa != undefined) {
      this.empresasOnChange({ idEmpresa: this.paqueteTramite.idEmpresa, nombre: this.paqueteTramite.nombreEmpresa });
    }
    if (this.paqueteTramite.idSucursal != undefined) {
      this.sucursalesOnChange({ idSucursal: this.paqueteTramite.idSucursal, nombre: this.paqueteTramite.nombreSucursal });
    }
    this.disableEnableSelects();
  }

  marcasOnChange(marca: Marca) {
    if (marca == undefined) {
      return;
    }
    this.paqueteTramite.idMarca = marca.idMarca;
    this.empresaNgSelect.clearModel();
    this.empresas = [];
    this.sucursalNgSelect.clearModel();
    this.sucursales = [];
    this.tramiteNgSelect.clearModel();
    this.tramites = [];
    this.subtramiteNgSelect.clearModel();
    this.subtramites = [];
    this.proveedores = [];
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }
  empresasOnChange(empresa: Empresa) {
    this.sucursalNgSelect.clearModel();
    this.sucursales = [];
    this.tramiteNgSelect.clearModel();
    this.tramites = [];
    this.subtramiteNgSelect.clearModel();
    this.subtramites = [];
    this.proveedores = [];
    if (empresa == undefined) {
      return;
    }
    this.paqueteTramite.idEmpresa = empresa.idEmpresa;
    this.paqueteTramite.nombreEmpresa = empresa.nombre;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    this.tramiteNgSelect.clearModel();
    this.tramites = [];
    this.subtramiteNgSelect.clearModel();
    this.subtramites = [];
    this.proveedores = [];
    if (sucursal == undefined) {
      return;
    }
    this.paqueteTramite.idSucursal = sucursal.idSucursal;
    this.paqueteTramite.nombreSucursal = sucursal.nombre;
    this.nombreSucursal = sucursal.nombre;
    this.tramiteService.getTramites(this.paqueteTramite.idMarca, this.paqueteTramite.idSucursal).subscribe((data: Tramite[]) => { this.tramites = data; });
  }

  tramiteOnChange(tramite: Tramite) {
    this.subtramiteNgSelect.clearModel();
    this.subtramites = [];
    this.proveedores = [];
    if (tramite == undefined) {
      return;
    }
    this.idTramite = tramite.idTramite;
    this.nombreTramite = tramite.nombre;
    this.tramiteService.getSubtramites(this.paqueteTramite.idMarca, this.paqueteTramite.idSucursal, this.idTramite)
      .subscribe((data: Subtramite[]) => { this.subtramites = data; });
  }

  subtramiteOnChange(subtramite: Subtramite) {
    if (subtramite == undefined) {
      return;
    }
    this.idSubtramite = subtramite.idSubtramite;
    this.nombreSubtramite = subtramite.nombre;
    this.tramiteService.getProveedorSubtramite(this.paqueteTramite.idMarca, this.paqueteTramite.idSucursal, this.idSubtramite)
      .subscribe((data: ProveedorAdicional[]) => {
        this.proveedores = data;
      });
  }

  cancelar() {
    this.activeModal.dismiss(false);
  }

  agregarItem() {
    const aux = this.paqueteTramite.tramites;
    this.proveedoresSelected.map(item => {
      if (!this.paqueteTramite.tramites.some(det => det.idTramite == this.idTramite &&
        det.idSubtramite == this.idSubtramite &&
        det.idProveedor == item.idProveedor)) {
        const itemDet = {
          idEncPaqueteTramite: this.paqueteTramite.idEncPaqueteTramite,
          idTramite: this.idTramite,
          idSubtramite: this.idSubtramite.toString(),
          idProveedor: item.idProveedor,
          nombreTramite: this.nombreTramite,
          nombreSubtramite: this.nombreSubtramite,
          nombreProveedor: item.nombreCompleto,
          costo: item.costo,
          precio: item.precio
        } as DetallePaqueteTramite;
        aux.push(itemDet);
      }
    });
    this.paqueteTramite.tramites = [...aux];
    this.disableEnableSelects();
  }

  eliminarItem(detalle: DetallePaqueteTramite) {
    const aux = this.paqueteTramite.tramites.filter(item => {
      return (item.idTramite.toString() + '|' + item.idSubtramite.toString() + '|' + item.idProveedor) !=
        (detalle.idTramite.toString() + '|' + detalle.idSubtramite.toString() + '|' + detalle.idProveedor);
    });
    this.paqueteTramite.tramites = [...aux];
    this.disableEnableSelects();
  }

  private disableEnableSelects() {
    if (this.paqueteTramite.tramites.length == 0) {
      this.marcaNgSelect.disabled = false;
      this.empresaNgSelect.disabled = false;
      this.sucursalNgSelect.disabled = false;
      this.empresaNgSelect.clearable = true;
      this.sucursalNgSelect.clearable = true;
    } else {
      this.marcaNgSelect.disabled = true;
      this.empresaNgSelect.disabled = true;
      this.sucursalNgSelect.disabled = true;
      this.empresaNgSelect.clearable = false;
      this.sucursalNgSelect.clearable = false;
    }
    this.empresaNgSelect.detectChanges();
    this.sucursalNgSelect.detectChanges();
  }

  guardar() {
    this.tramiteService.savePaqueteTramite(this.paqueteTramite).subscribe(() => {
      this.activeModal.close(true);
    }, (httpError) => {
      const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
      this.toastrService.error(message, 'Paquete de trámites');
    });
  }

}
