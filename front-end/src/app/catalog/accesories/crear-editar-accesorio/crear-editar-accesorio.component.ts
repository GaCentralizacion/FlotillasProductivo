import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Marca, Empresa, Sucursal, AccesorioNuevo, TipoProveedor, Proveedor } from '../../../models';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrandService, ProviderCatalogService, AccesorioCatalogService } from '../../../services';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { DireccionFlotillaSelectComponent } from 'src/app/shared/direccion-flotilla-select/direccion-flotilla-select.component';

@Component({
  selector: 'app-crear-editar-accesorio',
  templateUrl: './crear-editar-accesorio.component.html',
  styleUrls: ['./crear-editar-accesorio.component.scss']
})
export class CrearEditarAccesorioComponent implements OnInit {

  forma: FormGroup;
  @ViewChild(DireccionFlotillaSelectComponent) flotillaSelect: DireccionFlotillaSelectComponent;

  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  tiposProveedor: TipoProveedor[];
  proveedores: Proveedor[];
  @Input() accesorioNuevo: AccesorioNuevo;
  @ViewChild('marcaNgSelect') public marcaNgSelect: NgSelectComponent;
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;

  constructor(private brandService: BrandService,
    private activeModal: NgbActiveModal,
    private accesorioService: AccesorioCatalogService,
    private proveedorService: ProviderCatalogService,
    private toastrService: ToastrService) {
    this.forma = new FormGroup({
      nombre: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      anioModelo: new FormControl(null, [Validators.maxLength(200)]),
      costo: new FormControl(null, [Validators.required]),
      precio: new FormControl(null, [Validators.required]),
    });
  }

  isValidForm() {
    return this.forma.valid
      && this.accesorioNuevo.costo >= 0
      && this.accesorioNuevo.precio >= 0
      && this.accesorioNuevo.costo <= this.accesorioNuevo.precio
      && this.accesorioNuevo.idSucursal != undefined
      && this.accesorioNuevo.idProveedor != undefined;
  }

  ngOnInit() {
    this.tiposProveedor = this.proveedorService.getProviderTypes();
    this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => { this.marcas = dataMarcas; });
    if (this.accesorioNuevo.idMarca != undefined) {
      this.marcasOnChange({ idMarca: this.accesorioNuevo.idMarca });
    }
    if (this.accesorioNuevo.idEmpresa != undefined) {
      this.empresasOnChange({ idEmpresa: this.accesorioNuevo.idEmpresa, nombre: this.accesorioNuevo.nombreEmpresa });
    }
    if (this.accesorioNuevo.idSucursal != undefined) {
      this.sucursalesOnChange({ idSucursal: this.accesorioNuevo.idSucursal, nombre: this.accesorioNuevo.nombreSucursal });
    }
    if (this.accesorioNuevo.idTipoProveedor != undefined) {
      this.tipoProveedorOnChange({ idTipoProveedor: this.accesorioNuevo.idTipoProveedor, nombre: '' });
    }
    if (this.accesorioNuevo.idProveedor != undefined) {
      this.proveedorChange(Object.assign(new Proveedor()
        , { idProveedor: this.accesorioNuevo.idProveedor, nombreCompleto: this.accesorioNuevo.nombreProveedor }));
    }
    if (this.accesorioNuevo.idDireccionFlotillas != undefined) {
      setTimeout( () => {
        this.flotillaSelect.setDireccion(this.accesorioNuevo.idDireccionFlotillas);
      }, 100);
    }
  }

  cancelar() {
    this.activeModal.close(false);
  }

  marcasOnChange(marca: Marca) {
    if (marca == undefined) {
      return;
    }
    this.accesorioNuevo.idMarca = marca.idMarca;
    this.empresaNgSelect.clearModel();
    this.empresas = [];
    this.sucursalNgSelect.clearModel();
    this.sucursales = [];
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }

  empresasOnChange(empresa: Empresa) {
    this.sucursalNgSelect.clearModel();
    this.sucursales = [];
    if (empresa == undefined) {
      return;
    }
    this.accesorioNuevo.idEmpresa = empresa.idEmpresa;
    this.accesorioNuevo.nombreEmpresa = empresa.nombre == '' ? this.accesorioNuevo.nombreEmpresa : empresa.nombre;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    if (sucursal == undefined) {
      return;
    }
    this.accesorioNuevo.idSucursal = sucursal.idSucursal;
    this.accesorioNuevo.nombreSucursal = sucursal.nombre == '' ? this.accesorioNuevo.nombreSucursal : sucursal.nombre;
    if (this.accesorioNuevo.idTipoProveedor != undefined) {
      this.tipoProveedorOnChange({ idTipoProveedor: this.accesorioNuevo.idTipoProveedor, nombre: '' });
    }
  }

  tipoProveedorOnChange(tipoProveedor: TipoProveedor) {
    this.accesorioNuevo.idTipoProveedor = tipoProveedor.idTipoProveedor;
    if (this.accesorioNuevo.idSucursal == undefined) {
      this.toastrService.warning('Debe seleccionar una sucursal', 'Nuevo Accesorio');
      return;
    }
    this.proveedorService.getProviders(this.accesorioNuevo.idSucursal, this.accesorioNuevo.idTipoProveedor)
      .subscribe((data: Proveedor[]) => {
        this.proveedores = data.sort((a: Proveedor, b: Proveedor) => {
          if (a.nombreCompleto > b.nombreCompleto) {
            return 1;
          }
          if (a.nombreCompleto < b.nombreCompleto) {
            return -1;
          }
          return 0;
        });
      });
  }

  proveedorChange(proveedor: Proveedor) {
    if (proveedor == undefined) {
      this.accesorioNuevo.nombreProveedor = null;
      this.accesorioNuevo.idProveedor = null;
      return;
    }
    this.accesorioNuevo.nombreProveedor = proveedor.nombreCompleto;
    this.accesorioNuevo.idProveedor = proveedor.idProveedor;
  }

  guardar() {
    this.accesorioNuevo.idDireccionFlotillas = (this.flotillaSelect.direccionSelected.idDireccionFlotilla) ?
    this.flotillaSelect.direccionSelected.idDireccionFlotilla : this.flotillaSelect.direccionSelected.name;
    this.accesorioService.saveAccesorioNuevo(this.accesorioNuevo).subscribe(() => {
      this.activeModal.close(true);
    }, (httpError) => {
      const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
      this.toastrService.error(message, 'Paquete de trámites');
    });
  }
}





