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
const chat_1 = require("../../db/model/chat");
const notificacion_1 = require("../../db/model/notificacion");
const notificacion_2 = require("../notificacion");
const repositorio_1 = require("../repositorio");
class ChatBusiness {
    addGrupoChat(grupoChat) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const grupoRepository = yield manager.getRepository(chat_1.GrupoChat);
                const contactoRepository = yield manager.getRepository(chat_1.ContactoChat);
                const contactoGrupoRepository = yield manager.getRepository(chat_1.RelContactoGrupoChat);
                // const grupoDb = await grupoRepository.findOne(grupoChat.idGrupoChat);
                // if (grupoDb) {
                //     throw new Exception(409, `El grupo con Id: ${grupoChat.idGrupoChat} ya existe`);
                // }
                yield grupoRepository.save(grupoChat);
                for (const contacto of grupoChat.contactos) {
                    const contactoDb = yield contactoRepository.findOne({ where: { idUsuario: contacto.idUsuario } });
                    if (contactoDb) {
                        contacto.idContactoChat = contactoDb.idContactoChat;
                    }
                    if (!contacto.idContactoChat) {
                        contacto.idContactoChat = uuid_1.v4().replace(/-|\s/g, '');
                    }
                    contacto.idUsuarioModificacion = grupoChat.idUsuarioModificacion;
                    contacto.fechaModificacion = grupoChat.fechaModificacion;
                    yield contactoRepository.save(contacto);
                    const contactoGrupo = new chat_1.RelContactoGrupoChat();
                    contactoGrupo.idGrupoChat = grupoChat.idGrupoChat;
                    contactoGrupo.idContactoChat = contacto.idContactoChat;
                    contactoGrupo.idUsuarioModificacion = grupoChat.idUsuarioModificacion;
                    contactoGrupo.fechaModificacion = grupoChat.fechaModificacion;
                    yield contactoGrupoRepository.save(contactoGrupo);
                }
                resolve(1);
            }));
        }));
    }
    getGruposChat(idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const grupoRepository = yield connection.getRepository(chat_1.GrupoChat);
            const gruposChat = yield grupoRepository.createQueryBuilder('gc')
                .innerJoin('gc.contactos', 'contacto', 'contacto.idUsuario = :idUsuario', { idUsuario })
                .getMany();
            resolve(gruposChat);
        }));
    }
    getContactosChat(idGrupoChat) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const contactoRepository = yield connection.getRepository(chat_1.ContactoChat);
            const contactos = yield contactoRepository.createQueryBuilder('c')
                .select('DISTINCT c.*')
                .innerJoin('c.contactoGrupo', 'contactoGrupo', 'contactoGrupo.idGrupoChat = :idGrupoChat', { idGrupoChat })
                .getRawMany();
            resolve(contactos);
        }));
    }
    getMensajesChat(idGrupoChat, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec [dbo].[SP_GET_MENSAJESCHAT_PORGRUPO] @idGrupoChat='${idGrupoChat}', @idUsuario=${idUsuario}`)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                const notificacionBusiness = new notificacion_2.NotificacionBusiness();
                notificacionBusiness.marcarLeidaUsuario(idGrupoChat, -1, idUsuario);
                resolve(result);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getMensajesPorUsuario(idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const mensajes = yield connection.query(`
            select top 10 mc.idMensajeChat, gc.idGrupoChat, mc.cuerpoMensaje, mc.idUsuarioModificacion,
            (select nombreCompleto from ContactoChat where idUsuario = mc.idUsuarioModificacion) as usuario from GrupoChat gc
            inner join RelContactoGrupoChat rcgc on rcgc.idGrupoChat = gc.idGrupoChat
            inner join ContactoChat cc on cc.idContactoChat = rcgc.idContactoChat
            inner join MensajeChat mc on mc.idGrupoChat = gc.idGrupoChat
            where
                cc.idUsuario = ${idUsuario}
                and mc.idMediaChat IS NULL
                order by mc.fechaCreacion desc
            `);
            resolve(mensajes);
        }));
    }
    getMediaChat(idMediaChat) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const mediaRepository = yield connection.getRepository(chat_1.MediaChat);
            const media = yield mediaRepository.findOne({ where: { idMediaChat } });
            if (media) {
                const mensajeRepository = yield connection.getRepository(chat_1.MensajeChat);
                const idGrupoChat = (yield mensajeRepository.findOne({ where: { idMediaChat } })).idGrupoChat;
                const documentoBusiness = new repositorio_1.DocumentoBusiness('chat');
                media.contenido = yield documentoBusiness.get(idGrupoChat + '/' + idMediaChat + '.' + media.tipoMedio);
            }
            resolve(media);
        }));
    }
    addMensajeChat(mensajeChat) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            mensajeChat.fechaModificacion = new Date();
            mensajeChat.fechaCreacion = new Date();
            if (!mensajeChat.idMensajeChat) {
                mensajeChat.idMensajeChat = uuid_1.v4().replace(/-|\s/g, '');
            }
            if (mensajeChat.media) {
                if (!mensajeChat.idMediaChat) {
                    mensajeChat.idMediaChat = uuid_1.v4().replace(/-|\s/g, '');
                    mensajeChat.media.idMediaChat = mensajeChat.idMediaChat;
                }
                mensajeChat.media.idContactoChat = mensajeChat.idContactoChat;
                mensajeChat.media.fechaModificacion = mensajeChat.fechaModificacion;
                mensajeChat.media.idUsuarioModificacion = mensajeChat.idUsuarioModificacion;
                const documentoBusiness = new repositorio_1.DocumentoBusiness('chat');
                mensajeChat.media.mediaPath = mensajeChat.idGrupoChat + '/' + mensajeChat.media.idMediaChat + '.' + mensajeChat.media.tipoMedio;
                yield documentoBusiness.set(mensajeChat.media.mediaPath, mensajeChat.media.contenido);
            }
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const mensajeRepository = yield manager.getRepository(chat_1.MensajeChat);
                const mediaRepository = yield manager.getRepository(chat_1.MediaChat);
                if (mensajeChat.media) {
                    yield mediaRepository.save(mensajeChat.media);
                }
                yield mensajeRepository.save(mensajeChat);
                const notificacionBusiness = new notificacion_2.NotificacionBusiness();
                const contactoRepository = yield connection.getRepository(chat_1.ContactoChat);
                const contactos = yield contactoRepository.createQueryBuilder('c')
                    .innerJoin('c.contactoGrupo', 'contactoGrupo', 'contactoGrupo.idContactoChat <> :idContactoChat and contactoGrupo.idGrupoChat = :idGrupoChat', {
                    idContactoChat: mensajeChat.idContactoChat,
                    idGrupoChat: mensajeChat.idGrupoChat,
                })
                    .getMany();
                for (const contacto of contactos) {
                    const notificacion = new notificacion_1.Notificacion();
                    notificacion.idMensajeChat = mensajeChat.idMensajeChat;
                    notificacion.idGrupoChat = mensajeChat.idGrupoChat;
                    notificacion.fechaModificacion = mensajeChat.fechaModificacion;
                    notificacion.idUsuarioModificacion = mensajeChat.idUsuarioModificacion;
                    notificacion.idTipoNotificacion = -1;
                    notificacion.idUsuario = contacto.idUsuario;
                    notificacion.leida = false;
                    notificacion.link = process.env.CLIENT_URL + 'main/chatNotificaciones?idGrupoChat=' + mensajeChat.idGrupoChat;
                    yield notificacionBusiness.addNotificacion(notificacion, manager);
                }
            }));
            resolve(1);
        }));
    }
}
exports.ChatBusiness = ChatBusiness;
//# sourceMappingURL=chat.business.js.map