import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Usuario', database: 'FlotillasBism' })
export class Usuario {
    @PrimaryColumn({ type: 'int' })
    idUsuario: number;
    @Column({ type: 'varchar', length: 50, nullable: false })
    userName: string;
    @Column({ type: 'varchar', length: 450, nullable: false })
    nombreCompleto: string;
    @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;
    @Column({ type: 'varchar', length: 20, nullable: true })
    celular: string;
    @Column({ type: 'datetime', nullable: true })
    fechaRegistro: Date;
    @Column({ type: 'datetime', nullable: true })
    ultimoLogin: Date;
}
