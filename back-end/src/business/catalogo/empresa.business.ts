import { getConnection } from 'typeorm';
import { Empresa } from '../../db/model/catalogo';

export class EmpresaBusiness {
    getEmpresas(idMarca: string): Promise<Empresa[]> {
        return new Promise<Empresa[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec sp_bpro_empresas @Marca = ' + idMarca).then((resultadoEmpresas: any[]) => {
                const empresas: Empresa[] = [];
                resultadoEmpresas.map((resultado) => {
                    empresas.push({ idEmpresa: resultado.IdEmpresa, nombre: resultado.Descripcion });
                });
                resolve(empresas);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getEmpresasExternas(idMarca: string): Promise<Empresa[]> {
        return new Promise<Empresa[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec catalogo.SEL_EMPRESA_MARCA_SP @Marca = ' + idMarca).then((resultadoEmpresas: any[]) => {
                const empresas: Empresa[] = [];
                resultadoEmpresas.map((resultado) => {
                    empresas.push({ idEmpresa: resultado.IdEmpresa, nombre: resultado.Descripcion });
                });
                resolve(empresas);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }
}
