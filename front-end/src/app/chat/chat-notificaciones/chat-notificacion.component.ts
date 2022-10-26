import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { forkJoin } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { SocketNotificationService } from 'src/app/services/socket.notification.service';
import { SocketNotification } from 'src/app/models/socket.notification.model';

@Component({
  selector: 'app-chat-notificacion',
  templateUrl: './chat-notificacion.component.html',
  styleUrls: ['./chat-notificacion.component.scss']
})

export class ChatNotificacionComponent implements OnChanges {

  @Input() idGrupoChat: string;

  countRepeat: number = 0;

  typeStatus = [
    'En Aprobación',
    'Aprobado',
    'Cancelado',
    'Visto',
    'Retrasado'
  ];

  notifications: any[] = [];

  notificationsRows: any[] = [];

  constructor(
    private notificacionService: NotificationService, private socketNotificaction: SocketNotificationService) {
  }

  ngOnChanges() {
    if (this.idGrupoChat) {
      this.getNotificaciones(this.idGrupoChat);
    }
    this.socketNotificaction.getAll().subscribe((items: SocketNotification[]) => {
      let notificaciones;
      if (this.idGrupoChat) {
        notificaciones = items.filter(item => item.idTipoNotificacion !== -1 && item.idGrupoChat === this.idGrupoChat);
      } else {
        notificaciones = items.filter(item => item.idTipoNotificacion !== -1);
      }
    });
  }

  concatNotifications(notifications) {
    let news = [];
    for (const notification of notifications) {
      if (notification.length > 0) {
        news = news.concat(notification);
      }
    }
    return news;
  }

  getStatus(notification) {
    return (notification.status) ? notification.status : notification.estatus;
  }

  getNotificaciones(idGrupoChat: string) {
    forkJoin(
      this.notificacionService.getNotification(idGrupoChat, 2),
      this.notificacionService.getNotification(idGrupoChat, 3),
      this.notificacionService.getNotification(idGrupoChat, 9),
      this.notificacionService.getNotification(idGrupoChat, 12)
    )
      .subscribe((res: any[]) => {
        const [dos, tres, nueve, doce] = res;
        this.notifications = this.concatNotifications([...dos, ...tres, ...nueve, ...doce]);

        this.notifications = this.notifications.sort((a, b) => {
          if (a.not_fecha > b.not_fecha) {
            return 1;
          }

          if (a.not_fecha < b.not_fecha) {
            return -1;
          }
          return 0;
        });

        this.notificationsRows = JSON.parse(JSON.stringify(this.notifications));

        /*********************** SE FILTRAN NOTIFICACIONES QUE NO HAYA REPETIDAS Y SE RECONSTRUYE OBJETO *******************/

        let notificationsFilter: any;
        notificationsFilter = [{}];

        this.notificationsRows.forEach((element, index, array) => {

          if (element.not_id) {
            if (notificationsFilter.find(f => f.not_id === element.not_id && f.estatus === element.estatus)) {

            } else {
              notificationsFilter[index] = { not_id: element.not_id, not_descripcion: element.not_descripcion, estatus: element.estatus };
            }

          } else if (element.emp_id) {
            if (notificationsFilter.find(f => f.not_id === element.emp_id && f.estatus === element.estatus)) {

            } else {
              notificationsFilter[index] = {
                not_id: element.emp_id, not_descripcion: element.nar_comentario,
                estatus: element.estatus ? element.estatus : element.status
              };
            }
          }
        });

        this.notificationsRows = notificationsFilter;

      });
  }

}
