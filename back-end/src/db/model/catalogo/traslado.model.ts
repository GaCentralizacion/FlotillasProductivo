import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { UbicacionTraslado } from './ubicacion_traslado.model';

@Entity({ name: 'Traslado' })
export class Traslado {
    @PrimaryColumn({ type: 'int' })
    idTraslado: number;
    @Column({ type: 'int', nullable: false })
    idUbicacionOrigen: number;
    @Column({ type: 'int', nullable: false })
    idUbicacionDestino: number;
    @Column({ name: 'idMarca', type: 'varchar', length: 100, nullable: false })
    idMarca: string;
    @Column({ name: 'idEmpresa', type: 'int', nullable: false })
    idEmpresa: number;
    @Column({ name: 'idSucursal', type: 'int', nullable: false })
    idSucursal: number;
    @Column({ type: 'int', nullable: false })
    idProveedor: number;
    @Column({ type: 'varchar', length: 450, nullable: false })
    nombreProveedor: string;
    @Column({ type: 'money', nullable: false })
    costoUnitario: number;
    @Column({ type: 'money', nullable: false })
    precioUnitario: number;
    @Column({ type: 'int', nullable: false })
    idUsuarioModificacion: number;
    @Column({ type: 'datetime', nullable: false })
    fechaModificacion: Date;
    @Column({ name: 'utilidadTotal', type: 'money', nullable: false })
    utilidadTotal: number;
    @Column({ name: 'activo', type: 'bit', nullable: true, default: 1 })
    activo: boolean;
    @OneToOne((type) => UbicacionTraslado, (ubicacionOrigen) => ubicacionOrigen.idUbicacionTraslado)
    @JoinColumn({ name: 'idUbicacionOrigen' })
    ubicacionOrigen: UbicacionTraslado;
    @OneToOne((type) => UbicacionTraslado, (ubicacionDestino) => ubicacionDestino.idUbicacionTraslado)
    @JoinColumn({ name: 'idUbicacionDestino' })
    ubicacionDestino: UbicacionTraslado;
}
