import { Component, OnInit, HostListener, EventEmitter, Input, OnChanges } from '@angular/core';
import { PricingService, UserCatalogService } from '../../services';
import { forkJoin } from 'rxjs';
import { Contactos } from '../../models/chat.model';

@Component({
  selector: 'app-chat-usuarios',
  templateUrl: './chat-usuarios.component.html',
  styleUrls: ['./chat-usuarios.component.scss']
})

export class ChatUsuariosComponent implements OnChanges {

  @Input() contactosObtenidos: Contactos[];
  @Input() mensajeView: string;

  constructor() {
  }

  ngOnChanges() {
  }
}
