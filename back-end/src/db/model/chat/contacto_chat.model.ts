import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { GrupoChat } from './grupo_chat.model';
import { MensajeChat } from './mensaje_chat.model';
import { RelContactoGrupoChat } from './rel_contacto_grupo_chat.model';

@Entity({ name: 'ContactoChat' })
export class ContactoChat {
    @PrimaryColumn({ name: 'idContactoChat', type: 'varchar', length: 50 })
    idContactoChat: string;
    @Column({ name: 'idUsuario', type: 'int', nullable: false })
    idUsuario: number;
    @Column({ name: 'nombreCompleto', type: 'varchar', length: 450, nullable: false })
    nombreCompleto: string;
    @Column({ name: 'telefono', type: 'varchar', length: 15 })
    telefono: string;
    @Column({ name: 'correo', type: 'varchar', length: 50, nullable: false, default: null })
    correo: string;
    @Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'fechaModificacion', type: 'datetime', nullable: false })
    fechaModificacion: Date;

    @ManyToOne((type) => RelContactoGrupoChat, (contactoGrupo) => contactoGrupo.contacto)
    @JoinColumn({ name: 'idContactoChat' })
    contactoGrupo: RelContactoGrupoChat;
}
