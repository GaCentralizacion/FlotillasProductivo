import { Component, OnInit } from '@angular/core';
import { EventoLogFilter, EventoLogFilterResult, EventoLog } from '../../models/log.model';
import { LogService } from '../../services/log.service';
import { PageInfo } from '../../models/page.model';
import * as moment from 'moment';

@Component({
  selector: 'app-general-log',
  templateUrl: './general-log.component.html',
  styleUrls: ['./general-log.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class GeneralLogComponet implements OnInit {
  eventoLogFilter: EventoLogFilter;
  totalRegistros: number;
  eventosLog: EventoLog[];
  registrosPorPagina = 10;
  numeroPagina = 0;

  constructor(private logService: LogService) { }

  ngOnInit() {
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
    this.logService.getEventos(this.eventoLogFilter).subscribe((eventosLogFilterResult: EventoLogFilterResult) => {
      this.totalRegistros = eventosLogFilterResult.totalRegistros;
      this.eventosLog = eventosLogFilterResult.eventos;
      this.eventosLog.map(eventoLog => {
        eventoLog.fechaHoraText = moment(eventoLog.fechaHora).format('DD/MM/YYYY HH:mm:ss a');
      });
    }, error => {
    });
  }

  cambiaPagina(pageInfo: PageInfo) {
    this.eventoLogFilter.pagina = pageInfo.offset + 1;
    this.logService.getEventos(this.eventoLogFilter).subscribe((eventosLogFilterResult: EventoLogFilterResult) => {
      this.totalRegistros = eventosLogFilterResult.totalRegistros;
      this.eventosLog = eventosLogFilterResult.eventos;
    }, error => {
    });
  }

}
