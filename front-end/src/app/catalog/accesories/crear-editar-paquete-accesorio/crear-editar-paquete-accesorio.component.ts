import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PaqueteAccesorios, Marca, Empresa, Sucursal, AccesorioNuevo, DetallePaqueteAccesorios } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { AccesorioCatalogService, BrandService } from '../../../services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { CrearEditarAccesorioComponent } from '../crear-editar-accesorio/crear-editar-accesorio.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-crear-editar-paquete-accesorio',
  templateUrl: './crear-editar-paquete-accesorio.component.html',
  styleUrls: ['./crear-editar-paquete-accesorio.component.scss']
})
export class CrearEditarPaqueteAccesorioComponent implements OnInit {

  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  buscarText = '';

  rows: AccesorioNuevo[];
  rowsFiltered: AccesorioNuevo[];
  accesoriosSelected: AccesorioNuevo[] = [];

  @Input() paqueteAccesorios: PaqueteAccesorios;

  @ViewChild('marcaNgSelectModal') public marcaNgSelectModal: NgSelectComponent;
  @ViewChild('empresaNgSelectModal') public empresaNgSelectModal: NgSelectComponent;
  @ViewChild('sucursalNgSelectModal') public sucursalNgSelectModal: NgSelectComponent;
  @ViewChild('ngxDataTableModal') public ngxDataTableModal: DatatableComponent;

  forma: FormGroup;

  constructor(
    private accesoriosService: AccesorioCatalogService,
    private toastrService: ToastrService,
    private brandService: BrandService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.forma = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => { this.marcas = dataMarcas; });
    if (this.paqueteAccesorios.idMarca != undefined) {
      this.marcasOnChange({ idMarca: this.paqueteAccesorios.idMarca });
    }
    if (this.paqueteAccesorios.idEmpresa != undefined) {
      this.empresasOnChange({ idEmpresa: this.paqueteAccesorios.idEmpresa, nombre: this.paqueteAccesorios.nombreEmpresa });
    }
    if (this.paqueteAccesorios.idSucursal != undefined) {
      this.sucursalesOnChange({ idSucursal: this.paqueteAccesorios.idSucursal, nombre: this.paqueteAccesorios.nombreSucursal });
      this.search();
    }

