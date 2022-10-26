import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Cfdi, TipoOrden, GrupoUnidades, Cfdis } from 'src/app/models';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PricingService, ClientCatalogService } from 'src/app/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PricingManagerService } from 'src/app/pricing-manager/pricing.manager.service';

@Component({
  selector: 'app-configura-tipo-orden-adicionales',
  templateUrl: './configura-tipo-orden-adicionales.component.html',
  styleUrls: ['./configura-tipo-orden-adicionales.component.scss'],
  providers: [PricingManagerService]
})
export class ConfiguraTipoOrdenAdicionalesComponent implements OnInit {

  @Input() idGrupoUnidad: number;
  @Input() idCotizacion: string;
  @Input() modalGestoria: boolean;
  @Input() tipoAdicional: string;
  @Input() cantidad: number;

  //private imgAuto= require("src/assets/images/auto.jpg");

  form1: FormGroup;
  idTipoOrden: string;
  idCfdi: string;
  tipoOrden: TipoOrden[];
  tipoOrdenAD: TipoOrden[];

  cfdi: Cfdi;
  cfdiArr:any
  numeroGrupoUnidad: number;
  activo = true;
  curadio = {
    suma: false,
    nosuma: false
  };
  imprime = false;
  sumaType = '';
  CfdisCatalogo: any = [];
  strUsoCFD = '';
  strSuma = 'SUMA';
  strImprime = 'NO';

  accesoriosRows = [];
  accesoriosRowsOriginal = [];
  tramitesRows = [];
  tramitesRowsOriginal = [];
  serviciosRows = [];
  serviciosRowsOriginal = [];

  @ViewChild('tipoOrdenNgSelect') public tipoOrdenNgSelect: NgSelectComponent;
  @ViewChild('cfdiNgSelect') public cfdiNgSelect: NgSelectComponent;

