import dotenv from 'dotenv';
import { App } from './app';
import { BitacoraController, CatalogoController, CotizadorController, NotificacionController, PedidoController, RepositorioController, SeguridadController, TrasladosController, UtilidadController } from './controllers';
import { AprobacionController } from './controllers/aprobacion.controller';
import { ChatController } from './controllers/chat.controller';
import { SolicitudController } from './controllers/solicitud.controller';

dotenv.config();

const port = Number(process.env.SERVER_PORT);

const app = new App([
    new CatalogoController(),
    new BitacoraController(),
    new SeguridadController(),
    new RepositorioController(),
    new CotizadorController(),
    new AprobacionController(),
    new ChatController(),
    new NotificacionController(),
    new TrasladosController(),
    new PedidoController(),
    new UtilidadController(),
    new SolicitudController()],
    port);

const server = app.listen();

export default server;
