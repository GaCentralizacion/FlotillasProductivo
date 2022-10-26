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
const repositorio_1 = require("../business/repositorio");
const fileSchema = __importStar(require("../schemas/repositorio/file.schema.json"));
const filePathSchema = __importStar(require("../schemas/repositorio/file_path.schema.json"));
const base_controller_1 = require("./base.controller");
class RepositorioController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/repositorio';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        const validator = new express_json_validator_middleware_1.Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.post(`${this.basePath}/getFilenames`, validate({ body: filePathSchema }), this.getFilenames.bind(this));
        this.router.post(`${this.basePath}/getDocument`, validate({ body: filePathSchema }), this.getDocument.bind(this));
        this.router.post(`${this.basePath}/setDocument`, validate({ body: fileSchema }), this.setDocument.bind(this));
        this.router.get(`${this.basePath}/findDocument/:text`, this.findDocument.bind(this));
        this.router.get(`${this.basePath}/findDocument`, this.findDocument.bind(this));
        this.router.post(`${this.basePath}/deleteDocument`, validate({ body: filePathSchema }), this.deleteDocument.bind(this));
    }
    getFilenames(request, response) {
        const filePath = request.body;
        const documentoBusiness = new repositorio_1.DocumentoBusiness('repositorio');
        documentoBusiness.getFileNames(filePath.path).then((filenames) => {
            response.status(200).send(filenames);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getDocument(request, response) {
        const filePath = request.body;
        const documentoBusiness = new repositorio_1.DocumentoBusiness('repositorio');
        documentoBusiness.get(filePath.path).then((fileContent) => {
            response.status(200).send(fileContent);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    setDocument(request, response) {
        const filePath = request.body;
        const documentoBusiness = new repositorio_1.DocumentoBusiness('repositorio');
        documentoBusiness.set(filePath.path, filePath.fileContent).then((isCreated) => {
            response.status(200).send(isCreated);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    findDocument(request, response) {
        const text = request.params.text == undefined ? '.' : request.params.text.trim();
        const documentoBusiness = new repositorio_1.DocumentoBusiness('repositorio');
        documentoBusiness.find(text).then((documentPaths) => {
            response.status(200).send(documentPaths);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    deleteDocument(request, response) {
        const filePath = request.body;
        const documentoBusiness = new repositorio_1.DocumentoBusiness('repositorio');
        documentoBusiness.delete(filePath.path).then((deleteResponse) => {
            response.status(200).send(deleteResponse);
        }, (error) => {
            response.status(500).send(error);
        });
    }
}
exports.RepositorioController = RepositorioController;
//# sourceMappingURL=repositorio.controller.js.map