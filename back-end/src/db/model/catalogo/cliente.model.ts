import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Cliente' })
export class Cliente {
    @PrimaryColumn()
    idCliente: number;
    @Column({ type: 'varchar', length: 13 })
    rfc: string;
    @Column({ type: 'varchar', length: 10 })
    tipoPersona: string;
    @Column({ type: 'varchar', length: 10 })
    tipoMoral: string;
    @Column({ type: 'varchar', length: 450 })
    nombreCompleto: string;
    @Column({ type: 'varchar', length: 18 })
    curp: string;
    @Column({ type: 'varchar', length: 18 })
    telefono: string;
    @Column({ type: 'varchar', length: 10 })
    extension: string;
    @Column({ type: 'varchar', length: 18 })
    telefonoAlternativo: string;
    @Column({ type: 'varchar', length: 10 })
    extensionAlternativo: string;
    @Column({ type: 'varchar', length: 18 })
    celular: string;
    @Column({ type: 'varchar', length: 70 })
    correo: string;
    @Column({ type: 'varchar', length: 10 })
    pais: string;
    @Column({ type: 'varchar', length: 100 })
    estado: string;
    @Column({ type: 'varchar', length: 40 })
    ciudad: string;
    @Column({ type: 'varchar', length: 60 })
    municipioAlcaldia: string;
    @Column({ type: 'varchar', length: 150 })
    colonia: string;
    @Column({ type: 'varchar', length: 70 })
    calle: string;
    @Column({ type: 'varchar', length: 20 })
    numeroExterior: string;
    @Column({ type: 'varchar', length: 20 })
    numeroInterior: string;
    @Column({ type: 'varchar', length: 5 })
    codigoPostal: string;
    @Column({ type: 'varchar', length: 20 })
    estatus: string;
    @Column({ type: 'varchar', length: 50 })
    tipoBase: string;
}
