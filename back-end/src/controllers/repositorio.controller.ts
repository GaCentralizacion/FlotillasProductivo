import express = require('express');
import { Validator } from 'express-json-validator-middleware';
import { DocumentoBusiness } from '../business/repositorio';
import * as fileSchema from '../schemas/repositorio/file.schema.json';
import * as filePathSchema from '../schemas/repositorio/file_path.schema.json';
import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class RepositorioController extends BaseController implements IController {
    basePath = '/repositorio';
    router = express.Router();

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        const validator = new Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.post(
            `${this.basePath}/getFilenames`,
            validate({ body: filePathSchema }),
            this.getFilenames.bind(this),
        );
        this.router.post(
            `${this.basePath}/getDocument`,
            validate({ body: filePathSchema }),
            this.getDocument.bind(this),
        );
        this.router.post(
            `${this.basePath}/setDocument`,
            validate({ body: fileSchema }),
            this.setDocument.bind(this),
        );
        this.router.get(
            `${this.basePath}/findDocument/:text`,
            this.findDocument.bind(this),
        );
        this.router.get(
            `${this.basePath}/findDocument`,
            this.findDocument.bind(this),
        );
        this.router.post(
            `${this.basePath}/deleteDocument`,
            validate({ body: filePathSchema }),
            this.deleteDocument.bind(this),
        );
    }

    private getFilenames(request: express.Request, response: express.Response) {
        const filePath = request.body as { path: string };
        const documentoBusiness = new DocumentoBusiness('repositorio');
        documentoBusiness.getFileNames(filePath.path).then(
            (filenames: string[]) => {
                response.status(200).send(filenames);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getDocument(request: express.Request, response: express.Response) {
        const filePath = request.body as { path: string };
        const documentoBusiness = new DocumentoBusiness('repositorio');
        documentoBusiness.get(filePath.path).then(
            (fileContent: string) => {
                response.status(200).send(fileContent);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private setDocument(request: express.Request, response: express.Response) {
        const filePath = request.body as { path: string, fileContent: string };
        const documentoBusiness = new DocumentoBusiness('repositorio');
        documentoBusiness.set(filePath.path, filePath.fileContent).then(
            (isCreated: boolean) => {
                response.status(200).send(isCreated);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private findDocument(request: express.Request, response: express.Response) {
        const text = request.params.text == undefined ? '.' : (request.params.text as string).trim();
        const documentoBusiness = new DocumentoBusiness('repositorio');
        documentoBusiness.find(text).then(
            (documentPaths: string[]) => {
                response.status(200).send(documentPaths);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private deleteDocument(request: express.Request, response: express.Response) {
        const filePath = request.body as { path: string };
        const documentoBusiness = new DocumentoBusiness('repositorio');
        documentoBusiness.delete(filePath.path).then(
            (deleteResponse: boolean) => {
                response.status(200).send(deleteResponse);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

}
