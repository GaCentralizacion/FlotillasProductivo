import { Exception } from 'ts-httpexceptions';
import { getConnection, Not } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ContactoChat, GrupoChat, MediaChat, MensajeChat, RelContactoGrupoChat } from '../../db/model/chat';
import { Notificacion } from '../../db/model/notificacion';
import { NotificacionBusiness } from '../notificacion';
import { DocumentoBusiness } from '../repositorio';

export class ChatBusiness {
    addGrupoChat(grupoChat: GrupoChat) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const grupoRepository = await manager.getRepository(GrupoChat);
                const contactoRepository = await manager.getRepository(ContactoChat);
                const contactoGrupoRepository = await manager.getRepository(RelContactoGrupoChat);
                // const grupoDb = await grupoRepository.findOne(grupoChat.idGrupoChat);
                // if (grupoDb) {
                //     throw new Exception(409, `El grupo con Id: ${grupoChat.idGrupoChat} ya existe`);
                // }
                await grupoRepository.save(grupoChat);
                for (const contacto of grupoChat.contactos) {
                    const contactoDb = await contactoRepository.findOne({ where: { idUsuario: contacto.idUsuario } });
                    if (contactoDb) {
                        contacto.idContactoChat = contactoDb.idContactoChat;
                    }
                    if (!contacto.idContactoChat) {
                        contacto.idContactoChat = uuid().replace(/-|\s/g, '');
                    }
                    contacto.idUsuarioModificacion = grupoChat.idUsuarioModificacion;
                    contacto.fechaModificacion = grupoChat.fechaModificacion;
                    await contactoRepository.save(contacto);
                    const contactoGrupo = new RelContactoGrupoChat();
                    contactoGrupo.idGrupoChat = grupoChat.idGrupoChat;
                    contactoGrupo.idContactoChat = contacto.idContactoChat;
                    contactoGrupo.idUsuarioModificacion = grupoChat.idUsuarioModificacion;
                    contactoGrupo.fechaModificacion = grupoChat.fechaModificacion;
                    await contactoGrupoRepository.save(contactoGrupo);
                }
                resolve(1);
            });
        });
    }

    getGruposChat(idUsuario: number) {
        return new Promise<GrupoChat[]>(async (resolve, reject) => {
            const connection = getConnection();
            const grupoRepository = await connection.getRepository(GrupoChat);
            const gruposChat = await grupoRepository.createQueryBuilder('gc')
                .innerJoin('gc.contactos', 'contacto', 'contacto.idUsuario = :idUsuario', { idUsuario })
                .getMany();
            resolve(gruposChat);
        });
    }

    getContactosChat(idGrupoChat: string) {
        return new Promise<ContactoChat[]>(async (resolve, reject) => {
            const connection = getConnection();
            const contactoRepository = await connection.getRepository(ContactoChat);
            const contactos = await contactoRepository.createQueryBuilder('c')
                .select('DISTINCT c.*')
                .innerJoin('c.contactoGrupo', 'contactoGrupo', 'contactoGrupo.idGrupoChat = :idGrupoChat', { idGrupoChat })
                .getRawMany();
            resolve(contactos);
        });
    }

    getMensajesChat(idGrupoChat: string, idUsuario: number) {
        return new Promise<MensajeChat[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec [dbo].[SP_GET_MENSAJESCHAT_PORGRUPO] @idGrupoChat='${idGrupoChat}', @idUsuario=${idUsuario}`)
            .then(
                async (result: any) => {
                    const notificacionBusiness = new NotificacionBusiness();
                    notificacionBusiness.marcarLeidaUsuario(idGrupoChat, -1, idUsuario);
                    resolve(result);
                },
                async (error: any) => {
                    reject(error);
                },
            );

        });
    }

    getMensajesPorUsuario(idUsuario: number) {
        return new Promise<any[]>(async (resolve, reject) => {
            const connection = getConnection();

            const mensajes = await connection.query(`
            select top 10 mc.idMensajeChat, gc.idGrupoChat, mc.cuerpoMensaje, mc.idUsuarioModificacion,
            (select nombreCompleto from ContactoChat where idUsuario = mc.idUsuarioModificacion) as usuario from GrupoChat gc
            inner join RelContactoGrupoChat rcgc on rcgc.idGrupoChat = gc.idGrupoChat
            inner join ContactoChat cc on cc.idContactoChat = rcgc.idContactoChat
            inner join MensajeChat mc on mc.idGrupoChat = gc.idGrupoChat
            where
                cc.idUsuario = ${idUsuario}
                and mc.idMediaChat IS NULL
                order by mc.fechaCreacion desc
            `,
            );
            resolve(mensajes);
        });
    }

    getMediaChat(idMediaChat: string) {
        return new Promise<MediaChat>(async (resolve, reject) => {
            const connection = getConnection();
            const mediaRepository = await connection.getRepository(MediaChat);
            const media = await mediaRepository.findOne({ where: { idMediaChat } });
            if (media) {
                const mensajeRepository = await connection.getRepository(MensajeChat);
                const idGrupoChat = (await mensajeRepository.findOne({ where: { idMediaChat } })).idGrupoChat;
                const documentoBusiness = new DocumentoBusiness('chat');
                media.contenido = await documentoBusiness.get(idGrupoChat + '/' + idMediaChat + '.' + media.tipoMedio);
            }
            resolve(media);
        });
    }

    addMensajeChat(mensajeChat: MensajeChat) {
        return new Promise<number>(async (resolve, reject) => {
            mensajeChat.fechaModificacion = new Date();
            mensajeChat.fechaCreacion = new Date();
            if (!mensajeChat.idMensajeChat) {
                mensajeChat.idMensajeChat = uuid().replace(/-|\s/g, '');
            }
            if (mensajeChat.media) {
                if (!mensajeChat.idMediaChat) {
                    mensajeChat.idMediaChat = uuid().replace(/-|\s/g, '');
                    mensajeChat.media.idMediaChat = mensajeChat.idMediaChat;
                }
                mensajeChat.media.idContactoChat = mensajeChat.idContactoChat;
                mensajeChat.media.fechaModificacion = mensajeChat.fechaModificacion;
                mensajeChat.media.idUsuarioModificacion = mensajeChat.idUsuarioModificacion;
                const documentoBusiness = new DocumentoBusiness('chat');
                mensajeChat.media.mediaPath = mensajeChat.idGrupoChat + '/' + mensajeChat.media.idMediaChat + '.' + mensajeChat.media.tipoMedio;
                await documentoBusiness.set(mensajeChat.media.mediaPath, mensajeChat.media.contenido);
            }
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const mensajeRepository = await manager.getRepository(MensajeChat);
                const mediaRepository = await manager.getRepository(MediaChat);
                if (mensajeChat.media) {
                    await mediaRepository.save(mensajeChat.media);
                }
                await mensajeRepository.save(mensajeChat);
                const notificacionBusiness = new NotificacionBusiness();
                const contactoRepository = await connection.getRepository(ContactoChat);
                const contactos = await contactoRepository.createQueryBuilder('c')
                    .innerJoin('c.contactoGrupo', 'contactoGrupo', 'contactoGrupo.idContactoChat <> :idContactoChat and contactoGrupo.idGrupoChat = :idGrupoChat'
                        , {
                            idContactoChat: mensajeChat.idContactoChat
                            , idGrupoChat: mensajeChat.idGrupoChat,
                        })
                    .getMany();
                for (const contacto of contactos) {
                    const notificacion = new Notificacion();
                    notificacion.idMensajeChat = mensajeChat.idMensajeChat;
                    notificacion.idGrupoChat = mensajeChat.idGrupoChat;
                    notificacion.fechaModificacion = mensajeChat.fechaModificacion;
                    notificacion.idUsuarioModificacion = mensajeChat.idUsuarioModificacion;
                    notificacion.idTipoNotificacion = -1;
                    notificacion.idUsuario = contacto.idUsuario;
                    notificacion.leida = false;
                    notificacion.link = process.env.CLIENT_URL + 'main/chatNotificaciones?idGrupoChat=' + mensajeChat.idGrupoChat;
                    await notificacionBusiness.addNotificacion(notificacion, manager);
                }
            });

            resolve(1);
        });
    }
}
