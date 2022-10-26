import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cotizacion, GrupoUnidades, Condicion, Financieras, Cfdis, Iva, Ivas, DetalleUnidades } from 'src/app/models';
import { CondionesVentaService } from '../../../services';
import { PricingManagerService } from '../../pricing.manager.service';

@Component({
  selector: 'app-crear-editar-selling-condition',
  templateUrl: './crear-editar-salling-condition.component.html',
  styleUrls: ['./crear-editar-selling-condition.component.scss'],
  providers: [PricingManagerService]
})

export class CrearEditarSellingConditionComponent implements OnInit {

  @Input() cotizacion: Cotizacion;
  @Input() grupoUnidad: GrupoUnidades;
  @Input() detalleUnidad: DetalleUnidades;

  curadio = {
    suma: true,
    nosuma: false
  };
  imprime = false;
  isSuma = '';
  formCondiciones: FormGroup;

  /* Variables */
  time = { hour: 0, minute: 0 };


  condicionesIn = [
    { idCondicion: 'C0', nombre: 'CREDITO' },
    { idCondicion: 'C1', nombre: 'CONTADO' }
  ] as any;

  tipoOrden = [
    { idTipoOrden: 'FI', nombre: 'Facturacion Independiente' },
    { idTipoOrden: 'CU', nombre: 'Cargo a la Factura' }
  ] as any;

  fechaMinima = {};
  isCU = false;
  meridian = true;
  submitted = false;
  disabled = false;

  ivas: Ivas[] = [];

  CfdisCatalogo: any = [];
  financierasCatalogo: Financieras[] = [];

  ivasRows: Ivas[] = [];
  CfdisRows: Cfdis[] = [];
  financierasRows: Financieras[] = [];

  financierasDefault: any[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sellingService: CondionesVentaService,
    private toastrService: ToastrService,
    public pricingManagerService: PricingManagerService
  ) {
    this.createForm();
  }

  ngOnInit() {

    if (!this.cotizacion.idSucursal || !this.cotizacion.idCondicion || !this.cotizacion.tipoOrden) {
        this.disabled = true;
    }
    if (this.cotizacion.status === 'EN PROCESO') {
      this.pricingManagerService.onlyRead = false;
    } else {
      this.pricingManagerService.onlyRead = true;
    }

    //OCT99 SOLO LECTURA
    if(this.pricingManagerService.perfilSoloLectura)
      this.pricingManagerService.onlyRead = true; 

    this.obtenerCatalogos(this.cotizacion.idSucursal);

    if (this.detalleUnidad) {
      this.isSuma = this.detalleUnidad.tipoCargoUnidad;
      /*
      if (this.detalleUnidad.tipoOrden === 'CU') {
        this.cfdiAdicional.disable();
        this.cfdiAdicional.reset();
        this.cfdiAdicional.setValidators(null);
        this.isCU = true;
      } else {
        this.cfdiAdicional.enable();
        this.cfdiAdicional.setValidators([Validators.required]);
        this.cfdiAdicional.setValue(this.detalleUnidad.idCfdiAdicionales);
        this.isCU = false;
      }*/
      if (this.detalleUnidad.tipoCargoUnidad === 'NoSuma') {
        this.curadio.nosuma = true;
        this.curadio.suma = false;
      } else {
        this.curadio.nosuma = false;
        this.curadio.suma = true;
      }
      this.imprime = this.detalleUnidad.imprimeFactura;
      this.getFechaMinimaPromesaEntrega(this.cotizacion.idCotizacion)(this.detalleUnidad.idGrupoUnidad);
      this.setForm(this.detalleUnidad);
      this.getFinancieras();
    }

    if (this.grupoUnidad) {
      this.isSuma = this.grupoUnidad.tipoCargoUnidad;
      if (this.grupoUnidad.tipoCargoUnidad === 'NoSuma') {
        this.curadio.nosuma = true;
        this.curadio.suma = false;
      } else {
        this.curadio.nosuma = false;
        this.curadio.suma = true;
      }
      this.imprime = this.grupoUnidad.imprimeFactura;
      this.getFechaMinimaPromesaEntrega(this.cotizacion.idCotizacion)(this.grupoUnidad.idGrupoUnidad);
      this.setFormGrupoUnidades(this.grupoUnidad);
    }

  }

