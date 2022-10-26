import { Server } from 'http';
import socketIO from 'socket.io';
import { HTTPException } from 'ts-httpexceptions';

export class SocketServer {
    private static instance: SocketServer;
    private ioServer: socketIO.Server;

    private constructor() {

    }

    static init(server: Server) {
        if (!SocketServer.instance) {
            SocketServer.instance = new SocketServer();
        }
        SocketServer.instance.ioServer = socketIO(server);
        return SocketServer.instance;
    }

    static getInstance() {
        if (SocketServer.instance == undefined) {
            throw new HTTPException(400, 'No se inició el socket server');
        }
        return SocketServer.instance;
    }

    get IO() {
        if (this.ioServer == undefined) {
            throw new HTTPException(400, 'No se pudo iniciar el socket server');
        }
        return this.ioServer;
    }
}
