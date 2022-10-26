import { getConnection } from 'typeorm';
import { Sucursal } from '../../db/model/catalogo';

export class SucursalBusiness {
    getSucursales(idEmpresa: number): Promise<Sucursal[]> {
        return new Promise<Sucursal[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec sp_bpro_sucursales @Empresa = ' + idEmpresa).then((resultadoSucursales: any[]) => {
                const sucursales: Sucursal[] = [];
                resultadoSucursales.map((resultado) => {
                    sucursales.push({ idSucursal: resultado.IdSucursal, nombre: resultado.Descripcion });
                });
                resolve(sucursales);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getSucursalesExternas(idEmpresa: number): Promise<Sucursal[]> {
        return new Promise<Sucursal[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec catalogo.SEL_SUCURSAL_SP @Empresa = ' + idEmpresa).then((resultadoSucursales: any[]) => {
                const sucursales: Sucursal[] = [];
                resultadoSucursales.map((resultado) => {
                    sucursales.push({ idSucursal: resultado.IdSucursal, nombre: resultado.Descripcion });
                });
                resolve(sucursales);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }
}
