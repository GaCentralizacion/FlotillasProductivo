import { Component, OnInit, Input } from '@angular/core';
import {
  Cotizacion, PaqueteAccesorios, DetallePaqueteAccesorios, IdTiposProveedor,
  AccesorioSinPaquete, AccesorioNuevo, Proveedor, TipoProveedor, GrupoUnidades,
  Cantidad, AccesorioNuevoUnidad
} from 'src/app/models';
import { PricingService, AccesorioCatalogService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { elementContainerEnd } from '@angular/core/src/render3';
//SISCO
import { CatalogoSiscoComponent } from '../catalogo-sisco/catalogo-sisco.component';
import { AgregarAccesorioSiscoComponent } from '../agregar-accesorio-sisco/agregar-accesorio-sisco.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agregar-editar-accesorios',
  templateUrl: './agregar-editar-accesorios.component.html',
  styleUrls: ['./agregar-editar-accesorios.component.scss']
})

export class AgregarEditarAccesoriosComponent implements OnInit {

  @Input() cotizacion: Cotizacion;
  @Input() idGrupoUnidad: number;
  @Input() versionUnidad: string;
  @Input() modalGestoria: boolean;
  @Input() idDetalleUnidad: number;

  input = new Cantidad();
  cantidadSeleccionada: any[] = [];

  grupoSelected: GrupoUnidades;
  accesoriosSinPaquete: AccesorioSinPaquete;

  proveedores: Proveedor[] = [];
  accesoriosNuevos: AccesorioNuevo[] = [];
  paquetesAccesorios: PaqueteAccesorios[] = [];
  accesoriosSinPaquetes: AccesorioSinPaquete[] = [];

  proveedoresNombres: Proveedor[] = [];

  proveedoresRows: Proveedor[] = [];
  accesoriosRows: AccesorioNuevo[] = [];
  accesoriosRowsOriginal: AccesorioNuevo[] = [];

  tipoProveedoresSeleccionados: IdTiposProveedor[] = [];
  tipoProveedores: IdTiposProveedor[] = [];
  paquetesAccesoriosRows: PaqueteAccesorios[] = [];
  accesoriosSinPaquetesRows: AccesorioSinPaquete[] = [];

  proveedorSeleccionado: Proveedor[] = [];
  accesoriosSinPaqueteCreacion: AccesorioSinPaquete[] = [];
  accesoriosSinPaqueteSeleccionados: AccesorioSinPaquete[] = [];

  paquetesAccesorio: AccesorioSinPaquete[] = [];
  accesoriosSinPaqueteAsignados: AccesorioNuevo[] = [];
  accesoriosSinPaqueteAsignadosFiltro: AccesorioNuevo[] = [];

  paqueteAccesorios: PaqueteAccesorios[];
  paqueteAccesoriosCreacion: PaqueteAccesorios[] = [];
  paqueteAccesoriosAsignadosFiltro: PaqueteAccesorios[] = [];

  opcionTipoProveedor: IdTiposProveedor[] = [];
  opcionNombreProveedor: Proveedor[] = [];

  searchNombre = '';
  searchMarca = '';
  searchModeloAnio = '';
  searchCosto = '';
  searchPrecio = '';
  searchCantidad = '';
  searchExistencia = '';
  searchPlanta = '';
  searchOrigen = '';


  searchNombreSeleccionado: string;
  searchMarcaSeleccionado = '';
  searchModeloAnioSeleccionado: string;
  searchCostoSeleccionado: string;
  searchPrecioSeleccionado: string;
  searchCantidadSeleccionado: string;
  searchExistenciaSeleccionado: string;
  searchPlantaSeleccionado: string;
  searchOrigenSeleccionado: string;

  deshabilita = true;
  disabled = false;
  filtroEsNuevo: boolean = null;
  filtroEsNuevoSeleccionado: boolean = null;

  value: '';
  activeId = 'accesorios';
  tipoOrden = '';

  accesoriosSisco: any[] = [];
  accesoriosSiscoFiltro: any[] = [];

  almacenes = [{ nombreAlmacen: 'Negocio', idAlmacen: 'NEG' }, { nombreAlmacen: 'General', idAlmacen: 'GEN' }];

