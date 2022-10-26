import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BrandService, ClientCatalogService, PricingService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { GroupFleetComponent } from '../group-fleet/group-fleet.component';
import { Cotizacion, Marca, Empresa, Sucursal, Condicion, Financiera, Cfdi } from '../../models';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { PricingManagerService } from '../pricing.manager.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [ClientCatalogService, BrandService, PricingManagerService]
})

export class RegisterComponent implements OnInit, AfterViewInit {
  cotizacion: Cotizacion;
  flotillasItems: any;
  clientesFis = [] as any[];
  flotillasForm: FormGroup;
  formConsulta: FormGroup;
  formConsulta2: FormGroup;
  formCarga: FormGroup;
  submitted = false;
  required = '';
  selectedCliente: any;
  selectedCfdi: any;
  clientes: any[] = [];
  marcas: Marca[] = [];
  empresas: Empresa[] = [];
  sucursales: Sucursal[] = [];
  condiciones: any = [];
  financieras: any = [];
  monedas: any = [];
  ivas: any = [];
  tiposVenta: any = [];
  cfdi: any = [];
  clienteInfo: any = {};
  filter: any = {};
  idUsuario: string;
  idCliente: string;
  idClienteFis: string;
  nombreCliente: string;
  idDireccionFlotillas: string;
  nombreFlotilla: string;
  idMarca: string;
  idEmpresa: number;
  nombreEmpresa: string;
  idSucursal: number;
  nombreSucursal: string;
  idFinanciera: string;
  nombreFinanciera: string;
  idCfdi: string;
  nombreCfdi: string;
  idLicitacion: string;
  idCondicion: string;
  nombreCondicion: string;
  idCotizacion: string;
  datosCotizacion: any = [];
  multimarca = false;
  statusCotizacion = 'EN PROCESO';
  cotizaciones: Cotizacion[] = [];
  nuevaCotizacion = true;

  step: number;
  activo = true;
  isLoadingCliente = false;
  isLoadingCotacto = false;
  customSearchFn = '';
  //OCT 99
  isContinuar = false;

  idTipoVenta;
  idMoneda;
  idContacto;
  idIva;
  tasaIva: any;

  filtros: any = [];
  filtroSelect: any;
  filtroContactoSelect: any;
  loadClientes = 'Sin Información';
  loadContactos = 'Sin Información';
  tipoVenta = [{value:"1",text:"Por inventario"},
               {value:"2",text:"Activo fijo"}]
  contratos: any = []
  flagVentaSelect:boolean=false;
  flagTipoVentaSelect:boolean=false;

  @ViewChild('clienteNgSelect') public clienteNgSelect: NgSelectComponent;
  @ViewChild('contactoNgSelect') public contactoNgSelect: NgSelectComponent;
  @ViewChild('marcaNgSelect') public marcaNgSelect: NgSelectComponent;
  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  @ViewChild('condicionNgSelect') public condicionNgSelect: NgSelectComponent;
  @ViewChild('financieraNgSelect') public financieraNgSelect: NgSelectComponent;
  @ViewChild('monedaNgSelect') public monedaNgSelect: NgSelectComponent;
  @ViewChild('cfdiNgSelect') public cfdiNgSelect: NgSelectComponent;
  @ViewChild('tipoNgSelect') public tipoVentaNgSelect: NgSelectComponent;
  @ViewChild('ivaNgSelect') public ivaNgSelect: NgSelectComponent;
  @ViewChild('tVentaNgSelect') public tVentaNgSelect: NgSelectComponent;
  @ViewChild('contratoNgSelect') public contratoNgSelect: NgSelectComponent;


  @ViewChild(GroupFleetComponent) groupFleetComponent;
  inputItems: any = {};

  currentValue = '';

