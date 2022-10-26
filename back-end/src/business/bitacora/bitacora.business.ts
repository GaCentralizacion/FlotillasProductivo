import { getConnection } from 'typeorm';
import { EventoLog, EventoLogFilter } from '../../db/model/bitacora';
import { EventoLogFilterResult } from '../../db/model/bitacora';

export class BitacoraBusiness {
    getEventos(filtroEvento: EventoLogFilter): Promise<EventoLogFilterResult> {
        return new Promise<EventoLogFilterResult>(async (resolve, reject) => {
            const connection = getConnection();
            let condiciones = '@pagina = ' + filtroEvento.pagina + ', @numeroRegistros = ' + filtroEvento.numeroRegistros;
            const condExtra: string[] = [];
            if (filtroEvento.idUsuario != undefined) {
                condExtra.push('@idUsuario = \'' + filtroEvento.idUsuario + '\'');
            }
            if (filtroEvento.fechaInicio != undefined) {
                condExtra.push('@fechaInicio = \'' + filtroEvento.fechaInicio + '\'');
            }
            if (filtroEvento.modulo != undefined) {
                condExtra.push('@modulo = \'' + filtroEvento.modulo + '\'');
            }
            if (filtroEvento.tabla != undefined) {
                condExtra.push('@tabla = \'' + filtroEvento.tabla + '\'');
            }
            if (filtroEvento.evento != undefined) {
                condExtra.push('@evento = \'' + filtroEvento.evento + '\'');
            }
            condiciones = condiciones + (condExtra.length > 0 ? ', ' + condExtra.join(', ') : '');
            await connection.query('exec sp_flotillas_filter_evento_log_total ' + condExtra.join(', ')).then(async (resultado: Array<{ totalRegistros: number }>) => {
                const retorno = new EventoLogFilterResult();
                retorno.totalRegistros = resultado[0].totalRegistros;
                await connection.query('exec sp_flotillas_filter_evento_log ' + condiciones).then((resultadoEventos: EventoLog[]) => {
                    retorno.eventos = resultadoEventos;
                    resolve(retorno);
                },
                    async (error) => {
                        reject(error);
                    },
                );
            },
                async (error) => {
                    reject(error);
                },
            );

        });
    }

    saveRegister(idUsuario: number, tabla: string, evento: string, modulo: string, datos: any) {
        const register = {
            idUsuario,
            fechaHora: new Date(Date.now()),
            tabla,
            modulo,
            evento,
            datos: JSON.stringify(datos),
        };

        const connection = getConnection('bitacora');
        connection.transaction(async (manager) => {
            const bitacoraRepository = await manager.getRepository(EventoLog);
            await bitacoraRepository.save(register);
        });

    }

}// End for BitacoraBusiness
