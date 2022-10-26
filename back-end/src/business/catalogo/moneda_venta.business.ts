import { getConnection } from 'typeorm';
import { MonedaVenta } from '../../db/model/catalogo';

export class MonedaVentaBusiness {
    getMonedasVenta(idSucursal: number):
    Promise<MonedaVenta[]> {
        return new Promise<MonedaVenta[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_flotillas_moneda_venta @idSucursal='${idSucursal}'`)
                .then(async (resultado: any[]) => {
                    if (resultado.length > 0) {
                        const retorno = [];
                        for (const res of resultado) {
                            const monedaVenta = new MonedaVenta();
                            monedaVenta.idMonedaVenta = res.idMonedaVenta;
                            monedaVenta.nombre = res.nombre;
                            retorno.push(monedaVenta);
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
