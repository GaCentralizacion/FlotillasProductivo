import { getConnection } from 'typeorm';
import { Financiera } from '../../db/model/catalogo';

/* export class FinancieraBusiness {
    getFinancieras(idMarca: string): Promise<Financiera[]> {
        return new Promise<Financiera[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec sp_bpro_financieras @Marca = ' + idMarca).then((resultadoFinancieras: any[]) => {
                const financieras: Financiera[] = [];
                resultadoFinancieras.map((resultado) => {
                    financieras.push({ idFinanciera: resultado.IdFinanciera, nombre: resultado.Descripcion });
                });
                resolve(financieras);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }
}
 */
export class FinancieraBusiness {
    getFinancieras(idSucursal: number): Promise<Financiera[]> {
        return new Promise<Financiera[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec sp_bpro_financieras @Sucursal = ' + idSucursal).then((resultadoFinancieras: any[]) => {
                const financieras: Financiera[] = [];
                resultadoFinancieras.map((resultado) => {
                    financieras.push({ idFinanciera: resultado.IdFinanciera, nombre: resultado.Financiera });
                });
                resolve(financieras);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getFinancierasExternas(idSucursal: number): Promise<Financiera[]> {
        return new Promise<Financiera[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec catalogo.SEL_FINANCIERA_SP @Sucursal = ' + idSucursal).then((resultadoFinancieras: any[]) => {
                const financieras: Financiera[] = [];
                resultadoFinancieras.map((resultado) => {
                    financieras.push({ idFinanciera: resultado.IdFinanciera, nombre: resultado.Financiera });
                });
                resolve(financieras);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }
}
