"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let ModelSubscriber = class ModelSubscriber {
    afterUpdate(event) {
        /*  Metodo beforeUpdate importado desde typeorm
            nos permite realizar acciones antes de que se
            realice la actualizacion en las tablas
         */
        // const bitacoraBusiness =  new BitacoraBusiness();
        // const tableName = (event.metadata as any).tableName; /*asignamos el nombre d ela tabla proveniente del evento update */
        // const data = JSON.stringify(event.entity); /* convertimos a entidad en un string */
        // const register = { /* Armamos el json para ser almacenado */
        //     valorInicial: null, /* String que contine el body del requets */
        //     valorFinal: data,   /* String que contine el body del requets */
        //     fecha: new Date(), /* pasamos la fecha en formato utc */
        //     idUsuario: 13,
        //     tabla: tableName, /* tomamos el nombre de la tabla impactada */
        //     operacion: 'update', /* pasamos el momento en que se ejecuto el metodo beforeInsert */
        // };
    }
    afterInsert(event) {
        // const bitacoraHandler = new BitacoraHandler();
        // const tableName = (event.metadata as any).tableName; /*asignamos el nombre d ela tabla proveniente del evento update */
        // const data = JSON.stringify(event.entity); /* convertimos a entidad en un string */
        // const register = { /* Armamos el json para ser almacenado */
        //     valorInicial: null, /* String que contine el body del requets */
        //     valorFinal: data,   /* String que contine el body del requets */
        //     fecha: new Date(), /* pasamos la fecha en formato utc */
        //     idUsuario: 13,
        //     tabla: tableName, /* tomamos el nombre de la tabla impactada */
        //     operacion: 'insert', /* pasamos el momento en que se ejecuto el metodo beforeInsert */
        // };
    }
}; /* ModelSubscriber End */
ModelSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], ModelSubscriber);
exports.ModelSubscriber = ModelSubscriber;
//# sourceMappingURL=models_subscriber.js.map