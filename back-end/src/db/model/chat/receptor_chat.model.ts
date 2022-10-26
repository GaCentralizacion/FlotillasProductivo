import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MensajeChat } from './mensaje_chat.model';

@Entity({ name: 'ReceptorChat' })
export class ReceptorChat {
    @PrimaryColumn({ name: 'idContactoChat', type: 'varchar', length: 50 })
    idContactoChat: string;
    @PrimaryColumn({ name: 'idMensajeChat', type: 'varchar', length: 50 })
    idMensajeChat: string;
    @Column({ name: 'fechaLeido', type: 'datetime' })
    fechaLeido: Date;
    @Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'fechaModificacion', type: 'datetime', nullable: false })
    fechaModificacion: Date;

    @ManyToOne((type) => MensajeChat, (mensaje) => mensaje.receptores)
    @JoinColumn({ name: 'idMensajeChat' })
    mensaje: MensajeChat;
}
