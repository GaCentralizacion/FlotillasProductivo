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
const bitacora_1 = require("../../db/model/bitacora");
const bitacora_2 = require("../../db/model/bitacora");
class BitacoraBusiness {
    getEventos(filtroEvento) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let condiciones = '@pagina = ' + filtroEvento.pagina + ', @numeroRegistros = ' + filtroEvento.numeroRegistros;
            const condExtra = [];
            if (filtroEvento.idUsuario != undefined) {
                condExtra.push('@idUsuario = \'' + filtroEvento.idUsuario + '\'');
            }
            if (filtroEvento.fechaInicio != undefined) {
                condExtra.push('@fechaInicio = \'' + filtroEvento.fechaInicio + '\'');
            }
            if (filtroEvento.modulo != undefined) {
                condExtra.push('@modulo = \'' + filtroEvento.modulo + '\'');
            }
            if (filtroEvento.tabla != undefined) {
                condExtra.push('@tabla = \'' + filtroEvento.tabla + '\'');
            }
            if (filtroEvento.evento != undefined) {
                condExtra.push('@evento = \'' + filtroEvento.evento + '\'');
            }
            condiciones = condiciones + (condExtra.length > 0 ? ', ' + condExtra.join(', ') : '');
            yield connection.query('exec sp_flotillas_filter_evento_log_total ' + condExtra.join(', ')).then((resultado) => __awaiter(this, void 0, void 0, function* () {
                const retorno = new bitacora_2.EventoLogFilterResult();
                retorno.totalRegistros = resultado[0].totalRegistros;
                yield connection.query('exec sp_flotillas_filter_evento_log ' + condiciones).then((resultadoEventos) => {
                    retorno.eventos = resultadoEventos;
                    resolve(retorno);
                }, (error) => __awaiter(this, void 0, void 0, function* () {
                    reject(error);
                }));
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    saveRegister(idUsuario, tabla, evento, modulo, datos) {
        const register = {
            idUsuario,
            fechaHora: new Date(Date.now()),
            tabla,
            modulo,
            evento,
            datos: JSON.stringify(datos),
        };
        const connection = typeorm_1.getConnection('bitacora');
        connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
            const bitacoraRepository = yield manager.getRepository(bitacora_1.EventoLog);
            yield bitacoraRepository.save(register);
        }));
    }
} // End for BitacoraBusiness
exports.BitacoraBusiness = BitacoraBusiness;
//# sourceMappingURL=bitacora.business.js.map