  constructor(
    private cliCatalogoService: ClientCatalogService,
    private brandService: BrandService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private pricingService: PricingService,
    private toastrService: ToastrService,
    public pricingManagerService: PricingManagerService) {



    this.formConsulta = new FormGroup({
      multimarcaFormControl: new FormControl({ value: 'true', disabled: true }),
      clienteFormControl: new FormControl({ value: '', disabled: true }),
      contactoFormControl: new FormControl({ value: '', disabled: true }),
      licitacionFormControl: new FormControl({ value: '', disabled: true }),
      cfdiFormControl: new FormControl({ value: '', disabled: true }),
    });

    this.formConsulta2 = new FormGroup({
      multimarcaConsultaFormControl: new FormControl({ value: 'false', disabled: true }),
      clienteConsultaFormControl: new FormControl({ value: '', disabled: true }),
      marcaConsultaFormControl: new FormControl({ value: '', disabled: true }),
      empresaConsultaFormControl: new FormControl({ value: '', disabled: true }),
      tipoVentaConsultaFormControl: new FormControl({ value: '', disabled: true }),

      monedaConsultaFormControl: new FormControl({ value: '', disabled: true }),
      ivaConsultaFormControl: new FormControl({ value: '', disabled: true }),
      contactoConsultaFormControl: new FormControl({ value: '', disabled: true }),

      sucursalConsultaFormControl: new FormControl({ value: '', disabled: true }),
      condicionConsultaFormControl: new FormControl({ value: '', disabled: true }),
      financieraConsultaFormControl: new FormControl({ value: '', disabled: true }),
      cfdiConsultaFormControl: new FormControl({ value: '', disabled: true }),
      licitacionConsultaFormControl: new FormControl([]),
    });

    this.formCarga = new FormGroup({
      clienteFormControl: new FormControl('', Validators.required),
      marcaFormControl: new FormControl('', Validators.required),
      empresaFormControl: new FormControl('', Validators.required),
      sucursalFormControl: new FormControl('', Validators.required),
      condicionFormControl: new FormControl('', Validators.required),
      financieraFormControl: new FormControl('', Validators.required),
      cfdiFormControl: new FormControl('', Validators.required),
      tipoVentaFormControl: new FormControl('', Validators.required),
      monedaFormControl: new FormControl('', Validators.required),
      ivaFormControl: new FormControl('', Validators.required),
      contactoFormControl: new FormControl('', Validators.required),
      licitacionFormControl: new FormControl([]),
      tVentaFormControl:new FormControl(''),
      contratoFormControl:new FormControl(''),
    });

  }