  constructor(
    private pricingService: PricingService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private accesorioCatalogService: AccesorioCatalogService,
    //SISCO
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.opcionTipoProveedor = [];
    this.opcionNombreProveedor = [];
    this.cantidadSeleccionada = [];
    this.searchAccesories(this.cotizacion.idMarca, this.cotizacion.idSucursal);

    this.tipoOrden = this.cotizacion.tipoOrden;

    if (this.idGrupoUnidad !== undefined) {

      let grupoFresco = this.cotizacion.gruposUnidades.filter(f => f.idGrupoUnidad === this.idGrupoUnidad);
      this.tipoOrden = grupoFresco[0].tipoOrden;

      //OCT99 GESTION
      this.pricingService.getAdicionalesCierrebyIdCotizacionGrupoUnidad(this.cotizacion.idCotizacion, this.idGrupoUnidad).subscribe((adicionales: any) => {

        this.cantidadSeleccionada = [];
        this.accesoriosSinPaqueteAsignados = [];
        this.accesoriosSinPaqueteAsignadosFiltro = [];
        this.grupoSelected = this.cotizacion.gruposUnidades.find(grupoUnidad => {
          return grupoUnidad.idGrupoUnidad == this.idGrupoUnidad;
        });

        this.grupoSelected.accesoriosSinPaquete = adicionales[6];

        this.grupoSelected.accesoriosSinPaquete.map(accesorioSinPaquete => {
          const accesorio = Object.assign(new AccesorioSinPaquete(), accesorioSinPaquete);
          if (this.grupoSelected != undefined) {
            this.grupoSelected.accesoriosSinPaquete.filter(asp => {
              if (asp.idTipoProveedor === accesorio.idTipoProveedor) {
                this.opcionTipoProveedor.push(Object.assign(new IdTiposProveedor(), { idTipoProveedor: asp.idTipoProveedor }));
                this.opcionNombreProveedor.push(Object.assign(new Proveedor(), asp));
                this.cantidadSeleccionada.push(asp.cantidad);
              }
            });
          }
          this.accesoriosSinPaqueteAsignados.push(JSON.parse(JSON.stringify(accesorioSinPaquete)));
          this.accesoriosSinPaqueteAsignadosFiltro.push(JSON.parse(JSON.stringify(accesorioSinPaquete)));
        });

        this.accesorioCatalogService.getProveedores(this.cotizacion.idSucursal, '')
          .subscribe((res: IdTiposProveedor[]) => {
            Array.from(new Set(res.map(proveedor => proveedor.idTipoProveedor)))
              .map(idTipo => {
                if (idTipo !== 'PROTRAS') {
                  const idTipoProveedor = { idTipoProveedor: idTipo };
                  this.tipoProveedoresSeleccionados = [
                    ...this.tipoProveedoresSeleccionados,
                    Object.assign(new IdTiposProveedor(), idTipoProveedor)
                  ];
                }
              });
          });
      });
    }

    this.accesorioCatalogService.getPaquetesAccesorios(this.cotizacion.idSucursal).subscribe((paqueteAccesorios: PaqueteAccesorios[]) => {
      this.paqueteAccesorios = [];
      paqueteAccesorios.map(paqueteAcce => {
        const paquete = Object.assign(new PaqueteAccesorios(), paqueteAcce);
        if (this.grupoSelected != undefined) {
          paquete.isChecked = this.grupoSelected.paquetesAccesorios.some(
            pa => pa.idEncPaqueteAccesorio == paquete.idEncPaqueteAccesorio
          );
          if (paquete.isChecked) {
            this.paqueteAccesoriosCreacion.push(paquete);
          }
        }
        this.paqueteAccesorios.push(paquete);
      });
    });

  }

  searchAccesories(idMarca: string, idSucursal: number) {
    if (!idSucursal) {
      this.toastrService.warning('Debe seleccionar una sucursal', 'Paquete de Accesorios');
      return;
    }

    forkJoin(
      this.accesorioCatalogService.getAccesoriosBpro(idMarca, idSucursal, this.cotizacion.idCotizacion),
      this.accesorioCatalogService.getAccesoriosNuevos(idSucursal),
      this.accesorioCatalogService.getPaquetesAccesorios(idSucursal),
      this.accesorioCatalogService.getProveedores(idSucursal, ''),
    )
      .subscribe((res: any[]) => {
        let [accesoriosBpro, accesoriosNuevos, paquetesAccesorios, proveedores] = res;

        accesoriosNuevos.forEach(function (element) {
          element.Planta = "NO";
        });

        if (this.cotizacion.idDireccionFlotillas !== 'F2') {
          accesoriosNuevos = accesoriosNuevos.filter(fl => {
            return fl.idDireccionFlotillas !== 'F2';
          });
        }

        accesoriosBpro.map(accesorioBpro => {
          accesorioBpro.idAlmacen = null;
          this.accesoriosNuevos.push(Object.assign(new AccesorioNuevo(), accesorioBpro));
        });

        accesoriosNuevos.map(accesorioNuevo => {
          this.accesoriosNuevos.push(Object.assign(new AccesorioNuevo(), accesorioNuevo));
        });

        this.accesoriosNuevos = this.accesoriosNuevos.sort((a: AccesorioNuevo, b: AccesorioNuevo) => {
          if (a.nombre > b.nombre) {
            return 1;
          }

          if (a.nombre < b.nombre) {
            return -1;
          }
          return 0;
        });

        this.accesoriosNuevos.forEach(element => {
          element.costoO = element.costo;
        });

        this.accesoriosRows = JSON.parse(JSON.stringify(this.accesoriosNuevos));
        this.accesoriosRowsOriginal = JSON.parse(JSON.stringify(this.accesoriosNuevos));
        this.accesoriosRows = this.accesoriosRowsOriginal.filter(item => {
          if (!item.idMarca) {
            return false;
          }
          if (item.idMarca.toUpperCase().startsWith(this.cotizacion.idMarca.toUpperCase())) {
            return true;
          } else {
            return false;
          }
        });

        this.searchMarca = this.cotizacion.idMarca;
        paquetesAccesorios.map(paqueteAccesorio => {
          this.paquetesAccesorios.push(Object.assign(new AccesorioSinPaquete(), paqueteAccesorio));
        });

        this.paquetesAccesorios = this.paquetesAccesorios.sort((a: PaqueteAccesorios, b: PaqueteAccesorios) => {
          if (a.nombre > b.nombre) {
            return 1;
          }
          if (a.nombre < b.nombre) {
            return -1;
          }
          return 0;
        });

        this.paquetesAccesoriosRows = JSON.parse(JSON.stringify(this.paquetesAccesorios));

        proveedores.map(proveedor => {
          this.proveedores.push(Object.assign(new Proveedor(), proveedor));
        });

        this.proveedores = this.proveedores.sort((a: Proveedor, b: Proveedor) => {
          if (a.nombreCompleto > b.nombreCompleto) {
            return 1;
          }
          if (a.nombreCompleto < b.nombreCompleto) {
            return -1;
          }
          return 0;
        });

        this.proveedoresRows = JSON.parse(JSON.stringify(this.proveedores));

        Array.from(new Set(this.proveedoresRows.map(proveedor => proveedor.idTipoProveedor)))
          .map(idTipo => {
            if (idTipo !== 'PROTRAS') {
              const idTipoProveedor = { idTipoProveedor: idTipo };
              this.tipoProveedores.push(Object.assign(new IdTiposProveedor(), idTipoProveedor));
            }
          });
      });
  }

