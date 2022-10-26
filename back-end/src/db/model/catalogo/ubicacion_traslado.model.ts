import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Traslado } from './traslado.model';

@Entity({ name: 'UbicacionTraslado' })
export class UbicacionTraslado {
    @PrimaryColumn({ type: 'int' })
    idUbicacionTraslado: number;
    @Column({ type: 'varchar', length: 30, nullable: false })
    nombre: string;
    @Column({ type: 'varchar', length: 50, nullable: false })
    descripcion: string;
    @Column({ type: 'varchar', length: 340, nullable: false })
    direccion: string;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @ManyToOne((type) => Traslado, (traslado) => traslado.idUbicacionOrigen)
    @JoinColumn({ name: 'idUbicacionTraslado' })
    trasladoOrigen: Traslado;
    @ManyToOne((type) => Traslado, (traslado) => traslado.idUbicacionDestino)
    @JoinColumn({ name: 'idUbicacionTraslado' })
    trasladoDestino: Traslado;
}
