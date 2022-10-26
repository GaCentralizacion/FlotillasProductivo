import { Exception } from 'ts-httpexceptions';
import { getConnection } from 'typeorm';
import { UtilidadVista } from '../../db/model/catalogo';

export class UtilidadBusiness {
    getUtilidad(idCotizacion): Promise<UtilidadVista[]> {
        return new Promise<UtilidadVista[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_obtiene_historico_utilidad @idCotizacion='${idCotizacion}'`).then((resultadoUtilidadModal: any[]) => {
                const utilidadModal: UtilidadVista[] = [];
                resultadoUtilidadModal.map((resultado) => {
                    utilidadModal.push({
                        idsecuencia: resultado.idsecuencia,
                        tipoStatus: resultado.tipoStatus,
                        idCotizacion: resultado.idCotizacion,
                        tipoMovimiento: resultado.tipoMovimiento,
                        nombreStep: resultado.nombreStep,
                        idArticulo: resultado.idArticulo,
                        dsArticulo: resultado.dsArticulo,
                        cantidad: resultado.cantidad,
                        precioUnitario: Number(resultado.precioUnitario),
                        costoUnitario: Number(resultado.costoUnitario),
                        precio: Number(resultado.precio),
                        costo: Number(resultado.costo),
                        utilidadUnitaria: resultado.utilidadUnitaria,
                        tipoOrden: resultado.tipoOrden,
                        idCFDI: resultado.idCFDI,
                        idGrupoUnidad: resultado.idGrupoUnidad,
                        utilidadCot: resultado.utilidadCot,
                        utilidadPost: resultado.utilidadPost,
                        utilidadAd: resultado.utilidadAd,
                        totalUtilidad: resultado.totalUtilidad,
                        version: resultado.version,
                    });
                });
                resolve(utilidadModal);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

}
