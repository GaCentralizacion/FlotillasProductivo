import { getConnection } from 'typeorm';
import { TipoVenta } from '../../db/model/catalogo';

export class TipoVentaBusiness {
    getTiposVentas(idSucursal: number, idDireccionFlotillas: string): Promise<TipoVenta[]> {
        return new Promise<TipoVenta[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_flotillas_tipo_venta @idSucursal='${idSucursal}', @idDireccionFlotillas = '${idDireccionFlotillas}'`)
                .then(async (resultado: any[]) => {
                    if (resultado.length > 0) {
                        const retorno = [];
                        for (const res of resultado) {
                            const iva = new TipoVenta();
                            iva.idTipoVenta = res.idTipoVenta;
                            iva.nombre = res.nombre;
                            iva.tipo = res.tipo;
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
