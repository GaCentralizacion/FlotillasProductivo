import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'EventoLog', database: 'FlotillasBismLog' })
export class EventoLog {
    @PrimaryGeneratedColumn({ type: 'integer'})
    idEventoLog: number;

    @Column({ type: 'integer', nullable: false})
    idUsuario: number;

    @Column({type: 'datetime'})
    fechaHora: Date;

    @Column({type: 'varchar', length: 50, nullable: false})
    modulo: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    tabla: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    evento: string;

    @Column({type: 'text', nullable: false})
    datos: string;

}
