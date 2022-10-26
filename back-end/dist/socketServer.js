"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const ts_httpexceptions_1 = require("ts-httpexceptions");
class SocketServer {
    constructor() {
    }
    static init(server) {
        if (!SocketServer.instance) {
            SocketServer.instance = new SocketServer();
        }
        SocketServer.instance.ioServer = socket_io_1.default(server);
        return SocketServer.instance;
    }
    static getInstance() {
        if (SocketServer.instance == undefined) {
            throw new ts_httpexceptions_1.HTTPException(400, 'No se inició el socket server');
        }
        return SocketServer.instance;
    }
    get IO() {
        if (this.ioServer == undefined) {
            throw new ts_httpexceptions_1.HTTPException(400, 'No se pudo iniciar el socket server');
        }
        return this.ioServer;
    }
}
exports.SocketServer = SocketServer;
//# sourceMappingURL=socketServer.js.map