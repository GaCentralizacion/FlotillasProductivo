import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { MensajeChat } from '../chat';

@Entity({ name: 'Notificacion', database: 'FlotillasBism' })
export class Notificacion {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    idNotificacion: string;
    @Column({ name: 'idUsuario', type: 'int', nullable: false })
    idUsuario: number;
    @Column({ name: 'idGrupoChat', type: 'varchar', length: 50 })
    idGrupoChat: string;
    @Column({ name: 'idTipoNotificacion', type: 'int', nullable: false })
    idTipoNotificacion: number;
    @Column({ name: 'link', type: 'varchar', nullable: false })
    link: string;
    @Column({ name: 'leida', type: 'bit', nullable: false })
    leida: boolean;
    @Column({ name: 'idMensajeChat', type: 'varchar', length: 50, nullable: true })
    idMensajeChat: string;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;

    @OneToOne((type) => MensajeChat, (mensaje) => mensaje.notificacion)
    @JoinColumn({ name: 'idMensajeChat' })
    mensaje: MensajeChat;
}
