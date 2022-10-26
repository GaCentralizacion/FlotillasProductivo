import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionType } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { InvoiceModalComponent } from '../invoice-form-modal/invoice-form-modal.component';
import { Router } from '@angular/router';
import { InvoiceOrderComponent } from '../invoice-order-modal/invoice-order-modal.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  formPedido: FormGroup;
  formEntrega: FormGroup;
  loadingIndicator: boolean;
  solicitudGrupo: any;
  SelectionType = SelectionType;
  entregas = [];
  estatus = [];
  idSolicitudCotizacion: number;
  totalFacturadas = 0;
  solicitudGrupoEntrega: any = {};
  banderaProceso;
  banderaFacturar: number;
  banderaConsecutivo: number;
  banderaEditar:number=1;
  paqueteModal:any;
  showFormFacturar: boolean;
  idCotizacionSelect;

    meses = [
    { id: 1, nombre: 'ENERO' }, { id: 2, nombre: 'FEBRERO' }, { id: 3, nombre: 'MARZO' },
    { id: 4, nombre: 'ABRIL' }, { id: 5, nombre: 'MAYO' }, { id: 3, nombre: 'JUNIO' },
    { id: 7, nombre: 'JULIO' }, { id: 8, nombre: 'AGOSTO' }, { id: 9, nombre: 'SEPTIEMBRE' },
    { id: 10, nombre: 'OCTUBRE' }, { id: 11, nombre: 'NOVIEMBRE' }, { id: 12, nombre: 'DICIEMBRE' },
  ];

  //anios = ['2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036'];
  anios = ['2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  constructor(public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private router: Router,
    private toastrService: ToastrService,
    private httpRequestService: HttpRequestService) { }
    

  ngOnInit() {
    this.initForm();
    this.getEstatusPedido();
    if (localStorage.getItem('idSolicitudCotizacion')) {
      this.idSolicitudCotizacion = Number(localStorage.getItem('idSolicitudCotizacion'));
      this.solicitudGrupo = JSON.parse(localStorage.getItem('solicitudGrupo'));
      this.getPedido();
      this.getPedidoEntrega();
    }
  }

  getEstatusPedido = () => {
    this.httpRequestService.get('solicitud/getEstatusPedidoPlanta').subscribe((data: any) => {
      this.estatus = data;
    });
  }

  initForm = () => {
    this.formPedido = new FormGroup({
      folioPlanta: new FormControl('', [Validators.required]),
      fechaIngresoFolio: new FormControl('', [Validators.required]),
      fechaProbableEntrega: new FormControl('', [Validators.required]),
      estatusPedidoPlanta: new FormControl('', [Validators.required])
    });

    this.formEntrega = new FormGroup({
      mes: new FormControl('', [Validators.required]),
      anio: new FormControl('', [Validators.required]),
      entregaEstimada: new FormControl('0', [Validators.required]),
      facturadasPlanta: new FormControl('0', [Validators.required]),
    });
  }

  getPedidoEntrega = () => {
    let entregaEstimada = 0;
    this.httpRequestService.get(`solicitud/getGrupoPedidoEntrega?idSolicitudGrupoPedido=${this.solicitudGrupo.idSolicitudGrupoPedido}`).subscribe((data: any) => {
      this.entregas = data;
      this.entregas = this.entregas.map(e => {
        entregaEstimada += e.entregaEstimada;
        e.idMes = this.meses.find((m: any) => m.nombre == e.mes).id;
        return e;
      });

      this.entregas = this.entregas.sort(function (a, b) {
        return a.idMes - b.idMes;
      });

      this.formEntrega.controls.entregaEstimada.setValue(this.solicitudGrupo.cantidad - entregaEstimada);
    });
  }

  generarOrdenDeCompra(){

    //this.addOrderCompra();

    // if (this.solicitudGrupo.idSolicitudGrupoPedido) {
    //   const body: any = {
    //     idSolicitudCotizacion: this.solicitudGrupo.idSolicitudCotizacion,
    //     idSolicitudGrupo: this.solicitudGrupo.idSolicitudGrupo,
    //     idSolicitudEntregas: this.solicitudGrupoEntrega.idSolicitudEntregas,
    //     consecutivo: this.solicitudGrupoEntrega.consecutivo,
    //     entregaEstimada: this.solicitudGrupoEntrega.entregaEstimada,        
    //   }
    //   this.httpRequestService.post('solicitud/generarOrdenDeCompra', body).subscribe((data) => {
    //   if (data[0].Success === 1) {
    //       this.toastrService.success(`Se ha generado la O.C. exitosamente.`,'GUARDADO EXITOSO');
    //       this.getPedido();
    //       this.getPedidoEntrega();
    //     }
    //     else
    //     {
    //       this.toastrService.error(`Error al intentar guardar la OC.`,'GUARDADO ERRONEO');
    //     }        
    //   },(err) => {
    //     console.log(err);
    //       this.toastrService.error('Error al intentar guardar la OC',
    //         `ERROR`);
    //   });
    // }  
    // this.getPedido();
    // this.getPedidoEntrega();
  }

  getPedido = () => {
    if (this.solicitudGrupo.idSolicitudGrupoPedido) {
      let mesT = this.solicitudGrupo.fechaIngresoFolio.split('T');
      let mes = mesT[0].split('-');
      this.formPedido.controls.fechaIngresoFolio.setValue({
        month: Number(mes[1]),
        day: Number(mes[2]),
        year: Number(mes[0])
      });

      mesT = this.solicitudGrupo.fechaProbableEntrega.split('T');
      mes = mesT[0].split('-');
      this.formPedido.controls.fechaProbableEntrega.setValue({
        month: Number(mes[1]),
        day: Number(mes[2]),
        year: Number(mes[0])
      });

      this.formPedido.controls.folioPlanta.setValue(this.solicitudGrupo.folioPlanta);
      this.formPedido.controls.estatusPedidoPlanta.setValue(this.solicitudGrupo.estatusPedidoPlanta);
    }
  }

  addPedido = () => {
    const formfechaIngresoFolio = this.formPedido.value.fechaIngresoFolio;
    const formfechaProbableEntrega = this.formPedido.value.fechaProbableEntrega;

    const fechaIngresoFolio = `${formfechaIngresoFolio.month}/${formfechaIngresoFolio.day}/${formfechaIngresoFolio.year}`
    const fechaProbableEntrega = `${formfechaProbableEntrega.month}/${formfechaProbableEntrega.day}/${formfechaProbableEntrega.year}`

    const body: any = {
      idSolicitudCotizacion: this.solicitudGrupo.idSolicitudCotizacion,
      idSolicitudGrupo: this.solicitudGrupo.idSolicitudGrupoUnidad,
      folioPlanta: this.formPedido.value.folioPlanta,
      estatusPedidoPlanta: this.formPedido.value.estatusPedidoPlanta,
      fechaIngresoFolio,
      fechaProbableEntrega
    }

    if (this.solicitudGrupo.idSolicitudGrupoPedido) {
      body.idSolicitudGrupoPedido = this.solicitudGrupo.idSolicitudGrupoPedido;
    }

    this.httpRequestService.post('solicitud/insertGrupoPedido', body).subscribe((data) => {
      this.solicitudGrupo.idSolicitudGrupoPedido = data[0].idSolicitudGrupoPedido;
      this.toastrService.success(`Se ha guardado el pedido exitosamente.`,
        'GUARDADO EXITOSO');
    }, (err) => {
      this.toastrService.error(`Error al intentar guardar el pedido.`,
        'GUARDADO ERRONEO');
    });

  }

  addEntrega = (editar: boolean) => {
    if (this.solicitudGrupo.idSolicitudGrupoPedido) {
      let entregaEstimada = Number(this.formEntrega.value.entregaEstimada);
      let facturadasPlanta = Number(this.formEntrega.value.facturadasPlanta);

      this.entregas.forEach((ent: any) => {
        if (editar && ent.idSolicitudEntregas == this.solicitudGrupoEntrega.idSolicitudEntregas) {
        } else {
          entregaEstimada = entregaEstimada + ent.entregaEstimada;
          facturadasPlanta = facturadasPlanta + ent.facturadasPlanta;
        }
      });

      //if (entregaEstimada <= this.solicitudGrupo.cantidad && facturadasPlanta <= this.solicitudGrupo.cantidad) {
        const body: any = {
          idSolicitudGrupoPedido: this.solicitudGrupo.idSolicitudGrupoPedido,
          mes: this.formEntrega.value.mes,
          anio: this.formEntrega.value.anio,
          entregaEstimada: Number(this.formEntrega.value.entregaEstimada),
          facturadasPlanta: Number(this.formEntrega.value.facturadasPlanta),
        }
        if (this.solicitudGrupoEntrega.consecutivo != undefined) {
          body.consecutivo = this.solicitudGrupoEntrega.consecutivo;
        }
        if (this.solicitudGrupoEntrega.idSolicitudEntregas && editar) {
          body.idSolicitudEntregas = this.solicitudGrupoEntrega.idSolicitudEntregas;
        }
        this.httpRequestService.post('solicitud/insertGrupoPedidoEntrega', body).subscribe((data) => {
          this.toastrService.success(`Se ha guardado la entrega exitosamente.`,'GUARDADO EXITOSO');
          this.banderaEditar=1
          this.formEntrega.reset();
          this.getPedidoEntrega();
          this.formEntrega.controls.mes.setValue('');
          this.formEntrega.controls.anio.setValue('');
          this.formEntrega.controls.entregaEstimada.setValue(0);
          this.formEntrega.controls.facturadasPlanta.setValue(0);
          //this.formEntrega.controls.consecutivo.setValue(0);
          // this.activeModal.close();
        }, (err) => {
          this.toastrService.error(`Error al intentar guardar la entrega.`,'GUARDADO ERRONEO');
          this.banderaEditar=1
        });
      // } else {
      //   this.toastrService.error(`El total de facturadas/estimadas no puede ser mayor a la cantidad.`,'FACTURADAS A PLANTA MAYOR A LA CANTIDAD');
      //   this.banderaEditar=1
      // }
    } else {
      this.toastrService.error(`Es necesario guardar los datos del pedido.`,'NO DATOS DEL PEDIDO');
      this.banderaEditar=1
    }
  }

  onSelect = ($event: any) => {
    //Si esta seleccionado disabled=false --boton activado
    if ($event.selected.length > 0) {
      this.httpRequestService.get(`solicitud/getOrigenSolicitud?idSolicitudEntregas=${$event.selected[0].idSolicitudEntregas}`).subscribe((data: any) => {
        if (data[0].existe == 1) {
          this.banderaEditar = 1
          this.banderaProceso ='Pendiente Externo'
        } else {
          this.banderaEditar = 0
        }
      })
    } else {
      //caso contrario disabled=true --boton desactivado
      this.banderaEditar = 1
    }
    
    this.solicitudGrupoEntrega = $event.selected[0];
    this.formEntrega.controls.mes.setValue(this.solicitudGrupoEntrega.mes);
    this.formEntrega.controls.anio.setValue(this.solicitudGrupoEntrega.anio);
    this.formEntrega.controls.entregaEstimada.setValue(this.solicitudGrupoEntrega.entregaEstimada);
    this.formEntrega.controls.facturadasPlanta.setValue(this.solicitudGrupoEntrega.facturadasPlanta);

    this.banderaConsecutivo = Number(this.solicitudGrupoEntrega.consecutivo);
    this.banderaProceso = this.solicitudGrupoEntrega.estatus;
    this.banderaFacturar = Number(this.solicitudGrupoEntrega.facturadasPlanta);
    this.idCotizacionSelect = this.solicitudGrupoEntrega.idCotizacion
    
  }

  deleteEntrega = ($event: any) => {
    this.httpRequestService.post('solicitud/deleteGrupoPedidoEntrega', {
      idSolicitudEntregas: $event.idSolicitudEntregas
    }).subscribe((res: any) => {
      this.banderaEditar=1
      this.formEntrega.reset();
      this.toastrService.success(`Se ha eliminado la entrega de forma exitosa.`,'BORRADO EXITOSO');
      if (!res) {
        this.getPedidoEntrega();
      }
    });
  }

  addFactCot= () => {
    const accesorioModal =  this.paqueteModal = this.modalService.open(InvoiceModalComponent, { size: 'lg' });
    this.paqueteModal.componentInstance.idSolicitudCotizacion = this.idSolicitudCotizacion
    this.paqueteModal.componentInstance.idCotizacion = this.idCotizacionSelect

    accesorioModal.result.then(wasSaved => {
      if (wasSaved) {
        this.toastrService.success('Accesorio guardado correctamente', 'Accesorios');
        this.activeModal.close(true);
        this.router.navigate(['main/cotizaciones/manager/adicionales'], 
        {
          queryParams: {
          idFlotilla: wasSaved.idFlotilla, //'F5', //this.currentIdFlotilla'',
          idCotizacion: wasSaved.idCotizacion, // Number(localStorage.getItem('idSolicitudCotizacion')),//this.cotizacionFlotilla.idCotizacion,
          step: 2
          }
        });
      }
    });
  }

  addOrderCompra= () => {
    const accesorioModal =  this.paqueteModal = this.modalService.open(InvoiceOrderComponent, { size: 'lg' });
    this.paqueteModal.componentInstance.idSolicitudCotizacion = this.idSolicitudCotizacion,
    this.paqueteModal.componentInstance.idSolicitudGrupo = this.solicitudGrupo.idSolicitudGrupo,
    this.paqueteModal.componentInstance.idSolicitudEntregas = this.solicitudGrupoEntrega.idSolicitudEntregas,
    this.paqueteModal.componentInstance.consecutivo = this.solicitudGrupoEntrega.consecutivo,
    this.paqueteModal.componentInstance.entregaEstimada = this.solicitudGrupoEntrega.entregaEstimada,

    accesorioModal.result.then(wasSaved => {
    if (wasSaved) {
         // this.activeModal.close(true);
          this.getPedido();
          this.getPedidoEntrega();          
        }
    });
}

  setValueidCotizacion(event, row) {
    row.idCotizacion = event;
  }

  saveCotizacion(row) {  
    
    const vines = [];
    vines.push({
      vin: {
        idSolicitudEntregas: row.idSolicitudEntregas,
        idCotizacion: row.idCotizacion            
      }
    });

    this.httpRequestService.post('solicitud/updSolicitudGrupoPedido', {
      vines: vines,
    }).subscribe((res: any) => {
      if(res[0].mensaje!=''){
        this.toastrService.warning(res[0].mensaje, 'Alerta!');
      }else {
        this.banderaEditar = 1
        this.formEntrega.reset();
        this.toastrService.success(`Se guardado la cotización de forma exitosa.`, 'Exito!');
        this.getPedidoEntrega();
      }           
    });
  }
}
