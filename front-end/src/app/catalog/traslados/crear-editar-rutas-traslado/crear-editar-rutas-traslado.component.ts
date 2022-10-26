import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BrandService, TrasladosCatalogService, ProviderCatalogService } from '../../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UbicacionTraslado, Traslado, Marca, Empresa, Sucursal, UnidadBpro, Proveedor } from '../../../models';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-editar-rutas-traslado',
  templateUrl: './crear-editar-rutas-traslado.component.html',
  styleUrls: ['./crear-editar-rutas-traslado.component.scss']
})
export class CrearEditarRutasTrasladoComponent implements OnInit {
  form: FormGroup;
  @ViewChild('origenNgSelect ') public origenNgSelect: NgSelectComponent;
  @ViewChild('destinoNgSelect') public destinoNgSelect: NgSelectComponent;

  @ViewChild('marcaNgSelectModal') public marcaNgSelectModal: NgSelectComponent;
  @ViewChild('empresaNgSelectModal') public empresaNgSelectModal: NgSelectComponent;
  @ViewChild('sucursalNgSelectModal') public sucursalNgSelectModal: NgSelectComponent;
  @ViewChild('proveedorNgSelectModal') public proveedorNgSelectModal: NgSelectComponent;

  ubicacionesTraslado: UbicacionTraslado[];
  rutas: Traslado[];
  selectedIdTraslado: number;
  idLugarOrigen: number;
  nombreLugarOrigen: string;
  idLugarDestino: number;
  nombreLugarDestino: string;
  idMarca: string;
  idEmpresa: number;
  idSucursal: number;
  idProveedor: number;
  nombreProveedor: string;
  selectedCosto: number;
  selectedPrecio: number;
  idEliminar: number;
  nombreEliminar: string;
  idOrigen: number;
  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  proveedores: Proveedor[];
  constructor(
    private brandService: BrandService,
    private providerCatalogService: ProviderCatalogService,
    private toastrService: ToastrService,
    private trasladoService: TrasladosCatalogService,
    private modalService: NgbModal) {
    this.form = new FormGroup({
      marca: new FormControl(null, [Validators.required]),
      empresa: new FormControl(null, [Validators.required]),
      sucursal: new FormControl(null, [Validators.required]),
      proveedor: new FormControl(null, [Validators.required]),
      origen: new FormControl(null, [Validators.required]),
      destino: new FormControl(null, [Validators.required]),
      costo: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      precio: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
  }

  private autoLoadSelects() {
    this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => { this.marcas = dataMarcas; });
    if (this.idMarca != undefined) {
      this.marcasOnChange({ idMarca: this.idMarca }, true).then((isMarcaLoaded: boolean) => {
        if (isMarcaLoaded) {
          if (this.idEmpresa != undefined) {
            this.empresasOnChange({ idEmpresa: this.idEmpresa, nombre: null }, true).then((isEmpresaLoaded: boolean) => {
              if (this.idSucursal != undefined) {
                this.sucursalesOnChange({ idSucursal: this.idSucursal, nombre: null }, true).then((isSucursalLoaded: boolean) => {
                  if (this.idProveedor != undefined) {
                    const proveedor = new Proveedor();
                    proveedor.idProveedor = this.idProveedor;
                    this.proveedoresOnChange(proveedor);
                  }
                })
              }
            });
          }
        }
      });
    }
  }

  ngOnInit() {
    this.autoLoadSelects();
    this.trasladoService.getUbicacionTraslados().subscribe((ubicacionesTraslado: UbicacionTraslado[]) => {
      this.ubicacionesTraslado = ubicacionesTraslado;
    }, (error) => {
      this.toastrService.error(`se produjo un error al iniciar la pantalla precione F5 para volver a cargar la pantalla
      si el problema persiste contante al personal tecnico`, `ERROR AL INICIAR LA PANTALLA`);
    });

    this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
      this.rutas = rutas;
    }, (error) => {
      this.toastrService.error(`se produjo un error al iniciar la pantalla precione F5 para volver a cargar la pantalla
      si el problema persiste contante al personal tecnico`, `ERROR AL INICIAR LA PANTALLA`);
    });
  }

  marcasOnChange(marca: Marca, preselected = false): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (marca == undefined) {
        resolve(false);
        return;
      }
      this.idMarca = marca.idMarca;
      if (!preselected) {
        this.empresaNgSelectModal.clearModel();
        this.sucursalNgSelectModal.clearModel();
        this.proveedorNgSelectModal.clearModel();
      }
      this.empresas = [];
      this.sucursales = [];
      this.proveedores = [];
      this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; resolve(true); });
    });
  }
  empresasOnChange(empresa: Empresa, preselected = false): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!preselected) {
        this.sucursalNgSelectModal.clearModel();
        this.proveedorNgSelectModal.clearModel();
      }
      this.sucursales = [];
      this.proveedores = [];

      if (empresa == undefined) {
        resolve(false);
        return;
      }
      this.idEmpresa = empresa.idEmpresa;
      this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; resolve(true); });
    });
  }

  sucursalesOnChange(sucursal: Sucursal, preselected = false): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!preselected) {
        this.proveedorNgSelectModal.clearModel();
      }
      this.proveedores = [];
      if (sucursal == undefined) {
        resolve(false);
        return;
      }
      this.idSucursal = sucursal.idSucursal;
      this.providerCatalogService.getProviders(this.idSucursal, 'PROTRAS').subscribe((proveedores: Proveedor[]) => {
        this.proveedores = proveedores;
        resolve(true);
      });
    });
  }

  proveedoresOnChange(proveedor: Proveedor): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!proveedor) {
        this.idProveedor = null;
        resolve(false);
        return;
      }
      this.idProveedor = proveedor.idProveedor;
      this.nombreProveedor = proveedor.nombreCompleto;
      if (!this.nombreProveedor) {
        const proveedorSeleccionado = this.proveedores.find(p => p.idProveedor == proveedor.idProveedor);
        if (proveedorSeleccionado) {
          this.nombreProveedor = proveedorSeleccionado.nombreCompleto;
        }
      }
      resolve(true);
    });
  }


  origenOnChange(origen: UbicacionTraslado) {
    this.destinoNgSelect.clearModel();
    if (!origen) {
      return;
    }
    this.idLugarOrigen = origen.idUbicacionTraslado;
    this.nombreLugarOrigen = origen.nombre;
  }

  destinoOnChange(destino: UbicacionTraslado) {
    if (!destino) {
      return;
    }
    this.idLugarDestino = destino.idUbicacionTraslado;
    this.nombreLugarDestino = destino.nombre;
  }

  saveRuta() {
    const rutaTosave: Traslado[] = [];
    const item = {
      idTraslado: this.selectedIdTraslado,
      idUbicacionOrigen: this.idLugarOrigen,
      idUbicacionDestino: this.idLugarDestino,
      costoUnitario: this.selectedCosto,
      precioUnitario: this.selectedPrecio,
      ubicacionOrigen: null,
      ubicacionDestino: null,
      idMarca: this.idMarca,
      idEmpresa: this.idEmpresa,
      idSucursal: this.idSucursal,
      idProveedor: this.idProveedor,
      nombreProveedor: this.nombreProveedor,
      utilidadTotal: 0,
      activo: true
    };
    rutaTosave.push(item);
    this.trasladoService.saveTraslados(rutaTosave).subscribe((res) => {
      this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
        this.rutas = rutas;
      }, (error) => {
        this.toastrService.error(`se produjo un error al actualizar la pantalla precione F5 para volver a cargar la pantalla
        si el problema persiste contante al personal tecnico`, `ERROR AL ALTUALIZAR LA PANTALLA`);
      });
      this.toastrService.success(`Se guardo un nueva ruta`, ` SE ALMACENO UNA NUEVA RUTA`);
      this.form.reset();
      this.selectedIdTraslado = null;
    });
  }

  editTraslado(event, traslado: Traslado) {
    event.preventDefault();
    if (traslado) {
      const origenesSeleccionados = this.ubicacionesTraslado.find(ut => {
        return ut.idUbicacionTraslado == traslado.idUbicacionOrigen;
      });
      if (origenesSeleccionados != undefined) {
        this.origenOnChange(origenesSeleccionados);
      }

      const destinoSeleccionado = this.ubicacionesTraslado.find(ut => {
        return ut.idUbicacionTraslado == traslado.idUbicacionDestino;
      });
      if (destinoSeleccionado != undefined) {
        this.destinoOnChange(destinoSeleccionado);
      }
      this.selectedIdTraslado = traslado.idTraslado;
      this.selectedCosto = traslado.costoUnitario;
      this.selectedPrecio = traslado.precioUnitario;
      this.idMarca = traslado.idMarca;
      this.idEmpresa = traslado.idEmpresa;
      this.idSucursal = traslado.idSucursal;
      this.idProveedor = traslado.idProveedor;
      this.autoLoadSelects();
    }
    this.toastrService.success(`Ha seleccionado la ruta ${traslado.ubicacionOrigen.nombre} - ${traslado.ubicacionDestino.nombre},
    edite en el formulario de la parte superior`,
      `EDICIÓN DE RUTA`);
  }

  openModalDelete(event, deleteTemplate: any, traslado: Traslado) {
    event.preventDefault();
    this.nombreEliminar = traslado.ubicacionOrigen.nombre + ' - ' + traslado.ubicacionDestino.nombre;
    this.idEliminar = traslado.idTraslado;
    this.modalService.open(deleteTemplate, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  deleteTraslados() {
    this.trasladoService.deleteTraslados(this.idEliminar).subscribe((res) => {
      this.toastrService.success(`Se eleminiro la ruta ${this.nombreEliminar} de manera satisfactoria`,
        `ELIMINADA RUTA ${this.nombreEliminar}`);
      this.modalService.dismissAll('Archivo Eliminado');
      this.trasladoService.getTraslados().subscribe((traslados: Traslado[]) => {
        this.rutas = traslados;
      });
    }, (err) => {
      this.toastrService.error(`Se produjo un error al intenar eliminar ${this.nombreEliminar} si el problema persiste
      contante al personal técnico`,
        `ERRROR ${this.nombreEliminar}`);
    });
  }
}
