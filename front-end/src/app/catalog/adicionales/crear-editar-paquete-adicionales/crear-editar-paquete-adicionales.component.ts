import { Component, OnInit, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { Marca, Empresa, Sucursal, PaquetesAdicionales, OtroAdicional, DetallePaqueteAdicionales, UnidadMedida, ProveedorAdicional } from 'src/app/models';
import { AdicionalCatalogService, BrandService } from 'src/app/services';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-editar-paquete-adicionales',
  templateUrl: './crear-editar-paquete-adicionales.component.html',
  styleUrls: ['./crear-editar-paquete-adicionales.component.scss']
})
export class CrearEditarPaqueteAdicionalesComponent implements OnInit {

  forma: FormGroup;
  validForm: boolean;
  marcas: Marca[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  @Input() paqueteAdicionales: PaquetesAdicionales;
  proveedoresSelected: ProveedorAdicional[] = [];
  proveedores: ProveedorAdicional[] = [];
  @ViewChild('marcaNgSelect') public marcaNgSelect: NgSelectComponent;
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  @ViewChild('nombreAdicional') public nombreAdicional: ElementRef;
  @ViewChild('descripcionAdicional') public descripcionAdicional: ElementRef;
  rows: OtroAdicional[];
  rowsFiltered: OtroAdicional[];
  searchNombre: string;
  conceptos: DetallePaqueteAdicionales[] = [];
  detalleTosend: any[];
  paquetesAdic: PaquetesAdicionales;
  unidadesMedidas: UnidadMedida[];
  nombreSucursal: string;

  constructor(private brandService: BrandService,
    private adicionalCatalogService: AdicionalCatalogService,
    private toastrService: ToastrService,
    public paqueteModal: NgbActiveModal) {
    this.forma = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required])
    });
  }

  isValidForm() {
    return this.forma.valid && this.paqueteAdicionales.conceptos && this.paqueteAdicionales.conceptos.length > 0;
  }

  ngOnInit() {
    this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => { this.marcas = dataMarcas; });
    if (this.paqueteAdicionales.idMarca != undefined) {
      this.marcasOnChange({ idMarca: this.paqueteAdicionales.idMarca });
    }
    if (this.paqueteAdicionales.idEmpresa != undefined) {
      this.empresasOnChange({ idEmpresa: this.paqueteAdicionales.idEmpresa, nombre: this.paqueteAdicionales.nombreEmpresa });
    }
    if (this.paqueteAdicionales.idSucursal != undefined) {
      this.sucursalesOnChange({ idSucursal: this.paqueteAdicionales.idSucursal, nombre: '' });
      this.search();
      this.conceptos = this.paqueteAdicionales.conceptos;
    }
    this.disableEnableSelects();
  }

  marcasOnChange(marca: Marca) {
    if (marca == undefined) {
      return;
    }
    this.paqueteAdicionales.idMarca = marca.idMarca;
    this.empresaNgSelect.clearModel();
    this.empresas = [];
    this.sucursalNgSelect.clearModel();
    this.sucursales = [];
    this.proveedores = [];
    this.brandService.getCompany(marca.idMarca).subscribe((data: Empresa[]) => { this.empresas = data; });
  }

  empresasOnChange(empresa: Empresa) {
    this.sucursalNgSelect.clearModel();
    this.sucursales = [];
    this.proveedores = [];
    if (empresa == undefined) {
      return;
    }
    this.paqueteAdicionales.idEmpresa = empresa.idEmpresa;
    this.paqueteAdicionales.nombreEmpresa = empresa.nombre;
    this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((data: Sucursal[]) => { this.sucursales = data; });
  }

  sucursalesOnChange(sucursal: Sucursal) {
    this.proveedores = [];
    if (sucursal == undefined) {
      return;
    }
    this.paqueteAdicionales.idSucursal = sucursal.idSucursal;
    this.nombreSucursal = sucursal.nombre;
    this.paqueteAdicionales.nombreSucursal = this.nombreSucursal;
    this.search();
  }

  umOnChange(unidadMedida: UnidadMedida) {
    if (!unidadMedida) {
      return;
    }
  }

  private disableEnableSelects() {
    if (this.paqueteAdicionales.conceptos.length == 0) {
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

  search() {
    this.adicionalCatalogService
      .getConceptos(this.paqueteAdicionales.idSucursal).subscribe((data: OtroAdicional[]) => {
        this.rows = data;
        this.rowsFiltered = JSON.parse(JSON.stringify(this.rows));
      });

    this.adicionalCatalogService
      .getUnidadesMedida(this.paqueteAdicionales.idSucursal).subscribe((unidadesMedidas: UnidadMedida[]) => {
        this.unidadesMedidas = unidadesMedidas;
      });
  }

  updateFilter(event: any) {
    if (!this.rows) { return []; }
    if (this.searchNombre === undefined) {
      this.rowsFiltered = this.rows;
    }
    this.rowsFiltered = this.rows.filter(otroAdicional => {
      return otroAdicional.nombre.toLowerCase().includes(this.searchNombre.toLowerCase());
    });
  }

  onSelect($event, row: OtroAdicional) {
    $event.preventDefault();
    const detalleAdicionales = new DetallePaqueteAdicionales();
    detalleAdicionales.idConcepto = row.idConcepto;
    detalleAdicionales.nombreConcepto = row.nombre;
    this.conceptos.push(detalleAdicionales);
    this.toastrService.success('Se agrego una nueva entrada para ser editada', 'Nueva Entrada');
  }

  removeItem(i: number) {
    this.conceptos.splice(i, 1);
  }


  saveAdicionales() {
    this.validForm = true;
    this.paqueteAdicionales.conceptos = [];
    this.conceptos.forEach(ele => {
      const itemDetalle = {
        idEncPaqueteConcepto: null,
        idConcepto: ele.idConcepto,
        nombreConcepto: ele.nombreConcepto,
        idUnidadMedida: ele.idUnidadMedida,
        nombreUnidadMedida: 'PIEZA',
        nombre: ele.nombre,
        costo: ele.costo,
        precio: ele.precio,
        idUsuarioModificacion: null,
        fechaModificacion: null,
      } as DetallePaqueteAdicionales;
      if (ele.precio < ele.costo || ele.precio === undefined) {
        this.validForm = false;
        this.toastrService.warning(`El precio de ${ele.nombreConcepto} no puede ser menor al costo`,
          'EL PRECIO NO PUEDE SER INFERIOR AL COSTRO');
        return;
      } else {
        this.paqueteAdicionales.conceptos.push(itemDetalle);
      }
    });

    if (!this.paqueteAdicionales.nombre) {
      this.toastrService.warning(`Debe especificar el nombre del paquete`, 'PAQUETE');
    } else if (!this.paqueteAdicionales.descripcion) {
      this.toastrService.warning(`Debe especificar descripcion del paquete`, 'PAQUETE');
    } else if (this.paqueteAdicionales.conceptos && !this.paqueteAdicionales.conceptos.length) {
      this.toastrService.warning(`Debe especificar los conceptos que componen el paquete`, 'CONCEPTOS');
    } else {
      this.adicionalCatalogService.saveConceptos(this.paqueteAdicionales).subscribe((res) => {
        this.toastrService.success('Se Creo un nuevo paquete');
        this.paqueteModal.close();
      });
    }

  }

}