  changeValue() {
    this.imprime = !this.imprime;
  }


  obtenerCatalogos(idSucursal: number) {
    if (!idSucursal) {
      this.toastrService.warning(`No se ha encontrado identificador de sucursal`);
    }

    forkJoin(
      this.sellingService.getFinancieras(idSucursal),
      //this.sellingService.getAllCFDIByEmpresa(this.cotizacion.idEmpresa),
      this.sellingService.cfdiCliente("-1","-1","-1",this.cotizacion.idCotizacion),
      this.sellingService.getIva(idSucursal)
    ).subscribe((res: any[]) => {
      
        const [financieras,cfdis, ivas] = res;

        financieras.map(financiera => {
          this.financierasCatalogo.push(Object.assign(new Financieras(), financiera));
        });

        //console.log(cfdi);
        cfdis.map(cfdi => {
          this.CfdisCatalogo.push(Object.assign({}, cfdi));
        });

        ivas.map(iva => {
          this.ivas.push(Object.assign(new Ivas(), iva));
        });

        this.financierasCatalogo = this.financierasCatalogo.sort((a: Financieras, b: Financieras) => {
          if (a.nombre > b.nombre) {
            return 1;
          }

          if (a.nombre < b.nombre) {
            return -1;
          }
          return 0;
        });

        this.financierasRows = JSON.parse(JSON.stringify(this.financierasCatalogo));

        // this.CfdisCatalogo = this.CfdisCatalogo.sort((a: Cfdis, b: Cfdis) => {
        //   if (a.nombre > b.nombre) {
        //     return 1;
        //   }

        //   if (a.nombre < b.nombre) {
        //     return -1;
        //   }
        //   return 0;
        // });

         this.CfdisRows = JSON.parse(JSON.stringify(this.CfdisCatalogo));


        this.ivas = this.ivas.sort((a: Ivas, b: Ivas) => {
          if (a.tasa > b.tasa) {
            return 1;
          }

          if (a.tasa < b.tasa) {
            return -1;
          }
          return 0;
        });

        this.ivas = this.ivas.map(iva => { iva.fullLabel = iva.tasa + ' - ' +  iva.nombre; return iva; });

        this.ivasRows = JSON.parse(JSON.stringify(this.ivas));
      });
  }

  getFechaMinimaPromesaEntrega(idCotizacion: string) {
    return (idGrupoUnidad: number) => {
      this.sellingService.getFechaMinimaPromesaEntrega(idCotizacion, idGrupoUnidad).subscribe((res: any) => {
        this.fechaMinima = this.date2object(res.minFechaPromesaEntrega).date;
      });
    };
  }

  private getFinancieras() {
    this.sellingService.getFinancieras(this.cotizacion.idSucursal).subscribe(res => {
      this.financierasCatalogo = Object.assign([], res);
    });
  }

  getNameFinanciera(idFinaciera) {
    return this.financierasCatalogo.find(financiera => {
      return financiera.idFinanciera === idFinaciera;
    });
  }

