import { Component, OnInit, Input } from '@angular/core';
import { Cotizacion, PaqueteServicio, ServicioUnidad, ServicioUnidadSinPaquete, GrupoUnidades, UnidadBpro, ServicioUnidadSinPaqueteUnidad } from '../../../models';
import { PricingService, OrdenesCatalogService, NewUnitsService } from '../../../services';
import { NgbActiveModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-agregar-editar-servicio-unidad',
  templateUrl: './agregar-editar-servicio-unidad.component.html',
  styleUrls: ['./agregar-editar-servicio-unidad.component.scss']
})
export class AgregarEditarServicioUnidadComponent implements OnInit {

  @Input() cotizacion: Cotizacion;
  @Input() idGrupoUnidad: number;
  @Input() modalGestoria: boolean;
  @Input() idDetalleUnidad: number;

  serviciosUnidadSinPaqueteGrupo: ServicioUnidadSinPaquete[];
  serviciosUnidadSinPaqueteGrupoFiltrados: ServicioUnidadSinPaquete[];
  searchCatalogo = '';
  searchAnio = '';
  searchNombre = '';
  searchDescripcion = '';
  searchCosto = '';
  searchPrecio = '';
  paquetesServicioUnidad: PaqueteServicio[];
  paquetesServicioUnidadSeleccionados: PaqueteServicio[] = [];
  allServiciosUnidad: ServicioUnidad[] = [];
  serviciosUnidad: ServicioUnidad[];
  serviciosUnidadSelected: ServicioUnidad[] = [];
  grupoSelected: GrupoUnidades;
  activeId = 'serviciosUnidad';
  catalogos: UnidadBpro[];
  catalogoSelected: UnidadBpro;
  anio = new Date().getFullYear();
  anioSelected: string;

  constructor(private activeModal: NgbActiveModal,
    private newUnitsService: NewUnitsService,
    private serviceUnit: OrdenesCatalogService,
    private pricingService: PricingService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    if (this.idGrupoUnidad != undefined) {
      //OCT99 GESTION
      this.pricingService.getAdicionalesCierrebyIdCotizacionGrupoUnidad(this.cotizacion.idCotizacion,this.idGrupoUnidad).subscribe((adicionales: any) => { 
        this.grupoSelected = this.cotizacion.gruposUnidades.find((gu) => {
          return gu.idGrupoUnidad == this.idGrupoUnidad;
        });
        //OCT99 GESTION
        this.grupoSelected.serviciosUnidadSinPaquete = adicionales[8];
        this.serviciosUnidadSinPaqueteGrupo = [];
        this.serviciosUnidadSinPaqueteGrupoFiltrados = [];
        this.grupoSelected.serviciosUnidadSinPaquete.map(tsp => {
          this.serviciosUnidadSinPaqueteGrupo.push(JSON.parse(JSON.stringify(tsp)));
          this.serviciosUnidadSinPaqueteGrupoFiltrados.push(JSON.parse(JSON.stringify(tsp)));
        });
      });
    }
    this.newUnitsService.getCatalogo(this.cotizacion.idEmpresa)
      .subscribe((data: UnidadBpro[]) => {
        this.catalogos = JSON.parse(JSON.stringify(data));
      });
    this.serviceUnit.getPaqueteServicio(this.cotizacion.idSucursal).subscribe((paqueteServicios: PaqueteServicio[]) => {
      this.paquetesServicioUnidad = [];
      paqueteServicios.map(ps => {
        const paqueteServicioUnidad = Object.assign(new PaqueteServicio(), ps);
        if (this.grupoSelected != undefined) {
          paqueteServicioUnidad.isSelected = this.grupoSelected.paquetesServicioUnidad
            .some(gpsu => gpsu.idEncPaqueteServicioUnidad == paqueteServicioUnidad.idEncPaqueteServicioUnidad);
          if (paqueteServicioUnidad.isSelected) {
            this.paquetesServicioUnidadSeleccionados.push(paqueteServicioUnidad);
          }
        }
        this.paquetesServicioUnidad.push(paqueteServicioUnidad);
      });
    });
  }

  catalogoOnChange(unidadBpro: UnidadBpro) {
    this.catalogoSelected = unidadBpro;
  }

