import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApproveCatalogService, UserCatalogService } from '../../../services';
import { AprobacionUtilidadFlotillas, Usuario, Permisos, Permiso } from '../../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApproveConfirmationModalComponent } from '../approve-confirmation-modal/approve-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-solicitud-aprobacion-utilidad',
  templateUrl: './solicitud-aprobacion-utilidad.component.html',
  styleUrls: ['./solicitud-aprobacion-utilidad.component.scss']
})

export class SolicitudAprobacionUtilidadComponent implements OnInit {
  private formAprobacionUtilidad: FormGroup;
  selectedUtilidad: number;
  usuarios: Usuario[];
  catalogs: [];
  index;
  selectionables: Array<Permiso>;
  idUsuario: string;
  direcciones = [];
  nuevasAprobacionUtilidad: any[] = [];
  nuevasAprobacionUtilidadString: any[] = [];
  aprobacionesUtilidadDir: any[] = [];
  aprobacionesUtilidad: any[] = [];
  edit = false;

  private selectedUser;
  private selectedUserString;
  private selectedDireccionFlotillas;
  private selectedDireccionFlotillasString;

  private nuevasAprobacion: any[] = [];
  private nuevasAprobacionString: any[] = [];

  constructor(private userCatalogService: UserCatalogService,
    private approveCatalogService: ApproveCatalogService,
    private modalService: NgbModal,
    private toastrService: ToastrService) {

    this.formAprobacionUtilidad = new FormGroup({
      usuarioFormControl: new FormControl({ placeholder: '' }, Validators.required),
      flotillaFormControl: new FormControl({ placeholder: '' }, Validators.required),
      utilidadFormControl: new FormControl({ placeholder: '' }, [
        Validators.max(99), Validators.min(0.01), Validators.required])
    });

  }

  ngOnInit() {
    const userInformation = JSON.parse(localStorage.getItem('app_token'));
    this.catalogs = userInformation.data.permissions.modules;
    this.idUsuario = userInformation.data.user.id;
    this.index = this.catalogs.findIndex((i: any) => i.name === 'Dashboard');
    const permisos = userInformation.data.permissions as Permisos;
    this.selectionables = permisos.modules[this.index].objects.filter(p => p.caption != null);
    for (const element of this.selectionables) {
      const item = {
        id: element.name,
        name: `${element.name}-${element.caption}`
      };
      this.direcciones.push(item);
    }

    this.userCatalogService.getAll().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
    });

    this.getAprobacionesUtilidad();


  }

  getAprobacionesUtilidad() {
    this.userCatalogService.getAll().subscribe((usuariosCredtio: Usuario[]) => {
      const usuariosC = usuariosCredtio;
      this.approveCatalogService.getDirectionsProfits().subscribe((aprobacionesUtilidad: AprobacionUtilidadFlotillas[]) => {
        this.aprobacionesUtilidad = [];
        this.aprobacionesUtilidadDir = [];
        this.aprobacionesUtilidadDir = aprobacionesUtilidad;
        this.aprobacionesUtilidadDir.forEach(ele => {
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

          const item = {
            idUsuario: ele.idUsuario,
            idDireccion: ele.idDireccionFlotillas,
            direccionNombre: direccionName,
            usuarioNombre: username,
            margenUtilidad: Number(ele.margenUtilidad)
          };

          this.aprobacionesUtilidad.push(item);
        });
        this.aprobacionesUtilidad = this.aprobacionesUtilidad;

      });
    });
  }

  direccionOnChange($event) {
    this.selectedDireccionFlotillas = $event.id;
    this.selectedDireccionFlotillasString = $event.name;
  }

  userOnChange($event) {
    this.selectedUser = $event.idUsuario;
    this.selectedUserString = $event.nombreCompleto;
  }

  agregar() {
    const item = {
      idUsuario: this.selectedUser,
      idDireccionFlotillas: this.selectedDireccionFlotillas,
      margenUtilidad: this.formAprobacionUtilidad.get('utilidadFormControl').value

    };

    const itemString = {
      nombreUsuario: this.selectedUserString,
      nombreDireccionFlotillas: this.selectedDireccionFlotillasString,
      margenUtilidad: this.formAprobacionUtilidad.get('utilidadFormControl').value
    };

    this.nuevasAprobacion.push(item);
    this.nuevasAprobacionString.push(itemString);
    this.formAprobacionUtilidad.reset();
  }

  remove(index: number) {
    this.nuevasAprobacion.splice(index, 1);
    this.nuevasAprobacionString.splice(index, 1);
    this.toastrService.warning('ITEM ELIMINADO');
  }

  guardar() {
    if (this.nuevasAprobacion.length > 0) {
      this.approveCatalogService.createApproveDirProfit(this.nuevasAprobacion).subscribe((res) => {
        this.getAprobacionesUtilidad();
        this.nuevasAprobacion = [];
        this.nuevasAprobacionString = [];
        this.toastrService.success('REGLA GUARDADA');
      }, (error) => {
        this.toastrService.error('ERROR AL ELIMINAR LA REGLA');
      });
    } else {
      this.toastrService.warning('NO HAY REGLAS QUE GUARDAR');

    }
  }

  editAprobador($event, row) {
    $event.preventDefault();
    this.formAprobacionUtilidad.controls.usuarioFormControl.setValue(row.idDireccion);
    this.formAprobacionUtilidad.controls.flotillaFormControl.setValue(row.idUsuario);
    this.formAprobacionUtilidad.controls.utilidadFormControl.setValue(row.margenUtilidad);

    this.edit = true;

  }

  modificar() {

    const data = {
      idDireccion: this.formAprobacionUtilidad.controls.usuarioFormControl.value,
      idUsuario: this.formAprobacionUtilidad.controls.flotillaFormControl.value,
      margenUtilidad: this.formAprobacionUtilidad.controls.utilidadFormControl.value,
      idUsuarioModificacion: this.idUsuario
    };

    this.approveCatalogService.updateApprove(data).subscribe((res) => {
      this.toastrService.success('REGLA MODIFICADA');
      this.ngOnInit();
    }, (error) => {
      this.toastrService.error('ERROR AL MODIFICAR LA REGLA');
    });
  }

  nueva() {
    this.edit = false;
    this.formAprobacionUtilidad.reset();
  }

  eliminarAprobador($event, row) {
    $event.preventDefault();
    const modal = this.modalService.open(ApproveConfirmationModalComponent, { size: 'lg' });
    modal.componentInstance.rule = `${row.direccionNombre}-${row.usuarioNombre}`;
    modal.result.then(resultValue => {
      if (resultValue === 'ok') {
        this.approveCatalogService.deleteApproveDirProfit(row.idDireccion, row.idUsuario).subscribe((res) => {
          this.getAprobacionesUtilidad();
        });

      }
    });
  }

}
