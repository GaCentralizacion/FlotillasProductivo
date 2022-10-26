import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Cotizacion, Cliente, ClienteFilter, GrupoUnidades, GrupoUnidadesUnidadInteres, DetalleUnidades } from 'src/app/models';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { PricingService, ClientCatalogService } from 'src/app/services';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NotificationService } from 'src/app/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { PricingManagerService } from '../../pricing.manager.service';
import { PricingViewerPDFComponent } from '../pdf/pricing-viewer.pdf.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-pricing-viewer-onlyread',
  templateUrl: './pricing-viewer.onlyread.component.html',
  styleUrls: ['./pricing-viewer.onlyread.component.scss'],
  providers: [PricingManagerService],
  encapsulation: ViewEncapsulation.None
})
export class PricingViewerOnlyReadComponent implements OnInit, AfterViewInit {

  @ViewChild(DatatableComponent) mainTable: DatatableComponent;
  @ViewChild('content') content: ElementRef;

  rowHeight = 0;
  lastRowHeight = 0;
  idCotizacion;
  idFlotilla;
  cotizacion;
  original;
  cliente = {
    rfc: '',
    nombreCompleto: '',
    celular: '',
    telefono: '',
    correo: ''
  };
  contacto = '';
  grupoUnidades: GrupoUnidades[];
  selected = [];
  currentGrupoUnidad = 0;
  
  //OCT99
  cotizacionUG: Cotizacion;
  unidadesInteresesUG: GrupoUnidadesUnidadInteres[];
  accesoriosUG: [];
  tramitesUG: [];
  serviciosUnidadUG: [];
  unidadesGrupo: DetalleUnidades[];

  htmlContent;
  isClose = false;
  verUtilidad = false;
  isLoading = false;
  constructor(
    private router: Router,
    private pricingService: PricingService,
    private route: ActivatedRoute,
    private clientService: ClientCatalogService,
    private toastSerivce: ToastrService,
    public pricingManagerService: PricingManagerService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const token = JSON.parse(localStorage.getItem('app_token'));
    const cotizacionModule = token.data.permissions.modules.find(m => m.name == 'Cotizaciones');
    if (cotizacionModule) {
      this.verUtilidad = cotizacionModule.objects.some(o => (o.name == 'verUtilidad' && o.authorized == true));
    }
    this.getParams();
    this.getCotizacionesById();
  }

  ngAfterViewInit(): void {
  }


  getParams() {
    this.route.queryParams.subscribe(params => {
      this.idFlotilla = params.idFlotilla;
      this.idCotizacion = params.idCotizacion;
    });
  }

  getTotal() {
    let total = 0;
    if (this.cotizacion) {
    this.cotizacion.gruposUnidades.forEach( row => {
      total += (row.precioTotalTotal);
    });
  }
    return total;
  }


  onSelect(event) {
  }