  resetFormCarga() {
    this.formConsulta = new FormGroup({
      multimarcaFormControl: new FormControl({ value: 'true', disabled: true }),
      clienteFormControl: new FormControl({ value: '', disabled: true }),
      contactoFormControl: new FormControl({ value: '', disabled: true }),
      licitacionFormControl: new FormControl({ value: '', disabled: true }),
      cfdiFormControl: new FormControl({ value: '', disabled: true }),
    });

    this.formConsulta2 = new FormGroup({
      multimarcaConsultaFormControl: new FormControl({ value: 'false', disabled: true }),
      clienteConsultaFormControl: new FormControl({ value: '', disabled: true }),
      marcaConsultaFormControl: new FormControl({ value: '', disabled: true }),
      empresaConsultaFormControl: new FormControl({ value: '', disabled: true }),
      tipoVentaConsultaFormControl: new FormControl({ value: '', disabled: true }),

      monedaConsultaFormControl: new FormControl({ value: '', disabled: true }),
      ivaConsultaFormControl: new FormControl({ value: '', disabled: true }),
      contactoConsultaFormControl: new FormControl({ value: '', disabled: true }),

      sucursalConsultaFormControl: new FormControl({ value: '', disabled: true }),
      condicionConsultaFormControl: new FormControl({ value: '', disabled: true }),
      financieraConsultaFormControl: new FormControl({ value: '', disabled: true }),
      cfdiConsultaFormControl: new FormControl({ value: '', disabled: true }),
      licitacionConsultaFormControl: new FormControl([]),
    });

    this.formCarga = new FormGroup({
      clienteFormControl: new FormControl('', Validators.required),
      marcaFormControl: new FormControl('', Validators.required),
      empresaFormControl: new FormControl('', Validators.required),
      sucursalFormControl: new FormControl('', Validators.required),
      condicionFormControl: new FormControl('', Validators.required),
      financieraFormControl: new FormControl('', Validators.required),
      cfdiFormControl: new FormControl('', Validators.required),
      tipoVentaFormControl: new FormControl('', Validators.required),
      monedaFormControl: new FormControl('', Validators.required),
      ivaFormControl: new FormControl('', Validators.required),
      contactoFormControl: new FormControl('', Validators.required),
      licitacionFormControl: new FormControl([]),
      tVentaFormControl:new FormControl(''),
      contratoFormControl:new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.inputItems = (this.groupFleetComponent) as object;
  }

  private getParams() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idDireccionFlotillas = params.idFlotilla as string;
      this.idCotizacion = params.idCotizacion as string;
      this.idLicitacion = params.idLicitacion as string;
      this.step = Number(params.step);
    });
  }

  ngOnInit() {
    this.filtros = [];
    this.filtros.push({ "text": "ID", "value": "idCliente" })
    this.filtros.push({ "text": "Nombre", "value": "nombreCompleto" })
    this.filtros.push({ "text": "RFC", "value": "RFC" })
    this.getParams();
    //    getAllCFDIByEmpresa

    this.cliCatalogoService.getAllCFDI().subscribe((dataCfdi: Cfdi[]) => {

    // this.pricingService.cfdiCliente(this.idEmpresa,this.idSucursal,this.idCliente,'').subscribe((dataCfdi) => {
    this.cfdi = dataCfdi;
    // })

      this.cotizaciones = [];
      // this.filter = {
      //   pagina: 1,
      //   numeroRegistros: 200,
      //   rfc: '',
      //   nombreCompleto: '',
      //   idFlotilla: this.idDireccionFlotillas,
      //   idCfdiUnidades: '',
      //   idCfdiAccesorios: ''
      // };

      this.condiciones = [
        { idCondicion: 'C0', nombre: 'CREDITO' },
        { idCondicion: 'C1', nombre: 'CONTADO' }
      ];

      //this.getClientes(this.filter);
      this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => { this.marcas = dataMarcas; });

      if (this.idLicitacion != undefined && this.idCotizacion != undefined) {
        this.nuevaCotizacion = false;
        this.multimarca = true;
        this.pricingService.getPricingsByIdLicitacion(this.idLicitacion).subscribe(async (cotizaciones: Cotizacion[]) => {
          this.cotizaciones = await cotizaciones;
          this.formConsulta.controls.multimarcaFormControl.patchValue(true);
          this.formConsulta.controls.clienteFormControl.patchValue(this.cotizaciones[0].nombreCliente);
          this.formConsulta.controls.licitacionFormControl.patchValue(this.cotizaciones[0].idLicitacion);
          const cfdiSelected = this.cfdi.find(c => c.idCfdi == this.cotizaciones[0].idCfdi);
          if (cfdiSelected) {
            this.cotizaciones[0].nombreCfdi = cfdiSelected.nombre;
          }
          this.groupFleetComponent.setCotizaciones(this.cotizaciones);
          this.formConsulta.controls.cfdiFormControl.patchValue(this.cotizaciones[0].nombreCfdi);
          this.filter = {
            pagina: 1,
            numeroRegistros: 100,
            rfc: '',
            nombreCompleto: this.cotizaciones[0].nombreCliente,
            idFlotilla: this.idDireccionFlotillas,
            idCfdiUnidades: '',
            idCfdiAccesorios: ''
          };
          this.cliCatalogoService.postClienteFilter(this.filter).subscribe((res: any) => {
            res.clientes.map(ele => {
              if (ele.idCliente === this.cotizaciones[0].idCliente) {
                this.clienteInfo = ele;
              }
            });
          });
        });
      }

      if (this.idLicitacion == undefined && this.idCotizacion != undefined) {
        this.nuevaCotizacion = false;
        this.multimarca = false;
        if (this.idCotizacion !== undefined) {
          this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
            if (cotizacion.status === 'EN PROCESO') {
              this.pricingManagerService.onlyRead = false;
            } else {
              this.pricingManagerService.onlyRead = true;
            }
            if (cotizacion) {
              let nombreCFDI = '';
              if (cotizacion.idCfdi != undefined) {
                nombreCFDI = this.cfdi.find(c => c.idCfdi == cotizacion.idCfdi).nombre;
              }
              //OCT 99
              this.cotizacion = cotizacion;
              this.isContinuar = true;

              this.formConsulta2.controls.multimarcaConsultaFormControl.patchValue(false);
              this.formConsulta2.controls.clienteConsultaFormControl.patchValue(cotizacion.nombreCliente);
              this.formConsulta2.controls.marcaConsultaFormControl.patchValue(cotizacion.idMarca);
              this.formConsulta2.controls.empresaConsultaFormControl.patchValue(cotizacion.nombreEmpresa);
              this.formConsulta2.controls.tipoVentaConsultaFormControl.patchValue(cotizacion.nombreTipoVenta);

              this.formConsulta2.controls.ivaConsultaFormControl.patchValue(cotizacion.nombreIva);
              this.formConsulta2.controls.monedaConsultaFormControl.patchValue(cotizacion.nombreMoneda);
              this.formConsulta2.controls.contactoConsultaFormControl.patchValue(cotizacion.nombreContacto);

              this.formConsulta2.controls.sucursalConsultaFormControl.patchValue(cotizacion.nombreSucursal);
              this.formConsulta2.controls.condicionConsultaFormControl.patchValue(cotizacion.nombreCondicion);
              this.formConsulta2.controls.financieraConsultaFormControl.patchValue(cotizacion.nombreFinanciera);
              this.formConsulta2.controls.cfdiConsultaFormControl.patchValue(nombreCFDI);

              this.filter.idCliente = cotizacion.idCliente;

              this.cliCatalogoService.postClienteFilter(this.filter).subscribe((res: any) => {
                res.clientes.map(ele => {
                  if (ele.idCliente === cotizacion.idCliente) {
                    this.clienteInfo = ele;
                  }
                });
              });
            }
          });
        }
      }
    });
  }

  get f() { return this.flotillasForm.controls; }

  //#region combo filtro clientes
  filtrosOnChange($event) {
    this.filtroSelect = undefined;
    this.clienteNgSelect.clearModel();
    this.clientes = [];
    if ($event != undefined) {
      this.filtroSelect = $event.value
    }
  };
  //#endregion

  //#region combo Clientes
  getClientes() {
    if (this.filtroSelect == undefined) {
      this.toastrService.warning('Por favor seleccione el filtro por el cual desea buscar el cliente', 'BUSCADOR');
    } else {
      this.isLoadingCliente = true;
      this.cliCatalogoService.postClienteFilter(this.filter).subscribe((res: any) => {
        this.clientes = res.clientes;
        this.isLoadingCliente = false;
        this.clienteNgSelect.open();
      });
    }

  };
  clientesOnSearch($event) {
    this.filter = {
      pagina: 1,
      numeroRegistros: 100,
      rfc: '',
      nombreCompleto: $event.term,
      idFlotilla: this.idDireccionFlotillas,
      idCfdiUnidades: '',
      idCfdiAccesorios: '',
      tipoPersona: '',
      filtroSelect: this.filtroSelect
    };
  };
  clientesOnChange($event) {
    if ($event != undefined) {
      this.clienteInfo = $event;
      this.idCliente = $event.idCliente;
      this.nombreCliente = $event.nombreCompleto;
      if (!this.multimarca && this.marcaNgSelect) { this.marcaNgSelect.clearModel(); }
      if (!this.multimarca && this.empresaNgSelect) { this.empresaNgSelect.clearModel(); }
      if (!this.multimarca && this.sucursalNgSelect) { this.sucursalNgSelect.clearModel(); }
      if (!this.multimarca && this.condicionNgSelect) { this.condicionNgSelect.clearModel(); }
      if (!this.multimarca && this.financieraNgSelect) { this.financieraNgSelect.clearModel(); }

      if (!this.multimarca && this.tipoVentaNgSelect) { this.tipoVentaNgSelect.clearModel(); }
      if (!this.multimarca && this.contratoNgSelect) { this.contratoNgSelect.clearModel(); }
      this.flagTipoVentaSelect = false;
      this.flagVentaSelect = false;

      if (!this.multimarca && this.cfdiNgSelect) { this.cfdiNgSelect.clearModel(); }
    }
  }
  //#endregion

  //#region combo filtro contacto
  filtrosOnChangeContacto($event) {
    this.clientesFis = [];
    this.contactoNgSelect.clearModel()
    this.filtroContactoSelect = undefined;
    if ($event != undefined) {
      this.filtroContactoSelect = $event.value
    }
  }

  searchContacto(event) {
    this.filter = {
      pagina: 1,
      numeroRegistros: 100,
      rfc: '',
      nombreCompleto: event.term,
      idFlotilla: this.idDireccionFlotillas,
      idCfdiUnidades: '',
      idCfdiAccesorios: '',
      tipoPersona: 'FIS',
      filtroSelect: this.filtroContactoSelect
    };
  }

  getClientesFis() {
    if (this.filtroContactoSelect == undefined) {
      this.toastrService.warning('Por favor seleccione el filtro por el cual desea buscar el cliente', 'BUSCADOR');
    } else {
      this.isLoadingCotacto = true;
      this.cliCatalogoService.postClienteFilter(this.filter).subscribe((res: any) => {
        //console.log(res.clientes);
        this.clientesFis = res.clientes;
        this.isLoadingCotacto = false;
        this.contactoNgSelect.open();
      });
    }

  }
  //#endregion


  marcasOnChange(marca: Marca) {
    if (marca !== undefined) {
      this.empresas = [];
      this.brandService.getCompany(marca.idMarca).subscribe((dataEmpresas: Empresa[]) => { this.empresas = dataEmpresas; });
      this.idMarca = marca.idMarca;
    }
    this.empresaNgSelect.clearModel();
    this.sucursalNgSelect.clearModel();
    this.condicionNgSelect.clearModel();
    this.financieraNgSelect.clearModel();
    this.cfdiNgSelect.clearModel();

  }

  empresaOnChange(empresa: Empresa) {
    if (empresa !== undefined) {
      this.sucursales = [];
      this.brandService.getBranchOffice(empresa.idEmpresa).subscribe((dataSucursales: Sucursal[]) => { this.sucursales = dataSucursales; });
      
      // this.cliCatalogoService.getAllCFDIByEmpresa(empresa.idEmpresa).subscribe(res => {
      //   this.cfdi = res;
      // });

      this.idEmpresa = empresa.idEmpresa;
      this.nombreEmpresa = empresa.nombre;
    }
    this.sucursalNgSelect.clearModel();
    this.condicionNgSelect.clearModel();
    this.financieraNgSelect.clearModel();
    this.cfdiNgSelect.clearModel();
  }

  sucursalesOnChange(sucursal: Sucursal) {
    this.financieras = [];
    if (sucursal !== undefined) {
      this.idSucursal = sucursal.idSucursal;
      this.nombreSucursal = sucursal.nombre;
      this.cliCatalogoService.getDataContract(this.idCliente,this.idEmpresa,sucursal.idSucursal)
      .subscribe((data) => {
        this.contratos = data; 
        if (this.contratos[0].flag==1){
          this.flagTipoVentaSelect = true;
          this.formCarga.controls.tVentaFormControl.setValue("");
        } else{
          this.flagTipoVentaSelect = false;
          this.formCarga.controls.tVentaFormControl.setValue("");
        }
      });

      this.brandService.getFinancial(sucursal.idSucursal).subscribe((data) => { this.financieras = data; });
      this.pricingService.getMonedasVenta(sucursal.idSucursal).subscribe((data) => { this.monedas = data; });
      this.pricingService.getTiposVentas(sucursal.idSucursal, this.idDireccionFlotillas).subscribe((data) => {
        this.tiposVenta = data;
        this.tiposVenta.forEach(item => {
          item.label = item.nombre + '-' + item.tipo;
        })
      });
      this.pricingService.getIvas(sucursal.idSucursal).subscribe((data) => { this.ivas = data; });

      this.pricingService.cfdiCliente(this.idEmpresa,this.idSucursal,this.idCliente,'-1').subscribe((dataCfdi) => {
        this.cfdi = dataCfdi;
      })
    }
    this.condicionNgSelect.clearModel();
    this.financieraNgSelect.clearModel();
    this.cfdiNgSelect.clearModel();


  }

  condicionesOnChange(condicion: Condicion) {
    if (condicion !== undefined) {
      this.idCondicion = condicion.idCondicion;
      this.nombreCondicion = condicion.nombre;
      if (this.idCondicion == 'C0') {
        this.formCarga.controls['financieraFormControl'].disable();
      } else {
        this.formCarga.controls['financieraFormControl'].enable();
      }
    }
    this.financieraNgSelect.clearModel();
    this.cfdiNgSelect.clearModel();
  }

  financierasOnChange(financiera: Financiera) {
    if (financiera !== undefined) {
      this.idFinanciera = financiera.idFinanciera;
      this.nombreFinanciera = financiera.nombre;
    }
    this.cfdiNgSelect.clearModel();
  }


  cfdiOnChange(cfdi) {
    if (cfdi !== undefined) {
      this.idCfdi = cfdi.CUC_CVEUSOCFDI;
      this.nombreCfdi = cfdi.CUC_DESCRIPCION;
    }
  }

  ivaOnChange(value: any) {
    if (value !== undefined) {
      this.idIva = value.nombre;
      this.tasaIva = value.tasa;
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

  contactoOnChange(value: any) {
    if (value !== undefined) {
      this.idContacto = value.nombreCompleto;
    }
  }

  tVentaOnChange(datos: any) {
    if (datos !== undefined) {
      if (datos.value=='2'){
          this.flagVentaSelect=true;
          this.formCarga.controls.contratoFormControl.setValue("");
      }else{
        this.flagVentaSelect=false;
        this.formCarga.controls.contratoFormControl.setValue("");
      }
    }else{
      this.formCarga.controls.tVentaFormControl.setValue("");
    }
  }

  contratoOnChange(datos: any) {
    if (datos === undefined) {
      this.formCarga.controls.contratoFormControl.setValue("");
    }
  }


  multimarcaOnChange() {
    this.multimarca = !this.multimarca;
    if (this.multimarca) {
      this.formCarga.controls.clienteFormControl.setValidators([Validators.required]);
      this.formCarga.controls.licitacionFormControl.setValidators([Validators.required]);
      this.formCarga.controls.cfdiFormControl.setValidators([Validators.required]);
      this.formCarga.controls.marcaFormControl.clearValidators();
      this.formCarga.controls.empresaFormControl.clearValidators();
      this.formCarga.controls.sucursalFormControl.clearValidators();
      this.formCarga.controls.financieraFormControl.clearValidators();
      if (this.formCarga.controls.canalFormControl) {
        this.formCarga.controls.canalFormControl.setValidators([Validators.required]);
      }

      this.toastrService.success('Has Cambiado a Modo Multimarca');
    }
    if (!this.multimarca) {
      this.formCarga.controls.licitacionFormControl.clearValidators();
      this.formCarga.controls.licitacionFormControl.setValidators([Validators.required]);
      this.formCarga.controls.cfdiFormControl.setValidators([Validators.required]);
      this.formCarga.controls.marcaFormControl.setValidators([Validators.required]);
      this.formCarga.controls.empresaFormControl.setValidators([Validators.required]);
      this.formCarga.controls.sucursalFormControl.setValidators([Validators.required]);
      this.formCarga.controls.financieraFormControl.setValidators([Validators.required]);
      if (this.formCarga.controls.canalFormControl) {
        this.formCarga.controls.canalFormControl.clearValidators();
      }
      this.toastrService.success('Has Cambiado a Modo Simple');
    }
    this.resetFormCarga();
  }

  saveCotizaciones() {
    if (this.cotizacion != undefined) {
      if (this.cotizacion.step < 1) {
        this.step = 1;
      }
    }

    if (this.inputItems.flotillasItems.length > 0) {
      let idLicitacion = '';
      const cfdi = {
        id: '',
        nombre: ''
      };
      this.datosCotizacion = [];
      if (this.idLicitacion === undefined) {
        idLicitacion = this.formCarga.get('licitacionFormControl').value;
      } else {
        idLicitacion = this.idLicitacion;
      }

      if (this.idCfdi === undefined) {
        cfdi.id = this.cotizaciones[0].idCfdi;
        cfdi.nombre = this.cotizaciones[0].nombreCfdi;
      } else {
        cfdi.id = this.idCfdi;
        cfdi.nombre = this.nombreCfdi;
      }

      this.inputItems.flotillasItems.map(element => {
        this.datosCotizacion.push({
          idDireccionFlotillas: this.idDireccionFlotillas,
          idUsuario: null,
          idCliente: this.clienteInfo.idCliente,
          nombreCliente: this.clienteInfo.nombreCompleto,
          idCfdi: cfdi.id,
          nombreCfdi: cfdi.nombre,
          idCotizacion: element.idCotizacion.id,
          idMarca: element.selectedMarca.id,
          unidades: element.selectedUnidades.id,
          idEmpresa: element.selectedEmpresa.id,
          nombreEmpresa: element.selectedEmpresa.nombre,
          idSucursal: element.selectedSucursal.id,
          nombreSucursal: element.selectedSucursal.nombre,
          idCondicion: element.selectedCondicion.id,
          nombreCondicion: element.selectedCondicion.nombre,
          idFinanciera: element.selectedFinanciera.id,
          nombreFinanciera: element.selectedFinanciera.nombre,
          idLicitacion,
          status: this.statusCotizacion,
          step: 1,
          idTipoVenta: element.selectedTipoVenta.id,
          idMonedaVenta: element.selectedMoneda.id,
          idIva: element.selectedIva.id,
          tasaIva: element.selectedTasa.nombre,
          idClienteContacto: this.formCarga.controls.contactoFormControl.value,
          nombreContacto: this.idContacto
        });
      });
      this.pricingService.createPricing(this.datosCotizacion,
                                        this.formCarga.controls.tVentaFormControl.value,
                                        this.formCarga.controls.contratoFormControl.value ).subscribe(async (res: Cotizacion[]) => {
        this.cotizaciones = await res;
        this.inputItems.flotillasItems = [];
        this.toastrService.success(`Las cotizaciones asociadas a la licitación ${idLicitacion} se almacenaron sin problemas`,
          'GUARDADO EXITOSO');
      });
    } else {
      this.toastrService.warning('Por favor asegurese de cargar todos los datos necesarios', 'INFORMACIÓN INCOMPLETA');
    }
  }

  onSubmit() {
    if (  this.flagTipoVentaSelect && (this.formCarga.controls.tVentaFormControl.value==="" ||
          this.formCarga.controls.tVentaFormControl.value===undefined)){
      this.toastrService.warning('Por favor seleccione tipo de venta', 'INFORMACIÓN INCOMPLETA');
    }else if (  this.flagTipoVentaSelect &&
          this.formCarga.controls.tVentaFormControl.value==="2" &&
          (this.formCarga.controls.contratoFormControl.value === undefined ||
           this.formCarga.controls.contratoFormControl.value ==="")){
          this.toastrService.warning('Por favor seleccione el contrato', 'INFORMACIÓN INCOMPLETA');
    }else{
      this.activo = false;
      if (this.cotizacion != undefined) {
        if (this.cotizacion.step < 1) {
          this.step = 1;
        }
      }
      this.datosCotizacion = [];
      this.datosCotizacion.push({
        idCotizacion: this.idCotizacion,
        idDireccionFlotillas: this.idDireccionFlotillas,
        idUsuario: null,
        idCliente: this.formCarga.controls.clienteFormControl.value,
        nombreCliente: this.nombreCliente,
        idMarca: this.formCarga.controls.marcaFormControl.value,
        idEmpresa: this.formCarga.controls.empresaFormControl.value,
        nombreEmpresa: this.nombreEmpresa,
        idSucursal: this.formCarga.controls.sucursalFormControl.value,
        nombreSucursal: this.nombreSucursal,
        idCondicion: this.formCarga.controls.condicionFormControl.value,
        nombreCondicion: this.nombreCondicion,
        idFinanciera: this.formCarga.controls.financieraFormControl.value,
        nombreFinanciera: this.nombreFinanciera,
        idCfdi: this.formCarga.controls.cfdiFormControl.value,
        nombreCfdi: this.nombreCfdi,
        idLicitacion: null,
        status: this.statusCotizacion,
        step: this.step,
        idTipoVenta: this.formCarga.controls.tipoVentaFormControl.value,
        nombreTipoVenta: this.idTipoVenta,
        idMonedaVenta: this.formCarga.controls.monedaFormControl.value,
        nombreMoneda: this.idMoneda,
        idIva: this.formCarga.controls.ivaFormControl.value,
        nombreIva: this.idIva,
        tasaIva: this.tasaIva,
        idClienteContacto: this.formCarga.controls.contactoFormControl.value,
        nombreContacto: this.idContacto
      });
      this.pricingService.createPricing(this.datosCotizacion,
                                        (this.formCarga.controls.tVentaFormControl.value=="" ||
                                        this.formCarga.controls.tVentaFormControl.value==undefined)?"-1":
                                        this.formCarga.controls.tVentaFormControl.value,
                                        (this.formCarga.controls.contratoFormControl.value=="" ||
                                        this.formCarga.controls.contratoFormControl.value==undefined  )? "-1":
                                        this.formCarga.controls.contratoFormControl.value).subscribe(async (res: Cotizacion) => {
        this.activo = true;
        this.toastrService.success(`La cotización se almacenó con éxito`, 'GUARDADO EXITOSO');
        this.router.navigate(['main/cotizaciones/manager/unidades'], {
          queryParams: {
            idCotizacion: res[0].idCotizacion,
            idDireccionFlotillas: this.idDireccionFlotillas,
            idUsuario: this.idUsuario,
            step: 1
          }
        });
      });
    }

  }
  //OCT99
  goToUnidades() {

    if (this.cotizacion != undefined) {
      if (this.cotizacion.step < 1) {
        this.step = 1;
      }

      this.router.navigate(['main/cotizaciones/manager/unidades'], {
        queryParams: {
          idCotizacion: this.cotizacion.idCotizacion,
          idDireccionFlotillas: this.cotizacion.idDireccionFlotillas,
          idUsuario: this.idUsuario,
          step: 1
        }
      });
    }
  }

}
