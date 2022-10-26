import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApproveCatalogService, UserCatalogService } from '../../../services';
import { AprobacionDirUnidad, Usuario, Permisos, Permiso } from '../../../models';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApproveConfirmationModalComponent } from '../approve-confirmation-modal/approve-confirmation-modal.component';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-solicitud-aprobacion-credito',
  templateUrl: './solicitud-aprobacion-credito.component.html',
  styleUrls: ['./solicitud-aprobacion-credito.component.scss']
})
export class SolicitudAprobacionCreditoComponent implements OnInit {

  @Input() userlist: any[];
  subcription: Subscription;
  formAprobacionCredito: FormGroup;
  usuarios: Usuario[];
  catalogs: [];
  index;
  selectionables: Array<Permiso>;
  idUsuario: string;
  direcciones = [];
  selectedUser;
  selectedUserString;
  selectedDireccionFlotillas;
  selectedDireccionFlotillasString;
  nuevasAprobacionCredito: any[] = [];
  nuevasAprobacionCreditoString: any[] = [];
  aprobacionesCreditosDir: any[] = [];
  aprobacionesCreditos: any[] = [];



  constructor(private userCatalogService: UserCatalogService,
    private approveCatalogService: ApproveCatalogService,
    private modalService: NgbModal,
    private toastrService: ToastrService) {

    this.formAprobacionCredito = new FormGroup({
      usuarioFormControlCredito: new FormControl({ value: '', placeholder: '', disable: false }, Validators.required),
      flotillaFormControlCredito: new FormControl({ value: '', placeholder: '', disable: false }, Validators.required),
    });
  }

  ngOnInit() {
    const userInformation = JSON.parse(localStorage.getItem('app_token'));
    this.catalogs = userInformation.data.permissions.modules;
    this.idUsuario = userInformation.data.user.id;
    this.index = this.catalogs.findIndex((i: any) => i.name === 'Dashboard');
    const permisos = userInformation.data.permissions as Permisos;
    this.selectionables = permisos.modules[this.index].objects.filter(p => p.caption != null);
    for (let element of this.selectionables) {
      let item = {
        id: element.name,
        name: `${element.name}-${element.caption}`
      }
      this.direcciones.push(item)
    }

    this.userCatalogService.getAll().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
    });

    this.getAprobacionesC();
  }

  direccionOnChange($event) {
    this.selectedDireccionFlotillas = $event.id;
    this.selectedDireccionFlotillasString = $event.name
  }

  userOnChange($event) {
    this.selectedUser = $event.idUsuario;
    this.selectedUserString = $event.nombreCompleto
  }

  agregar() {
    let item = {
      idUsuario: this.selectedUser,
      idDireccionFlotillas: this.selectedDireccionFlotillas
    }

    let itemString = {
      nombreUsuario: this.selectedUserString,
      nombreDireccionFlotillas: this.selectedDireccionFlotillasString
    }

    this.nuevasAprobacionCredito.push(item);
    this.nuevasAprobacionCreditoString.push(itemString);
    this.formAprobacionCredito.reset();
  }

  remove(index: number) {
    this.nuevasAprobacionCredito.splice(index, 1);
    this.nuevasAprobacionCreditoString.splice(index, 1);
    this.toastrService.warning('ITEM ELIMINADO');
  }

  guardar() {
    if (this.nuevasAprobacionCredito.length > 0) {
      this.approveCatalogService.createApproveDirCredicts(this.nuevasAprobacionCredito).subscribe((res) => {
        this.getAprobacionesC();
        this.nuevasAprobacionCredito = [];
        this.nuevasAprobacionCreditoString = [];
        this.toastrService.success('REGLA GUARDADA');
      }, (error) => {
        this.toastrService.error('ERROR AL ELIMINAR LA REGLA');
      });
    } else {
      this.toastrService.warning('NO HAY REGLAS QUE GUARDAR');
    }
  }

  getAprobacionesC() {
    this.userCatalogService.getAll().subscribe((usuariosCredtio: Usuario[]) => {
      let usuariosC = usuariosCredtio;
      this.approveCatalogService.getDirectionsCredicts().subscribe((aprobacionesCreditos: AprobacionDirUnidad[]) => {
        this.aprobacionesCreditos = [];
        this.aprobacionesCreditosDir = [];
        this.aprobacionesCreditosDir = aprobacionesCreditos;
        this.aprobacionesCreditosDir.forEach(ele => {
          let direccionName = '';
          let username = '';
          this.direcciones.forEach(dEle => {
            if (ele.idDireccionFlotillas == dEle.id) {
              direccionName = dEle.name;
            }
          });

          usuariosC.forEach(uEle => {
            if (ele.idUsuario == uEle.idUsuario) {
              username = uEle.nombreCompleto;
            }
          });

          let item = {
            idUsuario: ele.idUsuario,
            idDireccion: ele.idDireccionFlotillas,
            direccionNombre: direccionName,
            usuarioNombre: username
          }

          this.aprobacionesCreditos.push(item);
        });
        this.aprobacionesCreditos = this.aprobacionesCreditos;
      });
    });
  }

  eliminarAprobador($event, row) {
    $event.preventDefault();
    const modal = this.modalService.open(ApproveConfirmationModalComponent, { size: 'lg' })
    modal.componentInstance.rule = `${row.direccionNombre}-${row.usuarioNombre}`;
    modal.result.then(resultValue => {
      if (resultValue === 'ok') {
        this.approveCatalogService.deleteApproveCreditcs(row.idDireccion, row.idUsuario).subscribe((res) => {
          this.toastrService.success('REGLAS ELIMINADA');
          this.getAprobacionesC();
        }, (error) =>{
          this.toastrService.error('ERROR AL ELIMINAR LA REGLA');
        });
      }
    });
  }


}
