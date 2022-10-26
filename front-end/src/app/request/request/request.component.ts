import { Unidad } from './../../models/unidad.model';
import { Cotizacion, GrupoUnidades } from './../../models/cotizacion.model';
import { AssignComponent } from './../assign/assign.component';
import { AlertComponentComponent } from './../../shared/alert-component/alert-component.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SelectionType } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Cfdi, Condicion, Empresa, Financiera, Marca, Sucursal } from 'src/app/models';
import { BrandService, ClientCatalogService, NewUnitsService, PricingService } from 'src/app/services';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { DireccionFlotillaSelectComponent } from 'src/app/shared/direccion-flotilla-select/direccion-flotilla-select.component';
import { DireccionFlotillasSelectService } from 'src/app/shared/direccion-flotilla-select/direccion-flotillas-select.service';
import { OrderComponent } from '../order/order.component';
import { VehiculoFormModalComponent } from '../vehiculo-form-modal/vehiculo-form-modal.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  form: FormGroup;
  flotillas = [];
  clientes = [];
  clientesFinales = [];
  clientesFacturar = [];
  marcas: Marca[] = [];
  empresas: Empresa[] = [];
  sucursales: Sucursal[] = [];
  catalogos = [];
  years = [];
  versiones = [];
  interiorColors = [];
  exteriorColors = [];
  clases = [];
  modelos = [];
  vehiculos = [];

  @ViewChild('tabset') public tabset: any;
  @ViewChild('clienteNgSelect') public clienteNgSelect: NgSelectComponent;
  @ViewChild('filtroNgSelect') public filtroNgSelect: NgSelectComponent;
  @ViewChild('clienteFinalSelected') public clienteFinalSelected: NgSelectComponent;
  @ViewChild('clienteFacturarSelected') public clienteFacturarSelected: NgSelectComponent;
  @ViewChild(DireccionFlotillaSelectComponent) dirFlotillas: DireccionFlotillaSelectComponent;
  @ViewChild('condicionNgSelect') public condicionNgSelect: NgSelectComponent;
  @ViewChild('financieraNgSelect') public financieraNgSelect: NgSelectComponent;
  @ViewChild('monedaNgSelect') public monedaNgSelect: NgSelectComponent;
  @ViewChild('cfdiNgSelect') public cfdiNgSelect: NgSelectComponent;

  cantidad = '';
  SelectionType = SelectionType;
  selected: any;
  entregas = [];
  filtros = [{ "text": "ID", "value": "idCliente" }, { "text": "Nombre", "value": "nombreCompleto" }, { "text": "RFC", "value": "RFC" }];
  totalFacturadas = 0;
  currentIdFlotilla = '';
  idCliente = '';
  nombreCliente = '';
  filter: any;
  isLoadingCliente = false;
  isLoadingClienteFinal = false;
  subscribeIdFlotila: any;
  solicitudCotizacion: any;
  idSolicitudCotizacion: number;
  showForm: boolean;
  formFacturar: FormGroup;
  showFormFacturar: boolean;
  condiciones = [{ idCondicion: 'C0', nombre: 'CREDITO' },
  { idCondicion: 'C1', nombre: 'CONTADO' }];
  financieras = [];
  cfdi = [];
  tiposVenta = [];
  monedas = [];
  ivas = [];
  idSucursal: number;
  nombreSucursal: string;

  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  nombreCondicion: any;
  idCondicion: any;
  idFinanciera: string;
  nombreFinanciera: string;
  nombreCfdi: any;
  tasaIva: any;
  idMoneda: any;
  idTipoVenta: any;
  clienteInfo: any;
  nombreEmpresa: string;
  nombreContacto: any;
  idIva: any;
  costoLista = 0;
  cotizacionFlotilla: any;
  estatusSolicitud = [];

  constructor(private modalService: NgbModal,
    private cliCatalogoService: ClientCatalogService,
    private brandService: BrandService,
    private direccionFlotillasSelectServices: DireccionFlotillasSelectService,
    private httpRequestService: HttpRequestService,
    config: NgbModalConfig,
    private newUnitsService: NewUnitsService,
    private router: Router,
    private pricingService: PricingService,
    private toastrService: ToastrService,) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.getMarcas();
    this.getEstatusSolicitudCotizacion();
    localStorage.removeItem('formSolicitud');
    if (localStorage.getItem('idSolicitudCotizacion')) {
      this.idSolicitudCotizacion = Number(localStorage.getItem('idSolicitudCotizacion'));
      this.solicitudCotizacion = JSON.parse(localStorage.getItem('solicitud'));
      this.getSolicitudCotizacionVehiculos();
    }
    this.initForm();

    this.subscribeIdFlotila = this.direccionFlotillasSelectServices.isSelected.subscribe(dirFlotilla => {
      if (dirFlotilla) {
        this.currentIdFlotilla = dirFlotilla;
        localStorage.setItem('idFlotilla', dirFlotilla);
        this.clearForm();
        if (this.solicitudCotizacion) {
          this.getMarcas();
        }
      }
    });
  }

  getSolicitudCotizacionVehiculos = () => {
    this.httpRequestService.get('solicitud/getSolicitudCotizacionVehiculo?idSolicitudCotizacion=' + this.idSolicitudCotizacion).subscribe((data: any[]) => {
      this.vehiculos = data.map(v => {
        v.idCatalogo = v.catalogo;
        v.version = v.versionUnidad;
        v.nombreColorInt = v.colorInterior;
        v.nombreColorExt = v.colorExterior;
        v.modeloNombre = v.modelo;
        return v;
      });
    });
  }

  getEstatusSolicitudCotizacion = () => {
    this.httpRequestService.get('solicitud/getEstatusSolicitudCotizacion').subscribe((data: any[]) => {
      this.estatusSolicitud = data;
    });
  }

  clearForm = () => {
    this.clientes = [];
    this.form.controls.idClienteFinal.setValue('');
    this.form.controls.idClienteFactura.setValue('');
    if (this.clienteNgSelect) {
      this.clienteNgSelect.clearModel();
      this.clienteFinalSelected.clearModel();
      this.clienteFacturarSelected.clearModel();
      this.clientes = [];
      this.clientesFacturar = [];
      this.clientesFinales = [];
    }
  }

  getMarcas = () => {
    this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => {
      this.marcas = dataMarcas;
      if (this.solicitudCotizacion) {
        this.form.controls.idMarca.setValue(this.solicitudCotizacion.idMarca);
      }
      this.brandService.getBrandsExternal().subscribe((dataMarcasExternas: Marca[]) => {
        for (var a = 0; a < dataMarcasExternas.length; a++) {
          this.marcas.push(dataMarcasExternas[a])
        }
      });
    });
  }

  initForm = () => {
    this.form = new FormGroup({
      filtro: new FormControl('', [Validators.required]),
      idMarca: new FormControl('', [Validators.required]),
      empresa: new FormControl('', [Validators.required]),
      sucursal: new FormControl('', [Validators.required]),
      idClienteFinal: new FormControl('', [Validators.required]),
      adjudicado: new FormControl(false),
      idClienteFactura: new FormControl('1', [Validators.required]),
      ordenCompra: new FormControl(''),
      estatusCotizacion: new FormControl('', [Validators.required]),
      idFinanciera: new FormControl(''),
    });

    this.formFacturar = new FormGroup({
      idCondicion: new FormControl('', [Validators.required]),
      idFinanciera: new FormControl('', [Validators.required]),
      idCfdi: new FormControl('', [Validators.required]),
      idTipoVenta: new FormControl('', [Validators.required]),
      idMonedaVenta: new FormControl('', [Validators.required]),
      idIva: new FormControl('', [Validators.required]),
      tasaIva: new FormControl('',),
      ivaTotal: new FormControl(''),
    });

    if (this.idSolicitudCotizacion) {
      this.form.controls.filtro.setValue('idCliente');
      this.form.controls.adjudicado.setValue(this.solicitudCotizacion.adjudicado);
      this.form.controls.ordenCompra.setValue(this.solicitudCotizacion.ordenCompra);
      this.form.controls.estatusCotizacion.setValue(this.solicitudCotizacion.estatusCotizacion);

      this.clientesOnSearch({ term: this.solicitudCotizacion.idCliente + '' });
      this.getClientes(2);
    }

    this.form.controls.idMarca.valueChanges.subscribe(idMarca => {
      if (idMarca) {
        this.empresas = [];
        this.sucursales = [];
        this.empresaNgSelect.clearModel();
        this.sucursalNgSelect.clearModel();
        this.form.controls.empresa.setValue('');
        this.form.controls.sucursal.setValue('');
        this.brandService.getCompany(idMarca).subscribe((dataEmpresas: Empresa[]) => {

          if (this.solicitudCotizacion) {
            this.filtroNgSelect.setDisabledState(true);
            this.empresaNgSelect.setDisabledState(true);
            this.form.controls.empresa.setValue(this.solicitudCotizacion.idEmpresa);
          }
          this.brandService.getCompanyExternal(idMarca).subscribe((dataEmpresasExternas: Empresa[]) => {
            if(dataEmpresas.length == 0){
              this.empresas = dataEmpresasExternas
            }else{
              for (var a = 0; a < dataEmpresasExternas.length; a++) {
                dataEmpresas.push(dataEmpresasExternas[a])
              }
              this.empresas = dataEmpresas;
            }
          });
        });
      }
    });

    this.form.controls.empresa.valueChanges.subscribe(empresa => {
      this.sucursales = [];
      this.sucursalNgSelect.clearModel();
      this.form.controls.sucursal.setValue('');
      this.catalogos = [];
      if (empresa) {
        this.brandService.getBranchOffice(empresa).subscribe((dataSucursales: Sucursal[]) => {
          if (this.solicitudCotizacion) {
            this.form.controls.sucursal.setValue(this.solicitudCotizacion.idSucursal);
            this.sucursalNgSelect.setDisabledState(true);
          }
          this.brandService.getBranchOfficeExternal(empresa).subscribe((dataSucursalesExternas: Sucursal[]) => {
            if(dataSucursales.length == 0){
              this.sucursales = dataSucursalesExternas
            }else{
              for (var a = 0; a < dataSucursalesExternas.length; a++) {
                dataSucursales.push(dataSucursalesExternas[a])
              }
              this.sucursales = dataSucursales;
            }
          });
        });
        localStorage.setItem('idEmpresa', empresa);
      }
    });
    this.form.controls.sucursal.valueChanges.subscribe(idSucursal => {
      if (idSucursal){
        this.brandService.getFinancial(idSucursal).subscribe((data: any) => {
          this.brandService.getFinancialExternal(idSucursal).subscribe((dataExternal: any) => {
            if(data.length == 0){
              this.financieras = dataExternal
            }else{
              for (var a = 0; a < dataExternal.length; a++) {
                data.push(dataExternal[a])
              }
              this.financieras = data;
            }
         });
        });

        if (this.solicitudCotizacion) {
          this.form.controls.idFinanciera.setValue(this.solicitudCotizacion.idFinanciera);
        }
      }
    });

  }


  addVehiculo = () => {
    localStorage.setItem('idSolicitudCotizacion', this.idSolicitudCotizacion + '');
    localStorage.setItem('idSucursal', this.form.value.sucursal);
    this.modalService.open(VehiculoFormModalComponent, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.getSolicitudCotizacionVehiculos();
    });
  }

  updateSolicitud = () => {
    this.httpRequestService.post('solicitud/updateSolicitud', {
      idSolicitudCotizacion: this.idSolicitudCotizacion,
      adjudicado: this.form.value.adjudicado ? 1 : 0,
      ordenCompra: this.form.value.ordenCompra,
      estatusCotizacion: this.form.value.estatusCotizacion,
      idFinanciera:(this.form.value.idFinanciera==null ? -1:this.form.value.idFinanciera)
    }).subscribe((res: any) => {
      this.toastrService.success(`Se ha modificado la solicitud exitosamente.`,
        ' EXITOSO');
      if (res) {
        this.idSolicitudCotizacion = res[0].idSolicitudCotizacion;
      }
    }, (err) => {
      console.log(err);
        this.toastrService.error('Error al intentar almacenar los registros',
          `ERROR`);
    });
  }

  addSolicitud = () => {
    this.httpRequestService.post('solicitud/insertSolicitud', {
      idDireccionFlotillas: this.currentIdFlotilla,
      idCliente: this.form.value.idClienteFinal,
      idEmpresa: this.form.value.empresa,
      idClienteFactura: this.form.value.idClienteFactura,
      adjudicado: this.form.value.adjudicado ? 1 : 0,
      idMarca: this.form.value.idMarca,
      idSucursal: this.form.value.sucursal,
      ordenCompra: this.form.value.ordenCompra,
      estatusCotizacion: this.form.value.estatusCotizacion,
      idFinanciera:this.form.value.idFinanciera
    }).subscribe((res: any) => {
      this.toastrService.success(`Se ha guardado la solicitud exitosamente.`,
        'GUARDADO EXITOSO');
      if (res) {
        this.idSolicitudCotizacion = res[0].idSolicitudCotizacion;
      }
    }, (err) => {
      console.log(err);
        this.toastrService.error('Error al intentar almacenar los registros',
          `ERROR`);
    });
  }
  configurarPedido = () => {
    this.modalService.open(OrderComponent, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.getSolicitudCotizacionVehiculos();
    });
  }

  onSelect = ($event) => {
    this.selected = $event.selected[0];
    localStorage.setItem('solicitudGrupo', JSON.stringify(this.selected));
  }

  clientesOnSearch = ($event: any) => {
    this.filter = {
      pagina: 1,
      numeroRegistros: 100,
      rfc: '',
      nombreCompleto: $event.term,
      idFlotilla: this.currentIdFlotilla,
      idCfdiUnidades: '',
      idCfdiAccesorios: '',
      tipoPersona: '',
      filtroSelect: this.form.value.filtro
    };
  };

  getClientes = (select: number) => {
    if (this.filter && this.form.value.filtro) {
      this.cliCatalogoService.postClienteFilter(this.filter).subscribe((res: any) => {
        switch (select) {
          case 2:
            this.clientesFinales = res.clientes;
            if (this.solicitudCotizacion) {
              this.form.controls.idClienteFinal.setValue(this.clientesFinales[0].nombreCompleto);
              this.clientesOnSearch({ term: this.solicitudCotizacion.idClienteFactura + '' });
              this.getClientes(3);
            } else {
              this.clienteFinalSelected.open();
            }
            break;
          case 3:
            this.clientesFacturar = res.clientes;
            if (this.solicitudCotizacion) {
              this.form.controls.idClienteFactura.setValue(this.clientesFacturar[0].nombreCompleto);
            } else {
              this.clienteFacturarSelected.open();
            }
            break;
        }
      });

    } else {
      this.toastrService.warning('Por favor seleccione el filtro por el cual desea buscar el cliente', 'BUSCADOR');
    }
  };

  deleteSolicitud = ($event: any) => {
    const rf = this.modalService.open(AlertComponentComponent, { size: 'sm' });
    rf.componentInstance.data = {
      title: 'Alerta, eliminar vehículo',
      message: 'Al eliminar el vehículo se eliminarán los pedidos y entregas configuradas.',
      msgOk: 'Eliminar',
      msgCancel: 'Cancelar'
    };
    rf.result.then((result) => {
      if (result) {
        this.httpRequestService.post('solicitud/deleteSolicitudGrupo', {
          idSolicitudGrupoUnidad: $event.idSolicitudGrupoUnidad
        }).subscribe((res: any) => {
          this.toastrService.success(`Se ha eliminado el vehiculo de forma exitosa.`,
            'BORRADO EXITOSO');
          if (!res) {
            this.getSolicitudCotizacionVehiculos();
          }
        });
      }
    });
  }

  assign = () => {
    if (this.selected.entregaEstimada > 0) {
      this.modalService.open(AssignComponent, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.getSolicitudCotizacionVehiculos();
      });
    } else {
      this.toastrService.warning('Es necesario configurar la proyección de entrega.',
        `ALERTA`);
    }
  }

  // facturar = () => {
  //   // Validar si hay unidades disponibles para facturar
  //   let totalDisponibles = 0;
  //   this.vehiculos.forEach(v => {
  //     totalDisponibles = totalDisponibles + v.unidadesDisponible;
  //   });
  //   if (totalDisponibles) {
  //     this.sucursalesOnChange(this.form.value.sucursal);
  //     this.showFormFacturar = true;
  //   } else {
  //     this.toastrService.warning(`No hay unidades disponibles para facturar`,
  //       `ALERTA`);
  //   }
  // }

  getCFDI = () => {
    this.pricingService.cfdiCliente(this.solicitudCotizacion.idEmpresa,this.idSucursal,this.idCliente,'-1').subscribe((dataCfdi: Cfdi[]) => {
        this.cfdi = dataCfdi;
    });
    // this.cliCatalogoService.getAllCFDI().subscribe((dataCfdi: Cfdi[]) => {
    //   this.cfdi = dataCfdi;
    // });
  }

  sucursalesOnChange(idSucursal: number) {
    this.financieras = [];
    // if (sucursal !== undefined) {
    // this.idSucursal;
    // this.nombreSucursal = sucursal.nombre;
    this.getCFDI();
    this.brandService.getFinancial(idSucursal).subscribe((data: any) => { this.financieras = data; });
    this.pricingService.getMonedasVenta(idSucursal).subscribe((data: any) => { this.monedas = data; });
    this.pricingService.getTiposVentas(idSucursal, this.currentIdFlotilla).subscribe((data: any) => {
      this.tiposVenta = data;
      this.tiposVenta.forEach(item => {
        item.label = item.nombre + '-' + item.tipo;
      })
    });
    this.pricingService.getIvas(idSucursal).subscribe((data: any) => { this.ivas = data; });
    // }
    // this.condicionNgSelect.clearModel();
    // this.financieraNgSelect.clearModel();
    // this.cfdiNgSelect.clearModel();
  }

  condicionesOnChange(condicion: Condicion) {
    if (condicion !== undefined) {
      this.idCondicion = condicion.idCondicion;
      this.nombreCondicion = condicion.nombre;
      if (this.idCondicion == 'C0') {
        // this.formFacturar.controls.idCondicion.disable();
      } else {
        this.formFacturar.controls.idFinanciera.enable();
      }
    }
    // this.financieraNgSelect.clearModel();
    // this.cfdiNgSelect.clearModel();
  }

  financierasOnChange(financiera: Financiera) {
    if (financiera !== undefined) {
      this.idFinanciera = financiera.idFinanciera;
      this.nombreFinanciera = financiera.nombre;
    }
    // this.cfdiNgSelect.clearModel();
  }

  cfdiOnChange(cfdi) {
    if (cfdi !== undefined) {
      this.nombreCfdi = cfdi.nombre;
    }
  }

  ivaOnChange(value: any) {
    if (value !== undefined) {
      this.tasaIva = value.tasa;
      this.idIva = value.nombre;
    }
  }

  monedaOnChange(value: any) {
    if (value !== undefined) {
      this.idMoneda = value.nombre;
    }
  }

  ventaOnChange(value: any) {
    if (value !== undefined) {
      this.idTipoVenta = value.label;
    }
  }

  saveCotizaciones = () => {
    this.clienteInfo = this.clientesFacturar[0];

    this.nombreEmpresa = this.empresas.find(c => {
      return c.idEmpresa == this.form.value.empresa;
    }).nombre;

    this.nombreSucursal = this.sucursales.find(c => {
      return c.idSucursal == this.form.value.sucursal;
    }).nombre;

     // VALIDAMOS SI LA COTIZACION YA FUE GENERADA CUANDO SE CREARON LAS OC
    const body: any = {
      idSolicitudCotizacion: this.idSolicitudCotizacion,
      nombreCliente: this.clienteInfo.nombreCompleto,
      idCondicion: this.formFacturar.value.idCondicion,
      nombreCondicion: this.nombreCondicion,
      nombreEmpresa: this.nombreEmpresa,
      nombreSucursal: this.nombreSucursal,
      idFinanciera: this.formFacturar.value.idFinanciera,
      nombreFinanciera: this.nombreFinanciera,
      idCfdi: this.formFacturar.value.idCfdi,
      idMonedaVenta: this.formFacturar.value.idMonedaVenta,
      idIva: this.formFacturar.value.idIva,
      tasaIva: this.tasaIva,
      nombreTipoVenta: this.idTipoVenta,
      nombreMoneda: this.idMoneda,
      nombreIva: this.idIva,
      nombreContacto: this.clienteInfo.nombreCompleto,
      idClienteContacto: this.form.value.idClienteFactura
    }
    this.httpRequestService.post('solicitud/generaCotizacionFlotillas', body).subscribe((data) => {
    if (data[0].Success === 1) {
          this.toastrService.success(`Generando proceso para flotillas.`,'PROCESO EXITOSO');
          this.cotizacionFlotilla = data[0];

          this.agregarGrupoFlotilla();

          const bodyVin: any = {
            idSolicitudCotizacion: this.idSolicitudCotizacion
          }
          this.httpRequestService.post('solicitud/asignaVinCotizacionFlotillas', bodyVin).subscribe((data) => {
            if (data[0].Success === 1) {
              this.toastrService.success(`Se asignaron los Vines.`,'PROCESO EXITOSO');
            }
          });
      }
    // FUNCIONALIDAD SI NO EXISTEN OC
    else
      {
        const cotizacion: any = [{
          idCotizacion: undefined,
          idDireccionFlotillas: this.currentIdFlotilla,
          idUsuario: null,
          idCliente: this.form.value.idClienteFactura,
          nombreCliente: this.clienteInfo.nombreCompleto,
          idMarca: this.form.value.idMarca,
          idEmpresa: this.form.value.empresa,
          nombreEmpresa: this.nombreEmpresa,
          idSucursal: this.form.value.sucursal,
          nombreSucursal: this.nombreSucursal,
          idCondicion: this.formFacturar.value.idCondicion,
          nombreCondicion: this.nombreCondicion,
          idFinanciera: this.formFacturar.value.idFinanciera,
          nombreFinanciera: this.nombreFinanciera,
          idCfdi: this.formFacturar.value.idCfdi,
          nombreCfdi: this.nombreCfdi,
          idLicitacion: null,
          status: 'EN PROCESO',
          step: 0,
          idTipoVenta: this.formFacturar.value.idTipoVenta,
          nombreTipoVenta: this.idTipoVenta,
          idMonedaVenta: this.formFacturar.value.idMonedaVenta,
          nombreMoneda: this.idMoneda,
          idIva: this.formFacturar.value.idIva,
          nombreIva: this.idIva,
          tasaIva: this.tasaIva,
          idClienteContacto: this.form.value.idClienteFactura,
          nombreContacto: this.clienteInfo.nombreCompleto
        }];
        this.isLoading = true;
        this.pricingService.createPricing(cotizacion,"-1","-1").subscribe((res: Cotizacion) => {
          this.cotizacionFlotilla = res[0];
          this.agregarGrupoFlotilla();
        }, () => this.isLoading = false);
      }
    },(err) => {
      console.log(err);
        this.toastrService.error('Error al intentar guardar la OC',
          `ERROR`);
    });

  }

  agregarGrupoFlotilla = async () => {
    const unidades = [];
    const allUnidadesDisponibles = [];
    try {
      for (const unidad of this.vehiculos) {
        const unidadesDisponibles: any = await this.getUnidadesDisponibles(unidad.idSolicitudGrupoPedido);
        if (unidadesDisponibles.length) {
          unidad.cantidadDisponible = unidadesDisponibles.length;
          allUnidadesDisponibles.push(unidadesDisponibles);
          unidades.push(unidades);
          const generareCotizacionUnidad = await this.saveGrupoUnidades(unidad);
        }
      }
      this.insDetalleUnidadFlotilla(unidades, allUnidadesDisponibles);
    } catch (error) {
      console.log(error);
      this.isLoading = false;
      this.toastrService.error(`Error al intentar almacenar los registros`,
        `ERROR`);
    }
  }

  getUnidadesDisponibles = (idSolicitudGrupoPedido: number) => {
    return new Promise((done) => {
      this.httpRequestService.get('solicitud/getUnidadesDisponibles?idSolicitudGrupoPedido=' + idSolicitudGrupoPedido).subscribe((data: any[]) => {
        done(data);
      });
    });
  }

  saveGrupoUnidades = (unidad: any) => {
    return new Promise(done => {
      const grupoUnidades = new GrupoUnidades();
      grupoUnidades.idCotizacion = this.cotizacionFlotilla.idCotizacion;
      grupoUnidades.idGrupoUnidad = unidad.idSolicitudGrupo;
      grupoUnidades.catalogo = unidad.idCatalogo;
      grupoUnidades.anio = unidad.anio;
      grupoUnidades.clase = unidad.clase;
      grupoUnidades.modelo = unidad.modelo;
      grupoUnidades.versionUnidad = unidad.versionUnidad;
      grupoUnidades.idColorInterior = unidad.idColorInterior;
      grupoUnidades.colorInterior = unidad.colorInterior;
      grupoUnidades.idColorExterior = unidad.idColorExterior;
      grupoUnidades.colorExterior = unidad.colorExterior;
      grupoUnidades.cantidad = unidad.cantidadDisponible;
      grupoUnidades.precio = unidad.precioLista;
      grupoUnidades.costo = Number(unidad.costo);

      grupoUnidades.idCondicion = this.cotizacionFlotilla.idCondicion;
      grupoUnidades.idFinanciera = this.cotizacionFlotilla.idFinanciera;
      grupoUnidades.nombreFinanciera = this.cotizacionFlotilla.nombreFinanciera;
      grupoUnidades.idCfdi = this.cotizacionFlotilla.idCfdi;
      grupoUnidades.idCfdiAdicionales = this.cotizacionFlotilla.idCfdiAdicionales;
      grupoUnidades.idIva = this.cotizacionFlotilla.idIva;
      grupoUnidades.tasaIva = this.cotizacionFlotilla.tasaIva;
      grupoUnidades.colorExteriorFacturacion = grupoUnidades.colorExterior;
      grupoUnidades.colorInteriorFacturacion = grupoUnidades.colorInterior;

      this.pricingService.saveGrupoUnidades(grupoUnidades)
        .subscribe((grupoUnidadesSaved: GrupoUnidades) => {
          done(true);
        });
    });
  }

  insDetalleUnidadFlotilla = (unidades: any[], allUnidadesDisponibles: any[]) => {
    const grupoDetalleUnidad = [];
    unidades.forEach(ele => {
      grupoDetalleUnidad.push({
        idCotizacion: this.cotizacionFlotilla.idCotizacion,
        idGrupoUnidad: ele.idGrupoUnidad,
        cantidad: ele.cantidadDisponible
      });
    });
    this.pricingService.saveDetalleUnidades(grupoDetalleUnidad, 'COTIZACION').subscribe((res: any) => {
      if (res.affectedRows.Success === 1) {
        this.pricingService.updateStep(this.cotizacionFlotilla.idCotizacion, 2).subscribe((update) => {
          this.updateDetalleUnidadToAsignado(allUnidadesDisponibles);
        });
      } else {
        this.isLoading = false;
        this.toastrService.error(`Error al intentar almacenar los registros: ` + res.affectedRows.Mensaje,
          `ERROR`);
      }
    }, () => this.isLoading = false);
  }

  updateDetalleUnidadToAsignado = (allGrupoUnidadesDisponibles: any[]) => {

    const unidades = [];
    allGrupoUnidadesDisponibles.forEach((unidadesDisponibles) => {
      unidadesDisponibles.forEach((unidad) => {
        unidades.push({
          unidad: unidad
        });
      });
    });
    const body = {
      unidades,
      idSolicitudCotizacion: this.idSolicitudCotizacion,
      idCotizacion: this.cotizacionFlotilla.idCotizacion
    };
    this.httpRequestService.post('solicitud/updateDetalleUnidadToAsignado', body).subscribe((data: any[]) => {
      this.isLoading = false;
      if (!data) {
        this.toastrService.success(`Se almacenaron los registros de forma satisfactoria`,
          `RESPUESTA EXISTOSO`);
        this.router.navigate(['main/cotizaciones/manager/adicionales'], {
          queryParams: {
            idFlotilla: this.currentIdFlotilla,
            idLicitacion: this.cotizacionFlotilla.idLicitacion,
            idCotizacion: this.cotizacionFlotilla.idCotizacion,
            step: 2
          }
        });
      } else {
        this.isLoading = false;
        console.log(data);
        this.toastrService.error('Error al intentar almacenar los registros',
          `ERROR`);
      }
    }, () => this.isLoading = false);
  }

  ngOnDestroy() {
    this.subscribeIdFlotila.unsubscribe();
    // localStorage.removeItem('idEmpresa');
    // localStorage.removeItem('solicitud');
    // localStorage.removeItem('solicitudGrupo');
  }

}
