import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ContactoChat, GrupoChat } from '.';

@Entity({ name: 'RelContactoGrupoChat' })
export class RelContactoGrupoChat {
    @PrimaryColumn({ name: 'idGrupoChat', type: 'varchar', length: 50 })
    idGrupoChat: string;
    @PrimaryColumn({ name: 'idContactoChat', type: 'varchar', length: 50 })
    idContactoChat: string;
    @Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'fechaModificacion', type: 'datetime', nullable: false })
    fechaModificacion: Date;

    @OneToOne(() => GrupoChat, (grupoChat) => grupoChat.idGrupoChat)
    @JoinColumn({ name: 'idGrupoChat' })
    grupo: GrupoChat;

    @OneToOne(() => ContactoChat, (contacto) => contacto.idContactoChat)
    @JoinColumn({ name: 'idContactoChat' })
    contacto: ContactoChat;
}
