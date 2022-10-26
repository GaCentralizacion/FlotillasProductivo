import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { PaquetesAdicionales } from '../models';
import { environment } from '../../environments/environment';
import { Notification } from '../models/notification.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  URI;

  constructor(private http: HttpClient, private appService: AppService) {
    this.URI = environment.notificationURL;
  }

  getNotification(cotizacionId: string, notificationType: number) {
    const request = {
      identificador: cotizacionId,
      idTipoNotificacion: notificationType
    };
    return this.http.post(`${this.URI}notification/GetStatusNotification`, request)
      .pipe(map(resp => {
        return resp;
      }));
  }

  createNotification(notification, status: boolean) {
    if (status) {
      return this.http.post(`${this.URI}notification/CreateNotification`, notification)
        .pipe(map(resp => {
          return resp;
        }));
    } else {
      return new Observable((observer) => {
        observer.next('OK');
        observer.complete();
      });
    }
  }

  getNotificationUsers(request, status: boolean) {
    if (status) {
      return this.http.post(`${this.URI}notification/GetNotificationUsers`, request)
        .pipe(map(resp => {
          return resp[1];
        }));
    } else {
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
  }

  getNotificationDashboard() {
    return this.http.get('http://localhost:3000/api/notificaciones')
      .pipe(map(resp => {
        return resp;
      }));
  }

}
