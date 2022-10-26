import { EntityManager, getConnection, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Notificacion } from '../../db/model/notificacion';
import { SocketServer } from '../../socketServer';

export class NotificacionBusiness {
    addNotificacion(notificacion: Notificacion, entityManager: EntityManager = null) {
        // TODO enviar por Socket.IO
        return new Promise<number>(async (resolve, reject) => {
            if (!notificacion.idNotificacion) {
                notificacion.idNotificacion = uuid().replace(/-|\s/g, '');
            }
            notificacion.fechaModificacion = new Date();
            notificacion.leida = false;
            let notificacionRepository;
            if (entityManager == undefined) {
                const connection = getConnection();
                notificacionRepository = connection.getRepository(Notificacion);
            } else {
                notificacionRepository = entityManager.getRepository(Notificacion);
            }
            await notificacionRepository.save(notificacion);
            const notificacionLeida = await notificacionRepository.findOne({ where: { idNotificacion: notificacion.idNotificacion }, relations: ['mensaje'] });
            const socketServer = SocketServer.getInstance().IO;
            socketServer.emit('notificaciones', { action: 'add', post: notificacionLeida });
            resolve(1);
        });
    }

    marcarLeida(idNotificacion: string, idUsuarioModificacion: number) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const notificacionRepository = connection.getRepository(Notificacion);
            notificacionRepository.update({ idNotificacion }
                , { leida: true, idUsuarioModificacion, fechaModificacion: new Date() });
            const notificacionLeida = await notificacionRepository.findOne({ where: { idNotificacion }, relations: ['mensaje'] });
            const socketServer = SocketServer.getInstance().IO;
            socketServer.emit('notificaciones', { action: 'read', post: notificacionLeida });
            resolve(1);
        });
    }

    marcarLeidaUsuario(idGrupoChat: string, idTipoNotificacion: number, idUsuario: number) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const notificacionRepository = connection.getRepository(Notificacion);
            const resultado = await notificacionRepository.update({ idGrupoChat, idTipoNotificacion, idUsuario }
                , { leida: true, idUsuario, fechaModificacion: new Date() });
            const notificacionesLeidas = await notificacionRepository.find({ where: { idGrupoChat, idTipoNotificacion, idUsuario }, relations: ['mensaje'] });
            const socketServer = SocketServer.getInstance().IO;
            socketServer.emit('notificaciones', { action: 'readMany', post: notificacionesLeidas });
            resolve(resultado.generatedMaps == undefined ? 0 : resultado.generatedMaps.length);
        });
    }

    getNotificaciones(idUsuario: number, cantidad: number = 100) {
        if (cantidad == undefined) {
            cantidad = 100;
        }

        return new Promise<Notificacion[]>(async (resolve, reject) => {
            const connection = getConnection();
            const notificacionRepository = connection.getRepository(Notificacion);
            const notificaciones = await notificacionRepository.query(
                `SELECT
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
                ORDER BY n.fechaModificacion DESC`,
            );
            resolve(notificaciones);
        });
    }
}
