export class Notification {
   identificador: string;
   descripcion: string;
   idSolicitante: number;
   idTipoNotificacion: number;
   linkBPRO: string;
   notAdjunto: string;
   notAdjuntoTipo: string;
   idEmpresa: string;
   idSucursal: string;
   departamentoId: string;
}

export class NotificationUnidades {
   identificador: string;
   descripcion: string;
   idSolicitante: number;
   idTipoNotificacion: number;
   linkBPRO: string;
   notAdjunto: string;
   notAdjuntoTipo: string;
   idEmpresa: string;
   idSucursal: string;
   departamentoId: string;
}



export class NotificationUsers {
   idUsuario: number;
   nombre: string;
   tipo: string;
   nivel_escalamiento: number;
   telefono: string;
   correo: string;
}
