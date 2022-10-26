import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Permisos, Permiso } from '../../models/permisos.model';
import { DireccionFlotillasSelectService } from './direccion-flotillas-select.service';


@Component({
  selector: 'app-direccion-flotilla-select',
  templateUrl: './direccion-flotilla-select.component.html',
  styleUrls: ['./direccion-flotilla-select.component.scss']
})
export class DireccionFlotillaSelectComponent implements OnInit {
  catalogs: [];
  index;
  selectionables: Array<Permiso>;
  idUsuario: string;
  idFlotilla;
  @Input() onlyRead = false;
  @Input() disabled = false;
  @Input() clearStyles = false;
  @Input() showLabel = true;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter<any>();
  direccionSelected: any = {};

  constructor(private direccionFlotillasSelectService: DireccionFlotillasSelectService) { }



  public getValue() {
    this.emitEvent.emit(this.direccionSelected);
    return this.direccionSelected;
  }

  ngOnInit() {
    const userInformation = JSON.parse(localStorage.getItem('app_token'));
    this.catalogs = userInformation.data.permissions.modules;
    this.idUsuario = userInformation.data.user.id;
    if(sessionStorage.getItem('idFlotillaSelected') != null)
      this.direccionSelected = { idDireccionFlotilla: sessionStorage.getItem('idFlotillaSelected'), idUsuario: this.idUsuario };
    else
      this.direccionSelected = { idDireccionFlotilla: 'F1', idUsuario: this.idUsuario };

    this.index = this.catalogs.findIndex((i: any) => i.name === 'Dashboard');
    const permisos = userInformation.data.permissions as Permisos;
    this.selectionables = permisos.modules[this.index].objects.filter(p => p.caption != null)
    .sort((a: Permiso, b: Permiso) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    this.direccionFlotillasSelectService.emitDireccionFlotillas(this.selectionables);
    if (this.selectionables.length > 0) {
      if(sessionStorage.getItem('idFlotillaSelected') != null){
        this.idFlotilla = sessionStorage.getItem('idFlotillaSelected');
        this.direccionSelected.name = this.idFlotilla;
        this.direccionFlotillasSelectService.emitSelected(this.direccionSelected.name);
      }
      else{
        this.direccionSelected = this.selectionables[0];
        this.idFlotilla = this.selectionables[0].name;
        this.direccionFlotillasSelectService.emitSelected(this.direccionSelected.name);
      }
    }
  }

  onChange(event, value) {
    this.direccionSelected = {
      idDireccionFlotilla: value,
      idUsuario: this.idUsuario
    };

    sessionStorage.setItem('idFlotillaSelected', value);

    if (!this.onlyRead) {
      this.direccionFlotillasSelectService.emitSelected(value);
    }
    this.emitEvent.emit(value);
  }

  setDireccion(id) {
    this.idFlotilla = id;
  }


}
