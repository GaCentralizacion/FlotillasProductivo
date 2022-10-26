export class SocketNotification {
      idNotificacion: string;
      idUsuario: number;
      idGrupoChat: string;
      idTipoNotificacion: number;
      link:	string;
}

export class SocketNotificacionResponse {
      idGrupoChat: string;
      idNotificacion: string;
      idTipoNotificacion: number;
      idUsuario: number;
      leida: boolean;
      link: string;
}
