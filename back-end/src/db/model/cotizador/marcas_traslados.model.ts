import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'MarcaTraslados' })
export class MarcaTraslados {
    @PrimaryColumn({ name: 'idMarca', type: 'varchar', length: 100 })
    idMarca: number;
    @Column({ type: 'bit', nullable: false })
    MarcaCobraPrimerTraslado: boolean;
}