  setForm(detalleUnidad) {
    this.formCondiciones.controls.idCondicion.setValue(detalleUnidad.idCondicion);
    this.formCondiciones.controls.idFinanciera.setValue(detalleUnidad.idFinanciera);
    this.formCondiciones.controls.colorFacturaExterior.setValue(detalleUnidad.colorExteriorFacturacion);
    this.formCondiciones.controls.colorFacturaInterior.setValue(detalleUnidad.colorInteriorFacturacion);
    this.formCondiciones.controls.idCfdi.setValue(detalleUnidad.idCfdi);
    this.formCondiciones.controls.fechaHoraPromesaEntrega.setValue(this.date2object(detalleUnidad.fechaHoraPromesaEntrega).date);
    this.formCondiciones.controls.hora.setValue(this.date2object(detalleUnidad.fechaHoraPromesaEntrega).time);
    //this.formCondiciones.controls.tipoOrden.setValue(detalleUnidad.tipoOrden);
    console.log(detalleUnidad.idCfdiAdicionales);
    //this.formCondiciones.controls.idCfdiAdicionales.setValue(detalleUnidad.idCfdiAdicionales);
    this.formCondiciones.controls.iva.setValue(detalleUnidad.idIva);
    this.formCondiciones.controls.leyendaFactura.setValue(detalleUnidad.leyendaFactura);
  }

  setFormGrupoUnidades(grupoUnidad) {
    if (grupoUnidad.idCondicion === 'C1') {
      this.finaciera.disable();
      this.finaciera.reset();
      this.finaciera.setValidators(null);
    } else {
      this.finaciera.enable();
      this.finaciera.setValidators([Validators.required]);
      this.finaciera.setValue(grupoUnidad.idFinanciera);
    }
    this.finaciera.updateValueAndValidity();
    /*
    if (grupoUnidad.tipoOrden === 'CU') {
      this.cfdiAdicional.disable();
      this.cfdiAdicional.reset();
      this.cfdiAdicional.setValidators(null);
      this.isCU = true;
    } else {
      this.cfdiAdicional.enable();
      this.cfdiAdicional.setValidators([Validators.required]);
      this.cfdiAdicional.setValue(grupoUnidad.idCfdiAdicionales);
      this.isCU = false;
    }
    */
    //this.cfdiAdicional.updateValueAndValidity();
    this.formCondiciones.controls.idCondicion.setValue(grupoUnidad.idCondicion);
    this.formCondiciones.controls.colorFacturaExterior.setValue(grupoUnidad.colorExteriorFacturacion);
    this.formCondiciones.controls.colorFacturaInterior.setValue(grupoUnidad.colorInteriorFacturacion);
    this.formCondiciones.controls.idCfdi.setValue(grupoUnidad.idCfdi);
    this.formCondiciones.controls.iva.setValue(grupoUnidad.idIva);
    this.formCondiciones.controls.fechaHoraPromesaEntrega.setValue(this.date2object(grupoUnidad.fechaHoraPromesaEntrega).date);
    this.formCondiciones.controls.hora.setValue(this.date2object(grupoUnidad.fechaHoraPromesaEntrega).time);
    //this.formCondiciones.controls.tipoOrden.setValue(grupoUnidad.tipoOrden);
    this.formCondiciones.controls.leyendaFactura.setValue(grupoUnidad.leyendaFactura);
  }

  tipoOrdenOnChange(tipoOrden) {
    if (tipoOrden.idTipoOrden === 'CU') {
      this.isCU = true;
    } else {
      this.isCU = false;
    }
  }

  createForm() {
    this.formCondiciones = new FormGroup({
      idCondicion: new FormControl(null, Validators.required),
      idFinanciera: new FormControl(null),
      colorFacturaExterior: new FormControl(null),
      colorFacturaInterior: new FormControl(null),
      idCfdi: new FormControl(null, Validators.required),
      fechaHoraPromesaEntrega: new FormControl(null, Validators.required),
      hora: new FormControl(null, Validators.required),
      //tipoOrden: new FormControl(null, Validators.required),
      //idCfdiAdicionales: new FormControl(null, Validators.required),
      iva: new FormControl(null, Validators.required),
      leyendaFactura: new FormControl(null)
    });

    this.condicion.valueChanges.subscribe(value => {
      if (value === 'C1') {
        this.finaciera.disable();
        this.finaciera.reset();
        this.finaciera.setValidators(null);
      } else {
        this.finaciera.enable();
        this.finaciera.setValidators([Validators.required]);
      }
      this.finaciera.updateValueAndValidity();
    });
    
    /*
    this.tiposOrden.valueChanges.subscribe(value => {
      if (value === 'CU') {
        this.cfdiAdicional.disable();
        this.cfdiAdicional.reset();
        this.cfdiAdicional.setValidators(null);
      } else {
        this.cfdiAdicional.enable();
        this.cfdiAdicional.setValidators([Validators.required]);
      }
      this.cfdiAdicional.updateValueAndValidity();
    });*/
  }

