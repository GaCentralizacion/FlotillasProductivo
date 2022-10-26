import { getConnection } from 'typeorm';

export class SolicitudBussiness {

  getAllSolicitudes() {
    const connection = getConnection();
    return connection.query('exec [dbo].[SEL_SOLICITUD_SP]');
  }

  getSolicitudCotizacionVehiculo(data: any) {
    const connection = getConnection();
    return connection.query('exec [dbo].[SEL_SOLICITUD_COTIZACION_VEHICULO_SP] @idSolicitudCotizacion = ' + data.idSolicitudCotizacion);
  }

  getGrupoPedidoEntrega(data: any) {
    const connection = getConnection();
    return connection.query('exec [dbo].[SEL_SOLICITUD_GRUPO_PEDIDO_ENTREGA_SP] @idSolicitudGrupoPedido=' + data.idSolicitudGrupoPedido);
  }

  getEstatusPedidoPlanta() {
    const connection = getConnection();
    return connection.query('exec [dbo].[SEL_SOLICITUD_ESTATUS_PEDIDO_PLANTA_SP]');
  }

  getGrupoDetalleUnidad(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[SEL_GRUPO_PEDIDO_DETALLE_UNIDAD_SP]
        @idSolicitudGrupoPedido = ${data.idSolicitudGrupoPedido}
        , @idSolicitudEntregas = ${data.idSolicitudEntregas}
        `);
  }

  getUnidadesDisponibles(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[SEL_DETALLE_UNIDAD_DISPONIBLE_SP]
        @idSolicitudGrupoPedido = ${data.idSolicitudGrupoPedido}`);
  }

  getEstatusSolicitudCotizacion(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[SEL_ESTATUS_SOLICITUD_SP]`);
  }

  getGestorSolicitudIndicadores(data: any) {
    const connection = getConnection();
    const idFlotilla = data.idFlotilla ? '\'' + data.idFlotilla + '\'' : null;
    const idMarca = data.idMarca ? '\'' + data.idMarca + '\'' : null;
    const idEmpresa = data.idEmpresa ? data.idEmpresa : null;
    const idSucursal = data.idSucursal ? data.idSucursal : null;
    return connection.query(`exec [dbo].[SEL_GESTOR_SOLICITUD_INDICADORES_SP]
        @idFlotilla= ${idFlotilla},
        @idMarca= ${idMarca},
        @idEmpresa= ${idEmpresa},
        @idSucursal= ${idSucursal}
        `);
  }
  getReasignacion() {
    const connection = getConnection();
    return connection.query('exec [dbo].[SEL_REASIGNACION_SP]');
  }

  getReasignacionDetalle(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[SEL_REASIGNACION_DETALLE_SP]
                                        @idMarca = '${data.idMarca}',
                                        @catalogo = '${data.catalogo}',
                                        @anio = ${data.anio},
                                        @versionUnidad = '${data.versionUnidad}'
                                        `);
  }

  getReasignacionDetalleSeleccion(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[SEL_REASIGNACION_DETALLE_SELECCION_SP]
                                        @vinesXml = '${data.vinesXml}'
                                        `);
  }

  insertSolicitud(data: any) {
    const connection = getConnection();

    return connection.query(
      `exec [dbo].[INS_SOLICITUD_SP]
                    @idDireccionFlotillas = '${data.idDireccionFlotillas}',
                    @idCliente = ${data.idCliente},
                    @idEmpresa = ${data.idEmpresa},
                    @idClienteFactura = ${data.idClienteFactura},
                    @adjudicado = ${data.adjudicado},
                    @idMarca = '${data.idMarca}',
                    @idSucursal = ${data.idSucursal},
                    @idUsuario = ${data.idUsuario},
                    @ordenCompra = '${data.ordenCompra}',
                    @estatusCotizacion = '${data.estatusCotizacion}',
                    @idFinanciera = '${data.idFinanciera}'
                    `);

  }

  insertGrupoPedido(data: any) {
    const connection = getConnection();
    let q = `exec [dbo].[INS_SOLICITUD_GRUPO_PEDIDO_SP]
        @idSolicitudCotizacion   = ${data.idSolicitudCotizacion}
        ,@idSolicitudGrupo   = ${data.idSolicitudGrupo}
        ,@folioPlanta			 = '${data.folioPlanta}'
        ,@fechaIngresoFolio		 = '${data.fechaIngresoFolio}'
        ,@fechaProbableEntrega   = '${data.fechaProbableEntrega}'
        ,@estatusPedidoPlanta	 = '${data.estatusPedidoPlanta}'
        ,@idUsuario				 = ${data.idUsuario}`;
    if (data.idSolicitudGrupoPedido) {
      q = `${q}
                ,@idSolicitudGrupoPedido		 = ${data.idSolicitudGrupoPedido}
                `;
    }
    return connection.query(q);
  }

  generarOrdenDeCompra(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[INS_GENERA_OC_SP]
         @idSolicitudCotizacion		= ${data.idSolicitudCotizacion}
        ,@idSolicitudGrupo        = ${data.idSolicitudGrupo}
        ,@idSolicitudEntregas     = ${data.idSolicitudEntregas}
        ,@consecutivo		          = ${data.consecutivo}
        ,@entregaEstimada		      = ${data.entregaEstimada}
        ,@idColorInterior	 = '${data.interiorColors}'
        ,@idColorExterior	 = '${data.exteriorColors}'
        ,@idUsuario				        = ${data.idUsuario}`);
  }

  generaCotizacionFlotillas(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[INS_GENERACOTIZACIONFLOTILLAS_SP]
         @idSolicitudCotizacion		= ${data.idSolicitudCotizacion}
        ,@nombreCliente      = '${data.nombreCliente}'
        ,@idCondicion		     = '${data.idCondicion}'
        ,@nombreCondicion	   = '${data.nombreCondicion}'
        ,@idFinanciera		   =  ${data.idFinanciera}
        ,@nombreFinanciera   = '${data.nombreFinanciera}'
        ,@idCfdi             = '${data.idCfdi}'
        ,@idMonedaVenta      = '${data.idMonedaVenta}'
        ,@idIva		           =  ${data.idIva}
        ,@tasaIva		         =  ${data.tasaIva}
        ,@nombreTipoVenta	   = '${data.nombreTipoVenta}'
        ,@nombreMoneda			 = '${data.nombreMoneda}'
        ,@nombreIva					 = '${data.nombreIva}'
        ,@nombreContacto		 = '${data.nombreContacto}'
        ,@idUsuario				   =  ${data.idUsuario}`);
  }

  asignaVinCotizacionFlotillas(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[INS_ASIGNAVINCOTIZACIONFLOTILLAS_SP]
         @idSolicitudCotizacion		= ${data.idSolicitudCotizacion}
        ,@idUsuario				        =  ${data.idUsuario}`);
  }

  insertGrupoPedidoEntrega(data: any) {
    const connection = getConnection();
    let q = `exec [dbo].[INS_SOLICITUD_GRUPO_PEDIDO_ENTREGA_SP]
        @idSolicitudGrupoPedido   = ${data.idSolicitudGrupoPedido}
        ,@mes					 = '${data.mes}'
        ,@anio					 = ${data.anio}
        ,@entregaEstimada		 = ${data.entregaEstimada}
        ,@idUsuario				 = ${data.idUsuario}
        ,@facturadasPlanta		 = ${data.facturadasPlanta} `;
    if (data.consecutivo) {
          q = `${q}
                    ,@consecutivo		 = ${data.consecutivo}
                    `;
        }
    if (data.idSolicitudEntregas) {
      q = `${q}
                ,@idSolicitudEntregas		 = ${data.idSolicitudEntregas}
                `;
    }
    return connection.query(q);
  }

  insertSolicitudGrupo(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[INS_SOLICITUD_GRUPO_SP]
        @idUsuario				 = ${data.idUsuario}
        ,@catalogo   = '${data.catalogo}'
        ,@anio	     = '${data.anio}'
        ,@clase			 = '${data.clase}'
        ,@modelo		 = '${data.modelo}'
        ,@versionUnidad   = '${data.versionUnidad}'
        ,@idColorInterior	 = '${data.idColorInterior}'
        ,@colorInterior					 = '${data.colorInterior}'
        ,@idColorExterior		 = '${data.idColorExterior}'
        ,@colorExterior		 = '${data.colorExterior}'
        ,@cantidad		 = ${data.cantidad}
        ,@requiereEquipamiento		 = ${data.requiereEquipamiento}
        ,@costo	 = ${data.costo}
        ,@precioLista	 = ${data.precioLista}
        ,@idSolicitudCotizacion    = ${data.idSolicitudCotizacion}
        ,@observaciones	    = '${data.observaciones	}'
                `);
  }

  insertSolicitudDetalleUnidad(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[INS_GRUPO_PEDIDO_DETALLE_UNIDAD_SP]
        @idUsuario				 = ${data.idUsuario}
        ,@idSolicitudGrupoPedido   = ${data.idSolicitudGrupoPedido}
        ,@vin	     = '${data.vin}'
                `);
  }

  getReasignacionCombosOrigen(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[SEL_REASIGNACION_COMBOS_ORIGEN_SP]
                                    @vinesXml = '${data.vinesXml}'
                                    `);
}

getReasignacionCombosDestino(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[SEL_REASIGNACION_COMBOS_DESTINO_SP]
                                    @idSolicitudCotizacion = ${data.idSolicitudCotizacion}
                                    `);
}

