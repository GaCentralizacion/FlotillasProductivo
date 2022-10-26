export interface EventoLogFilter {
    pagina: number;
    numeroRegistros: number;
    idUsuario: number;
    fechaInicio: string;
    fechaFin: string;
    modulo: string;
    tabla: string;
    evento: string;
}

export interface EventoLogFilterResult {
    totalRegistros: number;
    eventos: EventoLog[];
}

export interface EventoLog {
    idEventoLog: number;
    idUsuario: number;
    userName: string;
    nombreCompleto: string;
    fechaHora: Date;
    modulo: string;
    tabla: string;
    evento: string;
    datos: string;
    fechaHoraText: string;
}