  getCotizacionesById() {
    this.isLoading = true;
    //OCT99
    this.pricingService.getUnidadesInteresGrupoByIdCotizacion(this.idCotizacion).subscribe((unidadesInteres: any) => {
      this.unidadesInteresesUG = unidadesInteres;
    });

    this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {

      //OCT99
      /*
      this.pricingService.getUnidadesInteresByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {  
        this.grupoUnidades = cotizacion.gruposUnidades;
      });
      */
     //OCT99
      this.cotizacion = cotizacion;

     this.pricingService.getUnidadesCierreByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {  
        this.cotizacionUG = cotizacion;
        this.grupoUnidades = this.cotizacionUG.gruposUnidades;

        this.isLoading = false;
        if (cotizacion.status === 'EN PROCESO') {
          this.pricingManagerService.onlyRead = false;
        } else {
          this.pricingManagerService.onlyRead = true;
        }

        //OCT99 SOLO LECTURA
        if(this.pricingManagerService.perfilSoloLectura)
          this.pricingManagerService.onlyRead = true;  

        this.isClose = true;
        this.cotizacion = cotizacion;
        this.original = cotizacion.clienteOriginal;
        //OCT99
        //this.grupoUnidades = cotizacion.gruposUnidades;
        this.clientService.getCliente(this.cotizacion.idCliente).subscribe((cliente: Cliente) => {
          this.cliente = cliente;
        });
        this.clientService.getCliente(this.cotizacion.idClienteContacto).subscribe((cliente: Cliente) => {
          this.contacto = cliente.nombreCompleto;
        });
      });
    });
  }
  /*
  toggleExpandRow(row) {
    if (this.currentGrupoUnidad !== row.idGrupoUnidad) {
      if (this.currentGrupoUnidad > 0) {
        this.mainTable.rowDetail.collapseAllRows();
      }
    }
    this.mainTable.rowDetail.toggleExpandRow(row);
    this.rowHeight = (row.detalleUnidades.length * 33) + 20;
    this.lastRowHeight = (row.detalleUnidades.length * 33) + 20;
    this.currentGrupoUnidad = row.idGrupoUnidad;
  }
  */
  toggleExpandRow(row) {
    this.pricingService.getDetalleUnidadGrupoByIdCotizacionGrupo(row.idCotizacion,row.idGrupoUnidad).subscribe((unidadesGrupo: any) => {
      if (this.currentGrupoUnidad !== row.idGrupoUnidad) {
        if (this.currentGrupoUnidad > 0) {
          this.mainTable.rowDetail.collapseAllRows();
        }
      }
      this.mainTable.rowDetail.toggleExpandRow(row);
      //this.rowHeight = (row.detalleUnidades.length * 33) + 20;
      //this.lastRowHeight = (row.detalleUnidades.length * 33) + 20;
      this.rowHeight = (unidadesGrupo.length * 33) + 20;
      this.lastRowHeight = (unidadesGrupo.length * 33) + 20;
      this.currentGrupoUnidad = row.idGrupoUnidad;
    });
  }

  getUtilidadTotal(unidades) {
    let total = 0;
    unidades.serviciosUnidad.forEach(ser => {
      total += (ser.precio);
    });
    unidades.tramites.forEach(ser => {
      total += ser.precio;
    });
    unidades.accesorios.forEach(ser => {
      total += (ser.precio * ser.cantidad);
    });
    return total;
  }
  /*
  expandRow(unidades, row) {
    const current = unidades.expand;
    this.rowHeight = this.lastRowHeight;
    row.detalleUnidades.forEach(unidad => {
      if (unidad.expand) {
        unidad.expand = false;
      }
    });
    if (current) {
      unidades.expand = false;
    } else {
      unidades.expand = true;
      this.rowHeight += (unidades.tramites.length * 33) + 20 + (unidades.accesorios.length * 33) + (unidades.serviciosUnidad.length * 33);
    }
  }
  */
  expandRow(unidades, row) {

    this.pricingService.getAdicionalesCierrebyIdCotizacionGrupoUnidad(row.idCotizacion,row.idGrupoUnidad).subscribe((adicionales: any) => { 
      //console.log('expandRow - > unidades');
      //console.log(unidades);
      this.pricingService.getDetalleUnidadGrupoByIdCotizacionGrupo(row.idCotizacion,row.idGrupoUnidad).subscribe((unidadesGrupo: any) => {
      
        //this.unidadesGrupo = unidadesGrupo;

        unidades.accesorios = adicionales[0];
        unidades.tramites = adicionales[1];
        unidades.serviciosUnidad = adicionales[2];

        this.accesoriosUG = unidades.accesorios;      
        this.tramitesUG = unidades.tramites;
        this.serviciosUnidadUG = unidades.serviciosUnidad;

        /*
        console.log('this.accesoriosUG');
        console.log(this.accesoriosUG);
        console.log('this.tramitesUG');
        console.log(this.tramitesUG);
        console.log('this.serviciosUnidadUG');
        console.log(this.serviciosUnidadUG);
        */
        const current = unidades.expand;
        this.rowHeight = this.lastRowHeight;
        //row.detalleUnidades.forEach(unidad => {
        unidadesGrupo.forEach(unidad => {
          if (unidad.expand) {
            unidad.expand = false;
          }
        });
        if (current) {
          unidades.expand = false;
        } else {
          unidades.expand = true;
          //this.rowHeight += (unidades.tramites.length * 33) + 20 + (unidades.accesorios.length * 33) + (unidades.serviciosUnidad.length * 33);
          this.rowHeight += (this.tramitesUG.length * 33) + 20 + (this.accesoriosUG.length * 33) + (this.serviciosUnidadUG.length * 33);
        }
      });
    });
  }

  onDetailToggle(evento: { type: string, value: GrupoUnidades }) {
    if (evento.value.isToggled === undefined) {
      return;
    }
    evento.value.isToggled = !evento.value.isToggled;
    if (evento.value.isToggled) {
      const scrollWidth = this.mainTable.bodyComponent.scroller.parentElement.scrollWidth;
      this.mainTable.bodyComponent.scroller.parentElement.scroll(scrollWidth, 0);
    }
  }

  cargoAccesorios(unidades) {
    let total = 0;
    unidades.accesorios.forEach(element => {
      total += (element.cantidad * element.precio);
    });
    return total;
  }

  cargoServicios(unidades) {
    let total = 0;
    unidades.serviciosUnidad.forEach(servicios => {
      total += (((servicios.cantidad) ? servicios.cantidad : 1) * servicios.precio);
    });
    return total;
  }

  cargoTramites(unidades) {
    let total = 0;
    unidades.tramites.forEach(tra => {
      total += (((tra.cantidad) ? tra.cantidad : 1) * tra.precio);
    });
    return total;
  }

  cargoSubTotal(unidades) {
    return this.cargoAccesorios(unidades) + this.cargoServicios(unidades) + this.cargoTramites(unidades);
  }

  exportPDF(type) {
    const modalPDF = this.modalService.open(PricingViewerPDFComponent, { size: 'lg' });
    modalPDF.componentInstance.cotizacion = this.cotizacion;
    modalPDF.componentInstance.type = type;
    modalPDF.componentInstance.emailClient = this.cliente.correo;
    modalPDF.componentInstance.verUtilidad = this.verUtilidad;
    modalPDF.componentInstance.isDirector = true;
    modalPDF.result.then((isSaved: boolean) => {
      if (isSaved) {
        this.ngOnInit();
        this.selected = [];
      }
    });
  }

  //OCT99
  muestraUnidadesGrupo(evento: { type: string, value: GrupoUnidades }) {

    this.pricingService.getDetalleUnidadGrupoByIdCotizacionGrupo(this.idCotizacion,evento.value.idGrupoUnidad).subscribe((unidadesGrupo: any) => {
       
      this.unidadesGrupo = unidadesGrupo;

      if (evento.value.isToggled === undefined) {
        return;
      }
      evento.value.isToggled = !evento.value.isToggled;
      if (evento.value.isToggled) {
        const scrollWidth = this.mainTable.bodyComponent.scroller.parentElement.scrollWidth;
        this.mainTable.bodyComponent.scroller.parentElement.scroll(scrollWidth, 0);
      }
    });    
  }

}
