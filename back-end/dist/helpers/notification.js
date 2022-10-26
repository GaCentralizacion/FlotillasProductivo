"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Control del los adjuntos de una notificación
 */
class AttachedNotification {
    constructor(type) {
        this.type = type;
        this.embeded = false;
    }
}
exports.AttachedNotification = AttachedNotification;
/**
 * Guarda el mensaje de la notificación
 */
class MessageNotification {
    constructor() {
        this.title = '';
        this.body = '';
        this.bodySendGrid = '';
    }
}
exports.MessageNotification = MessageNotification;
/**
 * Almacena quien manda el mensaje, puede traer una de las 4 variables
 */
class SourceNotification {
}
exports.SourceNotification = SourceNotification;
/**
 * Almacena quien recibe el mensaje debe tener minimo una de las variables
 */
class DestinationNotification {
    constructor() {
        this.to = [];
        this.mailTo = [];
    }
}
exports.DestinationNotification = DestinationNotification;
/**
 * Almacena las caracteristicas de la notificación (como una tarea)
 */
class PushNotification {
    constructor() {
        this.how = [];
        this.idUser = 0;
        this.type = 1;
    }
}
exports.PushNotification = PushNotification;
/**
 * El objeto de notificaciónes
 */
class Notification {
    constructor() {
        this.message = new MessageNotification();
        this.source = new SourceNotification();
        this.destination = new DestinationNotification();
        this.push = new PushNotification();
        this.err = [];
    }
}
exports.Notification = Notification;
/**
 * La respuesta estandar de error
 */
class ErrorResponse {
    constructor() {
        this.code = 'ERR-MO-00';
        this.technical_message = 'No se le asignaron los valores correctos a la variable, este es el mensaje default';
        this.user_message = 'Ups, hemos tenido un inconveniente, reportar a sopoerte.';
    }
}
exports.ErrorResponse = ErrorResponse;
/**
 * La respuesta estandar
 */
class NotificaResponse {
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
exports.NotificaResponse = NotificaResponse;
//# sourceMappingURL=notification.js.map