import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { PaquetesAdicionales } from '../models';
import { environment } from '../../environments/environment.prod';
import { Notification } from '../models/notification.model';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { SocketNotification } from '../models/socket.notification.model';

@Injectable({
  providedIn: 'root'
})
export class SocketNotificationService {

  add = this.socket.fromEvent<any>('notificaciones');
  read = this.socket.fromEvent<any>('read');
  readMany = this.socket.fromEvent<any>('readMany');

  documents = this.socket.fromEvent<string[]>('documents');

  constructor(private socket: Socket, private http: HttpClient, private appService: AppService) {
  }

  sendNotification(notification: SocketNotification) {
      return this.http.post(`${this.appService.url}notificacion/add`, notification).pipe(map(res => res));
  }

  getAll(cantidad = 100) {
    return this.http.get(`${this.appService.url}notificacion/getAll/${cantidad}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

}
