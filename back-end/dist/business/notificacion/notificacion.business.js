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
const uuid_1 = require("uuid");
const notificacion_1 = require("../../db/model/notificacion");
const socketServer_1 = require("../../socketServer");
class NotificacionBusiness {
    addNotificacion(notificacion, entityManager = null) {
        // TODO enviar por Socket.IO
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!notificacion.idNotificacion) {
                notificacion.idNotificacion = uuid_1.v4().replace(/-|\s/g, '');
            }
            notificacion.fechaModificacion = new Date();
            notificacion.leida = false;
            let notificacionRepository;
            if (entityManager == undefined) {
                const connection = typeorm_1.getConnection();
                notificacionRepository = connection.getRepository(notificacion_1.Notificacion);
            }
            else {
                notificacionRepository = entityManager.getRepository(notificacion_1.Notificacion);
            }
            yield notificacionRepository.save(notificacion);
            const notificacionLeida = yield notificacionRepository.findOne({ where: { idNotificacion: notificacion.idNotificacion }, relations: ['mensaje'] });
            const socketServer = socketServer_1.SocketServer.getInstance().IO;
            socketServer.emit('notificaciones', { action: 'add', post: notificacionLeida });
            resolve(1);
        }));
    }
    marcarLeida(idNotificacion, idUsuarioModificacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const notificacionRepository = connection.getRepository(notificacion_1.Notificacion);
            notificacionRepository.update({ idNotificacion }, { leida: true, idUsuarioModificacion, fechaModificacion: new Date() });
            const notificacionLeida = yield notificacionRepository.findOne({ where: { idNotificacion }, relations: ['mensaje'] });
            const socketServer = socketServer_1.SocketServer.getInstance().IO;
            socketServer.emit('notificaciones', { action: 'read', post: notificacionLeida });
            resolve(1);
        }));
    }
    marcarLeidaUsuario(idGrupoChat, idTipoNotificacion, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const notificacionRepository = connection.getRepository(notificacion_1.Notificacion);
            const resultado = yield notificacionRepository.update({ idGrupoChat, idTipoNotificacion, idUsuario }, { leida: true, idUsuario, fechaModificacion: new Date() });
            const notificacionesLeidas = yield notificacionRepository.find({ where: { idGrupoChat, idTipoNotificacion, idUsuario }, relations: ['mensaje'] });
            const socketServer = socketServer_1.SocketServer.getInstance().IO;
            socketServer.emit('notificaciones', { action: 'readMany', post: notificacionesLeidas });
            resolve(resultado.generatedMaps == undefined ? 0 : resultado.generatedMaps.length);
        }));
    }
    getNotificaciones(idUsuario, cantidad = 100) {
        if (cantidad == undefined) {
            cantidad = 100;
        }
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const notificacionRepository = connection.getRepository(notificacion_1.Notificacion);
            const notificaciones = yield notificacionRepository.query(`SELECT
                    TOP ${cantidad}
                    n.idNotificacion
                    ,n.idUsuario
                    ,n.idGrupoChat
                    ,n.idTipoNotificacion
                    ,n.link
                    ,n.leida
                    ,n.idUsuarioModificacion
                    ,n.fechaModificacion
                FROM Notificacion n
                WHERE n.idUsuario = ${idUsuario}
                ORDER BY n.fechaModificacion DESC`);
            resolve(notificaciones);
        }));
    }
}
exports.NotificacionBusiness = NotificacionBusiness;
//# sourceMappingURL=notificacion.business.js.map