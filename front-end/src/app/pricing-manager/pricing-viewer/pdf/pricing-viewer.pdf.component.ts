import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Cotizacion, Cliente, ClienteFilter, GrupoUnidades, Traslado } from 'src/app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { PricingService, ClientCatalogService, TrasladosCatalogService, CondionesVentaService } from 'src/app/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from '../../../../environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-pricing-viewer-pdf',
  templateUrl: './pricing-viewer.pdf.component.html',
  styleUrls: ['./pricing-viewer.pdf.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class PricingViewerPDFComponent implements OnInit, AfterViewInit {

  public cotizacion;
  public emailClient;
  public type;
  public verUtilidad;
  public isDirector = false;
  original;
  gruposUnidades = [] as any[];
  rutas = [] as any[];
  CfdisRows: any[] = [];
  innerHTML: SafeHtml;
  htmlContent;
  contacto = '';
  to = '';
  isTo: boolean;
  subject = '';
  body = '';
  isLoading;
  toDay = new Date();
  fecha= '';
  cotizacionUG: Cotizacion;

  condicionesIn = [
    { idCondicion: 'C0', nombre: 'CREDITO' },
    { idCondicion: 'C1', nombre: 'CONTADO' }
  ] as any;

  config: ScrollToConfigOptions = {
    target: 'INITIAL',
    offset: -200,
    duration: 350
  };

  cliente = {
    rfc: '',
    nombreCompleto: '',
    celular: '',
    telefono: '',
    correo: ''
  };
  lastDayOfMonth;

  marca = '';
  id = '';  

  constructor(
    private trasladoService: TrasladosCatalogService,
    private activeModal: NgbActiveModal,
    private sellingService: CondionesVentaService,
    private pricingService: PricingService,
    private sanitizer: DomSanitizer,
    private toasterService: ToastrService,
    private clientService: ClientCatalogService,
    private datePipe: DatePipe
  ) { 
      this.fecha = this.datePipe.transform(this.toDay, 'yyyy-MM-dd');
    }

  ngOnInit() {
    this.isLoading = true;
    this.pricingService.getUnidadesCierreByIdCotizacion(this.cotizacion.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      this.cotizacionUG = cotizacion;
      this.gruposUnidades = this.cotizacionUG.gruposUnidades;

      for (let i=0; i < this.gruposUnidades.length; i++)
      {
        this.pricingService.getDetalleUnidadGrupoByIdCotizacionGrupo(this.cotizacion.idCotizacion, this.gruposUnidades[i].idGrupoUnidad).subscribe((detalleUnidades: any) => {
          
          this.gruposUnidades[i].detalleUnidades = detalleUnidades;
        });
        console.log('|XXX');
        console.log(this.gruposUnidades);
      }

      setTimeout(() => {
        this.isLoading = false;
        const d = new Date();
        this.id = d.getTime() + '';
      }, 1500);

      const today = new Date();
      this.marca = this.cotizacion.idMarca;
      this.lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      this.isTo = environment.production;
      //this.gruposUnidades = this.cotizacion.gruposUnidades;
      this.trasladoService.getTraslados().subscribe((rutas: Traslado[]) => {
        this.rutas = rutas;
      });
      this.sellingService.getAllCfdi().subscribe(res => {
        this.CfdisRows = Object.assign([], res);
      });
      this.pricingService.getCondicionesEntrega(this.cotizacion.idCotizacion).subscribe(response => {
        const html = '<h2 class="general-titles">Condiciones de Entrega</h2><hr>';
        this.htmlContent = (response.toString());
        this.innerHTML = this.sanitizer.bypassSecurityTrustHtml(html + this.htmlContent);
      });
      this.to = this.emailClient;
      this.subject = 'Cotizaci\u00F3n ' + this.cotizacion.idCotizacion;
      this.clientService.getCliente(this.cotizacion.idCliente).subscribe((cliente: Cliente) => {
        this.cliente = cliente;
      });
      this.original = this.cotizacion.clienteOriginal;
      this.clientService.getCliente(this.cotizacion.idClienteContacto).subscribe((cliente: Cliente) => {
        this.contacto = cliente.nombreCompleto;
      });

      /*
          this.notificationService.createNotification(notification, isCredito).subscribe( 
            res => {
            notification.descripcion = 'Aprobación de Unidad: ' + unidadesInteres;
            notification.idTipoNotificacion = 9;
            this.notificationService.createNotification(notificationUnidades, isUnidadesInteres).subscribe( res2 => {
              notification.descripcion = 'Autorización de porcentaje de utilidad: ' + '%' + utilidad + aditionalInfo;
              notification.idTipoNotificacion = 2;
              this.notificationService.createNotification(notification, isUtilidad).subscribe( res3 => {
                notification.descripcion = 'Autorización de porcentaje de utilidad en traslados ' + aditionalInfo;
                notification.idTipoNotificacion = 12;
                this.notificationService.createNotification(notification, isMagerTraslado).subscribe( res4 => {
      */
     console.log('YYYY');
    });

    console.log('ZZZZ');

  }

  ngAfterViewInit(): void {
  }

  save() {
  }

  cancel() {
    this.activeModal.close(false);
  }

  download() {
    const widthC = document.getElementById('documento').offsetWidth;
    const heightC = document.getElementById('documento').offsetHeight;
    const options = { background: 'white', height: heightC, width: 1200 };
    const isP = (heightC < 1000) ? '1' : 'p';

    html2canvas(document.getElementById('documento')).then((canvas) => {
      console.log(canvas);
      const doc = new jsPDF(isP, 'mm', [(1200 / 1.27), (heightC / 1.18)]);
      //var doc = new jsPDF("p", "mm", "a4");
      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();


      const imgData = canvas.toDataURL('image/PNG', 1.0);
      //doc.addImage(imgData, 'PNG', 10, 0, 0, 0, undefined, 'FAST');
      doc.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');

      const pdfOutput = doc.output();
      const buffer = new ArrayBuffer(pdfOutput.length);
      const array = new Uint8Array(buffer);
      for (let i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }
      const fileName = this.cotizacion.idCotizacion;
      doc.save(fileName);
      this.activeModal.close(false);
    });
  }

  plus(){
    
  }


  sendEmail() {
    const widthC = document.getElementById('documento').offsetWidth; //'allPDF'
    const heightC = document.getElementById('documento').offsetHeight;
    const options = { background: 'white', height: heightC, width: 1200 };
    const isP = (heightC < 1000) ? '1' : 'p';
    html2canvas(document.getElementById('documento')).then((canvas) => {
      const doc = new jsPDF(isP, 'mm', [(1200 / 1.27), (heightC / 1.18)]);
      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();

      const imgData = canvas.toDataURL('image/PNG');
      //doc.addImage(imgData, 'PNG', 10, 0, 0, 0, undefined, 'FAST');
      doc.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
      const pdfOutput = doc.output();
      const buffer = new ArrayBuffer(pdfOutput.length);
      const array = new Uint8Array(buffer);
      for (let i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }
      const fileName = this.cotizacion.idCotizacion;
      const request = {
        para: [
          this.to
        ],
        asunto: this.subject,
        cuerpo: this.body,
        adjuntos: [
          {
            nombre: this.cotizacion.idCotizacion + '.pdf',
            contenido: doc.output('datauri')
          }
        ]
      };
      this.pricingService.enviarCorreo(request).subscribe(res => {
        this.toasterService.success('Correo Enviado');
        this.activeModal.close(false);
      });
    });
  }



  cargoAccesorios(unidades) {
    let total = 0;
    if(unidades.accesorios){
      unidades.accesorios.forEach(element => {
        total += (element.cantidad * element.precio);
      });
    }
    return total;
  }

  cargoServicios(unidades) {
    let total = 0;
    if(unidades.serviciosUnidad){
      unidades.serviciosUnidad.forEach(servicios => {
        total += (((servicios.cantidad) ? servicios.cantidad : 1) * servicios.precio);
      });
    }
    return total;
  }

  cargoTramites(unidades) {
    let total = 0;
    if(unidades.tramites){
      unidades.tramites.forEach(tra => {
        total += (((tra.cantidad) ? tra.cantidad : 1) * tra.precio);
      });
    }
    return total;
  }

  cargoSubTotal(unidades) {
    return this.cargoAccesorios(unidades) + this.cargoServicios(unidades) + this.cargoTramites(unidades);
  }

  getUtilidadTotal(unidades) {
    let total = 0;
    if(unidades.serviciosUnidad){
      unidades.serviciosUnidad.forEach(ser => {
        total += (ser.precio);
      });
    }
    if(unidades.tramites){
      unidades.tramites.forEach(ser => {
        total += ser.precio;
      });
    }
    if(unidades.accesorios){
      unidades.accesorios.forEach(ser => {
        total += (ser.precio * ser.cantidad);
      });
    }
    return total;
  }

  getNombreUbicacion(idTraslado, type) {
    if (this.rutas.length > 0 && idTraslado) {
      const ruta = this.rutas.filter(rt => {
        return rt.idTraslado === idTraslado;
      })[0];
      if (type === 'Destino') {
        return ruta.ubicacionDestino.nombre;
      } else {
        return ruta.ubicacionOrigen.nombre;
      }
    } else {
      return '';
    }
  }

  getTraslados(row) {
    const childs = this.list_to_tree(row);
    return childs;
  }

  list_to_tree(list) {
    const map = {};
    let node;
    const roots = [];

    for (let i = 0; i < list.length; i += 1) {
      map[list[i].idCotizacionTraslado] = i;
      list[i].children = [];
    }

    for (let i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.idCotizacionTrasladoPadre && node.idCotizacionTrasladoPadre !== '0') {
        list[map[node.idCotizacionTrasladoPadre]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }


  getCfdfiName(item) {
    if (this.CfdisRows && this.CfdisRows.length > 0 && item) {
      return this.CfdisRows.filter(cfdi => {
        return cfdi.idCfdi === item;
      })[0].nombre;
    } else {
      return '';
    }
  }

  getCfdfiAdicionalName(item) {
    if (this.CfdisRows && this.CfdisRows.length > 0 && item) {
      return this.CfdisRows.filter(cfdi => {
        return cfdi.idCfdi === item;
      })[0].nombre;
    } else {
      return '';
    }
  }

  getDescription(idContition) {
    return this.condicionesIn.filter(item => {
      return idContition === item.idCondicion;
    })[0].nombre;
  }

  print() {
    window.print();
  }

}
