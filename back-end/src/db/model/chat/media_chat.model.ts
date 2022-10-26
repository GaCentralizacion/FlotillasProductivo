import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { MensajeChat } from './mensaje_chat.model';

@Entity({ name: 'MediaChat' })
export class MediaChat {
    @PrimaryColumn({ name: 'idMediaChat', type: 'varchar', length: 50 })
    idMediaChat: string;
    @Column({ name: 'nombre', type: 'varchar', length: 100, nullable: false })
    nombre: string;
    @Column({ name: 'mediaPath', type: 'varchar', length: 250, nullable: false })
    mediaPath: string;
    @Column({ name: 'idContactoChat', type: 'varchar', length: 50, nullable: false })
    idContactoChat: string;
    @Column({ name: 'tipoMedio', type: 'varchar', length: 50, nullable: false })
    tipoMedio: string;
    @Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'fechaModificacion', type: 'datetime', nullable: false })
    fechaModificacion: Date;

    contenido: string;

    @OneToOne(() => MensajeChat, (mensaje) => mensaje.idMediaChat)
    @JoinColumn({ name: 'idMediaChat' })
    mensaje: MensajeChat;
}