  get fields() { return this.formCondiciones.controls; };

  get condicion() {
    return this.formCondiciones.get('idCondicion') as FormControl;
  }

  get finaciera() {
    return this.formCondiciones.get('idFinanciera') as FormControl;
  }
  /*
  get tiposOrden() {
    return this.formCondiciones.get('tipoOrden') as FormControl;
  }

  get cfdiAdicional() {
    return this.formCondiciones.get('idCfdiAdicionales') as FormControl;
  }*/

  dateFormat(fecha: any, hora: any) {
    return `${fecha.year}-` +
    (fecha.month <= 9 ? `0${fecha.month}-` : `${fecha.month}-`) +
    (fecha.day <= 9 ? `0${fecha.day}T` : `${fecha.day}T`) +
    (hora.hour <= 9 ? `0${hora.hour}:` : `${hora.hour}:`) +
    (hora.minute <= 9 ? `0${hora.minute}:` : `${hora.minute}:`) + `00.000Z`;
  }

  date2object(date: string) {
    const jsonTime = { date: {}, time: {} };

    if (!date) {
      return jsonTime;
    }

    const dateTime = date.split(/T/g);
    dateTime.forEach(time => {
      if (time.search('-') > -1) {
        jsonTime.date = {
          year: parseInt(time.split('-')[0], 10),
          month: parseInt(time.split('-')[1], 10),
          day: parseInt(time.split('-')[2], 10)
        };
      } else {
        jsonTime.time = { hour: parseInt(time.split(':')[0], 10), minute: parseInt(time.split(':')[1], 10) };
      }
    });
    return jsonTime;
  }

  getTasa(idIva: string) {
    const result = this.ivasRows.find(iva => {
      return iva.idIva === idIva;
    });
    return result ? result.tasa : 0;
  }