  updateFilterAccesoriosSinPaquete() {
    if (!this.accesoriosNuevos) { this.accesoriosNuevos = []; }
    this.accesoriosRows = this.accesoriosNuevos.filter(item => {
      return item.nombre.toLowerCase().includes((this.searchNombre || '').toLowerCase()) &&
        (item.idMarca === undefined ? '' : item.idMarca).toLowerCase().includes((this.searchMarca || '').toLowerCase()) &&
        item.modeloAnio.toLowerCase().includes((this.searchModeloAnio || '').toLowerCase()) &&
        item.costo.toString().toLowerCase().includes((this.searchCosto || '').toLowerCase()) &&
        item.precio.toString().toLowerCase().includes((this.searchPrecio || '').toLowerCase()) &&
        (item.existencia === undefined ? 0 : item.existencia).toString().toLowerCase()
          .includes((this.searchExistencia || '').toLowerCase()) &&
        item.Planta.toLowerCase().includes((this.searchPlanta || '').toLowerCase()) &&
        item.Origen.toLowerCase().includes((this.searchOrigen || '').toLowerCase()) &&
        this.filtroEsNuevo == undefined ? true : item.esNuevo == this.filtroEsNuevo;
    });
  }

  filterHeader() {
    this.accesoriosRows = Object.assign(this.accesoriosRowsOriginal, []);
    if (this.searchMarca.length > 0) {
      this.accesoriosRows = this.accesoriosRows.filter(item => {
        if (!item.idMarca) {
          return false;
        }
        if (item.idMarca.toUpperCase().startsWith(this.searchMarca.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.searchNombre.length > 0) {
      this.accesoriosRows = this.accesoriosRows.filter(item => {
        if (!item.nombre) {
          return false;
        }
        if (item.nombre.toUpperCase().startsWith(this.searchNombre.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.searchMarca.length > 0) {
      this.accesoriosRows = this.accesoriosRows.filter(item => {
        if (!item.idMarca) {
          return false;
        }
        if (item.idMarca.toUpperCase().startsWith(this.searchMarca.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.searchCosto.length > 0) {
      this.accesoriosRows = this.accesoriosRows.filter(item => {
        if (item.costo >= Number(this.searchCosto)) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.searchPrecio.length > 0) {
      this.accesoriosRows = this.accesoriosRows.filter(item => {
        if (item.precio >= Number(this.searchPrecio)) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.searchExistencia.length > 0) {
      this.accesoriosRows = this.accesoriosRows.filter(item => {
        if (Number(item.existencia) >= Number(this.searchExistencia)) {
          return true;
        } else {
          return false;
        }
      });
    }

    if (this.searchPlanta.length > 0) {
      this.accesoriosRows = this.accesoriosRows.filter(item => {
        if (!item.Planta) {
          return false;
        }
        if (item.Planta.toUpperCase().startsWith(this.searchPlanta.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
    //OCT99 20210122 
    if (this.searchOrigen.length > 0) {
      this.accesoriosRows = this.accesoriosRows.filter(item => {
        if (!item.Origen) {
          return false;
        }
        if (item.Origen.toUpperCase().startsWith(this.searchOrigen.toUpperCase())) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  getName() {
    return this.cotizacion.gruposUnidades.filter(
      item => {
        return item.idGrupoUnidad === this.idGrupoUnidad;
      }
    )[0].versionUnidad;
  }

  updateFilterAccesoriosSeleccionados() {
    if (!this.accesoriosSinPaqueteAsignados) { this.accesoriosSinPaqueteAsignados = []; }
    this.accesoriosSinPaqueteAsignadosFiltro = this.accesoriosSinPaqueteAsignados.filter(item => {
      return item.nombre.toLowerCase().includes((this.searchNombreSeleccionado || '').toLowerCase()) &&
        (item.idMarca === undefined ? '' : item.idMarca).toLowerCase().includes((this.searchMarcaSeleccionado || '').toLowerCase()) &&
        item.modeloAnio.toLowerCase().includes((this.searchModeloAnioSeleccionado || '').toLowerCase()) &&
        item.costo.toString().toLowerCase().includes((this.searchCostoSeleccionado || '').toLowerCase()) &&
        item.precio.toString().toLowerCase().includes((this.searchPrecioSeleccionado || '').toLowerCase()) &&
        (item.existencia === undefined ? 0 : item.existencia).toString().toLowerCase()
          .includes((this.searchExistenciaSeleccionado || '').toLowerCase()) &&
        item.Planta.toLowerCase().includes((this.searchPlantaSeleccionado || '').toLowerCase()) &&
        item.Origen.toLowerCase().includes((this.searchOrigenSeleccionado || '').toLowerCase()) &&
        this.filtroEsNuevoSeleccionado == undefined ? true : item.esNuevo == this.filtroEsNuevoSeleccionado;
    });
  }

  closeModal() {
    this.activeModal.close(false);
  }

  setFiltroEsNuevo(valor: boolean = null) {
    switch (valor) {
      case true:
        this.filtroEsNuevo = false;
        break;
      case false:
        this.filtroEsNuevo = null;
        break;
      default:
        this.filtroEsNuevo = true;
    }
    this.updateFilterAccesoriosSinPaquete();
  }

  setFiltroEsNuevoSeleccionado(valor: boolean = null) {
    switch (valor) {
      case true:
        this.filtroEsNuevoSeleccionado = false;
        break;
      case false:
        this.filtroEsNuevoSeleccionado = null;
        break;
      default:
        this.filtroEsNuevoSeleccionado = true;
    }
    this.updateFilterAccesoriosSeleccionados();
  }

  getRowClass(accesorioNuevo: AccesorioNuevo) {
    if (accesorioNuevo.esNuevo) {
      return { 'row-orange': true };
    }
  }

  // setValueInput(event, row) {
  //   row.cantidad = event;
  // }

  getCantidad(cantidad, row, index) {
    const search = this.accesoriosSinPaqueteCreacion.find(accesorios => accesorios.idParte === row.idParte);
    if (cantidad > '0' && !search) {
      this.accesoriosSinPaqueteCreacion.push(row);
    } else if (cantidad === '0' && search) {
    } else if (cantidad > '0' && search) {
      if (this.accesoriosSinPaqueteCreacion.find(f => f.idAccesorioNuevo === row.idAccesorioNuevo)) {
      } else {
        this.accesoriosSinPaqueteCreacion.push(row);
      }
    }
  }

  getCantidadUpdate(cantidad, row, index) {
    const search = this.accesoriosSinPaqueteAsignadosFiltro.find(accesorios => accesorios.idParte === row.idParte);
    if (cantidad === '0' && search) {
      this.disabled = true;
    }
  }

  rowClassChange(row) {
    if (row.cantidad > 0) {
      return { 'row-color': true };
    } else {
      return { 'row-color': false };
    }
  }

  tabChanged(tabEvent: NgbTabChangeEvent) {
    this.activeId = tabEvent.nextId;
  }

  onSelectTipoProveedor($event) {
    if ($event) {
      this.proveedoresNombres = [];
      this.proveedores.filter(proveedor => {
        if ($event.idTipoProveedor === proveedor.idTipoProveedor) {
          this.proveedoresNombres.push(Object.assign(new Proveedor(), proveedor));
        }
      });

      this.proveedoresNombres.forEach(proveedor => {
        proveedor.nombreIdProveedor = proveedor.idProveedor + ' - ' + proveedor.nombreCompleto;
      });
    }
  }

  onSelectNombreProveedor($event) {
    if ($event) {
      this.proveedorSeleccionado.push($event);
    }
  }

  checkValidation() {
    let accesoriosSinPaquete = [];
    accesoriosSinPaquete = this.accesoriosSinPaqueteCreacion;
    // accesoriosSinPaquete = [...accesoriosSinPaquete, ...this.accesoriosSinPaqueteAsignadosFiltro];
    accesoriosSinPaquete = accesoriosSinPaquete.filter(item => {
      return item.cantidad != null && item.cantidad > 0;  //&& item.idTipoProveedor != null && item.nombreProveedor != null;
    });
    return accesoriosSinPaquete.length === 0;
  }

  agregarAccesorioSinPaquete(tipoMovimiento) {

    this.accesoriosSinPaqueteCreacion = this.accesoriosSinPaqueteCreacion.filter(item => {
      return item.cantidad != null && item.cantidad > 0;  //&& item.idTipoProveedor != null && item.nombreProveedor != null;
    });

    if (this.modalGestoria) {
      const accesoriosSinPaqueteNuevo = [];
      let accesoriosSinPaquete = [];
      accesoriosSinPaquete = this.accesoriosSinPaqueteCreacion;
      // accesoriosSinPaquete = [...accesoriosSinPaquete, ...this.accesoriosSinPaqueteAsignadosFiltro];
      accesoriosSinPaquete = accesoriosSinPaquete.filter(item => {
        //return item.cantidad != null && item.cantidad > 0 && item.idTipoProveedor != null && item.nombreProveedor != null;
        return item.cantidad != null && item.cantidad > 0 && item.Planta === 'SI' || item.Planta === 'NO APLICA'
        && item.cantidad <= item.existencia;
      });

      if(accesoriosSinPaquete.length == 0){
        this.toastrService.warning(`Existen partes SISCO.`, `Validación de Accesorios`);
        return true;
      }

      //let planta = accesoriosSinPaqueteNuevo.filter(item => item.Planta === 'SI' || item.Planta === 'NO APLICA');
      accesoriosSinPaquete.forEach(element => {

        const accesorio = {
          idCotizacion: this.cotizacion.idCotizacion,
          idGrupoUnidad: this.idGrupoUnidad,
          idDetalleUnidad: this.idDetalleUnidad,
          idAccesorio: '', //cual es?
          idEncPaqueteAccesorio: null,
          idDetPaqueteAccesorio: null,
          idAccesorioNuevo: element.idAccesorioNuevo,
          nombre: element.nombre,
          idTipoProveedor: element.idTipoProveedor,
          idProveedor: element.idProveedor,
          nombreProveedor: element.nombreProveedor,
          idParte: element.idParte ? element.idParte : null,
          modeloAnio: element.modeloAnio,
          cantidad: element.cantidad,
          costo: element.costo,
          precio: element.precio,
          tipoMovimiento,
          idUsuarioModificacion: element.idUsuario,
          fechaModificacion: new Date()
        } as AccesorioNuevoUnidad;
        accesoriosSinPaqueteNuevo.push(accesorio);

      });

      this.pricingService.saveCotizacionUnidadAccesorioMovs(this.cotizacion.idCotizacion,
        this.idGrupoUnidad, this.idDetalleUnidad, accesoriosSinPaqueteNuevo).subscribe(() => {
          this.activeModal.close(true);
        }, (httpError) => {
          const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
          this.toastrService.error(message, 'Accesorios');
        });

    } else {

      let index = 0;
      let accesoriosSinPaqueteNuevo = [];

      let accesoriosSinPaquete = [];

      accesoriosSinPaquete = this.accesoriosSinPaqueteCreacion;
      //accesoriosSinPaquete = [...accesoriosSinPaquete, ...this.accesoriosSinPaqueteAsignadosFiltro];
      accesoriosSinPaquete = [...accesoriosSinPaquete];
      for (const acsp of accesoriosSinPaquete) {
        if (!this.proveedorSeleccionado.length) {
          acsp.idProveedor = null;
          acsp.nombreProveedor = null;
          acsp.idTipoProveedor = null;
        }

        //OCT99 20201001 COMPRAS
        if (this.proveedorSeleccionado.length > 0) {
          if (this.proveedorSeleccionado[index] !== undefined &&
            this.proveedorSeleccionado[index].hasOwnProperty('idTipoProveedor')) {
            acsp.idTipoProveedor = this.proveedorSeleccionado[index].idTipoProveedor;
          } else {
            acsp.idTipoProveedor = null;
          }

          if (this.proveedorSeleccionado[index] !== undefined &&
            this.proveedorSeleccionado[index].hasOwnProperty('idProveedor')) {
            acsp.idProveedor = this.proveedorSeleccionado[index].idProveedor;
          } else {
            acsp.idProveedor = null;
          }

          if (this.proveedorSeleccionado[index] !== undefined &&
            this.proveedorSeleccionado[index].hasOwnProperty('nombreCompleto')) {
            acsp.nombreProveedor = this.proveedorSeleccionado[index].nombreCompleto;
          } else {
            acsp.nombreProveedor = null;
          }
        }

        if (this.idGrupoUnidad) {
          acsp.idGrupoUnidad = this.idGrupoUnidad;
        } else {
          this.cotizacion.gruposUnidades.map(grupoUnidad => {
            acsp.idGrupoUnidad = grupoUnidad.idGrupoUnidad;
          });
        }

        if (acsp.idParte) {
          acsp.idParte = acsp.idParte;
        } else {
          acsp.idParte = '';
        }

        acsp.idCotizacion = this.cotizacion.idCotizacion;
        acsp.cantidad = (this.input[index] !== undefined) ? this.input[index] : acsp.cantidad;
        acsp.idAccesorioNuevo = (acsp.idAccesorioNuevo !== undefined) ? acsp.idAccesorioNuevo : -1;
        index++;
        accesoriosSinPaqueteNuevo.push(Object.assign(new AccesorioSinPaquete(), acsp));
      }

      let costoMayorPrecio = accesoriosSinPaqueteNuevo.filter(item => item.costo >= item.precio);

      if (costoMayorPrecio.length > 0) {
        this.toastrService.warning(`Existen partes con Costo mayor que Precio.`, `Validación de Accesorios`);
        return true;
      }

      /*
      No Planta      
      1.-sisco catalogo
      2.-sisco nuevo
      Planta
      3.-con existencia(normal)
      4.-sin existencia(obligatorio almacen)
      */

      let CatalogoSisco = new CatalogoSiscoComponent(this.pricingService, this.toastrService, this.activeModal, this.accesorioCatalogService);
      let AgregaNuevoSisco = new AgregarAccesorioSiscoComponent(this.pricingService, this.toastrService, this.activeModal, this.accesorioCatalogService);

      let planta = accesoriosSinPaqueteNuevo.filter(item => item.Planta === 'SI' || item.Planta === 'NO APLICA');
      let noPlanta = accesoriosSinPaqueteNuevo.filter(item => item.Planta === 'NO');

      let noPlantaSisco = noPlanta.filter(item => { return (item.cantidad > item.existencia) || (item.existencia === undefined) });
      let noPlantaExistencia = noPlanta.filter(item => { return (item.cantidad <= (item.existencia === undefined) ? 0 : item.existencia) });
      //let noPlantaExistenciaSisco = noPlanta.filter(item => { return (item.cantidad <= item.existencia) || (item.existencia != undefined) });
      //let descripciones: string[] = [];
      let agregadoNormal: any[] = [];

      planta.forEach(element => {
        agregadoNormal.push(element);
      });

      noPlantaExistencia.forEach(element => {
        agregadoNormal.push(element);
      });

      //let plantaSinExistenciaPrincipal = planta.filter(item => ((item.cantidad > item.existencia) || (item.existencia === undefined)) && item.idAlmacen == null);
      let plantaSinExistenciaPrincipal = planta.filter(item => item.idAlmacen == null);
      let plantaCostoCero = planta.filter(item => item.costo == 0 || item.costo === undefined || item.costo === null);

      if (plantaSinExistenciaPrincipal.length > 0) {
        this.toastrService.warning(`Hay accesorios de planta y se requiere seleccionar almacen.`, `Validación de Accesorios`);
        return true;
      }

      if (plantaCostoCero.length > 0) {
        this.toastrService.warning(`No se permiten accesorios de Planta con costo 0.`, `Validación de Accesorios`);
        return true;
      }
      /*
      let plantaSinExistenciaPost1 = planta.filter(item => ((item.cantidad > item.existencia || item.existencia === undefined) && item.cantidad > 0));
      //let plantaSinExistenciaPost2 = planta.filter(item => ((item.cantidad > item.existencia || item.existencia === undefined) && item.cantidad > 0));

      console.log('plantaSinExistenciaPost');
      console.log(plantaSinExistenciaPost1);
      
      let plantaConExistencia: any[] = [];
      let plantaSinExistencia: any[] = [];
      
      if(plantaSinExistenciaPost1.length > 0){
        
        plantaSinExistenciaPost1.forEach(element => {
          let elementoExistencia = element;
          let existencia = Number(element.existencia);          
          //elementoExistencia.cantidad = existencia;          
          elementoExistencia.plantaExistencia = true;
          plantaConExistencia.push(elementoExistencia);
        });

        console.log('planta con existencia');
        console.log(plantaConExistencia);
        
        plantaSinExistenciaPost2.forEach(element => {
          
          let elementoSinExistencia = element;
          const existencia1 = Number(element.existencia);
          const cantidad1 = Number(element.cantidad);
          //elementoSinExistencia.cantidad = elementoSinExistencia.cantidad - elementoSinExistencia.existencia;
          plantaSinExistencia.push(elementoSinExistencia);
        });

        console.log('planta sin existencia');
        console.log(plantaSinExistencia);        
      }*/

      /*
      noPlantaSisco.forEach(async (element) => {
        let elemento = (({ nombre }) => ({ nombre }))(element);
        descripciones.push(elemento.nombre);
      });
      */
      /*
      console.log('Planta:');
      console.log(planta);
      console.log('No Planta:');
      console.log(noPlanta);
      console.log('Descripciones:');
      console.log(descripciones);
      */
      this.buscarPartidasSisco(noPlantaSisco)
        .then((res: any[]) => {
          let nuevosSisco = res.filter(element => element.ExisteSisco == false);
          let agregarCatalogoSisco = res.filter(element => element.ExisteSisco == true);
          if (nuevosSisco.length > 0) {

            let agregarSisco: any[] = [];

            nuevosSisco.forEach(async (element) => {
              agregarSisco.push({ cantidad: element.cantidad, 
                                  descripcion: element.nombre,
                                  idParte: (element.idAccesorioNuevo === -1) ? element.idParte : element.idAccesorioNuevo,
                                  existencia: (element.existencia === undefined || element.existencia === null) ? 0 : element.existencia,                                  
                                  precioFrm: element.precioFrm});
            });
            AgregaNuevoSisco.cotizacion = this.cotizacion;
            AgregaNuevoSisco.idGrupoUnidad = this.idGrupoUnidad;
            AgregaNuevoSisco.agregarExterno(agregarSisco);
          }
          if (agregarCatalogoSisco.length > 0) {
            CatalogoSisco.cotizacion = this.cotizacion;
            CatalogoSisco.idGrupoUnidad = this.idGrupoUnidad;

            CatalogoSisco.agregaCatalogoSiscoDesdeFuera(agregarCatalogoSisco);
          }
        })
        .then(() => {
          if (planta.length > 0) {
            agregadoNormal.forEach((item) => { item.Planta = 'SI' });
            if (this.idGrupoUnidad) {
              //this.pricingService.saveCotizacionGrupoAccesoriosSinPaquete(accesoriosSinPaqueteNuevo)
              this.pricingService.saveCotizacionGrupoAccesoriosSinPaquete(agregadoNormal)
                .subscribe((res) => {
                  this.activeModal.close(true);
                  this.toastrService.success(`Accesorios agregados al grupo ${this.idGrupoUnidad} de forma sactisfactoria.`, `OPERACION EXITOSA`);
                }, error => {
                  this.toastrService.error(`No se logro agregar los accesorios al grupo ${this.idGrupoUnidad}.`,
                    `ERROR AL INTENTAR LA OPERACION`);
                });
            } else {
              //this.pricingService.saveCotizacionGrupoAccesoriosSinPaqueteTodos(accesoriosSinPaqueteNuevo)
              this.pricingService.saveCotizacionGrupoAccesoriosSinPaqueteTodos(agregadoNormal)
                .subscribe((res) => {
                  this.activeModal.close(true);
                  this.toastrService.success(`Accesorios agregados al grupo ${this.idGrupoUnidad} de forma sactisfactoria.`, `OPERACION EXITOSA`);
                }, error => {
                  this.toastrService.error(`No se logro agregar los accesorios al grupo ${this.idGrupoUnidad}.`,
                    `ERROR AL INTENTAR LA OPERACION`);
                });
            }
            accesoriosSinPaqueteNuevo = [];
          }
          else {
            let agregar = agregadoNormal.filter(item => item.existencia >= item.cantidad
              && item.Planta === 'NO');

            if (agregar.length > 0) {

              this.pricingService.saveCotizacionGrupoAccesoriosSinPaquete(agregadoNormal)
                .subscribe((res) => {
                  this.activeModal.close(true);
                  this.toastrService.success(`Accesorios agregados al grupo ${this.idGrupoUnidad} de forma sactisfactoria.`, `OPERACION EXITOSA`);
                }, error => {
                  this.toastrService.error(`No se logro agregar los accesorios al grupo ${this.idGrupoUnidad}.`,
                    `ERROR AL INTENTAR LA OPERACION`);
                });
            }
            else {
              this.activeModal.close(true);
              this.toastrService.success(`Accesorios agregados al grupo ${this.idGrupoUnidad} de forma sactisfactoria.`, `OPERACION EXITOSA`);
            }
            /*
            this.pricingService.saveCotizacionGrupoAccesoriosSinPaquete(agregadoNormal)
              .subscribe((res) => {
                this.activeModal.close(true);
                this.toastrService.success(`Accesorios agregados al grupo ${this.idGrupoUnidad} de forma sactisfactoria.`, `OPERACION EXITOSA`);
              }, error => {
                this.toastrService.error(`No se logro agregar los accesorios al grupo ${this.idGrupoUnidad}.`,
                  `ERROR AL INTENTAR LA OPERACION`);
              });*/
            // this.activeModal.close(true);
            // this.toastrService.success(`3 Accesorios agregados al grupo ${this.idGrupoUnidad} de forma sactisfactoria.`, `OPERACION EXITOSA`);
          }
        })
        .catch(err => console.log(err.message));

      /*
      catalogoSisco.cotizacion = this.cotizacion;
      catalogoSisco.idGrupoUnidad = this.idGrupoUnidad;
      catalogoSisco.ngOnInit();
      */

    }
  }

  onSelectPaquetesAccesorios(paqueteAccesorio: PaqueteAccesorios) {
    paqueteAccesorio.isChecked = !paqueteAccesorio.isChecked;
    if (paqueteAccesorio.isChecked) {
      this.paqueteAccesoriosCreacion.push(paqueteAccesorio);
    } else {
      this.paqueteAccesoriosCreacion = this.paqueteAccesoriosCreacion.filter(pas => {
        return pas.idEncPaqueteAccesorio != paqueteAccesorio.idEncPaqueteAccesorio;
      });
    }
  }

  getIdGrupoUnidad() {
    let idGrupoUnidad: number;
    for (const grupos of this.cotizacion.gruposUnidades) {
      if (grupos.idGrupoUnidad) {
        idGrupoUnidad = grupos.idGrupoUnidad;
      }
    }
    return idGrupoUnidad;
  }

  selectPaqueteAccesorios(idCotizacion: string, idGrupoUnidad: number, paqueteAccesorios: PaqueteAccesorios[]) {
    this.pricingService.saveCotizacionGrupoAccesorios(idCotizacion, idGrupoUnidad, paqueteAccesorios).subscribe(() => {
      this.activeModal.close(true);
      this.ngOnInit();
    }, httpError => {
      const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
      this.toastrService.error(message, 'Paquete de accesorios');
    });
  }

  agregarPaquetesAccesorios(tipoMovimiento) {

    if (this.modalGestoria) {

      const idsEncPaqueteAccesorios = this.grupoSelected.paquetesAccesorios.map(m => m.idEncPaqueteAccesorio);
      const accesoriosPaquetes = this.paqueteAccesoriosCreacion.filter(f => !idsEncPaqueteAccesorios.includes(f.idEncPaqueteAccesorio));

      const accesoriosSinPaqueteNuevo = [];

      accesoriosPaquetes.forEach(element => {

        const accesorio = {
          idCotizacion: this.cotizacion.idCotizacion,
          idGrupoUnidad: this.idGrupoUnidad,
          idDetalleUnidad: this.idDetalleUnidad,
          idAccesorio: '', //cual es?
          idEncPaqueteAccesorio: element.idEncPaqueteAccesorio,
          idDetPaqueteAccesorio: null,
          idAccesorioNuevo: null,
          nombre: element.nombre,
          idTipoProveedor: null,
          idProveedor: null,
          nombreProveedor: null,
          idParte: null,
          modeloAnio: null,
          cantidad: element.accesorios.length,
          costo: null,
          precio: Number(element.precioTotal),
          tipoMovimiento,
          idUsuarioModificacion: 0,
          fechaModificacion: new Date()
        } as AccesorioNuevoUnidad;
        accesoriosSinPaqueteNuevo.push(accesorio);

      });

      this.pricingService.saveCotizacionUnidadAccesorioMovs(this.cotizacion.idCotizacion,
        this.idGrupoUnidad, this.idDetalleUnidad, accesoriosSinPaqueteNuevo).subscribe(() => {
          this.activeModal.close(true);
        }, (httpError) => {
          const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
          this.toastrService.error(message, 'Accesorios');
        });

    } else {
      if (!this.idGrupoUnidad) {
        this.selectPaqueteAccesorios(
          this.cotizacion.idCotizacion, this.getIdGrupoUnidad(), this.paqueteAccesoriosCreacion);
      } else {
        this.selectPaqueteAccesorios(
          this.cotizacion.idCotizacion, this.idGrupoUnidad, this.paqueteAccesoriosCreacion);
      }
      this.paqueteAccesoriosCreacion = [];
    }
  }

  //SISCO
  abrirCatalogoSisco() {
    const modalCatalogoSisco = this.modalService.open(CatalogoSiscoComponent, { size: 'sm' });
    modalCatalogoSisco.componentInstance.idGrupoUnidad = this.idGrupoUnidad;
    modalCatalogoSisco.componentInstance.cotizacion = this.cotizacion;
    modalCatalogoSisco.componentInstance.modalGestoria = false;
    modalCatalogoSisco.componentInstance.idEscenario = 2;
    modalCatalogoSisco.componentInstance.filtroDescripcion = "";
    //modalCatalogoSisco.componentInstance.idProveedor = 9;
    //modalCatalogoSisco.componentInstance.nombreProveedor = "";

    modalCatalogoSisco.result.then((isSaved: boolean) => {
      if (isSaved) {
        //this.refreshData();
        //this.ngOnInit();
        this.activeModal.close(true);
      }
    });
  }

  //SISCO
  abrirAgregarSisco() {
    const modalAgregarAccesorioSisco = this.modalService.open(AgregarAccesorioSiscoComponent, { size: 'lg' });
    modalAgregarAccesorioSisco.componentInstance.idGrupoUnidad = this.idGrupoUnidad;
    modalAgregarAccesorioSisco.componentInstance.cotizacion = this.cotizacion;
    modalAgregarAccesorioSisco.componentInstance.modalGestoria = false;
    modalAgregarAccesorioSisco.result.then((isSaved: boolean) => {
      if (isSaved) {
        //this.refreshData();
        //this.ngOnInit();         
        //this.activeModal.close(true);
        this.activeModal.close(true);
      }
    });
  }

  buscarSisco(row) {
    const modalCatalogoSisco = this.modalService.open(CatalogoSiscoComponent, { size: 'sm' });
    modalCatalogoSisco.componentInstance.idGrupoUnidad = this.idGrupoUnidad;
    modalCatalogoSisco.componentInstance.cotizacion = this.cotizacion;
    modalCatalogoSisco.componentInstance.modalGestoria = false;
    modalCatalogoSisco.componentInstance.idEscenario = 1;
    modalCatalogoSisco.componentInstance.filtroDescripcion = row.nombre;
    modalCatalogoSisco.componentInstance.idProveedor = row.idProveedor;
    modalCatalogoSisco.componentInstance.nombreProveedor = row.nombreProveedor;
    modalCatalogoSisco.componentInstance.idAccesorioNuevo = row.idAccesorioNuevo;
    modalCatalogoSisco.result.then((isSaved: boolean) => {
      if (isSaved) {
        //this.refreshData();
        //this.ngOnInit();
        this.activeModal.close(true);
      }
    });
  }


  //////////COMPRAS 20201120
  buscarPartidasSisco(descripcionesBuscar: any[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {

      this.accesorioCatalogService.getDatosSisco().subscribe(async (datos) => {

        //this.accesorioCatalogService.postSiscoLogin(datos[0].email, datos[0].password, datos[0].application, datos[0].urlLogin).subscribe(async (aut) => {
        // await this.loginSisco(datos[0].email, datos[0].password, datos[0].application, datos[0].urlLogin).then(async (aut: any[]) => {

            let filtroSisco = {
              "idTipoObjeto": datos[0].idTipoObjeto,
              "numeroContrato": datos[0].numeroContrato,
              "idCliente": datos[0].idCliente,
              "idClase": datos[0].idClase,
              "idTipoSolicitud": datos[0].idTipoSolicitud,
              "idMoneda": datos[0].idMoneda
            };

            let token = environment.tokenSisco;
            //aut[0].data.security.token;

            this.accesorioCatalogService.getCatalogoAccesoriosSISCO(filtroSisco, token, datos[0].urlGetPartidas).subscribe(async (resp) => {

              if (resp[0].error === "") {
                this.accesoriosSisco = resp[0].recordsets[0];
                this.accesoriosSiscoFiltro = [];

                //cuando se da click en un accesorio del catalogo y se busca por este
                descripcionesBuscar.forEach(async (element) => {
                  let accesorio = this.accesoriosSisco.filter(f => f.Descripción === element.nombre);

                  if (accesorio.length > 0) {
                    element.Descripción = accesorio[0].Descripción;
                    element.idPartida = accesorio[0].idPartida;
                    element.noParte = accesorio[0].noParte;
                    element.Costo = accesorio[0].Costo;
                    element.Venta = accesorio[0].Venta;
                    element.ExisteSisco = true;                     
                  }
                  else {
                    element.ExisteSisco = false;
                  }

                  element.precioFrm = element.precio;

                  this.accesoriosSiscoFiltro.push(element);
                });

                /*
                this.accesoriosSiscoFiltro.map((obj) => {
                  obj.cantidad = 0;
                  return obj;
                })
                */

                resolve(this.accesoriosSiscoFiltro);
                /*
                if (this.accesoriosSiscoFiltro.length == 0)
                  this.toastrService.error('No existen partidas en el catalogo de SISCO', 'Catalogo de Partidas SISCO');
                this.accesoriosSiscoFiltro = [...this.accesoriosSiscoFiltro];
                */
              }
              else {
                //return [{ Error: resp[0].error }];
                reject([{ Error: resp[0].error }]);
                this.toastrService.error(resp[0].error, 'Catalogo de Partidas SISCO');
              }

            }, (httpError) => {
              const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
              reject([{ Error: message }]);
              //this.toastrService.error(message, 'Catalogo de Partidas SISCO');
            });
            //});
          // })//LOGIN SISCO
          // .catch(err => {
          //   let error = JSON.parse(err[0].Error);
          //   this.toastrService.error(error.errors[0].description, 'LOGIN SISCO');
          // }
          // );
      });
    });
  }
  /*
  buscaSisco(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
    });
  }
  */

  precioBloqueado(row) {
    let validacion = true; //desactivado    
      if (row.Origen === 'FLO') {
        validacion = false;
      }
      if (row.Origen === 'BPRO') {
        if (row.Planta === 'SI') {
          validacion = false;
        }
        else {
          validacion = false;
        }
      }
    return validacion;
  }

  costoBloqueado(row) {

    let validacion = true; //desactivado
      if (row.Origen === 'FLO') {
        validacion = false;
      }
      if (row.Origen === 'BPRO') {
        if (row.Planta === 'SI') {
          if (row.existencia === 0 || row.existencia == null || row.existencia == undefined)
            validacion = false;
          else
            validacion = true;
        }
        else {
          validacion = true;
        }
      }
    return validacion;
  }

  // async loginSisco(email, password, application, urlLogin): Promise<any[]> {
  //   return new Promise<any[]>((resolve, reject) => {
  //     this.accesorioCatalogService.postSiscoLogin(email, password, application, urlLogin).subscribe(async (aut) => {
  //       resolve(aut);
  //     }, (httpError) => {
  //       const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
  //       reject([{ Error: message }]);
  //     });
  //   });
  // }

}
