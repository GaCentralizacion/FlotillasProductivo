import { HttpRequestService } from 'src/app/services/http-request.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionType } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss']
})
export class AssignComponent implements OnInit {
  idSolicitudCotizacion: number;
  solicitudGrupo: any;
  form: FormGroup;
  formPedido: FormGroup;
  SelectionType = SelectionType;
  unidades = [];
  vines = [];
  cantidadVines: number;
  url = '';
  unidad: any;
  lstEstatusUnidad = [];
  entregas= [];
  selectedItem:any
  idSolicitudEntregas: any;
  lstUbicacion = [];

  constructor(public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private router: Router,
    private httpRequestService: HttpRequestService) { }

  ngOnInit() {
    this.initForm();
    if (localStorage.getItem('idSolicitudCotizacion')) {
      this.idSolicitudCotizacion = Number(localStorage.getItem('idSolicitudCotizacion'));
      this.solicitudGrupo = JSON.parse(localStorage.getItem('solicitudGrupo'));
      this.getEntregas();
      this.getUbicacionUnidad();
      this.getEstatusUnidad();            
      // this.getPedidoEntrega();
      // this.getSolicitudCotizacionVehiculos();
    }
  }

  getUnidades = () => {
    this.httpRequestService.get(`solicitud/getGrupoDetalleUnidad?idSolicitudGrupoPedido=${this.solicitudGrupo.idSolicitudGrupoPedido}&&idSolicitudEntregas=${ this.idSolicitudEntregas}`).subscribe((data: any) => {
      this.unidades = data;
    });
  }

  getEstatusUnidad = () => {
    this.httpRequestService.get(`solicitud/getEstatusUnidad`).subscribe((data: any) => {
      this.lstEstatusUnidad = data;
    });
  }

  getUbicacionUnidad = () => {
    this.httpRequestService.get(`solicitud/getUbicacionUnidad`).subscribe((data: any) => {
      this.lstUbicacion = data;
    });
  }

  getEntregas = () => {
    this.httpRequestService.get(`solicitud/getEntregas?idSolicitudGrupoPedido=${this.solicitudGrupo.idSolicitudGrupoPedido}`).subscribe((data: any) => {
      this.entregas = data;
    });
  }

  initForm = () => {
    this.form = new FormGroup({
      vin: new FormControl('', [Validators.required, Validators.maxLength(17), Validators.minLength(17)])
    });
  }

  addUnidadMasiva = () => {
    const vines = [];
    this.vines.forEach((v, index) => {
      if (index > 0) {
        vines.push({
          vin: {
            vin: v[0],
            cotizacion:v[1]== undefined ? 'SN': v[1],
            idUbicacion:v[2]== undefined ? '0': v[2]         
          }
        });
      }
    });
    this.httpRequestService.post('solicitud/insertSolicitudDetalleUnidadMasiva', {
      vines: vines,
      idSolicitudGrupoPedido: this.solicitudGrupo.idSolicitudGrupoPedido,
      idSolicitudEntregas: this.idSolicitudEntregas,
    }).subscribe((data) => {
      this.vines = [];
      this.cantidadVines = 0;
      this.getUnidades();
      this.getEntregas();
      this.toastrService.success(`Se ha asignado la unidad exitosamente.`,
        'GUARDADO EXITOSO');
    }, (err) => {
      this.toastrService.error(`Error al intentar asignar la unidad.`,
        'GUARDADO ERRONEO');
    });

  }

  addUnidad = () => {
    this.httpRequestService.post('solicitud/insertSolicitudDetalleUnidad', {
      vin: this.form.value.vin,
      idSolicitudGrupoPedido: this.solicitudGrupo.idSolicitudGrupoPedido
    }).subscribe((data) => {
      this.form.controls.vin.setValue('');
      this.getUnidades();
      this.toastrService.success(`Se ha asignado la unidad exitosamente.`,
        'GUARDADO EXITOSO');
    }, (err) => {
      this.toastrService.error(`Error al intentar asignar la unidad.`,
        'GUARDADO ERRONEO');
    });
  }

  deleteVin = ($event: any) => {
    this.httpRequestService.post('solicitud/deleteDetalleUnidad', {
      idSolicitudDetalleUnidad: $event.idSolicitudDetalleUnidad
    }).subscribe((res: any) => {
      this.toastrService.success(`Se ha eliminado la unidad de forma exitosa.`,
        'BORRADO EXITOSO');
      if (!res) {
        this.getUnidades();
      }
    })
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, {header: 1});
      if (data.length > 0) {
        this.vines = data;
        this.cantidadVines = data.length - 1;
      } else {
        this.vines = [];
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  onSelect = ($event: any) => {
    this.unidad = $event.selected[0];
  }

  goToFlitllas = (unidad: any) => {
    this.activeModal.close();
    this.router.navigate([`main/cotizaciones/manager/traslados`], {
      queryParams: {
        idFlotilla: unidad.idDireccionFlotillas,
        idCotizacion: unidad.idCotizacion,
        step: unidad.step
      }
    });
  }

  estatusUnidadOnChange(estatus: any, item) {
    if (estatus) {
      this.httpRequestService.post('solicitud/updSolicitudEstatusUnidad', {
        estatus: estatus.estatusUnidad,
        idSolicitudDetalleUnidad: item.idSolicitudDetalleUnidad
      }).subscribe((data) => {
        this.toastrService.success(`Se ha actualizado el estatus de la unidad.`, 'GUARDADO EXITOSO');
      }, (err) => {
        this.toastrService.error(`Error al intentar actualizar la unidad.`, 'GUARDADO ERRONEO');
      });
    }
    else {
      console.log('Borro')
    }
  }
  
  entregasOnChange(entregas){
    this.idSolicitudEntregas = entregas.idSolicitudEntregas 
    this.getUnidades();
  }

  ubicacionOnChange(ubicacion: any, item) {
    if (ubicacion) {
      this.httpRequestService.post('solicitud/updSolicitudUbicacionUnidad', {
        idUbicacion: ubicacion.idUbicacion,
        idSolicitudDetalleUnidad: item.idSolicitudDetalleUnidad
      }).subscribe((data) => {
        this.toastrService.success(`Se ha actualizado la ubicación de la unidad.`, 'GUARDADO EXITOSO');
      }, (err) => {
        this.toastrService.error(`Error al intentar actualizar la ubicación de la unidad.`, 'GUARDADO ERRONEO');
      });
    }
    else {
      console.log('Borro')
    }
  }

  
}
