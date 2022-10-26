"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const express_json_validator_middleware_1 = require("express-json-validator-middleware");
const ip = __importStar(require("ip"));
const cron = __importStar(require("node-cron"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const typeorm_1 = require("typeorm");
const catalogo_1 = require("./business/catalogo");
const socketServer_1 = require("./socketServer");
const swagger_json_1 = __importDefault(require("./swagger.json"));
class App {
    constructor(controllers, port) {
        this.ipAddress = ip.address() || 'localhost';
        this.app = express_1.default();
        this.port = port;
        typeorm_1.createConnections().then(() => {
            this.initJobs();
            this.init();
            this.initControllers(controllers);
        }, (error) => {
            console.log(error);
        }).catch((error) => {
            console.log(error);
        });
    }
    initJobs() {
        const syncMins = process.env.SYNC_MINS;
        const syncHours = process.env.SYNC_HOURS;
        cron.schedule(syncMins + ' ' + syncHours + ' * * *', () => {
            const syncBusiness = new catalogo_1.SyncBusiness();
            syncBusiness.syncClientes();
        });
    }
    init() {
        this.app.use('/schemas', express_1.default.static('dist/schemas'));
        this.app.use(body_parser_1.default({ limit: '50mb' }));
        this.app.use(body_parser_1.default.json({ limit: '50mb' }));
        this.app.use(body_parser_1.default.urlencoded({ extended: true, limit: '50mb' }));
        // headers
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, idUsuario');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });
    }
    initControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api/v1', controller.router);
        });
        this.app.use((err, req, res, next) => {
            console.log(err);
            if (err instanceof express_json_validator_middleware_1.ValidationError) {
                const errorMessage = {
                    url: req.url,
                    method: req.method,
                    message: 'Invalid parameter(s)',
                    errors: [],
                };
                err.validationErrors.body.map((error) => {
                    errorMessage.errors.push(error);
                });
                res.status(422).json(errorMessage);
            }
            else {
                next(err);
            }
        });
        const newPaths = JSON.parse(JSON.stringify(Object.keys(swagger_json_1.default.paths).sort().reduce((a, c) => (a[c] = swagger_json_1.default.paths[c], a), {})));
        swagger_json_1.default.paths = newPaths;
        this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
    }
    listen() {
        const server = this.app.listen(this.port, () => {
            console.log(`API: http://${this.ipAddress}:${this.port}/api/v1`);
            console.log(`API Docs: http://${this.ipAddress}:${this.port}/api-docs`);
        });
        const io = socketServer_1.SocketServer.init(server).IO;
        io.on('connection', (socket) => {
            console.log('Client connected');
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map