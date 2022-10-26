export interface Evento {
    idEventoLog: number;
    idUsuario: number;
    fechaHora: Date;
    modulo: string;
    tabla: string;
    evento:string;
    datos:any;
}