import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { EventoLogFilter } from '../models/log.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {
    constructor(private http: HttpClient, private appService: AppService) { }
    getEventos(eventoLogFilter: EventoLogFilter) {
        return this.http.post(`${this.appService.url}bitacora/getEventos`, eventoLogFilter)
            .pipe(map(res => res));
    }

}

