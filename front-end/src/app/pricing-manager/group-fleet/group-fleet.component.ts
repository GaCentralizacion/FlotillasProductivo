import { Component, OnInit, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { BrandService } from 'src/app/services/brand.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cotizacion, Licitacion } from '../../models';
import { Router, ActivatedRoute } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Marca, Empresa, Sucursal } from 'src/app/models';
import { Condicion } from 'src/app/models/condicion.model';
import { Financiera } from 'src/app/models/financiera.model';
import { PricingService } from 'src/app/services';
import { id } from '@swimlane/ngx-datatable/release/utils';
import { ToastrService } from 'ngx-toastr';
import { PricingManagerService } from '../pricing.manager.service';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-group-fleet',
  templateUrl: './group-fleet.component.html',
  styleUrls: ['./group-fleet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupFleetComponent implements OnInit, OnChanges {

  @Input() clienteIn: any = {};
  @Input() marcaIn: any = {};
  @Input() cotizacionesIn: Cotizacion[];
  @Input() licitacionIn: string;
  @ViewChild('fmarcaNgSelect') public fmarcaNgSelect: NgSelectComponent;
  @ViewChild('fempresaNgSelect') public fempresaNgSelect: NgSelectComponent;
  @ViewChild('fsucursalNgSelect') public fsucursalNgSelect: NgSelectComponent;
  @ViewChild('fcondicionNgSelect') public fcondicionNgSelect: NgSelectComponent;
  @ViewChild('ffinancieraNgSelect') public ffinancieraNgSelect: NgSelectComponent;

  currentArray = [1];

  empresasIn: any;
  financierasIn: any;
  condicionesIn: any;
  sucursalesIn: any;

  selectedMarca: string;
  selectedUnidades: string;
  selectedEmpresa: string;
  selectedSucursal: string;
  selectedCondicion: string;
  selectedFinanciera: string;
  selectedTipoVenta: string;
  selectedMoneda: string;
  selectedIva: string;

  idMarca: string;
  idEmpresa: number;
  nombreEmpresa: string;
  idSucursal: number;
  nombreSucursal: string;
  idTipoVenta: string;
  nombreTipoVenta: string;
  idMonedaVenta: string;
  nombreMoneda: string;
  idIva: string;
  nombreIva: string;
  idFinanciera: string;
  nombreFinanciera: string;
  idCondicion: string;
  nombreCondicion: string;

  flotillasItems: any = [];
  tiposVenta: any = [];
  monedas: any = [];
  ivas: any = [];
  form: FormGroup;
  idDireccionFlotillas: string;
  idUsuario: number;
  idLicitacion: string;
  step: number;
  idCotizacion: string;
  onlyRead = false;

  constructor(private brandService: BrandService,
    private pricingService: PricingService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public pricingManagerService: PricingManagerService,
    private scrollToService: ScrollToService) { }

  ngOnChanges() {
    this.idLicitacion = this.licitacionIn;
    if (this.flotillasItems.length <= this.cotizacionesIn.length && !this.onlyRead) {
      this.flotillasItems = [];
      this.cotizacionesIn.map(ele => {
        const selectedTasa = this.ivas.find(i => i.idIva == this.idIva);
        const item = {
          idCotizacion: { id: ele.idCotizacion, state: true },
          selectedMarca: { id: ele.idMarca, nombre: ele.idMarca },
          selectedUnidades: { id: ele.unidades, nombre: ele.unidades },
          selectedEmpresa: { id: ele.idEmpresa, nombre: ele.nombreEmpresa },
          selectedSucursal: { id: ele.idSucursal, nombre: ele.nombreSucursal },
          selectedCondicion: { id: ele.idCondicion, nombre: ele.nombreCondicion },
          selectedFinanciera: { id: ele.idFinanciera, nombre: ele.nombreFinanciera },
          selectedTipoVenta: { id: ele.idTipoVenta, nombre: ele.nombreTipoVenta},
          selectedMoneda: {id: ele.idMonedaVenta, nombre: ele.nombreMoneda },
          selectedIva: {id: ele.idIva, nombre: ele.nombreIva},
          selectedTasa: {id: selectedTasa.id, nombre: selectedTasa.tasa}
        };
        this.flotillasItems.push(item);
      });
    }
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      marca: [null, Validators.required],
      unidades: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      empresa: [null, Validators.required],
      sucursal: [null, Validators.required],
      condicion: [null, Validators.required],
      financiera: [null, Validators.required],
      venta: [null, Validators.required],
      moneda: [null, Validators.required],
      iva: [null, Validators.required],
    });

    this.getParams();

    this.condicionesIn = [
      { idCondicion: 'C0', nombre: 'CREDITO' },
      { idCondicion: 'C1', nombre: 'CONTADO' }
    ];
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      this.idDireccionFlotillas = params.idFlotilla;
      this.idUsuario = params.idUsuario;
      this.idLicitacion = params.idLicitacion;
      this.idCotizacion = params.idCotizacion;
      this.step = params.step;
    });
  }

  getCotizacion(event: any, item: any) {
    event.preventDefault();

    this.getParams();

    this.router.navigate(['main/cotizaciones/manager/unidades'], {
      queryParams: {
        idCotizacion: item.idCotizacion.id,
        idLicitacion: this.idLicitacion,
        idFlotilla: this.idDireccionFlotillas,
        idUsuario: this.idUsuario,
        step: this.step
      }
    });
  }

  setCotizaciones(cotizaciones: Cotizacion[]) {
    this.onlyRead = true;
    cotizaciones.forEach( ele => {
      const item = {
      idCotizacion: { id: ele.idCotizacion, state: true },
      selectedMarca: { id: ele.idMarca, nombre: ele.idMarca },
      selectedUnidades: { id: ele.unidades, nombre: ele.unidades },
      selectedEmpresa: { id: ele.idEmpresa, nombre: ele.nombreEmpresa },
      selectedSucursal: { id: ele.idSucursal, nombre: ele.nombreSucursal },
      selectedCondicion: { id: ele.idCondicion, nombre: ele.nombreCondicion },
      selectedFinanciera: { id: ele.idFinanciera, nombre: ele.nombreFinanciera },
      selectedTipoVenta: { id: ele.idTipoVenta, nombre: ele.nombreTipoVenta},
      selectedMoneda: {id: ele.idMonedaVenta, nombre: ele.nombreMoneda },
      selectedIva: {id: ele.idIva, nombre: ele.nombreIva},
      selectedTasa: {id: '', nombre: ''}
      };
      this.flotillasItems.push(item);
  });
}

  marcasOnChange(marca: Marca) {
    this.idMarca = marca.idMarca;
    this.brandService.getCompany(marca.idMarca).subscribe((data) => { this.empresasIn = data; });
    this.fempresaNgSelect.clearModel();
    this.fsucursalNgSelect.clearModel();
    this.fcondicionNgSelect.clearModel();
    this.ffinancieraNgSelect.clearModel();
  }

  empresasOnChange(empresa: Empresa) {
    if (empresa !== undefined) {
      this.idEmpresa = empresa.idEmpresa;
      this.nombreEmpresa = empresa.nombre;
      this.brandService.getBranchOffice(empresa.idEmpresa).subscribe(data => { this.sucursalesIn = data; });
    }
    this.fsucursalNgSelect.clearModel();
    this.fcondicionNgSelect.clearModel();
    this.ffinancieraNgSelect.clearModel();
  }

  sucursalesOnChange(sucursal: Sucursal) {
    this.financierasIn = [];
    if (sucursal !== undefined) {
      this.idSucursal = sucursal.idSucursal;
      this.nombreSucursal = sucursal.nombre;
      this.brandService.getFinancial(sucursal.idSucursal).subscribe((data) => { this.financierasIn = data; });
      this.pricingService.getMonedasVenta(sucursal.idSucursal).subscribe((data) => { this.monedas = data; });
      this.pricingService.getTiposVentas(sucursal.idSucursal, this.idDireccionFlotillas).subscribe((data) => {
        this.tiposVenta = data;
        this.tiposVenta.forEach( item => {
          item.label = item.nombre + '-' + item.tipo;
        });
      });
      this.pricingService.getIvas(sucursal.idSucursal).subscribe((data) => { this.ivas = data; });
    }
    this.fcondicionNgSelect.clearModel();
    this.ffinancieraNgSelect.clearModel();
  }

  condicionesOnChange(condicion: Condicion) {
    if (condicion !== undefined) {
      this.idCondicion = condicion.idCondicion;
      this.nombreCondicion = condicion.nombre;
    }
    this.ffinancieraNgSelect.clearModel();
  }

  financierasOnChange(financiera: Financiera) {
    if (financiera !== undefined) {
      this.idFinanciera = financiera.idFinanciera;
      this.nombreFinanciera = financiera.nombre;
    }
  }

  monedaOnChange(moneda) {
    if (moneda !== undefined) {
      this.idMonedaVenta = moneda.idMonedaVenta;
      this.nombreMoneda = moneda.nombre;
    }
  }

  ivaOnChange(iva) {
    if (iva !== undefined) {
      this.idIva = iva.idIva;
      this.nombreIva = iva.nombre;
    }
  }

  ventaOnChange(venta) {
    if (venta !== undefined) {
      this.idTipoVenta = venta.idTipoVenta;
      this.nombreTipoVenta = venta.nombre;
    }
  }


  addItem() {
    this.pricingService.checkLicitacion(this.idLicitacion).subscribe((licitacion: Licitacion) => {
      if (licitacion.existeLicitacion && this.idCotizacion == undefined) {
        this.toastrService.warning(`No se puede duplicar un numero de licitacion, el numero de licitación ${this.idLicitacion}
          se encuentra en uso`, `ERROR LICITACION EXISTE`);
      } else {
        this.idCotizacion = '';
        const selectedTasa = this.ivas.find(i => i.idIva == this.idIva);
        const item = {
          idCotizacion: { id: null, state: false },
          selectedMarca: { id: this.idMarca, nombre: this.idMarca },
          selectedUnidades: { id: this.selectedUnidades, nombre: this.selectedUnidades },
          selectedEmpresa: { id: this.idEmpresa, nombre: this.nombreEmpresa },
          selectedSucursal: { id: this.idSucursal, nombre: this.selectedSucursal },
          selectedCondicion: { id: this.idCondicion, nombre: this.nombreCondicion },
          selectedFinanciera: { id: this.idFinanciera, nombre: this.nombreFinanciera },
          selectedTipoVenta: { id: this.idTipoVenta, nombre: this.nombreTipoVenta},
          selectedMoneda: {id: this.idMonedaVenta, nombre: this.nombreMoneda },
          selectedIva: {id: this.idIva, nombre: this.nombreIva},
          selectedTasa: {id: selectedTasa.id, nombre: selectedTasa.tasa}
        };
        this.flotillasItems.push(item);
        this.currentArray = [];
        this.form.reset();
      }
    });
  }

  removeItem(index: number) {
    this.flotillasItems.splice(index, 1);
  }

  addArray() {
    if (this.currentArray.length === 0) {
      this.currentArray.push(1);
    }
  }

  public triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      offset:  -440
    };
    this.scrollToService.scrollTo(config);
  }

  focusSelect() {
    const config: ScrollToConfigOptions = {
      offset:  240,
      target: 'tableUnit'
    };
    this.scrollToService.scrollTo(config);
  }

}
