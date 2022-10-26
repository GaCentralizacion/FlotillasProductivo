export class GrupoChat {
    idGrupoChat: string;
    nombreGrupo: string;
    idUsuarioModificacion: number;
    contactos: Contactos[];
}

export interface Contactos {
    idUsuario: number;
    nombreCompleto: string;
    telefono: string;
    correo: string;
}

export class ChatMessage {
  idMensajeChat: string;
  cuerpoMensaje: string;
  idGrupoChat: string;
  idContactoChat: string;
  idMediaChat: string;
  media: Media;
  fechaCreacion: Date;
  fechaModificacion: Date;
  receptores: Receptores[];
  usuario ?: string;
  leido ?: boolean;
  fechaLeido ?: Date;
}

export interface Media {
  idMediaChat: string;
  nombre: string;
  mediaPath: string;
  idContactoChat: string;
  tipoMedio: string;
  contenido: string;
}

export interface Receptores {
  idContactoChat: string;
  idMensajeChat: string;
}
