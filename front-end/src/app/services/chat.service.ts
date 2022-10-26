import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { GrupoUnidades, DetalleUnidades } from 'src/app/models';
import { GrupoChat, ChatMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  constructor(
    private http: HttpClient,
    private appService: AppService
  ) { }

  saveGrupoChat(grupoChat: GrupoChat) {
    return this.http.post(`${this.appService.url}chat/addGrupo`, grupoChat)
      .pipe(map(res => {
        return res;
      }));
    }

    getGrupos() {
        return this.http.get(`${this.appService.url}chat/getGrupos`).pipe(map(res => res));
    }

    getContactos(idGrupoChat: string) {
      return this.http.get(`${this.appService.url}chat/getContactos/${idGrupoChat}`)
      .pipe(map(res => res));
    }

    getMessage(idGrupoChat: string) {
      return this.http.get(`${this.appService.url}chat/getMensajes/${idGrupoChat}`)
      .pipe(map(res => res));
    }

    getMessageByUser(idUsuario: number) {
      return this.http.get(`${this.appService.url}chat/getMensajesPorUsuario/${idUsuario}`)
      .pipe(map(res => res));
    }

    getMedia(idMediaChat: string) {
      return this.http.get(`${this.appService.url}chat/getMedia/${idMediaChat}`)
      .pipe(map(res => res));
    }

    saveMessage(message: ChatMessage) {
      return this.http.post(`${this.appService.url}chat/addMensaje`, message)
        .pipe(map(res => {
          return res;
        }));
      }
}
