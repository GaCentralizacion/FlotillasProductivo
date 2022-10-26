import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatCotizacionesComponent } from './chat-cotizaciones/chat-cotizaciones.component';
import { ChatUsuariosComponent } from './chat-usuarios/chat-usuarios.component';
import { ChatMensajesComponent } from './chat-mensajes/chat-mensajes.component';
import { ChatNotificacionComponent } from './chat-notificaciones/chat-notificacion.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChatComponent,
    ChatCotizacionesComponent,
    ChatUsuariosComponent,
    ChatMensajesComponent,
    ChatNotificacionComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ChatRoutingModule
  ],
  entryComponents: [
  ]
})
export class ChatModule { }