  constructor(
    private pricingService: PricingService,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    //private groupTablas: GroupTablesComponent,
    private catalogoService: ClientCatalogService,
    public pricingManagerService: PricingManagerService) {
    this.form1 = new FormGroup({
      tipoOrden: new FormControl(null, [Validators.required]),
      cfdi: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {

    this.tipoOrden = [
      { idTipoOrden: 'FI', nombre: 'Facturacion Independiente' },
      { idTipoOrden: 'CU', nombre: 'Carga a la Factura' }
    ];

    this.tipoOrdenAD= [
      { idTipoOrden: 'FI', nombre: 'Facturacion Independiente' }
    ]

    this.getCfdiCatalogo().then((respuesta: boolean) => {
      if (respuesta) {
        if (this.tipoAdicional == 'ACCESORIOS') {
          this.pricingService.getListadoAccesoriosGrupos(this.idCotizacion, this.idGrupoUnidad, (!this.modalGestoria) ? 1 : 2).subscribe((adicionales: any) => {
            this.accesoriosRowsOriginal = adicionales;
            this.accesoriosRows = this.accesoriosRowsOriginal;
            this.configuraCargoFactura(adicionales);
          });
        }
        if (this.tipoAdicional == 'ACCESORIOS_AD') {
          this.pricingService.getListadoAccesoriosGrupos(this.idCotizacion, this.idGrupoUnidad, (!this.modalGestoria) ? 1 : 2).subscribe((adicionales: any) => {
            this.accesoriosRowsOriginal = adicionales;
            this.accesoriosRows = this.accesoriosRowsOriginal;
            this.configuraCargoFactura(adicionales);
          });
        }
        if (this.tipoAdicional == 'TRAMITES') {
          this.pricingService.getListadoTramitesGrupos(this.idCotizacion, this.idGrupoUnidad, (!this.modalGestoria) ? 1 : 2).subscribe((tramites: any) => {
            this.tramitesRowsOriginal = tramites;
            this.tramitesRows = this.tramitesRowsOriginal;
          });
        }
        if (this.tipoAdicional == 'SERVICIOS') {
          this.pricingService.getListadoServiciosGrupos(this.idCotizacion, this.idGrupoUnidad, (!this.modalGestoria) ? 1 : 2).subscribe((servicios: any) => {
            this.serviciosRowsOriginal = servicios;
            this.serviciosRows = this.serviciosRowsOriginal;
            this.configuraCargoFactura(servicios);
          });
        }
      }
      else {
        this.toastrService.error('Error al cargar catalog de Uso CFDI', 'Catalogo Uso CFDI');
      }
    });

    /*
    this.numeroGrupoUnidad = this.GrupoUnidad.idGrupoUnidad;
    this.cantidad = this.GrupoUnidad.cantidad;

    if (this.GrupoUnidad.tipoCargoUnidad === 'NoSuma') {
      this.curadio.nosuma = true;
      this.curadio.suma = false;
    } else {
      this.curadio.nosuma = false;
      this.curadio.suma = true;
    }

    this.imprime = this.GrupoUnidad.imprimeFactura;
    this.idCfdi = this.GrupoUnidad.idCfdiAdicionales;
    this.idTipoOrden = this.GrupoUnidad.tipoOrden;

    if (this.idTipoOrden == null) {
      this.activo = false;
    }
    else {
      if (this.GrupoUnidad.tipoOrden === 'CU') {
        this.idCfdi = undefined;
        this.cfdiNgSelect.setDisabledState(true);
        this.activo = true;
      }
      else{
        if(this.idCfdi == null){
          this.idCfdi = {} as any;
          //this.cfdiNgSelect.setDisabledState(false);
          this.activo = false;
        }
        else 
          this.activo = true;
      }
    }
    */
  }

  configuraCargoFactura(adicionales: any) {
    console.log('adicionales');
    console.log(adicionales);

    const fi = adicionales.filter(item => item.tipoOrden === 'FI' && item.idCfdi != null);
    const cu = adicionales.filter(item => item.tipoOrden === 'CU');

    if (fi.length > 0) {
      this.idCfdi = fi[0].idCfdi;
      let catalogoCfdi: any;
      catalogoCfdi = this.cfdi;
      this.strUsoCFD = catalogoCfdi.filter(item => { return item.idCfdi === this.idCfdi; })[0].nombre;
    }
    if (cu.length > 0) {
      this.curadio.suma = (cu[0].tipoCargoUnidad === 'Suma') ? true : false;
      this.curadio.nosuma = (cu[0].tipoCargoUnidad === 'NoSuma') ? true : false;

      this.imprime = (cu[0].imprimeFactura) ? true : false;
      this.strImprime = (this.imprime) ? 'SI' : 'NO';

      this.strSuma = (this.curadio.suma) ? 'SUMA' : (this.curadio.nosuma) ? 'NO SUMA' : '';
      this.sumaType = (this.curadio.suma) ? 'Suma' : (this.curadio.nosuma) ? 'NoSuma' : '';
    }
    else {
      //this.curadio.suma = true;
    }
  }

  getCfdiCatalogo(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // this.catalogoService.getAllCFDI().subscribe((cfdi: Cfdi) => {
      //   this.cfdi = cfdi;
      
      this.pricingService.cfdiCliente('-1','-1','-1',this.idCotizacion).subscribe((res: any) => {
        const cfdis = res;

        cfdis.map(cfdi => {
          this.CfdisCatalogo.push({"idCfdi":cfdi.CUC_CVEUSOCFDI,"nombre":cfdi.CUC_DESCRIPCION})
        })
        this.cfdi = JSON.parse(JSON.stringify(this.CfdisCatalogo));

        resolve(true);
      },(error: any) => {
        reject(false);
      }) 
    });
  }

  tipoOrdenOnChange(tipoOrden: TipoOrden, item) {

    if (this.tipoAdicional == 'ACCESORIOS') {
      const actualizaAccesorio = {
        idCotizacion: item.idCotizacion,
        idGrupoUnidad: item.idGrupoUnidad,
        idAccesorioNuevo: item.idAccesorioNuevo,
        idParte: item.idParte,
        tipoOrden: tipoOrden.idTipoOrden,
        tipoCargoUnidad: this.sumaType,
        imprimeFactura: this.imprime,
        idCfdi: this.idCfdi,
      };

      if (this.modalGestoria) { //POSTERIORES
        this.pricingService.actualizaTipoOdenAccesorioGruposMovs(actualizaAccesorio).subscribe((resp: any) => {
          if (resp[0].Success === 1)
            this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
          else
            this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
        });
      }
      else {
        console.log('actualizaAccesorio');
        console.log(actualizaAccesorio);
        this.pricingService.actualizaTipoOdenAccesorioGrupos(actualizaAccesorio).subscribe((resp: any) => {
          if (resp[0].Success === 1)
            this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
          else
            this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
        });
      }
    }

    if (this.tipoAdicional == 'SERVICIOS') {
      const actualizaServicio = {
        idCotizacion: item.idCotizacion,
        idGrupoUnidad: item.idGrupoUnidad,
        idServicioUnidad: item.idServicioUnidad,
        tipoOrden: tipoOrden.idTipoOrden,
        tipoCargoUnidad: this.sumaType,
        imprimeFactura: this.imprime,
        idCfdi: this.idCfdi,
      };

      if (this.modalGestoria) { //POSTERIORES
        this.pricingService.actualizaTipoOdenServicioGruposMovs(actualizaServicio).subscribe((resp: any) => {
          if (resp[0].Success === 1)
            this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
          else
            this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
        });
      }
      else {
        this.pricingService.actualizaTipoOdenServicioGrupos(actualizaServicio).subscribe((resp: any) => {
          if (resp[0].Success === 1)
            this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
          else
            this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
        });
      }
    }
  }

  cfdiOnChangeHeader(cfdi: Cfdi) {
    if (cfdi) {
      this.idCfdi = cfdi.idCfdi;
      this.strUsoCFD = cfdi.nombre;
      this.actualizaDesdeEncabezado();
      /*
      this.pricingService
        .updateCfdiAdicionales(this.idCotizacion, cfdi.idCfdi).subscribe(async (update) => { });
        */
    }
    else {

    }
  }

  cfdiOnChange(cfdi: Cfdi, item) {
    if (cfdi) {
      this.idCfdi = cfdi.idCfdi;
      this.activo = true;
      /*
      this.pricingService
        .updateCfdiAdicionales(this.idCotizacion, cfdi.idCfdi).subscribe(async (update) => { });
        */

      if (this.tipoAdicional == 'TRAMITES') {
        const actualizaTramite = {
          idCotizacion: item.idCotizacion,
          idGrupoUnidad: item.idGrupounidad,
          idTramite: item.idTramite,
          idSubtramite: item.idSubtramite,
          tipoOrden: '',//tipoOrden.idTipoOrden,
          idCfdi: cfdi.idCfdi,
        };

        if (this.modalGestoria) {//POSTERIORES
          this.pricingService.actualizaTipoOdenTramiteGruposMovs(actualizaTramite).subscribe((resp: any) => {
            if (resp[0].Success === 1)
              this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
            else
              this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
          });
        }
        else {
          this.pricingService.actualizaTipoOdenTramiteGrupos(actualizaTramite).subscribe((resp: any) => {
            if (resp[0].Success === 1)
              this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
            else
              this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
          });
        }
      }
      if (this.tipoAdicional == 'ACCESORIOS_AD') {
        const actualizaAccesorio = {
          idCotizacion: item.idCotizacion,
          idGrupoUnidad: item.idGrupoUnidad,
          idAccesorioNuevo: item.idAccesorioNuevo,
          idParte: item.idParte,
          tipoOrden: 'FI',
          tipoCargoUnidad: this.sumaType,
          imprimeFactura: this.imprime,
          idCfdi: this.idCfdi,
        };
        this.pricingService.actualizaTipoOdenAccesorioGruposMovs(actualizaAccesorio).subscribe((resp: any) => {
          if (resp[0].Success === 1)
            this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
          else
            this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
        });
      }
    }
    else {
      this.idCfdi = {} as any;
      this.activo = false;
      this.cfdiNgSelect.setDisabledState(false);
      //this.idCfdiAdicionales = undefined;
    }
  }

  closeModal() {
    this.activeModal.close(true);
  }

  actualizaTipoOrden() {
    this.pricingService.updateGruposTipoOrden(this.idCotizacion, this.numeroGrupoUnidad, this.idTipoOrden, (this.idCfdi === undefined) ? '99' : this.idCfdi, this.sumaType, this.imprime).subscribe(async (update) => {
      this.toastrService.success('Se actualizo correctamente el tipo de orden para el grupo: ' + this.numeroGrupoUnidad, 'Tipo de Orden');
      //this.groupTablas.ngOnInit();
    });

    this.activeModal.close(true);
  }

  onProfitSelectionChange(value, texto) {
    this.sumaType = value;
    this.strSuma = texto;
    this.actualizaDesdeEncabezado();
  }

  changeValueImprime() {
    this.imprime = !this.imprime;
    this.strImprime = (this.imprime) ? 'SI' : 'NO';
    this.actualizaDesdeEncabezado();
  }

  actualizaDesdeEncabezado() {
    if (this.tipoAdicional == 'ACCESORIOS') {
      const actualizaAccesorio = {
        idCotizacion: this.idCotizacion,
        idGrupoUnidad: this.idGrupoUnidad,
        idAccesorioNuevo: 0,
        idParte: '',
        tipoOrden: '',
        tipoCargoUnidad: this.sumaType,
        imprimeFactura: this.imprime,
        idCfdi: this.idCfdi,
      };

      if (this.modalGestoria) {//POSTERIORES
        this.pricingService.actualizaTipoOdenAccesorioGruposMovs(actualizaAccesorio).subscribe((resp: any) => {
          if (resp[0].Success === 1)
            this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
          else
            this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
        });
      }
      else {
        this.pricingService.actualizaTipoOdenAccesorioGrupos(actualizaAccesorio).subscribe((resp: any) => {
          if (resp[0].Success === 1)
            this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
          else
            this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
        });
      }
    }
    if (this.tipoAdicional == 'SERVICIOS') {
      const actualizaServicio = {
        idCotizacion: this.idCotizacion,
        idGrupoUnidad: this.idGrupoUnidad,
        idServicioUnidad: 0,
        tipoOrden: '',
        tipoCargoUnidad: this.sumaType,
        imprimeFactura: this.imprime,
        idCfdi: this.idCfdi,
      };

      if (this.modalGestoria) {//POSTERIORES
        this.pricingService.actualizaTipoOdenServicioGruposMovs(actualizaServicio).subscribe((resp: any) => {
          if (resp[0].Success === 1)
            this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
          else
            this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
        });
      }
      else {
        this.pricingService.actualizaTipoOdenServicioGrupos(actualizaServicio).subscribe((resp: any) => {
          if (resp[0].Success === 1)
            this.toastrService.success(resp[0].Mensaje, 'Tipo de Orden');
          else
            this.toastrService.error(resp[0].Mensaje, 'Tipo de Orden');
        });
      }
    }
  }

  onFiltroSelectionChange(filtro: number) {

    if (this.tipoAdicional == 'ACCESORIOS') {
      switch (filtro) {
        case 0:
          this.accesoriosRows = this.accesoriosRowsOriginal;
          break;
        default:
          this.accesoriosRows = this.accesoriosRowsOriginal.filter(item => item.idEstatus === filtro)
          break;
      }
    }

    if (this.tipoAdicional == 'SERVICIOS') {
      switch (filtro) {
        case 0:
          this.serviciosRows = this.serviciosRowsOriginal;
          break;
        default:
          this.serviciosRows = this.serviciosRowsOriginal.filter(item => item.idEstatus === filtro)
          break;
      }
    }

    if (this.tipoAdicional == 'TRAMITES') {
      switch (filtro) {
        case 0:
          this.tramitesRows = this.tramitesRowsOriginal;
          break;
        default:
          this.tramitesRows = this.tramitesRowsOriginal.filter(item => item.idEstatus === filtro)
          break;
      }
    }
  }
  /*
  getRowClass = (row) => {
     {
       console.log(row.idEstatus);
      switch(row.idEstatus){
        case 1:
        return {'uno': true};
        case 2:
        return {'dos': true};
        case 3:
        return {'tres': true};
        case 4:
        return {'cuatro': true};
        default:
        return {'uno': false};
      }      
    };
 }*/

}
