import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'FacturacionUnidad' })
export class FacturacionUnidad {
    @PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 50 })
    idCotizacion: string;
    @PrimaryColumn({ name: 'vin', type: 'varchar', length: 50 })
    vin: string;
    @Column({ name: 'unidadFacturada', type: 'bit', nullable: false })
    unidadFacturada: boolean;
}
