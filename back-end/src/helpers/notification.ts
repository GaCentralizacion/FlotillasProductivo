/**
 * Almacena las credenciales para enviar mensajes por correo
 */
 export declare class HostIdentidad {
    public host?: string;
    public user?: string;
    public password?: string;
    public port?: string;
    public pool?: string;
    public secure?: string;
    public requiereTLS?: string;
    public from?: string;
}

 export declare class HostIdentidadSendGrid {
    public from?: string;
    public name?: string;
    public templateID?: string;
}

/**
 * Control del los adjuntos de una notificación
 */
 export class AttachedNotification {
    public type: string; // url = por url, fileserver = servidor de archivos
    public url?: string; // url donde esta el archivo
    public fileServer?: number; // id en el fileserver
    public embeded: boolean; // se muestra en el mensaje (si es una imagen)

    constructor(type: string) {
        this.type = type;
        this.embeded = false;
    }
}

/**
 * Guarda el mensaje de la notificación
 */
 export class MessageNotification {
    public title: string;
    public body: string;
    public bodySendGrid: string;
    public attached?: AttachedNotification[];

    constructor() {
        this.title = '';
        this.body = '';
        this.bodySendGrid = '';
    }
}

/**
 * Almacena quien manda el mensaje, puede traer una de las 4 variables
 */
 export class SourceNotification {
    public mail?: string;
    public idUser?: number;
    public idAplication?: number;
}

/**
 * Almacena quien recibe el mensaje debe tener minimo una de las variables
 */
 export class DestinationNotification {
    public to: number[];
    public ccTo?: number[];
    public ccbTo?: number[];
    public mailTo?: string[];
    public mailccTo?: string[];
    public mailccbTo?: string[];

    constructor() {
        this.to = [];
        this.mailTo = [];
    }
}

/**
 * Almacena las caracteristicas de la notificación (como una tarea)
 */
 export class PushNotification {
    public how: number[]; // Como se notifica; 1= mail, 2= push (sistema), 3= firebase, 4=tarea programada
    public idUser: number; // Quien cargo la notificación para bitácora, diferente a quien envía o quien recibe
    public type: number; // 1= ahora, 2=programado, 3=repoeticiones
    public date?: string;  // Fecha a notificar, en caso de que sea programada
    public range?: string; // En caso de que sea periodica (type=3) cada cuanto tiempo se tiene que estar notificando
    public repeat?: number; // En caso de que sea periodica (type=3) cuantas veces se va a notificar
    public headers?: {
        urgency: string;
        priority: number;
    };

    constructor() {
        this.how = [];
        this.idUser = 0;
        this.type = 1;
    }
}

/**
 * El objeto de notificaciónes
 */
 export class Notification {
    public message: MessageNotification;
    public source: SourceNotification;
    public destination: DestinationNotification;
    public push: PushNotification;
    public err: ErrorResponse[];

    constructor() {
        this.message = new MessageNotification();
        this.source = new SourceNotification();
        this.destination = new DestinationNotification();
        this.push = new PushNotification();
        this.err = [];
    }
}

/**
 * La respuesta estandar de error
 */
 export class ErrorResponse {
    code: string;
    technical_message: any;
    user_message: string;
    constructor() {
        this.code = 'ERR-MO-00';
        this.technical_message = 'No se le asignaron los valores correctos a la variable, este es el mensaje default';
        this.user_message = 'Ups, hemos tenido un inconveniente, reportar a sopoerte.';
    }
}

/**
 * La respuesta estandar
 */
 export class NotificaResponse {
    public metadata: {
        resultset: {
            count: number,
            offset: number,
            limit: number,
        },
    };
    public data: any;
    public status: string;
    public code: number;
    public messages?: string[];
    public errors?: ErrorResponse[];
    constructor() {
        this.metadata = {
            resultset: {
                count: 1,
                offset: 25,
                limit: 25,
            },
        };
        this.status = 'error';
        this.code = 500;
    }
}