  save() {
    this.submitted = true;
    console.log('this.formCondiciones.invalid:',this.formCondiciones);
    if (this.formCondiciones.invalid) {
      return;
    } else {
      let nombreFinanciera = null;
      const formatoFechaHoraPromesaEntrega = this.dateFormat(
        this.formCondiciones.value.fechaHoraPromesaEntrega,
        this.formCondiciones.value.hora
      );
      const tasa = this.getTasa(this.formCondiciones.value.iva);
      if (this.formCondiciones.controls.idFinanciera.value) {
        nombreFinanciera = (this.getNameFinanciera(this.formCondiciones.controls.idFinanciera.value)) ?
        this.getNameFinanciera(this.formCondiciones.controls.idFinanciera.value) : null;
      } else {
        nombreFinanciera = {nombre: null, idFinanciera: this.formCondiciones.controls.idFinanciera.value};
      }
      if (this.grupoUnidad) {
        const grupoUnidadSave = {
          idCotizacion: this.cotizacion.idCotizacion,
          idGrupoUnidad: this.grupoUnidad.idGrupoUnidad,
          catalogo: this.grupoUnidad.catalogo,
          anio: this.grupoUnidad.anio,
          clase: this.grupoUnidad.clase,
          modelo: this.grupoUnidad.modelo,
          versionUnidad: this.grupoUnidad.versionUnidad,
          idColorInterior: this.grupoUnidad.idColorInterior,
          colorInterior: this.grupoUnidad.colorInterior,
          idColorExterior: this.grupoUnidad.colorExterior,
          colorExterior: this.grupoUnidad.colorExterior,
          cantidad: this.grupoUnidad.cantidad,
          precio: this.grupoUnidad.precio,
          costo: this.grupoUnidad.costo,
          idCondicion: this.formCondiciones.value.idCondicion,
          idIva: this.formCondiciones.value.iva,
          tasaIva: tasa,
          idFinanciera: nombreFinanciera.idFinanciera,
          nombreFinanciera: nombreFinanciera.nombre,
          colorInteriorFacturacion: this.formCondiciones.value.colorFacturaInterior,
          colorExteriorFacturacion: this.formCondiciones.value.colorFacturaExterior,
          idCfdi: this.formCondiciones.value.idCfdi,
          idCfdiAdicionales: null,//this.formCondiciones.value.idCfdiAdicionales || null, solo se setea, en back no se ocupa OCT99 20201001
          tipoOrden: 'FI',//this.formCondiciones.value.tipoOrden, solo se setea, en back no se ocupa OCT99 20201001
          leyendaFactura: this.formCondiciones.value.leyendaFactura || null,
          fechaHoraPromesaEntrega: formatoFechaHoraPromesaEntrega,
          costoTotal: this.grupoUnidad.costoTotal,
          precioTotal: this.grupoUnidad.precioTotal,
          utilidadBruta: this.grupoUnidad.utilidadBruta,
          tipoCargoUnidad: 'Suma',//this.isSuma, solo se setea, en back no se ocupa OCT99 20201001
          imprimeFactura: true//this.imprime solo se setea, en back no se ocupa OCT99 20201001
        } as GrupoUnidades;
        this.sellingService.saveGrupoUnidades(grupoUnidadSave).subscribe((res) => {
          this.activeModal.close(true);
          this.toastrService.success('Se guardó la información correctamente.', `Condiciones de Venta`);
        }, error => {
          this.toastrService.error(`Error al guardar.`,
            `Condiciones de Venta`);
        });
      } else {
        const detalleUnidad = {
          idCotizacion: this.cotizacion.idCotizacion,
          idGrupoUnidad: this.detalleUnidad.idGrupoUnidad,
          idDetalleUnidad: this.detalleUnidad.idDetalleUnidad,
          idCondicion: this.formCondiciones.value.idCondicion,
          idIva: this.formCondiciones.value.iva,
          tasaIva: tasa,
          idFinanciera: nombreFinanciera.idFinanciera,
          nombreFinanciera: nombreFinanciera.nombre,
          colorInteriorFacturacion: this.formCondiciones.value.colorFacturaInterior,
          colorExteriorFacturacion: this.formCondiciones.value.colorFacturaExterior,
          idCfdi: this.formCondiciones.value.idCfdi,
          idCfdiAdicionales: this.formCondiciones.value.idCfdiAdicionales || null,
          tipoOrden: this.formCondiciones.value.tipoOrden,
          leyendaFactura: this.formCondiciones.value.leyendaFactura || null,
          fechaHoraPromesaEntrega: formatoFechaHoraPromesaEntrega,
          costoTotal: this.detalleUnidad.costoTotal,
          precioTotal: this.detalleUnidad.precioTotal,
          utilidadBruta: this.detalleUnidad.utilidadBruta,
          tipoCargoUnidad: this.isSuma,
          imprimeFactura: this.imprime
        } as DetalleUnidades;
        this.sellingService.updateCotizacionUnidadDetalle(detalleUnidad).subscribe((res) => {
          this.activeModal.close(true);
          this.toastrService.success('Se guardó la información correctamente.', `Condiciones de Venta`);
        }, error => {
          this.toastrService.error(`Error al guardar.`,
            `Condiciones de Venta`);
        });
      }
    }
  }

  /* Events Helpers */
  closeModal() {
    this.activeModal.close(false);
  }

  onProfitSelectionChange(value) {
    this.isSuma = value;
  }

}