  buscarServiciosUnidad() {
    this.serviceUnit.getServicios(this.cotizacion.idSucursal, this.catalogoSelected.idUnidadBpro, this.anioSelected)
      .subscribe((data: ServicioUnidad[]) => {
        this.allServiciosUnidad = data;
        this.serviciosUnidadSelected = [];
        if (this.grupoSelected != undefined) {
          this.allServiciosUnidad.map(su => {
            su.isSelected = this.grupoSelected.serviciosUnidadSinPaquete.some(susp => susp.idServicioUnidad == su.idServicioUnidad);
            if (su.isSelected) {
              this.serviciosUnidadSelected.push(JSON.parse(JSON.stringify(su)));

            }
          });
        }
      });
  }

  onSelectServiciosUnidad(evento) {
    const selected = evento.selected as ServicioUnidad[];
    const lastItemSelected = selected[selected.length - 1];
    lastItemSelected.isSelected = true;
    let aux = [];
    if (this.serviciosUnidadSelected.length > 0) {
      aux = [...this.serviciosUnidadSelected
        .slice(0, this.serviciosUnidadSelected.length - 1)];
    }
    const itemsExists = aux.filter(su => su.idServicioUnidad == lastItemSelected.idServicioUnidad).length > 0;
    if (itemsExists) {
      this.serviciosUnidadSelected = this.serviciosUnidadSelected.filter(su => su.idServicioUnidad != lastItemSelected.idServicioUnidad);
    } else {
      aux.push(lastItemSelected);
      this.serviciosUnidadSelected = aux;
    }
  }

  cancelar() {
    this.activeModal.close(false);
  }

  guardarServiciosUnidad(tipoMovimiento) {
  
    if (this.modalGestoria) {
      const serviciosUnidadPorGuardar = [];

      this.serviciosUnidadSelected.forEach(element => {
          const servicioUnidad = {
            idCotizacion: this.cotizacion.idCotizacion,
            idGrupoUnidad: this.idGrupoUnidad,
            idDetalleUnidad: this.idDetalleUnidad,
            idEncPaqueteServicioUnidad: null,
            idServicioUnidad: element.idServicioUnidad,
            catalogo: this.catalogoSelected.idUnidadBpro,
            anio: this.anioSelected,
            nombre: element.nombre,
            descripcion: element.descripcion,
            costo: element.costo,
            precio: element.precio,
            tipoMovimiento,
            idUsuarioModificacion: 0,
            fechaModificacion: new Date()
          } as ServicioUnidadSinPaqueteUnidad;
          serviciosUnidadPorGuardar.push(servicioUnidad);
      });

      this.pricingService.saveCotizacionUnidadServicioMovs(this.cotizacion.idCotizacion,
        this.idGrupoUnidad, this.idDetalleUnidad, serviciosUnidadPorGuardar).subscribe(() => {
          this.activeModal.close(true);
        }, (httpError) => {
          const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
          this.toastrService.error(message, 'Servicios');
        });


    } else {
      const serviciosUnidadPorGuardar = [];
      if (this.grupoSelected != undefined) {
        this.serviciosUnidadSelected.map(sus => {
          const servicioUnidad = {
            idCotizacion: this.cotizacion.idCotizacion,
            idGrupoUnidad: this.idGrupoUnidad,
            idServicioUnidad: sus.idServicioUnidad,
            catalogo: this.catalogoSelected.idUnidadBpro,
            anio: this.anioSelected,
            nombre: sus.nombre,
            descripcion: sus.descripcion,
            costo: sus.costo,
            precio: sus.precio,
            idUsuarioModificacion: 0,
            fechaModificacion: new Date()
          } as ServicioUnidadSinPaquete;
          serviciosUnidadPorGuardar.push(servicioUnidad);
        });
      } else {
        this.cotizacion.gruposUnidades.map(g => {
          this.serviciosUnidadSelected.map(sus => {
            const servicioUnidad = {
              idCotizacion: this.cotizacion.idCotizacion,
              idGrupoUnidad: g.idGrupoUnidad,
              idServicioUnidad: sus.idServicioUnidad,
              catalogo: this.catalogoSelected.idUnidadBpro,
              anio: this.anioSelected,
              nombre: sus.nombre,
              descripcion: sus.descripcion,
              costo: sus.costo,
              precio: sus.precio,
              idUsuarioModificacion: 0,
              fechaModificacion: new Date()
            } as ServicioUnidadSinPaquete;
            serviciosUnidadPorGuardar.push(servicioUnidad);
          });
        });
      }
      this.pricingService.saveCotizacionGrupoServiciosUnidadSinPaquete(serviciosUnidadPorGuardar).subscribe(() => {
        this.activeModal.close(true);
      }, (httpError) => {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
        this.toastrService.error(message, 'Órdenes de Servicio');
      });
    }
  }

