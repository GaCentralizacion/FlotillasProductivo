import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Cfdi, TipoOrden, GrupoUnidades } from 'src/app/models';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PricingService, ClientCatalogService } from 'src/app/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { GroupTablesComponent } from '../group-tables/group-tables.component';
import { ToastrService } from 'ngx-toastr';
import { PricingManagerService } from 'src/app/pricing-manager/pricing.manager.service';

@Component({
  selector: 'app-configura-tipo-orden',
  templateUrl: './configura-tipo-orden.component.html',
  styleUrls: ['./configura-tipo-orden.component.scss'],
  providers: [PricingManagerService]
})
export class ConfiguraTipoOrdenComponent implements OnInit {

  @Input() GrupoUnidad: GrupoUnidades;
  @Input() idCotizacion: string;
  @Input() modalGestoria: boolean;
  @Input() edit: boolean;

  form1: FormGroup;
  idTipoOrden: string;
  idCfdi: string;
  tipoOrden: TipoOrden[];
  cfdi: Cfdi;
  numeroGrupoUnidad: number;
  cantidad: number;
  activo = true;
  curadio = {
    suma: true,
    nosuma: false
  };
  imprime = false;
  sumaType = 'Suma';
  CfdisCatalogo: any = [];

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
    this.getCfdiCatalogo();

    /*
    this.pricingService.getAdicionalesCierrebyIdCotizacionGrupoUnidad(this.cotizacion.idCotizacion,this.idGrupoUnidad).subscribe((adicionales: any) => {

    });*/
    this.numeroGrupoUnidad = this.GrupoUnidad.idGrupoUnidad;
    this.cantidad = this.GrupoUnidad.cantidad;

    if (this.GrupoUnidad.tipoCargoUnidad === 'NoSuma') {
      this.curadio.nosuma = true;
      this.curadio.suma = false;
      this.sumaType = 'NoSuma';
    } else {
      this.curadio.nosuma = false;
      this.curadio.suma = true;
      this.sumaType = 'Suma';
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
        // this.cfdiNgSelect.setDisabledState(true);
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
  }

  getCfdiCatalogo() {
    this.pricingService.cfdiCliente('-1','-1','-1',this.idCotizacion).subscribe((res: any) => {
      const cfdis = res;

      cfdis.map(cfdi => {
        this.CfdisCatalogo.push({"idCfdi":cfdi.CUC_CVEUSOCFDI,"nombre":cfdi.CUC_DESCRIPCION})
      })
      this.cfdi = JSON.parse(JSON.stringify(this.CfdisCatalogo));
  })
}

  tipoOrdenOnChange(tipoOrden: TipoOrden) {

    if (tipoOrden) {

      this.idTipoOrden = tipoOrden.idTipoOrden;

      if (tipoOrden.idTipoOrden === 'CU') {
        this.idCfdi = undefined;
        this.activo = true;
        this.cfdiNgSelect.setDisabledState(true);
      } else {
        this.idCfdi = {} as any;
        this.activo = false;
        this.cfdiNgSelect.setDisabledState(false);
      }
    }
    else {
      this.idCfdi = undefined;
      this.activo = false;
      this.cfdiNgSelect.setDisabledState(true);
    }

  }

  cfdiOnChange(cfdi: Cfdi) {
    if (cfdi) {
      this.idCfdi = cfdi.idCfdi;
      this.activo = true;
      /*
      this.pricingService
        .updateCfdiAdicionales(this.idCotizacion, cfdi.idCfdi).subscribe(async (update) => { });
        */
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

    this.pricingService.updateGruposTipoOrden(this.idCotizacion, this.numeroGrupoUnidad, this.idTipoOrden, (this.idCfdi === undefined) ? '99' : this.idCfdi, this.sumaType, this.imprime)
    .subscribe(async (update: any) => {
     if(update.affectedRows[0].Success == 1 || update.affectedRows[0].Success == '1'){
        this.toastrService.success('Se actualizo correctamente el tipo de orden para el grupo: ' + this.numeroGrupoUnidad, 'Tipo de Orden');
        this.activeModal.close(true);
      } else{
        this.toastrService.warning(update.affectedRows[0].Mensaje, 'Tipo de Orden');
      }

      //this.groupTablas.ngOnInit();
    });


  }

  onProfitSelectionChange(value) {
    this.sumaType = value;
  }

  changeValue() {
    this.imprime = !this.imprime;
  }

}
