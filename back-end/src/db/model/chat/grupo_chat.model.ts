import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { ContactoChat } from './contacto_chat.model';
import { MensajeChat } from './mensaje_chat.model';

@Entity({ name: 'GrupoChat' })
export class GrupoChat {
    @PrimaryColumn({ name: 'idGrupoChat', type: 'varchar', length: 50 })
    idGrupoChat: string;
    @Column({ name: 'nombreGrupo', type: 'varchar', length: 50, nullable: false })
    nombreGrupo: string;
    @Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ name: 'fechaModificacion', type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @ManyToMany(() => ContactoChat, (contacto) => contacto.idContactoChat)
    @JoinTable({ name: 'RelContactoGrupoChat', joinColumn: { name: 'idGrupoChat' }, inverseJoinColumn: { name: 'idContactoChat' } })
    contactos: ContactoChat[];
    @OneToMany(() => MensajeChat, (mensaje) => mensaje.grupo)
    mensajes: MensajeChat[];
}