    this.disableEnableSelects();
  }

  marcasOnChange(marca: Marca) {
    if (marca == undefined) {
      return;
    }
    this.paqueteAccesorios.idMarca = marca.idMarca;
    this.empresaNgSelectModal.clearModel();
    this.empresas = [];
    this.sucursalNgSelectModal.clearModel();
    this.sucursales = [];
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }
  empresasOnChange(empresa: Empresa) {
    this.sucursalNgSelectModal.clearModel();
    this.sucursales = [];

    if (empresa == undefined) {
      return;
    }
    this.paqueteAccesorios.idEmpresa = empresa.idEmpresa;
    this.paqueteAccesorios.nombreEmpresa = empresa.nombre;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    if (sucursal == undefined) {
      return;
    }
    this.paqueteAccesorios.idSucursal = sucursal.idSucursal;
    this.paqueteAccesorios.nombreSucursal = sucursal.nombre;
  }

  isValidForm() {
    return this.forma.valid && this.paqueteAccesorios.accesorios && this.paqueteAccesorios.accesorios.length > 0;
  }

  search() {
    if (this.paqueteAccesorios.idSucursal === undefined) {
      this.toastrService.warning('Debe seleccionar una surucarl', 'Paquete de Accesorios');
      return;
    }
    forkJoin(
      this.accesoriosService.getAccesoriosBproSC(this.paqueteAccesorios.idMarca, this.paqueteAccesorios.idSucursal),
      this.accesoriosService.getAccesoriosNuevos(this.paqueteAccesorios.idSucursal)
    ).subscribe((res: any[]) => {
      this.rows = [];
      this.rowsFiltered = [];
      res[0].map(itemBpro => {
        this.rows.push(Object.assign(new AccesorioNuevo(), itemBpro));
        this.rowsFiltered.push(Object.assign(new AccesorioNuevo(), itemBpro));
      });
      res[1].map(itemBpro => {
        this.rows.push(Object.assign(new AccesorioNuevo(), itemBpro));
        this.rowsFiltered.push(Object.assign(new AccesorioNuevo(), itemBpro));
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
      this.rowsFiltered = this.rowsFiltered.sort((a: AccesorioNuevo, b: AccesorioNuevo) => {
        if (a.nombre > b.nombre) {
          return 1;
        }
        if (a.nombre < b.nombre) {
          return -1;
        }
        return 0;
      });
    });
  }

  eliminarItem(accesorios: DetallePaqueteAccesorios) {
    let aux = this.paqueteAccesorios.accesorios;
    aux = aux.filter((ele) => {
      return ele !== accesorios;
    });
    this.paqueteAccesorios.accesorios = [...aux];
    this.disableEnableSelects();
  }

  private disableEnableSelects() {
    if (this.paqueteAccesorios.accesorios.length == 0) {
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

  cancelar() {
    this.activeModal.close(false);
  }

  crearEditarAccesorio(accesorioNuevo: AccesorioNuevo = null) {
    const accesorioModal = this.modalService.open(CrearEditarAccesorioComponent, { size: 'lg' });
    if (accesorioNuevo == undefined) {
      accesorioNuevo = new AccesorioNuevo();
      accesorioNuevo.idMarca = this.paqueteAccesorios.idMarca;
      accesorioNuevo.idEmpresa = this.paqueteAccesorios.idEmpresa;
      accesorioNuevo.nombreEmpresa = this.paqueteAccesorios.nombreEmpresa;
      accesorioNuevo.idSucursal = this.paqueteAccesorios.idSucursal;
      accesorioNuevo.nombreSucursal = this.paqueteAccesorios.nombre;
    }
    accesorioModal.componentInstance.accesorioNuevo = accesorioNuevo;
    accesorioModal.result.then(wasSaved => {
      if (wasSaved) {
        this.toastrService.success('Accesorio guardado correctamente', 'Accesorios');
        if (this.paqueteAccesorios.idSucursal != undefined) {
          this.search();
          this.updateFilter();
        }
      }
    });
  }
  updateFilter() {
    this.rowsFiltered = this.rows.filter(r => {
      return JSON.stringify(r).toLowerCase().indexOf(this.buscarText.toLowerCase()) >= 0;
    });
  }

  getRowClass(accesorioNuevo: AccesorioNuevo) {
    if (accesorioNuevo.esNuevo) {
      return { 'row-orange': true };
    }
  }

  setValueCantidad(event, row) {
    row.cantidad = event;
  }

  agregarItem() {
    const aux = this.paqueteAccesorios.accesorios;
    this.accesoriosSelected.map(item => {
      const itemDetalle = Object.assign(new DetallePaqueteAccesorios(), {
        idEncPaqueteAccesorio: this.paqueteAccesorios.idEncPaqueteAccesorio,
        idDetPaqueteAccesorio: null,
        idAccesorioNuevo: item.idAccesorioNuevo,
        nombre: item.nombre,
        idTipoProveedor: item.idTipoProveedor,
        idProveedor: item.idProveedor,
        nombreProveedor: item.nombreProveedor,
        idParte: item.idParte,
        modeloAnio: item.modeloAnio,
        costo: item.costo,
        cantidad: item.cantidad,
        precio: item.precio,
        idUsuario: null,
        fechaModificacion: null
      }) as DetallePaqueteAccesorios;
      if (!aux.some(a => a.id == itemDetalle.id)) {
        aux.push(itemDetalle);
      }
    });
    this.paqueteAccesorios.accesorios = [...aux];
    this.disableEnableSelects();
    this.accesoriosSelected = [];
    this.ngxDataTableModal.selected = [];
  }

  guardar() {
    this.accesoriosService.savePaqueteAccesorios(this.paqueteAccesorios).subscribe(() => {
      this.activeModal.close(true);
    }, (httpError) => {
      const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
      this.toastrService.error(message, 'Paquete de Accesorios');
    });
  }

}
