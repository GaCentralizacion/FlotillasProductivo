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
const cotizador_1 = require("../../db/model/cotizador");
class MarcaBusiness {
    getMarcas() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec sp_bpro_marcas').then((resultadoMarcas) => {
                const marcas = [];
                resultadoMarcas.map((resultado) => {
                    marcas.push({ idMarca: resultado.Nombre });
                });
                resolve(marcas);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    cobrarPrimerTraslado(idMarca) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const marcaTrasladosRepo = yield manager.getRepository(cotizador_1.MarcaTraslados);
                const marcaTrasladosFind = yield marcaTrasladosRepo.findOne({ idMarca });
                console.log(marcaTrasladosFind, '¿MARCAS TRASLADOS?');
                if (marcaTrasladosFind) {
                    resolve(marcaTrasladosFind.MarcaCobraPrimerTraslado);
                }
                else {
                    resolve(true);
                }
            }))
                .catch(reject);
        }));
    }
    // LBM
    cobrarPrimerTrasladoCOAL(idMarca, idCotizacion, idGrupoUnidad, idCotizacionTraslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_ValidaNumeroTraslado @idMarca='${idMarca}',@idCotizacion='${idCotizacion}',@idGrupoUnidad='${idGrupoUnidad}',@idCotizacionTraslado='${idCotizacionTraslado}'`)
                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                resolve(resp[0].flag);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getMarcasExternas() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec catalogo.SEL_MARCA_SP').then((resultadoMarcas) => {
                const marcas = [];
                resultadoMarcas.map((resultado) => {
                    marcas.push({ idMarca: resultado.Nombre });
                });
                resolve(marcas);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
}
exports.MarcaBusiness = MarcaBusiness;
//# sourceMappingURL=marca.business.js.map