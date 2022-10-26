import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Marca, Empresa, Sucursal, UnidadBpro, ServicioUnidad } from '../../../models';
import { OrdenesCatalogService, NewUnitsService, BrandService } from 'src/app/services';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaqueteServicio, DetallePaqueteServicio } from '../../../models';
import { DatatableComponent } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-crear-editar-paquete-servicio',
  templateUrl: './crear-editar-paquete-servicio.component.html',
  styleUrls: ['./crear-editar-paquete-servicio.component.scss']
})
export class CrearEditarPaqueteServicioComponent implements OnInit {
  forma: FormGroup;

  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  catalogos: UnidadBpro[];
  selectedAnio: any;
  rows: ServicioUnidad[];

  @Input() paqueteServicio: PaqueteServicio;

  @ViewChild('marcaNgSelectModal') public marcaNgSelectModal: NgSelectComponent;
  @ViewChild('empresaNgSelectModal') public empresaNgSelectModal: NgSelectComponent;
  @ViewChild('sucursalNgSelectModal') public sucursalNgSelectModal: NgSelectComponent;
  @ViewChild('catalogoNgSelectModal') public catalogoNgSelectModal: NgSelectComponent;
  @ViewChild('ngxDataTableModal') public ngxDataTableModal: DatatableComponent;

  servicios: UnidadBpro[];
  idServicio: string;
  nombreServicio: string;
  nombreSucursal: string;
  servicioSelected: ServicioUnidad[] = [];
  anio = new Date().getFullYear();

  constructor(private brandService: BrandService,
    private toastrService: ToastrService,
    private newUnitsService: NewUnitsService,
    private serviceUnit: OrdenesCatalogService,
    private activeModal: NgbActiveModal) {
    this.forma = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required]),
      anio: new FormControl(null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.minLength(4),
      Validators.maxLength(4)])
    });
  }

  isValidForm() {
    return this.forma.valid && this.paqueteServicio.serviciosUnidad && this.paqueteServicio.serviciosUnidad.length > 0;
  }

  ngOnInit() {
    this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => { this.marcas = dataMarcas; });
    if (this.paqueteServicio.idMarca != undefined) {
      this.marcasOnChange({ idMarca: this.paqueteServicio.idMarca });
    }
    if (this.paqueteServicio.idEmpresa != undefined) {
      this.empresasOnChange({ idEmpresa: this.paqueteServicio.idEmpresa, nombre: this.paqueteServicio.nombreEmpresa });
    }
    if (this.paqueteServicio.idSucursal != undefined) {
      this.sucursalesOnChange({ idSucursal: this.paqueteServicio.idSucursal, nombre: this.paqueteServicio.nombreSucursal });
    }
    if (this.paqueteServicio.catalogo != undefined) {
      this.catalogoOnChange({ idUnidadBpro: this.paqueteServicio.catalogo, linea: '' });
    }

    this.disableEnableSelects();
  }

  marcasOnChange(marca: Marca) {
    if (marca == undefined) {
      return;
    }
    this.paqueteServicio.idMarca = marca.idMarca;
    this.empresaNgSelectModal.clearModel();
    this.empresas = [];
    this.sucursalNgSelectModal.clearModel();
    this.sucursales = [];
    this.catalogoNgSelectModal.clearModel();
    this.catalogos = [];
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }
  empresasOnChange(empresa: Empresa) {
    this.sucursalNgSelectModal.clearModel();
    this.sucursales = [];
    this.catalogoNgSelectModal.clearModel();
    this.catalogos = [];

    if (empresa == undefined) {
      return;
    }
    this.paqueteServicio.idEmpresa = empresa.idEmpresa;
    this.paqueteServicio.nombreEmpresa = empresa.nombre;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    this.catalogoNgSelectModal.clearModel();
    this.catalogos = [];
    if (sucursal == undefined) {
      return;
    }
    this.paqueteServicio.idSucursal = sucursal.idSucursal;
    this.paqueteServicio.nombreSucursal = sucursal.nombre;
    this.nombreSucursal = sucursal.nombre;
    this.newUnitsService.getCatalogo(this.paqueteServicio.idEmpresa)
      .subscribe((data: UnidadBpro) => {
        this.catalogos = JSON.parse(JSON.stringify(data));
      });
  }

  catalogoOnChange(catalogo: UnidadBpro) {
    if (catalogo == undefined) {
      return;
    }
    this.paqueteServicio.catalogo = catalogo.idUnidadBpro;
  }
  search() {
    if (this.paqueteServicio.idSucursal === undefined || this.paqueteServicio.catalogo === undefined || this.selectedAnio === undefined) {
      this.toastrService.warning('Debe Completar todos los campos', 'INFORMACIÓN INCOMPLETA');
      return;
    } else {
      this.serviceUnit.getServicios(this.paqueteServicio.idSucursal, this.paqueteServicio.catalogo, this.selectedAnio)
        .subscribe((data: ServicioUnidad[]) => {
          this.rows = JSON.parse(JSON.stringify(data));
        });
    }
  }


  cancelar() {
    this.activeModal.dismiss(false);
  }

  agregarItem() {
    const aux = this.paqueteServicio.serviciosUnidad;
    let idEncPaqueteServTemp = null;
    if (this.paqueteServicio.idEncPaqueteServicioUnidad !== null) {
      idEncPaqueteServTemp = this.paqueteServicio.idEncPaqueteServicioUnidad;
    }
    this.servicioSelected.map(item => {
      const itemDetalle = {
        idEncPaqueteServicioUnidad: idEncPaqueteServTemp,
        idServicioUnidad: item.idServicioUnidad,
        catalogo: this.paqueteServicio.catalogo,
        anio: this.paqueteServicio.anio.toString(),
        nombre: item.nombre,
        descripcion: item.descripcion,
        costo: item.costo,
        precio: item.precio
      } as DetallePaqueteServicio;
      aux.push(itemDetalle);
    });
    this.paqueteServicio.serviciosUnidad = [...aux];
    this.disableEnableSelects();
    this.servicioSelected = [];
    this.ngxDataTableModal.selected = [];

  }

  eliminarItem(detalle: DetallePaqueteServicio) {
    let aux = this.paqueteServicio.serviciosUnidad;
    aux = aux.filter((ele) => {
      return ele !== detalle;
    });
    this.paqueteServicio.serviciosUnidad = [...aux];
    this.disableEnableSelects();
  }


  private disableEnableSelects() {
    if (this.paqueteServicio.serviciosUnidad.length == 0) {
      this.marcaNgSelectModal.disabled = false;
      this.empresaNgSelectModal.disabled = false;
      this.sucursalNgSelectModal.disabled = false;
      this.empresaNgSelectModal.clearable = true;
      this.sucursalNgSelectModal.clearable = true;
    } else {
      this.marcaNgSelectModal.disabled = true;
      this.empresaNgSelectModal.disabled = true;
      this.sucursalNgSelectModal.disabled = true;
      this.empresaNgSelectModal.clearable = false;
      this.sucursalNgSelectModal.clearable = false;
    }
    this.empresaNgSelectModal.detectChanges();
    this.sucursalNgSelectModal.detectChanges();
  }

  guardar() {
    this.paqueteServicio.anio = this.paqueteServicio.anio.toString();
    this.serviceUnit.savePaqueteServicio(this.paqueteServicio).subscribe(() => {
      this.activeModal.close(true);
    }, (httpError) => {
      const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
      this.toastrService.error(message, 'Paquete de trámites');
    });
  }
}
