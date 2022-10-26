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
const notificacion_1 = require("../business/notificacion");
const postNotificacion = __importStar(require("../schemas/notificacion/notificacion.schema.json"));
const base_controller_1 = require("./base.controller");
class NotificacionController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/notificacion';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        const validator = new express_json_validator_middleware_1.Validator({ allErrors: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.post(`${this.basePath}/add`, validate({ body: postNotificacion }), this.addNotificacion.bind(this));
        this.router.get(`${this.basePath}/marcarLeida/:idNotificacion`, this.marcarLeida.bind(this));
        this.router.get(`${this.basePath}/marcarLeidaUsuario/:idGrupoChat/:idTipoNotificacion`, this.marcarLeidaUsuario.bind(this));
        this.router.get(`${this.basePath}/getAll/:cantidad`, this.getNotificaciones.bind(this));
        this.router.get(`${this.basePath}/getAll`, this.getNotificaciones.bind(this));
    }
    addNotificacion(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const notificacion = request.body;
        notificacion.idUsuarioModificacion = idUsuario;
        const notificacionBusiness = new notificacion_1.NotificacionBusiness();
        notificacionBusiness.addNotificacion(notificacion)
            .then((affected) => {
            response.status(200).json({ affectedRows: affected });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    marcarLeida(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idNotificacion = request.params.idNotificacion;
        const notificacionBusiness = new notificacion_1.NotificacionBusiness();
        notificacionBusiness.marcarLeida(idNotificacion, idUsuario)
            .then((affected) => {
            response.status(200).json({ affectedRows: affected });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    marcarLeidaUsuario(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idGrupoChat = request.params.idGrupoChat;
        const idTipoNotificacion = Number(request.params.idTipoNotificacion);
        const notificacionBusiness = new notificacion_1.NotificacionBusiness();
        notificacionBusiness.marcarLeidaUsuario(idGrupoChat, idTipoNotificacion, idUsuario)
            .then((affected) => {
            response.status(200).json({ affectedRows: affected });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getNotificaciones(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        let cantidad = null;
        if (request.params.cantidad && !isNaN(Number(request.params.cantidad))) {
            cantidad = Number(request.params.cantidad);
        }
        const notificacionBusiness = new notificacion_1.NotificacionBusiness();
        notificacionBusiness.getNotificaciones(idUsuario, cantidad)
            .then((notificaciones) => {
            response.status(200).json(notificaciones);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
}
exports.NotificacionController = NotificacionController;
//# sourceMappingURL=notificacion.controller.js.map