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
class TipoVentaBusiness {
    getTiposVentas(idSucursal, idDireccionFlotillas) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_flotillas_tipo_venta @idSucursal='${idSucursal}', @idDireccionFlotillas = '${idDireccionFlotillas}'`)
                .then((resultado) => __awaiter(this, void 0, void 0, function* () {
                if (resultado.length > 0) {
                    const retorno = [];
                    for (const res of resultado) {
                        const iva = new catalogo_1.TipoVenta();
                        iva.idTipoVenta = res.idTipoVenta;
                        iva.nombre = res.nombre;
                        iva.tipo = res.tipo;
                        retorno.push(iva);
                    }
                    resolve(retorno);
                }
                else {
                    return null;
                }
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
}
exports.TipoVentaBusiness = TipoVentaBusiness;
//# sourceMappingURL=tipo_venta.business.js.map