import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class VersionUnidad {
    @PrimaryColumn({ name: 'IdCatalogo', type: 'varchar', length: 20 })
    idUnidadBpro: string;
    @Column({ name: 'Descripcion', type: 'varchar', length: 60, nullable: false })
    nombre: string;
    @Column({ name: 'PrecioLista', type: 'money', nullable: false })
    precioLista: number;
    @Column({ name: 'MonedaCosto', type: 'varchar', length: 10, nullable: false })
    monedaCompra: string;
    @Column({ name: 'Año', type: 'varchar', length: 4, nullable: false })
    modelo: string;
}
