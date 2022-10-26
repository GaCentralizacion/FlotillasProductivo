import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Cotizacion, TramiteSinPaquete, TramiteUnidad, Tramite, Subtramite, ProveedorAdicional, GrupoUnidades, PaqueteTramite } from '../../../models';
import { NgbActiveModal, NgbTabChangeEvent, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TramiteCatalogService, PricingService } from '../../../services';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-agregar-editar-tramites-grupal',
  templateUrl: './agregar-editar-tramites-grupal.component.html',
  styleUrls: ['./agregar-editar-tramites-grupal.component.scss']
})
export class AgregarEditarTramitesGrupalComponent implements OnInit {

  @Input() cotizacion: Cotizacion;
  @Input() idGrupoUnidad: number;
  @Input() modalGestoria: boolean;
  @Input() idDetalleUnidad: number;

  @ViewChild('subtramiteNgSelect') subtramiteNgSelect: NgSelectComponent;

  tramitesSinPaqueteGrupo: TramiteSinPaquete[];
  tramitesSinPaqueteGrupoFiltrados: TramiteSinPaquete[];
  searchTramite = '';
  searchSubtramite = '';
  searchProveedor = '';
  searchCosto = '';
  searchPrecio = '';
  paquetesTramites: PaqueteTramite[];
  paquetesTramitesSeleccionados: PaqueteTramite[] = [];
  tramites: Tramite[];
  tramiteSelected: Tramite;
  subtramites: Subtramite[];
  subtramiteSelected: Subtramite;
  proveedores: ProveedorAdicional[];
  proveedoresSelected: ProveedorAdicional[] = [];
  grupoSelected: GrupoUnidades;
  activeId = 'tramites';
  precioEditado = 0;
  costoEditado = 0;

  paquetesI = [];
  guardaTramite = false;
  msg = '';
  closeResult = '';
  modalValida: any;

