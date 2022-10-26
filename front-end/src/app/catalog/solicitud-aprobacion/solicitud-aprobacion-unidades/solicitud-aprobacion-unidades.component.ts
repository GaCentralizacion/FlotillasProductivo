import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApproveCatalogService, UserCatalogService } from '../../../services';
import { Aprobaciones, AprobacionDirUnidad, Usuario, Permisos, Permiso } from '../../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApproveConfirmationModalComponent } from '../approve-confirmation-modal/approve-confirmation-modal.component';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-solicitud-aprobacion-unidades',
  templateUrl: './solicitud-aprobacion-unidades.component.html',
  styleUrls: ['./solicitud-aprobacion-unidades.component.scss'],
  providers: [ApproveCatalogService]
})
export class SolicitudAprobacionUnidadesComponent implements OnInit {

  @Input() userlist;
  private formAprobacionUnidades: FormGroup;
  private usuarios: Usuario[];
  private catalogs: [];
  private index;
  private selectionables: Array<Permiso>;
  private idUsuario: string;
  private direcciones = [];
  private selectedUser;
  private selectedUserString;
  private selectedDireccionFlotillas;
  private selectedDireccionFlotillasString;

  private aprobacionDirUnidad: AprobacionDirUnidad[];
  private aprobacionDirUnidadDatos: any;

  private nuevasAprobacion: any[] = [];
  private nuevasAprobacionString: any[] = [];

  private aprobacionUnidades: Aprobaciones[] = [];
  private aprobaciones;

  private aUnidades;


  constructor(private userCatalogService: UserCatalogService,
    private approveCatalogService: ApproveCatalogService,
    private modalService: NgbModal,
    private toastrService: ToastrService) {

    this.formAprobacionUnidades = new FormGroup({
      usuarioFormControl: new FormControl({ placeholder: '' }, Validators.required),
      flotillaFormControl: new FormControl({ placeholder: '' }, Validators.required),
    });
  }

  ngOnInit() {
    /* this.aprobaciones = 'salida' */
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

    this.getAprobaciones();
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

    this.nuevasAprobacion.push(item);
    this.nuevasAprobacionString.push(itemString);
    this.formAprobacionUnidades.reset();
  }

  remove(index: number) {
    this.nuevasAprobacion.splice(index, 1);
    this.nuevasAprobacionString.splice(index, 1);
    this.toastrService.warning('ITEM ELIMINADO');
  }

  guardar() {
    if (this.nuevasAprobacion.length > 0) {
      this.approveCatalogService.createApproveDirUnits(this.nuevasAprobacion).subscribe((res) => {
        this.getAprobaciones();
        this.nuevasAprobacion = [];
        this.nuevasAprobacionString = [];
        this.toastrService.success('REGLA GUARDADA');
      }, (error) => {
        this.toastrService.error('ERROR AL ELIMINAR LA REGLA');
      })
    } else {
      this.toastrService.warning('NO HAY REGLAS QUE GUARDAR');

    }
  }

  getAprobaciones() {
    this.approveCatalogService.getDirectionsUnits().subscribe((aprobacionDirUnidad: AprobacionDirUnidad[]) => {
      this.aprobaciones = [];
      this.aprobacionUnidades = []
      this.aprobacionDirUnidad = [];
      this.aprobacionDirUnidad = aprobacionDirUnidad;
      this.aprobacionDirUnidad.forEach(ele => {
        let direccionName = '';
        let username = '';

        this.direcciones.forEach(dEle => {
          if (ele.idDireccionFlotillas == dEle.id) {
            direccionName = dEle.name;
          }
        });

        this.usuarios.forEach(uEle => {
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

        this.aprobacionUnidades.push(item);
      });
      this.aprobaciones = this.aprobacionUnidades
    });
  }

  eliminarAprobador($event, row) {
    $event.preventDefault();
    const modal = this.modalService.open(ApproveConfirmationModalComponent, { size: 'lg' })
    modal.componentInstance.rule = `${row.direccionNombre}-${row.usuarioNombre}`;
    modal.result.then(resultValue => {
      if (resultValue === 'ok') {
        this.approveCatalogService.deleteApproveDirUnits(row.idDireccion, row.idUsuario).subscribe(res => {
          this.toastrService.success('REGLAS ELIMINADA');
          this.getAprobaciones();
        }, (error) => {
          this.toastrService.error('ERROR AL ELIMINAR LA REGLA');
        });
      }
    });
  }
}
