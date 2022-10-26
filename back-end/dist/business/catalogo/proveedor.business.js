"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const catalogo_1 = require("../../db/model/catalogo");
class ProveedorBusiness {
    getProveedores(idSucursal, idTipoProveedor = '') {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_bpro_proveedores @Sucursal ='${idSucursal}', @TipoBD = '1', @TipoAdicional = '${idTipoProveedor}'`)
                .then((proveedoresDB) => {
                const retorno = [];
                if (proveedoresDB == undefined) {
                    resolve([]);
                }
                proveedoresDB.map((proveedorDB) => {
                    const proveedor = new catalogo_1.Proveedor();
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
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
}
exports.ProveedorBusiness = ProveedorBusiness;
//# sourceMappingURL=proveedor.business.js.map