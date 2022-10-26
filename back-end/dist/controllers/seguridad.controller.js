"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const seguridad_1 = require("../business/seguridad");
const base_controller_1 = require("./base.controller");
class SeguridadController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/seguridad';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(`${this.basePath}/usuario/get/:idUsuario`, this.getUsuario.bind(this));
        this.router.get(`${this.basePath}/usuario/getAll`, this.getAllUsuarios.bind(this));
    }
    getUsuario(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const seguridadBusiness = new seguridad_1.SeguridadBusiness();
        seguridadBusiness.getUsuario(idUsuario).then((usuario) => {
            response.json(usuario);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    getAllUsuarios(request, response) {
        const seguridadBusiness = new seguridad_1.SeguridadBusiness();
        seguridadBusiness.getAllUsuarios().then((usuarios) => {
            response.json(usuarios);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
}
exports.SeguridadController = SeguridadController;
//# sourceMappingURL=seguridad.controller.js.map