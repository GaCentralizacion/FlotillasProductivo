import express = require('express');
import { Validator } from 'express-json-validator-middleware';
import { ChatBusiness } from '../business/chat';
import { ContactoChat, GrupoChat, MediaChat, MensajeChat } from '../db/model/chat';
import * as postContactoChat from '../schemas/chat/contacto_chat.schema.json';
import * as postGrupoChat from '../schemas/chat/grupo_chat.schema.json';
import * as postMediaChat from '../schemas/chat/media_chat.schema.json';
import * as postMensajeChat from '../schemas/chat/mensaje_chat.schema.json';
import * as postReceptorChat from '../schemas/chat/receptor_chat.schema.json';
import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class ChatController extends BaseController implements IController {
    basePath = '/chat';
    router = express.Router();

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        const validator = new Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        const postGrupoChatCompilado = ajv
            .addSchema(postContactoChat)
            .compile(postGrupoChat).schema;
        this.router.post(
            `${this.basePath}/addGrupo`,
            validate({ body: postGrupoChatCompilado }),
            this.addGrupoChat.bind(this),
        );
        this.router.get(
            `${this.basePath}/getGrupos`,
            this.getGruposChat.bind(this),
        );
        this.router.get(
            `${this.basePath}/getContactos/:idGrupoChat`,
            this.getContactosChat.bind(this),
        );
        this.router.get(
            `${this.basePath}/getMensajes/:idGrupoChat`,
            this.getMensajesChat.bind(this),
        );
        this.router.get(
            `${this.basePath}/getMedia/:idMediaChat`,
            this.getMediaChat.bind(this),
        );

        this.router.get(
            `${this.basePath}/getMensajesPorUsuario/:idUsuario`,
            this.getMensajesPorUsuario.bind(this),
        );
        const postMensajeChatCompilado = ajv
            .addSchema(postMediaChat)
            .addSchema(postReceptorChat)
            .compile(postMensajeChat).schema;
        this.router.post(
            `${this.basePath}/addMensaje`,
            validate({ body: postMensajeChatCompilado }),
            this.addMennsajeChat.bind(this),
        );
    }

    private addGrupoChat(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const grupoChat = request.body as GrupoChat;
        grupoChat.idUsuarioModificacion = idUsuario;
        grupoChat.fechaModificacion = new Date();
        const chatBusiness = new ChatBusiness();
        chatBusiness.addGrupoChat(grupoChat)
            .then((affected: number) => {
                response.status(200).json({ affectedRows: affected });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private getGruposChat(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const chatBusiness = new ChatBusiness();
        chatBusiness.getGruposChat(idUsuario)
            .then((gruposChat: GrupoChat[]) => {
                response.status(200).json(gruposChat);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private getContactosChat(request: express.Request, response: express.Response) {
        const idGrupoChat = request.params.idGrupoChat || '';
        const chatBusiness = new ChatBusiness();
        chatBusiness.getContactosChat(idGrupoChat)
            .then((contactos: ContactoChat[]) => {
                response.status(200).json(contactos);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private getMensajesChat(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idGrupoChat = request.params.idGrupoChat || '';
        const chatBusiness = new ChatBusiness();
        chatBusiness.getMensajesChat(idGrupoChat, idUsuario)
            .then((mensajes: MensajeChat[]) => {
                response.status(200).json(mensajes);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private getMensajesPorUsuario(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.params.idUsuario) ? request.params.idUsuario : 0);
        const chatBusiness = new ChatBusiness();
        chatBusiness.getMensajesPorUsuario(idUsuario)
            .then((mensajes: MensajeChat[]) => {
                response.status(200).json(mensajes);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private getMediaChat(request: express.Request, response: express.Response) {
        const idMediaChat = request.params.idMediaChat || '';
        const chatBusiness = new ChatBusiness();
        chatBusiness.getMediaChat(idMediaChat)
            .then((media: MediaChat) => {
                response.status(200).json(media);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private addMennsajeChat(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const mensajeChat = request.body as MensajeChat;
        mensajeChat.idUsuarioModificacion = idUsuario;
        const chatBusiness = new ChatBusiness();
        chatBusiness.addMensajeChat(mensajeChat)
            .then((affected: number) => {
                response.status(200).json({ affectedRows: affected });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

}
