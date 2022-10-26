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

@Component({
    selector: 'app-invoice-order-modal',
    templateUrl: './invoice-order-modal.component.html',
    styleUrls: ['./invoice-order-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [PricingManagerService]
  })
  
export class InvoiceOrderComponent implements OnInit {

    @Input() idSolicitudCotizacion: number;
    @Input() idSolicitudGrupo: number;
    @Input() idSolicitudEntregas: number;
    @Input() consecutivo: number;
    @Input() entregaEstimada: number;

    paqueteModal:any;
    solicitudGrupo: any;
    formVehiculo: FormGroup;
    interiorColors = [];
    exteriorColors = [];
    empresa: number;
    anio: number;

    @ViewChild('ngSelectColorInterior') ngSelectColorInterior: NgSelectComponent;
    @ViewChild('ngSelectColorExterior') ngSelectColorExterior: NgSelectComponent;

    constructor(public modalService: NgbModal,
        public activeModal: NgbActiveModal,
        private router: Router,
        private toastrService: ToastrService,
        private newUnitsService: NewUnitsService,
        private httpRequestService: HttpRequestService) { }

    ngOnInit() {
        this.initForm();
        this.idSolicitudCotizacion = Number(localStorage.getItem('idSolicitudCotizacion'));
        this.solicitudGrupo = JSON.parse(localStorage.getItem('solicitudGrupo'));   
        this.llenaColor();    
    }

    initForm = () => {
        this.formVehiculo = new FormGroup({
         interiorColor: new FormControl('', [Validators.required]),
         exteriorColor: new FormControl('', [Validators.required]),
        });
      }

      clearAllSelects = () => {
        this.ngSelectColorInterior.clearModel();
        this.interiorColors = [];
        this.ngSelectColorExterior.clearModel();
        this.exteriorColors = [];
        this.formVehiculo.controls.interiorColor.setValue('');
        this.formVehiculo.controls.exteriorColor.setValue('');
      }

      llenaColor(){

        this.newUnitsService.getInterioresColors(this.solicitudGrupo.idEmpresa, this.solicitudGrupo.idCatalogo, Number(this.solicitudGrupo.anio))
        .subscribe((dataArray: any[]) => {
            console.log(dataArray)
            this.interiorColors = dataArray       
        });

        this.newUnitsService.getExteriorColors(this.solicitudGrupo.idEmpresa, this.solicitudGrupo.idCatalogo, Number(this.solicitudGrupo.anio))
        .subscribe((dataArray: any[]) => {
            this.exteriorColors = dataArray
        });

      }



    saveOrderCompra(){

    if (this.solicitudGrupo.idSolicitudGrupoPedido) {
      const body: any = {
        idSolicitudCotizacion: this.idSolicitudCotizacion,
        idSolicitudGrupo: this.idSolicitudGrupo,
        idSolicitudEntregas: this.idSolicitudEntregas,
        consecutivo: this.consecutivo,
        entregaEstimada: this.entregaEstimada, 
        interiorColors: this.formVehiculo.controls.interiorColor.value,
        exteriorColors: this.formVehiculo.controls.exteriorColor.value, 
      }
      this.httpRequestService.post('solicitud/generarOrdenDeCompra', body).subscribe((data) => {
      if (data[0].Success === 1) {
          this.toastrService.success(`Se ha generado la O.C. exitosamente.`,'GUARDADO EXITOSO');
          this.activeModal.close(true);
        }
        else
        {
          this.toastrService.error(`Error al intentar guardar la OC.`,'GUARDADO ERRONEO');
        }        
      },(err) => {
        console.log(err);
          this.toastrService.error('Error al intentar guardar la OC',
            `ERROR`);
      });
    }  

    }

}