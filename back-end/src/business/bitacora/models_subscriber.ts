import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { BitacoraBusiness } from './bitacora.business';

@EventSubscriber()
export class ModelSubscriber implements EntitySubscriberInterface {

    afterUpdate(event: UpdateEvent<any>) {
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

    afterInsert(event: InsertEvent<any>) {
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
    /*   beforeRemove(event: RemoveEvent<any>) {
          const bitacoraHandler =  new BitacoraHandler();
          const tableName = (event.metadata as any).tableName; /*asignamos el nombre d ela tabla proveniente del evento update */
    // const data = JSON.stringify(event.entity); /* convertimos a entidad en un string */
    // const register = { /* Armamos el json para ser almacenado */
    //  valorInicial: null, /* String que contine el body del requets */
    // valorFinal: data,   /* String que contine el body del requets */
    // fecha: new Date(), /* pasamos la fecha en formato utc */
    // idUsuario: 13,
    // tabla: tableName, /* tomamos el nombre de la tabla impactada */
    // operacion: 'remove', /* pasamos el momento en que se ejecuto el metodo beforeInsert */
    // };

    // } */

} /* ModelSubscriber End */
