import { Contactos } from './chat.model';

export interface GrupoChat {
  idGrupoChat: string;
  nombreGrupo: string;
  idUsuarioModificacion: number;
  contactos: Contactos[];
}
