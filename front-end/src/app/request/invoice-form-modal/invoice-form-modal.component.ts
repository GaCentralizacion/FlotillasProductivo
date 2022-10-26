import { PricingManagerService } from 'src/app/pricing-manager/pricing.manager.service';
import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { NewUnitsService } from 'src/app/services';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { BrandService, ClientCatalogService, PricingService } from 'src/app/services';
import { Cfdi, Condicion, Empresa, Financiera, Marca, Sucursal, UnidadBpro } from 'src/app/models';
import { Router } from '@angular/router';
import { Cotizacion, GrupoUnidades } from './../../models/cotizacion.model';

@Component({
    selector: 'app-invoice-form-modal',
    templateUrl: './invoice-form-modal.component.html',
    styleUrls: ['./invoice-form-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [PricingManagerService]
  })

export class InvoiceModalComponent implements OnInit {

//    @Input() idSolicitudCotizacion: number;
    @Input() idCotizacion;

    isLoading: boolean;
    marcas: Marca[] = [];
    empresas: Empresa[] = [];
    sucursales: Sucursal[] = [];
    catalogos = [];
    comboSolicitudReasignar=[];
    comboGrupoReasignar=[];
    vines=[]
    vehiculos = [];
    form: FormGroup;
    formFacturar: FormGroup;
    clientesFacturar = [];
    flotillas = [];
    clientes = [];
    clientesFinales = [];
    showFormFacturar: boolean;
    condiciones = [{ idCondicion: 'C0', nombre: 'CREDITO' },
    { idCondicion: 'C1', nombre: 'CONTADO' }];
    financieras = [];
    cfdi = [];
    tiposVenta = [];
    monedas = [];
    ivas = [];
    filter: any;
    solicitudCotizacion: any;
    idSolicitudCotizacion: number;
    empresa: number;

    @ViewChild('ngSelectCatalogo') public ngSelectCatalogo: NgSelectComponent;
    @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
    @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
    @ViewChild('filtroNgSelect') public filtroNgSelect: NgSelectComponent;
    @ViewChild('clienteFinalSelected') public clienteFinalSelected: NgSelectComponent;
    @ViewChild('clienteFacturarSelected') public clienteFacturarSelected: NgSelectComponent;

    nombreCondicion: any;
    currentIdFlotilla = '';
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

    constructor(public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        private httpRequestService: HttpRequestService,
        private toastrService: ToastrService,
        private cliCatalogoService: ClientCatalogService,
        private brandService: BrandService,
        private pricingService: PricingService,
        private router: Router,
        private newUnitsService: NewUnitsService,) {

        }

      ngOnInit() {
        //localStorage.removeItem('formSolicitud');
        if (localStorage.getItem('idSolicitudCotizacion')) {
          this.idSolicitudCotizacion = Number(localStorage.getItem('idSolicitudCotizacion'));
          this.solicitudCotizacion = JSON.parse(localStorage.getItem('solicitud'));
        }
        this.currentIdFlotilla = localStorage.getItem('idFlotilla');

        this.initForm();

      }


      fnGetVinesXml(array):string{
        let cadena='';
        let vines='';
        array.forEach((element: {VIN:string,idSolicitudCotizacion:number})=>{
          cadena+='<vin><idVin>' + element.VIN + '</idVin></vin><idSolicitudCotizacion>'+element.idSolicitudCotizacion+'</idSolicitudCotizacion> '
        });
        if (cadena.length>0){
          vines='<vines>'+cadena+'</vines>'
        }
        return vines
      }

      initForm = () => {
        this.form = new FormGroup({
          filtro: new FormControl('', [Validators.required]),
          idMarca: new FormControl('', [Validators.required]),
          idEmpresa: new FormControl('', [Validators.required]),
          idSucursal: new FormControl('', [Validators.required]),
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
          this.form.controls.idEmpresa.setValue(this.solicitudCotizacion.idEmpresa);
          this.form.controls.idSucursal.setValue(this.solicitudCotizacion.idSucursal)

          this.clientesOnSearch({ term: this.solicitudCotizacion.idCliente + '' });
          this.getClientes(2);
        }


            this.brandService.getFinancial(this.form.controls.idSucursal.value).subscribe((data: any) => { this.financieras = data; });
            if (this.solicitudCotizacion) {
              this.form.controls.idFinanciera.setValue(this.solicitudCotizacion.idFinanciera);
            }

            // this.cliCatalogoService.getAllCFDI().subscribe((dataCfdi: Cfdi[]) => {
            //   this.cfdi = dataCfdi;
            // })

            this.pricingService.cfdiCliente('-1','-1','-1',this.idCotizacion).subscribe((dataCfdi: Cfdi[]) => {
              this.cfdi = dataCfdi;
            })

            this.pricingService.getMonedasVenta(this.form.controls.idSucursal.value).subscribe((data: any) => { this.monedas = data; });
            this.pricingService.getTiposVentas(this.form.controls.idSucursal.value, this.currentIdFlotilla).subscribe((data: any) => {
              this.tiposVenta = data;
              this.tiposVenta.forEach(item => {
                item.label = item.nombre + '-' + item.tipo;
              })
            });

            this.pricingService.getIvas(this.form.controls.idSucursal.value).subscribe((data: any) => { this.ivas = data; });

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

      getCFDI = () => {
        this.pricingService.cfdiCliente('-1','-1','-1',this.idCotizacion).subscribe((cfdi: Cfdi[]) => {
        this.cfdi = cfdi;
        })

        // this.cliCatalogoService.getAllCFDI().subscribe((dataCfdi: Cfdi[]) => {
        //   this.cfdi = dataCfdi;
        // });
      }

      sucursalesOnChange(idSucursal: number) {
        this.financieras = [];

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
        this.isLoading = true;

        this.clienteInfo = this.clientesFacturar[0];

         // VALIDAMOS SI LA COTIZACION YA FUE GENERADA CUANDO SE CREARON LAS OC
        const body: any = {
          idSolicitudCotizacion: this.idSolicitudCotizacion,
          nombreCliente: this.clienteInfo.nombreCompleto,
          idCondicion: this.formFacturar.value.idCondicion,
          nombreCondicion: this.nombreCondicion,
          // nombreEmpresa: this.nombreEmpresa,
          // nombreSucursal: this.nombreSucursal,
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
          // idClienteContacto: this.form.value.idClienteFactura
        }

        this.httpRequestService.post('solicitud/generaCotizacionFlotillas', body).subscribe((data) => {
        if (data[0].Success === 1) {
          const body: any = {
            idFlotilla: this.currentIdFlotilla,
            idCotizacion: this.idCotizacion
          }
              this.activeModal.close(body);
              // this.toastrService.success(`Generando proceso para flotillas.`,'PROCESO EXITOSO');
              // this.cotizacionFlotilla = data[0];
                // this.toastrService.success(`Se almacenaron los registros de forma satisfactoria`,`RESPUESTA EXISTOSO`);
                  // this.router.navigate(['main/cotizaciones/manager/adicionales'], {
                  //   queryParams: {
                  //     idFlotilla: this.currentIdFlotilla,
                  //     idCotizacion: this.cotizacionFlotilla.idCotizacion,
                  //     step: 2
                  //   }
                  // });
          }
        }, () => this.isLoading = false);
      }

}
