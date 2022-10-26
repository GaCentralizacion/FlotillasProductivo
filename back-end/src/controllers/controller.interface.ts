import express = require('express');

/**
 * Interfaz de Controller, todos los controllers que se deseen exponer, deben implementar la interfaz.
 */
export interface IController {
  /**
   * URL base del controlador.
   */
  basePath: string;
  /**
   * Configuración de rutas.
   */
  router: express.Router;
  /**
   * Iniciador de rutas.
   */
  initRoutes(): any;
  errorHandler(response: express.Response, error: any): any;
}
