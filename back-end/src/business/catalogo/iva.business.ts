import { getConnection } from 'typeorm';
import { Iva } from '../../db/model/catalogo';

export class IvaBusiness {
    getIvas(idSucursal: number): Promise<Iva[]> {
        return new Promise<Iva[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_flotillas_iva @idSucursal='${idSucursal}'`)
                .then(async (resultado: any[]) => {
                    if (resultado.length > 0) {
                        const retorno = [];
                        for (const res of resultado) {
                            const iva = new Iva();
                            iva.idIva = res.idIva;
                            iva.tasa = Number(res.tasa);
                            iva.nombre = res.nombre;
                            retorno.push(iva);
                        }
                        resolve(retorno);
                    } else {
                        return null;
                    }
                },
                    async (error) => {
                        reject(error);
                    },
                );
        });
    }
}
