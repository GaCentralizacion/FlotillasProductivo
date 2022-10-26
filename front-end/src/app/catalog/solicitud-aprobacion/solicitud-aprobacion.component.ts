import { Component, OnInit } from '@angular/core';
import { UserCatalogService } from '../../services/user-catalog.service';
import { Usuario } from '../../models';

@Component({
  selector: 'app-solicitud-aprobacion',
  templateUrl: './solicitud-aprobacion.component.html',
  styleUrls: ['./solicitud-aprobacion.component.scss']
})
export class SolicitudAprobacionComponent implements OnInit {
  usuarios: Usuario[];
  constructor(private userCatalogService: UserCatalogService) { }

  ngOnInit() {
  }

}
