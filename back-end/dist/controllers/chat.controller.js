"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_json_validator_middleware_1 = require("express-json-validator-middleware");
const chat_1 = require("../business/chat");
const postContactoChat = __importStar(require("../schemas/chat/contacto_chat.schema.json"));
const postGrupoChat = __importStar(require("../schemas/chat/grupo_chat.schema.json"));
const postMediaChat = __importStar(require("../schemas/chat/media_chat.schema.json"));
const postMensajeChat = __importStar(require("../schemas/chat/mensaje_chat.schema.json"));
const postReceptorChat = __importStar(require("../schemas/chat/receptor_chat.schema.json"));
const base_controller_1 = require("./base.controller");
class ChatController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/chat';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        const validator = new express_json_validator_middleware_1.Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        const postGrupoChatCompilado = ajv
            .addSchema(postContactoChat)
            .compile(postGrupoChat).schema;
        this.router.post(`${this.basePath}/addGrupo`, validate({ body: postGrupoChatCompilado }), this.addGrupoChat.bind(this));
        this.router.get(`${this.basePath}/getGrupos`, this.getGruposChat.bind(this));
        this.router.get(`${this.basePath}/getContactos/:idGrupoChat`, this.getContactosChat.bind(this));
        this.router.get(`${this.basePath}/getMensajes/:idGrupoChat`, this.getMensajesChat.bind(this));
        this.router.get(`${this.basePath}/getMedia/:idMediaChat`, this.getMediaChat.bind(this));
        this.router.get(`${this.basePath}/getMensajesPorUsuario/:idUsuario`, this.getMensajesPorUsuario.bind(this));
        const postMensajeChatCompilado = ajv
            .addSchema(postMediaChat)
            .addSchema(postReceptorChat)
            .compile(postMensajeChat).schema;
        this.router.post(`${this.basePath}/addMensaje`, validate({ body: postMensajeChatCompilado }), this.addMennsajeChat.bind(this));
    }
    addGrupoChat(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const grupoChat = request.body;
        grupoChat.idUsuarioModificacion = idUsuario;
        grupoChat.fechaModificacion = new Date();
        const chatBusiness = new chat_1.ChatBusiness();
        chatBusiness.addGrupoChat(grupoChat)
            .then((affected) => {
            response.status(200).json({ affectedRows: affected });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getGruposChat(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const chatBusiness = new chat_1.ChatBusiness();
        chatBusiness.getGruposChat(idUsuario)
            .then((gruposChat) => {
            response.status(200).json(gruposChat);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getContactosChat(request, response) {
        const idGrupoChat = request.params.idGrupoChat || '';
        const chatBusiness = new chat_1.ChatBusiness();
        chatBusiness.getContactosChat(idGrupoChat)
            .then((contactos) => {
            response.status(200).json(contactos);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getMensajesChat(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idGrupoChat = request.params.idGrupoChat || '';
        const chatBusiness = new chat_1.ChatBusiness();
        chatBusiness.getMensajesChat(idGrupoChat, idUsuario)
            .then((mensajes) => {
            response.status(200).json(mensajes);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getMensajesPorUsuario(request, response) {
        const idUsuario = Number((request.params.idUsuario) ? request.params.idUsuario : 0);
        const chatBusiness = new chat_1.ChatBusiness();
        chatBusiness.getMensajesPorUsuario(idUsuario)
            .then((mensajes) => {
            response.status(200).json(mensajes);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getMediaChat(request, response) {
        const idMediaChat = request.params.idMediaChat || '';
        const chatBusiness = new chat_1.ChatBusiness();
        chatBusiness.getMediaChat(idMediaChat)
            .then((media) => {
            response.status(200).json(media);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    addMennsajeChat(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const mensajeChat = request.body;
        mensajeChat.idUsuarioModificacion = idUsuario;
        const chatBusiness = new chat_1.ChatBusiness();
        chatBusiness.addMensajeChat(mensajeChat)
            .then((affected) => {
            response.status(200).json({ affectedRows: affected });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map