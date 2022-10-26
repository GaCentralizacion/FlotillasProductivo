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
class UtilidadBusiness {
    getUtilidad(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_obtiene_historico_utilidad @idCotizacion='${idCotizacion}'`).then((resultadoUtilidadModal) => {
                const utilidadModal = [];
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
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
}
exports.UtilidadBusiness = UtilidadBusiness;
//# sourceMappingURL=utilidad.business.js.map