  updateFilter() {
    this.serviciosUnidadSinPaqueteGrupoFiltrados = this.serviciosUnidadSinPaqueteGrupo.filter((suspg) => {
      return suspg.catalogo.toLowerCase().includes((this.searchCatalogo || '').toLowerCase()) &&
        suspg.anio.toLowerCase().includes((this.searchAnio || '').toLowerCase()) &&
        suspg.nombre.toLowerCase().includes((this.searchNombre || '').toLowerCase()) &&
        (suspg.descripcion || '').toString().toLowerCase().includes((this.searchDescripcion || '').toLowerCase()) &&
        suspg.costo.toString().toLowerCase().includes((this.searchCosto || '').toLowerCase()) &&
        suspg.precio.toString().toLowerCase().includes((this.searchPrecio || '').toLowerCase());
    });
  }

  tabChanged(tabEvent: NgbTabChangeEvent) {
    this.activeId = tabEvent.nextId;
  }

  onSelectPaquete(paqueteServicioUnidad: PaqueteServicio) {
    paqueteServicioUnidad.isSelected = !paqueteServicioUnidad.isSelected;
    if (paqueteServicioUnidad.isSelected) {
      this.paquetesServicioUnidadSeleccionados.push(paqueteServicioUnidad);
    } else {
      this.paquetesServicioUnidadSeleccionados = this.paquetesServicioUnidadSeleccionados.filter(pts => {
        return pts.idEncPaqueteServicioUnidad != paqueteServicioUnidad.idEncPaqueteServicioUnidad;
      });
    }
  }

  guardarPaquetes(tipoMovimiento) {
    if (this.modalGestoria) {

      const serviciosPaquetesUnidadPorGuardar = [];

      this.paquetesServicioUnidadSeleccionados.forEach(element => {
        const servicioUnidad = {
          idCotizacion: this.cotizacion.idCotizacion,
          idGrupoUnidad: this.idGrupoUnidad,
          idDetalleUnidad: this.idDetalleUnidad,
          idEncPaqueteServicioUnidad: element.idEncPaqueteServicioUnidad,
          idServicioUnidad: '',
          catalogo: element.catalogo,
          anio: element.anio,
          nombre: element.nombre,
          descripcion: element.descripcion,
          costo: null,
          precio: element.precioTotal,
          tipoMovimiento,
          idUsuarioModificacion: 0,
          fechaModificacion: new Date()
        } as ServicioUnidadSinPaqueteUnidad;
        serviciosPaquetesUnidadPorGuardar.push(servicioUnidad);

      });

      this.pricingService.saveCotizacionUnidadServicioMovs(this.cotizacion.idCotizacion,
        this.idGrupoUnidad, this.idDetalleUnidad, serviciosPaquetesUnidadPorGuardar).subscribe(() => {
          this.activeModal.close(true);
        }, (httpError) => {
          const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
          this.toastrService.error(message, 'Servicios');
        });



    } else {
      const serviciosPaquetes = [];
      if (this.idGrupoUnidad != undefined) {
        serviciosPaquetes.push(this.pricingService.saveCotizacionGrupoServicioUnidad(
          this.cotizacion.idCotizacion,
          this.idGrupoUnidad,
          this.paquetesServicioUnidadSeleccionados));
      } else {
        this.cotizacion.gruposUnidades.map(g => {
          serviciosPaquetes.push(this.pricingService.saveCotizacionGrupoServicioUnidad(
            this.cotizacion.idCotizacion,
            g.idGrupoUnidad,
            this.paquetesServicioUnidadSeleccionados));
        });
      }
      forkJoin(serviciosPaquetes).subscribe(() => {
        this.activeModal.close(true);
      }, (httpError) => {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
        this.toastrService.error(message, 'Paquete de órdenes de servicio');
      });
    }
  }

}
