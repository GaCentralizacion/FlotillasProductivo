import { Component, OnInit, AfterViewInit, ViewChild, Input } from "@angular/core";
import { NgbActiveModal, NgbModal, NgbModalOptions, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";
import { PricingService, ApproveCatalogService } from "src/app/services";
import { ActivatedRoute } from "@angular/router";
import { UtilidadCatalogService } from "../../../services/utilidad.service";
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { Cotizacion, GrupoUnidades, Proveedor, CotizacionTraslado, Cfdi, TipoOrden, AprobacionUtilidadFlotillas} from "../../../models";


@Component({
    selector: "app-modal-utilidad",
    templateUrl: "./modal-utilidad.component.html",
    styleUrls: ["./modal-utilidad.component.scss"],
    providers: [UtilidadCatalogService],
  })

  export class ModalUtilidadComponent implements OnInit {
    @Input() GrupoUnidad: GrupoUnidades;
    @Input() cotizacion: Cotizacion;
    @Input() idCotizacion: string;
    @Input() idGrupoUnidad: number;
    @Input() modalGestoria: boolean;
    @Input() idDetalleUnidad: number;
    
    aprobacionUtilidadFlotillas: AprobacionUtilidadFlotillas[] = [];

    idFlotilla;
    bProStatus;
    gruposUnidades: Cotizacion;
    public selectedRows = [] as any[];
    public idsecuencia = [] as any[];

    secuencia = 'idsecuencia';
    idUsuario = 0;
    numeroGrupoUnidad: number;
    cantidad: number;
    utilidadCot: number;
    utilidadPost: number;
    utilidadAd: number;
    totalUtilidad: number;
    version: string;

    constructor(
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toasterService: ToastrService,
        private catalogService: PricingService,
        private activeRoute: ActivatedRoute,
        private pricingService: PricingService,
        private utilidadservice: UtilidadCatalogService,
        private approveCatalogService: ApproveCatalogService,
    ) {
        this.activeRoute.queryParams.subscribe(params => {
            this.idCotizacion = params.idCotizacion as string;
        });
     }

    ngOnInit() {
      this.pricingService.getPedidoBproStatus(this.idCotizacion).subscribe(res => {
      this.bProStatus = res;
      });
      const userInformation = JSON.parse(localStorage.getItem('app_token'));
      this.idUsuario = userInformation.data.user.id;
        this.utilidadservice.getUtilidad(this.idCotizacion).subscribe((resp: any) => {
          let itemsFiltrados: any = [{}];
          itemsFiltrados = resp;
          const nuevoItm = itemsFiltrados;
          this.idsecuencia = itemsFiltrados.sort((a, b) => {
            if (a.resp === null) {
              return 1;
            } else {
              return -1;
            }
            return 0;
          });
          this.utilidadCot = resp[0].utilidadCot;
          this.utilidadPost = resp[0].utilidadPost;
          this.utilidadAd = resp[0].utilidadAd;
          this.totalUtilidad = resp[0].totalUtilidad;
          this.version = resp[0].version;
        });
       this.getParams();
      this.approveCatalogService.getDirectionsProfits().subscribe((aprobacionesUtilidad: AprobacionUtilidadFlotillas[]) => {
      this.aprobacionUtilidadFlotillas = aprobacionesUtilidad;
       });
    }

    cancel() {
        this.activeModal.close(false);
    }

    tabChanged(tabEvent: NgbTabChangeEvent) {
        this.secuencia = tabEvent.nextId;
    }

    private getParams() {
      this.activeRoute.queryParams.subscribe(params => {
        this.idCotizacion = params.idCotizacion as string;
      });
    }
}
