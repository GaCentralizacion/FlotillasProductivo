import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { GrupoChat } from '../../models/chat.grupos.model';
import * as ChatModel from '../../models/chat.model';
import { ChatService } from '../../services';
import { forkJoin } from 'rxjs';
import { Contactos } from '../../models/chat.contactos.model';

@Component({
  selector: 'app-chat-cotizaciones',
  templateUrl: './chat-cotizaciones.component.html',
  styleUrls: ['./chat-cotizaciones.component.scss']
})

export class ChatCotizacionesComponent implements OnChanges {

  @Input() chatCotizaciones: GrupoChat[];
  @Output() mensajeContacto: EventEmitter<string> = new EventEmitter();
  @Output() enviarContactos: EventEmitter<Contactos[]> = new EventEmitter();
  @Output() enviaIdGrupoChat: EventEmitter<string> = new EventEmitter();

  grupoSeleccionado: any;

  mensajeView: string;
  buscarCotizacion: string;
  mensajeViewContacto: string;

  contactos: Contactos[] = [];
  cotizaciones: ChatModel.GrupoChat[] = [];

  contactosRow: Contactos[] = [];
  cotizacionesRows: ChatModel.GrupoChat[] = [];

  constructor(
    private chatService: ChatService
  ) {}

  ngOnChanges() {
    this.cotizacionesRows = [];
    if (this.chatCotizaciones.length > 0) {
      this.mensajeView = '';
      this.chatCotizaciones.map(cotizacion => {
        this.cotizaciones.push(Object.assign(new ChatModel.GrupoChat(), cotizacion));
      });
      this.cotizacionesRows = JSON.parse(JSON.stringify(this.cotizaciones));
    } else {
      this.mensajeView = 'No hay existencia de cotizaciones';
    }
  }

  filtroCotizacion() {
    if (!this.cotizaciones) { this.cotizaciones = []; }
    this.cotizacionesRows = this.cotizaciones.filter(cotizacion => {
      return cotizacion.idGrupoChat.toLowerCase().includes((this.buscarCotizacion || '').toLowerCase());
    });
  }

  getUsuario(grupo: GrupoChat) {
    this.contactos = [];
    this.mensajeViewContacto = '';
    this.contactosRow = [];
    this.grupoSeleccionado = grupo;

    this.chatService.getContactos(grupo.idGrupoChat).subscribe((contactos: any[]) => {
      contactos.map(contacto => {
        this.contactos.push(Object.assign(new Contactos(), contacto));
      });

      if (this.contactos.length) {
        this.mensajeViewContacto = '';
        this.contactosRow = JSON.parse(JSON.stringify(this.contactos));
      } else {
        this.mensajeViewContacto = 'No hay contactos asignados';
      }

      this.mensajeContacto.emit(this.mensajeViewContacto);
      this.enviarContactos.emit(this.contactosRow);
      this.enviaIdGrupoChat.emit(grupo.idGrupoChat);
    });
  }
}
