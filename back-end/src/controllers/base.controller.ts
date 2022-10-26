import express = require('express');
import { Exception } from 'ts-httpexceptions';

/**
 * Controlador base del cual todos deben heredar
 */
export class BaseController {
    /**
     * Función de manejo de errores
     * @param response Objeto para enviar respuestas a express
     * @param error Error a manejar
     */
    errorHandler(response: express.Response, error: any) {
        if (error instanceof Exception) {
            return response.status(error.status).send(error.message);
        }
        if (error instanceof Error) {
            return response.status(500).send(error.message);
        }
        return response.status(500).json(error);
    }
}
