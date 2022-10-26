import { Component, OnInit } from '@angular/core';
import { GrupoChat, ChatMessage } from '../models/chat.model';
import { ChatService } from '../services';
import { forkJoin } from 'rxjs';
import { Contactos } from '../models/chat.contactos.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  idGrupoChat: string;
  mensajeView: string;

  grupoChat: GrupoChat[] = [];
  contactosObtenidos: Contactos[] = [];

  grupoChatRows: GrupoChat[] = [];

  constructor(
    private chatService: ChatService
  ) {
  }

  ngOnInit() {
    this.getGroups();
  }

  getGroups() {
    this.chatService.getGrupos().subscribe((grupos: any[]) => {
      grupos.map(grupo => {
        this.grupoChat.push(Object.assign(new GrupoChat(), grupo));
      });
      this.grupoChatRows = JSON.parse(JSON.stringify(this.grupoChat));
    });
  }

  obtenerConctactos($event) {
    this.contactosObtenidos = $event;
  }

  obtenerMensajes($event: string) {
    this.mensajeView = $event;
  }

  messageEvent(chatMessage: ChatMessage) {
  }

  obtenerIdGrupoChat(idGrupoChat: string) {
    this.idGrupoChat = idGrupoChat;
  }
}
