import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SidebarToggleService } from './sidebar-toggle-service.service';
import { Router } from '@angular/router';
import { SocketNotificationService } from '../services/socket.notification.service';
import { SocketNotificacionResponse } from '../models/socket.notification.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  collapsed = false;
  showNotification = false;

  messages = [] as SocketNotificacionResponse[];
  cotizaciones = [] as SocketNotificacionResponse[];

  constructor(private sidebarToggleService: SidebarToggleService, private router: Router,
    private socketNotificationService: SocketNotificationService, private route: Router) { }

  ngOnInit() {
    this.collapsed = localStorage.getItem('isCollapsed') == 'true';
    this.socketNotificationService.add.subscribe( subs => {
      if (subs.post &&  subs.post.idUsuario && subs.post.idUsuario  === JSON.parse(localStorage.getItem('app_token')).data.user.id) {
        const notificacion = {
          leida: subs.post.leida,
          link: subs.post.link,
          idTipoNotificacion: subs.post.idTipoNotificacion,
          idUsuario: subs.post.idUsuario,
          idGrupoChat: subs.post.link.substring(subs.post.link.lastIndexOf('=') +  1, subs.post.link.length)
        } as SocketNotificacionResponse;
        if (notificacion.idTipoNotificacion === -1 ) {
          this.messages.push(notificacion);
        } else {
          this.cotizaciones.push(notificacion);
        }
      }
    });
    this.socketNotificationService.getAll().subscribe( (notificaciones: SocketNotificacionResponse[]) => {
      notificaciones.forEach( notificacion => {
        if (notificacion.idTipoNotificacion === -1 ) {
            this.messages.push(notificacion);
        } else {
          this.cotizaciones.push(notificacion);
        }
      });
    });
  }

  toggle() {
    if (this.route.url.startsWith('/main/lectura')) {
      return;
    }
    this.collapsed = !this.collapsed;
    localStorage.setItem('isCollapsed', this.collapsed.toString());
    this.sidebarToggleService.emitCollapsed(this.collapsed);
  }

  collapse() {
    this.sidebarToggleService.emitCollapsed(true);
  }

  closeSession() {
    localStorage.removeItem('app_token');
    localStorage.removeItem('idUsuario');
    this.router.navigate(['/login']);
  }

  gotoLog() {
    this.router.navigate(['/main/log']);
  }

  gotoFileRepository() {
    this.router.navigate(['/main/file-repository']);
  }

  showNotificationEvent() {
    if ((this.messages.length + this.cotizaciones.length ) < 1) {
      return;
    }
    this.showNotification = !this.showNotification;
  }
}
