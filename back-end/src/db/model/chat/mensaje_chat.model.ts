import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Notificacion } from '../notificacion';
import { ContactoChat } from './contacto_chat.model';
import { GrupoChat } from './grupo_chat.model';
import { MediaChat } from './media_chat.model';
import { ReceptorChat } from './receptor_chat.model';

@Entity({ name: 'MensajeChat' })
export class MensajeChat {
    @PrimaryColumn({ name: 'idMensajeChat', type: 'varchar', length: 50 })
    idMensajeChat: string;
    @Column({ name: 'cuerpoMensaje', type: 'varchar', length: 512, nullable: false })
    cuerpoMensaje: string;
    @Column({ name: 'idGrupoChat', type: 'varchar', length: 50 })
    idGrupoChat: string;
    @Column({ name: 'idContactoChat', type: 'varchar', length: 50 })
    idContactoChat: string;
    @Column({ name: 'idMediaChat', type: 'varchar', length: 50 })
    idMediaChat: string;
    @Column({ name: 'fechaCreacion', type: 'datetime', nullable: false })
    fechaCreacion: Date;
    @Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'fechaModificacion', type: 'datetime', nullable: false })
    fechaModificacion: Date;

    @ManyToOne((type) => GrupoChat, (grupo) => grupo.mensajes)
    @JoinColumn({ name: 'idGrupoChat' })
    grupo: GrupoChat;

    @OneToOne(() => MediaChat, (media) => media.idMediaChat)
    @JoinColumn({ name: 'idMediaChat' })
    media: MediaChat;

    @OneToMany(() => ReceptorChat, (receptor) => receptor.mensaje)
    @JoinColumn({ name: 'idMensajeChat' })
    receptores: ReceptorChat;

    @OneToOne((type) => Notificacion, (notificacion) => notificacion.mensaje)
    @JoinColumn({ name: 'idMensajeChat' })
    notificacion: Notificacion;
}