  constructor(private activeModal: NgbActiveModal,
    private tramitesService: TramiteCatalogService,
    private pricingService: PricingService,
    private toastrService: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit() {

    if (this.idGrupoUnidad != undefined) {
      //OCT99 GESTION
      //this.pricingService.getAdicionalesCierrebyIdCotizacionGrupoUnidad(this.cotizacion.idCotizacion,this.idGrupoUnidad).subscribe((adicionales: any) => { 
      this.pricingService.getAdicionalesGestionbyGrupal(this.cotizacion.idCotizacion, this.idGrupoUnidad).subscribe((adicionales: any) => {
        this.grupoSelected = this.cotizacion.gruposUnidades.find((gu) => {
          return gu.idGrupoUnidad == this.idGrupoUnidad;
        });
        //OCT99
        this.grupoSelected.tramitesSinPaquete = adicionales[1];
        this.tramitesSinPaqueteGrupo = [];
        this.tramitesSinPaqueteGrupoFiltrados = [];
        this.grupoSelected.tramitesSinPaquete.map(tsp => {
          this.tramitesSinPaqueteGrupo.push(Object.assign(new TramiteSinPaquete(), tsp));
          this.tramitesSinPaqueteGrupoFiltrados.push(Object.assign(new TramiteSinPaquete(), tsp));
        });
      });
    }
    this.tramitesService.getTramites(this.cotizacion.idMarca, this.cotizacion.idSucursal).subscribe((tramites: Tramite[]) => {
      this.tramites = tramites;
    });
    this.tramitesService.getPaquetesTramite(this.cotizacion.idSucursal).subscribe((paquetesTramites: PaqueteTramite[]) => {
      this.paquetesTramites = [];
      console.log(paquetesTramites);
      paquetesTramites.map(pt => {
        const paqueteTramite = Object.assign(new PaqueteTramite(), pt);
        if (this.grupoSelected != undefined) {
          /*
          paqueteTramite.isSelected = this.grupoSelected.paquetesTramites
            .some(gpt => gpt.idEncPaqueteTramite == paqueteTramite.idEncPaqueteTramite);
          if (paqueteTramite.isSelected) {            
            this.paquetesTramitesSeleccionados.push(paqueteTramite);
            this.paquetesI.push(paqueteTramite);
          }
          */
        }
        this.paquetesTramites.push(paqueteTramite);
      });
    });

  }

  tramiteOnChange(tramite: Tramite) {
    this.tramiteSelected = tramite;
    this.subtramiteNgSelect.clearModel();
    this.proveedores = [];
    if (tramite != undefined) {
      this.tramitesService.getSubtramites(this.cotizacion.idMarca,
        this.cotizacion.idSucursal,
        this.tramiteSelected.idTramite).subscribe((subtramites: Subtramite[]) => {
          this.subtramites = subtramites;
        });
    }
  }

  subtramiteOnChange(subtramite: Subtramite) {
    this.subtramiteSelected = subtramite;
    this.proveedores = [];
    if (subtramite != undefined) {
      this.tramitesService.getProveedorSubtramite(this.cotizacion.idMarca,
        this.cotizacion.idSucursal,
        this.subtramiteSelected.idSubtramite).subscribe((proveedores: ProveedorAdicional[]) => {
          this.proveedores = proveedores;
          this.proveedoresSelected = [];
          this.precioEditado = this.proveedores[0].precio;
          this.costoEditado = this.proveedores[0].costo;
        });
    }
  }

  cancelar() {
    this.activeModal.close(false);
  }

  guardarTramites(tipoMovimiento,tramiteValida) {

    if (this.costoEditado == 0 || this.costoEditado == null || this.costoEditado == undefined) {
      this.toastrService.warning(`Debe capturar un costo diferente de 0.`, `Validación de Tramite`);
      return true;
    }

    if (this.modalGestoria) {

      let previo = this.tramitesSinPaqueteGrupoFiltrados.filter(item =>
        item.idTramite === this.tramiteSelected.idTramite.toString() &&
        item.idSubtramite === this.subtramiteSelected.idSubtramite.toString());

      if (previo.length > 0) {

        let previo2 = this.tramitesSinPaqueteGrupoFiltrados.filter(item => item.precio === this.precioEditado);
        if (previo2.length > 0) {
          this.msg = 'El tramite ya existe con el mismo precio. No se puede agregar.';
          this.guardaTramite = false;
        }
        else {
          this.msg = 'El tramite ya existe con diferente precio. Desea agregarlo?';
          this.guardaTramite = true;          
        }
        this.modalValida = this.modalService.open(tramiteValida, { size: 'sm'});
      }
      else{
        this.guardarTramite();
      }

      /*  
      const tramites = [];
      const tramiteUnico = {
        idCotizacion: this.cotizacion.idCotizacion,
        idGrupoUnidad: this.idGrupoUnidad,
        idDetalleUnidad: 0,//this.idDetalleUnidad,
        idEncPaqueteTramite: 0,
        idTramite: this.tramiteSelected.idTramite.toString(),
        idSubtramite: this.subtramiteSelected.idSubtramite.toString(),
        idProveedor: this.proveedoresSelected[0].idProveedor,
        nombreTramite: this.tramiteSelected.nombre,
        nombreSubtramite: this.subtramiteSelected.nombre,
        nombreProveedor: this.proveedoresSelected[0].nombreCompleto,
        costo: this.proveedoresSelected[0].costo,
        precio: this.precioEditado,//this.proveedoresSelected[0].precio,
        tipoMovimiento: 'B',
        idUsuarioModificacion: 0,
        fechaModificacion: new Date(),
      } as TramiteUnidad;
      tramites.push(tramiteUnico);
  
      this.pricingService.saveCotizacionUnidadTramiteGrupal(this.cotizacion.idCotizacion,
        this.idGrupoUnidad, this.idDetalleUnidad, tramites).subscribe(() => {
          this.activeModal.close(true);
        }, (httpError) => {
          const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
          this.toastrService.error(message, 'Trámites y Gestión');
        });
        */

    } else {

      const tramitesPorGuardar = [];
      if (this.grupoSelected != undefined) {
        const tramiteUnico = {
          idCotizacion: this.cotizacion.idCotizacion,
          idGrupoUnidad: this.idGrupoUnidad,
          idTramite: this.tramiteSelected.idTramite.toString(),
          idSubtramite: this.subtramiteSelected.idSubtramite.toString(),
          idProveedor: this.proveedoresSelected[0].idProveedor,
          nombreTramite: this.tramiteSelected.nombre,
          nombreSubtramite: this.subtramiteSelected.nombre,
          nombreProveedor: this.proveedoresSelected[0].nombreCompleto,
          costo: this.costoEditado,//this.proveedoresSelected[0].costo,
          precio: this.precioEditado,//this.proveedoresSelected[0].precio,
          idUsuarioModificacion: 0,
          fechaModificacion: new Date(),
        } as TramiteSinPaquete;
        tramitesPorGuardar.push(tramiteUnico);
      } else {
        this.cotizacion.gruposUnidades.map(g => {
          const tramite = {
            idCotizacion: this.cotizacion.idCotizacion,
            idGrupoUnidad: g.idGrupoUnidad,
            idTramite: this.tramiteSelected.idTramite.toString(),
            idSubtramite: this.subtramiteSelected.idSubtramite.toString(),
            idProveedor: this.proveedoresSelected[0].idProveedor,
            nombreTramite: this.tramiteSelected.nombre,
            nombreSubtramite: this.subtramiteSelected.nombre,
            nombreProveedor: this.proveedoresSelected[0].nombreCompleto,
            costo: this.costoEditado,//this.proveedoresSelected[0].costo,
            precio: this.precioEditado,//this.proveedoresSelected[0].precio,
            idUsuarioModificacion: 0,
            fechaModificacion: new Date(),
          } as TramiteSinPaquete;
          tramitesPorGuardar.push(tramite);
        });
      }
      /*
      this.pricingService.saveCotizacionGrupoTramiteSinPaquete(tramitesPorGuardar).subscribe(() => {
        this.activeModal.close(true);
      }, (httpError) => {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
        this.toastrService.error(message, 'Trámites y Gestión');
      });
      */
    }
  }

  guardarTramite(){
    const tramites = [];
      const tramiteUnico = {
        idCotizacion: this.cotizacion.idCotizacion,
        idGrupoUnidad: this.idGrupoUnidad,
        idDetalleUnidad: 0,//this.idDetalleUnidad,
        idEncPaqueteTramite: 0,
        idTramite: this.tramiteSelected.idTramite.toString(),
        idSubtramite: this.subtramiteSelected.idSubtramite.toString(),
        idProveedor: this.proveedoresSelected[0].idProveedor,
        nombreTramite: this.tramiteSelected.nombre,
        nombreSubtramite: this.subtramiteSelected.nombre,
        nombreProveedor: this.proveedoresSelected[0].nombreCompleto,
        costo: this.costoEditado,//this.proveedoresSelected[0].costo,
        precio: this.precioEditado,//this.proveedoresSelected[0].precio,
        tipoMovimiento: 'B',
        idUsuarioModificacion: 0,
        fechaModificacion: new Date(),
      } as TramiteUnidad;
      tramites.push(tramiteUnico);
  
      this.pricingService.saveCotizacionUnidadTramiteGrupal(this.cotizacion.idCotizacion,
        this.idGrupoUnidad, this.idDetalleUnidad, tramites).subscribe(() => {
          if(this.guardaTramite)
            this.modalValida.close(true);

          this.activeModal.close(true);
        }, (httpError) => {
          const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
          this.toastrService.error(message, 'Trámites y Gestión');
        });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  updateFilter() {
    this.tramitesSinPaqueteGrupoFiltrados = this.tramitesSinPaqueteGrupo.filter((tsp) => {
      return tsp.nombreTramite.toLowerCase().includes((this.searchTramite || '').toLowerCase()) &&
        tsp.nombreSubtramite.toLowerCase().includes((this.searchSubtramite || '').toLowerCase()) &&
        tsp.nombreProveedor.toLowerCase().includes((this.searchProveedor || '').toLowerCase()) &&
        tsp.costo.toString().toLowerCase().includes((this.searchCosto || '').toLowerCase()) &&
        tsp.precio.toString().toLowerCase().includes((this.searchPrecio || '').toLowerCase());
    });
  }

  tabChanged(tabEvent: NgbTabChangeEvent) {
    this.activeId = tabEvent.nextId;
  }

  onSelectPaquete(paqueteTramites: PaqueteTramite) {
    paqueteTramites.isSelected = !paqueteTramites.isSelected;
    if (paqueteTramites.isSelected) {
      this.paquetesTramitesSeleccionados.push(paqueteTramites);
    } else {
      this.paquetesTramitesSeleccionados = this.paquetesTramitesSeleccionados.filter(pts => {
        return pts.idEncPaqueteTramite != paqueteTramites.idEncPaqueteTramite;
      });
    }
  }

  guardarPaquetes(tipoMovimiento) {
    if (this.modalGestoria) {
      const tramites = [];

      const idsEncPaqueteTramites = this.paquetesI.map(m => m.idEncPaqueteTramite);
      const paquetesTramitesNuevos = this.paquetesTramitesSeleccionados.filter(f => !idsEncPaqueteTramites.includes(f.idEncPaqueteTramite));


      paquetesTramitesNuevos.forEach(element => {
        const tramitePaquete = {
          idCotizacion: this.cotizacion.idCotizacion,
          idGrupoUnidad: this.idGrupoUnidad,
          idDetalleUnidad: this.idDetalleUnidad,
          idEncPaqueteTramite: element.idEncPaqueteTramite,
          idTramite: element.tramites[0].idTramite,
          idSubtramite: '',
          idProveedor: element.tramites[0].idProveedor,
          nombreTramite: element.nombre,
          nombreSubtramite: '',
          nombreProveedor: element.tramites[0].nombreProveedor,
          costo: 0,
          precio: element.precioTotal,
          tipoMovimiento,
          idUsuarioModificacion: 0,
          fechaModificacion: new Date(),
        } as TramiteUnidad;
        tramites.push(tramitePaquete);
      });

      this.pricingService.saveCotizacionUnidadTramiteMovs(this.cotizacion.idCotizacion,
        this.idGrupoUnidad, this.idDetalleUnidad, tramites).subscribe(() => {
          this.activeModal.close(true);
        }, (httpError) => {
          const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
          this.toastrService.error(message, 'Trámites y Gestión');
        });


    } else {
      const serviciosPaquetes = [];
      if (this.idGrupoUnidad != undefined) {
        serviciosPaquetes.push(this.pricingService.saveCotizacionGrupoTramite(
          this.cotizacion.idCotizacion,
          this.idGrupoUnidad,
          this.paquetesTramitesSeleccionados));
      } else {
        this.cotizacion.gruposUnidades.map(g => {
          serviciosPaquetes.push(this.pricingService.saveCotizacionGrupoTramite(
            this.cotizacion.idCotizacion,
            g.idGrupoUnidad,
            this.paquetesTramitesSeleccionados));
        });
      }
      forkJoin(serviciosPaquetes).subscribe(() => {
        this.activeModal.close(true);
      }, (httpError) => {
        const message = typeof httpError.error === 'object' ? JSON.stringify(httpError.error) : httpError.error;
        this.toastrService.error(message, 'Paquete de trámites');
      });
    }
  }

}
