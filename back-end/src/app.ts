import bodyParser from 'body-parser';
import express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import * as ip from 'ip';
import * as cron from 'node-cron';
import { Socket } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import { createConnections } from 'typeorm';
import { SyncBusiness } from './business/catalogo';
import { IController } from './controllers/controller.interface';
import { SocketServer } from './socketServer';
import swaggerDocument from './swagger.json';

export class App {
  ipAddress: string;
  app: express.Application;
  port: number;

  constructor(controllers: IController[], port: number) {
    this.ipAddress = ip.address() || 'localhost';
    this.app = express();
    this.port = port;
    createConnections().then(() => {
      this.initJobs();
      this.init();
      this.initControllers(controllers);
    }, (error) => {
      console.log(error);
    }).catch((error) => {
      console.log(error);
    });
  }

  private initJobs() {
    const syncMins = process.env.SYNC_MINS;
    const syncHours = process.env.SYNC_HOURS;
    cron.schedule(syncMins + ' ' + syncHours + ' * * *', () => {
      const syncBusiness = new SyncBusiness();
      syncBusiness.syncClientes();
    });
  }

  private init() {
    this.app.use('/schemas', express.static('dist/schemas'));
    this.app.use(bodyParser({ limit: '50mb' }));
    this.app.use(bodyParser.json({limit: '50mb'}));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    // headers
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, idUsuario',
      );
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, DELETE',
      );
      res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
      next();
    });
  }

  private initControllers(controllers: IController[]) {
    controllers.forEach((controller: IController) => {
      this.app.use('/api/v1', controller.router);
    });
    this.app.use(
      (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        console.log(err);
        if (err instanceof ValidationError) {
          const errorMessage = {
            url: req.url,
            method: req.method,
            message: 'Invalid parameter(s)',
            errors: [],
          };
          err.validationErrors.body.map((error: any) => {
            errorMessage.errors.push(error);
          });
          res.status(422).json(errorMessage);
        } else {
          next(err);
        }
      },
    );
    const newPaths = JSON.parse(JSON.stringify(Object.keys(swaggerDocument.paths).sort().reduce((a, c) => (a[c] = swaggerDocument.paths[c], a), {})));
    swaggerDocument.paths = newPaths;
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument),
    );
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      console.log(`API: http://${this.ipAddress}:${this.port}/api/v1`);
      console.log(`API Docs: http://${this.ipAddress}:${this.port}/api-docs`);
    });
    const io = SocketServer.init(server).IO;
    io.on('connection', (socket: Socket) => {
      console.log('Client connected');
    });
  }
}
