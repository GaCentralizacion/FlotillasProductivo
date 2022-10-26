"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const controllers_1 = require("./controllers");
const aprobacion_controller_1 = require("./controllers/aprobacion.controller");
const chat_controller_1 = require("./controllers/chat.controller");
const solicitud_controller_1 = require("./controllers/solicitud.controller");
dotenv_1.default.config();
const port = Number(process.env.SERVER_PORT);
const app = new app_1.App([
    new controllers_1.CatalogoController(),
    new controllers_1.BitacoraController(),
    new controllers_1.SeguridadController(),
    new controllers_1.RepositorioController(),
    new controllers_1.CotizadorController(),
    new aprobacion_controller_1.AprobacionController(),
    new chat_controller_1.ChatController(),
    new controllers_1.NotificacionController(),
    new controllers_1.TrasladosController(),
    new controllers_1.PedidoController(),
    new controllers_1.UtilidadController(),
    new solicitud_controller_1.SolicitudController()
], port);
const server = app.listen();
exports.default = server;
//# sourceMappingURL=server.js.map