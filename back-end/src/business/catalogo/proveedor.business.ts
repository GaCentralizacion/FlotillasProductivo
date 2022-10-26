import { getConnection } from 'typeorm';
import { Proveedor } from '../../db/model/catalogo';

export class ProveedorBusiness {
    getProveedores(idSucursal: number, idTipoProveedor: string = ''): Promise<Proveedor[]> {
        return new Promise<Proveedor[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_bpro_proveedores @Sucursal ='${idSucursal}', @TipoBD = '1', @TipoAdicional = '${idTipoProveedor}'`)
                .then((proveedoresDB: any[]) => {
                    const retorno = [];
                    if (proveedoresDB == undefined) {
                        resolve([]);
                    }
                    proveedoresDB.map((proveedorDB) => {
                        const proveedor = new Proveedor();
                        proveedor.idProveedor = proveedorDB.IdCliente;
                        proveedor.nombreCompleto = proveedorDB.Nombre +
                            (proveedorDB.Paterno.trim().length == 0 ? '' : ' ' + proveedorDB.Paterno.trim()) +
                            (proveedorDB.Materno.trim().length == 0 ? '' : ' ' + proveedorDB.Materno.trim());
                        proveedor.rfc = proveedorDB.RFC;
                        proveedor.calle = proveedorDB.Calle;
                        proveedor.colonia = proveedorDB.Colonia;
                        proveedor.numeroExterior = proveedorDB.NumeroExterior;
                        proveedor.numeroInterior = proveedorDB.NumeroInterior;
                        proveedor.municipioAlcaldia = proveedorDB.Delegacion;
                        proveedor.correo = proveedorDB.Email;
                        proveedor.ciudad = proveedorDB.Ciudad;
                        proveedor.estado = proveedorDB.Estado;
                        proveedor.codigoPostal = proveedorDB.CodigoPostal;
                        proveedor.telefono = proveedorDB.Telefono;
                        proveedor.extension = proveedorDB.Extension;
                        proveedor.telefonoAlternativo = proveedorDB.TelefonoAlternativo;
                        proveedor.celular = proveedorDB.Celular;
                        proveedor.idTipoProveedor = proveedorDB.IdTipoAdicional;
                        proveedor.tipoProveedor = proveedorDB.TipoAdicional;
                        retorno.push(proveedor);
                    });
                    resolve(retorno);
                },
                    async (error) => {
                        reject(error);
                    },
                );

        });
    }
}
