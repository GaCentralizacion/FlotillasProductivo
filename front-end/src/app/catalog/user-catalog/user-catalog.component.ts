import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models';
import { UserCatalogService } from '../../services';

@Component({
  selector: 'app-user-catalogs',
  templateUrl: './user-catalog.component.html',
  styleUrls: ['./user-catalog.component.scss']
})
export class UserCatalogComponent implements OnInit {

  usuarios: Usuario[];
  searchIdUsuario: '';
  searchNombreCompleto: '';
  searchEmail: '';
  searchUserName: '';
  searchCelular: '';
  searchFechaRegistro: '';
  searchUltimoLogin: '';
  usuariosFilter: Usuario[];

  constructor(
    private userCatalogService: UserCatalogService
  ) {}

  ngOnInit() {
    this.userCatalogService.getAll().subscribe((data: Usuario[]) => {
      this.usuarios = data;
      this.usuariosFilter = JSON.parse(JSON.stringify(this.usuarios));
    });
  }

  updateFilter(event: any) {
    if (!this.usuariosFilter) { return []; }
    this.usuariosFilter = this.usuarios.filter(usuario => {
      return usuario.idUsuario.toString().includes((event.target.value || '').toLowerCase()) ||
      usuario.nombreCompleto.toLowerCase().includes((event.target.value || '').toLowerCase()) ||
      usuario.email.toLowerCase().includes((event.target.value || '').toLowerCase()) ||
      usuario.userName.toLowerCase().includes((event.target.value || '').toLowerCase()) ||
      usuario.celular.toLowerCase().includes((event.target.value || '').toLowerCase()) ||
      usuario.fechaRegistro.toLowerCase().includes((event.target.value || '').toLowerCase()) ||
      usuario.ultimoLogin.toLowerCase().includes((event.target.value || '').toLowerCase())
    });
  }

}