insReasignacion(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[INS_REASIGNACION_SP]
                                    @vinesXml = '${data.vinesXml}',
                                    @idSolicitudReasignar = '${data.idSolicitudReasignar}',
                                    @idGrupoReasignar = '${data.idGrupoReasignar}',
                                    @idUsuario = ${data.idUsuario}
                                    `);
}

insReasignacionCreaGrupo(data: any) {
  const connection = getConnection();
  return connection.query(`exec [dbo].[INS_REASIGNACION_NUEVOGRUPO_SP]
                                  @vinesXml = '${data.vinesXml}',
                                  @idSolicitudReasignar = '${data.idSolicitudReasignar}',
                                  @idUsuario = ${data.idUsuario}
                                  `);
}

  insertSolicitudDetalleUnidadMasiva(data: any) {
    const connection = getConnection();
    // console.log(data);
    return connection.query(`exec [dbo].[INS_GRUPO_PEDIDO_DETALLE_UNIDAD_MASIVA_SP]
        @idUsuario				 = ${data.idUsuario}
        ,@idSolicitudGrupoPedido   = ${data.idSolicitudGrupoPedido}
        ,@idSolicitudEntregas   = ${data.idSolicitudEntregas}
        ,@vines	     = '${data.vines}'
                `);
  }

 updateDetalleUnidadToAsignado(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[UPDATE_DETALLE_UNIDAD_ASIGNADO_SP]
        @idUsuario				 = ${data.idUsuario}
        ,@idCotizacion   = '${data.idCotizacion}'
        ,@idSolicitudCotizacion   = ${data.idSolicitudCotizacion}
        ,@unidades	     = '${data.unidades}'
                `);
  }

  updateSolicitud(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[UPDATE_SOLICITUD_SP]
      @idUsuario				 = ${data.idUsuario}
      ,@idSolicitudCotizacion   = ${data.idSolicitudCotizacion}
      ,@ordenCompra	     = '${data.ordenCompra}'
      ,@adjudicado	     = ${data.adjudicado}
      ,@estatusCotizacion	     = ${data.estatusCotizacion}
      ,@idFinanciera	     = ${data.idFinanciera}
              `);
  }

  deleteSolicitudGrupo(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[DEL_SOLICITUD_GRUPO_SP]
        @idUsuario				 = ${data.idUsuario}
        ,@idSolicitudGrupoUnidad   = '${data.idSolicitudGrupoUnidad}'
        `);
  }

  deleteDetalleUnidad(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[DEL_DETALLE_UNIDAD_SP]
        @idUsuario				 = ${data.idUsuario}
        ,@idSolicitudDetalleUnidad   = ${data.idSolicitudDetalleUnidad}
        `);
  }

  deleteSolicitud(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[DEL_SOLICITUD_SP]
        @idUsuario				 = ${data.idUsuario}
        ,@idSolicitudCotizacion   = '${data.idSolicitudCotizacion}'
        `);
  }

  deleteGrupoPedidoEntrega(data: any) {
    const connection = getConnection();
    return connection.query(`exec [dbo].[DEL_SOLICITUD_GRUPO_ENTREGA_SP]
        @idUsuario				 = ${data.idUsuario}
        ,@idSolicitudEntregas   = ${data.idSolicitudEntregas}
        `);
  }

  updSolicitudGrupoPedido(data: any) {
    const connection = getConnection();
    return connection.query(`exec [solicitud].[UPD_COTIZACION_UNIDAD_SP]
       @vines	     = '${data.vines}'
                `);
  }

  getOrigenSolicitud(data: any) {
    const connection = getConnection();
    return connection.query(`exec solicitud.SEL_ORIGEN_SOLCITUD_SP
        @idSolicitudEntregas = ${data.idSolicitudEntregas}`);
  }

  updSolicitudEstatusUnidad(data: any) {
    const connection = getConnection();
    return connection.query(`exec [solicitud].[UPD_SOLICITUD_ESTATUS_UNIDAD_SP]
      @estatus				 = ${data.estatus}
      ,@idSolicitudDetalleUnidad  = ${data.idSolicitudDetalleUnidad}`);
  }

  getEstatusUnidad(data: any) {
    const connection = getConnection();
    return connection.query(`exec [catalogo].[SEL_ESTATUS_UNIDAD_SP]`);
  }

  getEntregas(data: any) {
    const connection = getConnection();
    return connection.query(`exec [solicitud].[SEL_ENTREGAS_SP]  @idSolicitudGrupoPedido			 = ${data.idSolicitudGrupoPedido}`);
  }

  getUbicacionUnidad(data: any) {
    const connection = getConnection();
    return connection.query(`exec [catalogo].[SEL_UBICACION_UNIDAD_SP]`);
  }

  updSolicitudUbicacionUnidad(data: any) {
    const connection = getConnection();
    return connection.query(`exec [solicitud].[UPD_SOLICITUD_UBICACION_UNIDAD_SP]
      @idUbicacion				 = ${data.idUbicacion}
      ,@idSolicitudDetalleUnidad  = ${data.idSolicitudDetalleUnidad}`);
  }

}
