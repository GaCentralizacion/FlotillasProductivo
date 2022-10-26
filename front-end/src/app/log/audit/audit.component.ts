import { Component, OnInit } from '@angular/core';
import { PageInfo } from '../../models/page.model';
import { EventoLogFilter, EventoLog, EventoLogFilterResult } from '../../models/log.model';
import { LogService } from '../../services/log.service';
import { UserCatalogService } from '../../services/user-catalog.service';
import { Usuario } from '../../models/usuarioModel';
import * as moment from 'moment';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  eventoLogFilter: EventoLogFilter;
  totalRegistros: number;
  eventosLog: EventoLog[];
  registrosPorPagina = 10;
  numeroPagina = 0;

  constructor(private logService: LogService, private userCatalogService: UserCatalogService) { }

  /*  
    Declaracion de variables usadas por el componente
  */
  fromDateModel: { year: number, month: number, day: number }; // variable para capturar el inicio del rango fecha para la consulta [(ngModel)]
  untilDateModel: { year: number, month: number, day: number }; // variable para capturar el final del rango fecha para la consulta [(ngModel)]
  selectedModulo = null; // variable para capturar el item seleccionado en el ngselect correspondiente [(ngModel)]
  selectedUsuario = null; // variable para capturar el item seleccionado en el ngselect correspondiente [(ngModel)]
  selectedEvento = null; // variable para capturar el item seleccionado en el ngselect correspondiente [(ngModel)]

  /* 
    Arreglos para ser llenados por las listas de los catalogos correspondientes
  */
  modulos: any = [];
  usuarios: any = [];
  eventos: any = [];

  ngOnInit() {
    this.eventos = ['INSERT', 'UPDATE', 'DELETE'];
    this.modulos = ['CATALOGOS', 'COTIZACIONES', 'GESTION DE FLOTILLAS', 'CHAT Y NOTIFICACIONES'];
    
    this.eventoLogFilter = {
      pagina: 1,
      numeroRegistros: 10,
      idUsuario: null,
      fechaInicio: null,
      fechaFin: null,
      modulo: null,
      tabla: null,
      evento: null
    };
    
    this.userCatalogService.getAll().subscribe((usuariosLista: Usuario[])=>{
      this.usuarios = usuariosLista;
    },(error) => {
    }
    );
    
  }

  buscarUsuarios(){

  }

  cambiaPagina(pageInfo: PageInfo) {
    this.eventoLogFilter.pagina = pageInfo.offset + 1;
    this.logService.getEventos(this.eventoLogFilter).subscribe((eventosLogFilterResult: EventoLogFilterResult) => {
    this.totalRegistros = eventosLogFilterResult.totalRegistros;
    this.eventosLog = eventosLogFilterResult.eventos;
    }, error => {
   });
  }

  buscar() {
    const dateFrom = this.fromDateModel == undefined ? null : new Date(this.fromDateModel.year, this.fromDateModel.month - 1, this.fromDateModel.day);
    const dateTo = this.untilDateModel == undefined ? null : new Date(this.untilDateModel.year, this.untilDateModel.month - 1, this.untilDateModel.day);
    this.eventoLogFilter = {
      pagina: 1,
      numeroRegistros: 10,
      idUsuario: this.selectedUsuario,
      fechaInicio: dateFrom == undefined ? null : moment(dateFrom).toJSON().substr(0, 10),
      fechaFin: dateTo == undefined ? null : moment(dateTo).toJSON().substr(0, 10),
      modulo: this.selectedModulo,
      tabla: null,
      evento: this.selectedEvento
    };
    this.logService.getEventos(this.eventoLogFilter).subscribe((eventosLogFilterResult: EventoLogFilterResult) => {
      this.totalRegistros = eventosLogFilterResult.totalRegistros;
      this.eventosLog = eventosLogFilterResult.eventos;
      this.eventosLog.map(eventoLog => {
        eventoLog.fechaHoraText = moment(eventoLog.fechaHora).format("DD/MM/YYYY HH:mm:ss a");
      });
    }, error => {
    });
  }




}
