import { getConnection } from 'typeorm';
import { Marca } from '../../db/model/catalogo';
import { MarcaTraslados } from '../../db/model/cotizador';

export class MarcaBusiness {
    getMarcas(): Promise<Marca[]> {
        return new Promise<Marca[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec sp_bpro_marcas').then((resultadoMarcas: any[]) => {
                const marcas: Marca[] = [];
                resultadoMarcas.map((resultado) => {
                    marcas.push({ idMarca: resultado.Nombre });
                });
                resolve(marcas);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    cobrarPrimerTraslado(idMarca): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();

            await connection.transaction(async (manager) => {
                const marcaTrasladosRepo = await manager.getRepository(MarcaTraslados);
                const marcaTrasladosFind = await marcaTrasladosRepo.findOne({ idMarca });

                console.log(marcaTrasladosFind, '¿MARCAS TRASLADOS?');

                if (marcaTrasladosFind) {
                    resolve(marcaTrasladosFind.MarcaCobraPrimerTraslado);
                } else {
                    resolve(true);
                }
            })
            .catch(reject);
        });
    }

    // LBM
    cobrarPrimerTrasladoCOAL(idMarca: any, idCotizacion: any, idGrupoUnidad: number, idCotizacionTraslado: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_ValidaNumeroTraslado @idMarca='${idMarca}',@idCotizacion='${idCotizacion}',@idGrupoUnidad='${idGrupoUnidad}',@idCotizacionTraslado='${idCotizacionTraslado}'` )
                .then(async (resp: any) => {
                    resolve(resp[0].flag);
                },
                    async (error) => {
                        reject(error);
                    },
                );
        });
    }

    getMarcasExternas(): Promise<Marca[]> {
        return new Promise<Marca[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec catalogo.SEL_MARCA_SP').then((resultadoMarcas: any[]) => {
                const marcas: Marca[] = [];
                resultadoMarcas.map((resultado) => {
                    marcas.push({ idMarca: resultado.Nombre });
                });
                resolve(marcas);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }
}
