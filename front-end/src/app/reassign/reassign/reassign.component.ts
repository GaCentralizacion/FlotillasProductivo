import { AlertComponentComponent } from './../../shared/alert-component/alert-component.component';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SelectionType } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Empresa, Marca, Sucursal } from 'src/app/models';
import { BrandService, ClientCatalogService } from 'src/app/services';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { DireccionFlotillaSelectComponent } from 'src/app/shared/direccion-flotilla-select/direccion-flotilla-select.component';
import { DireccionFlotillasSelectService } from 'src/app/shared/direccion-flotilla-select/direccion-flotillas-select.service';
import { ReassignFormModalComponent } from '../reassign-form-modal/reassign-form-modal.component';


@Component({
    selector: 'app-reassign',
    templateUrl: './reassign.component.html',
    styleUrls: ['./reassign.component.scss']
  })
  export class ReassignComponent implements OnInit, OnDestroy {
    isLoading: boolean;
    form: FormGroup;
    marcas: Marca[] = [];
    isLoadingCliente = false;
    isLoadingClienteFinal = false;
    subscribeIdFlotila: any;
    solicitudCotizacion: any;
    idSolicitudCotizacion: number;
    showForm: boolean;
    currentIdFlotilla = '';
    SelectionType = SelectionType;
    empresas: Empresa[] = [];
    sucursales: Sucursal[] = [];
    solicitudes = [];
    solicitudesFilter = [];
    groupSelected: any;
    solicitudGrupo: any;

    
    VinesSelected=[];
    vehiculos = [];
    paqueteModal:any;


    @ViewChild('tabset') public tabset: any;
    @ViewChild('clienteNgSelect') public clienteNgSelect: NgSelectComponent;
    @ViewChild('filtroNgSelect') public filtroNgSelect: NgSelectComponent;
    @ViewChild('clienteFinalSelected') public clienteFinalSelected: NgSelectComponent;
    @ViewChild('clienteFacturarSelected') public clienteFacturarSelected: NgSelectComponent;
    @ViewChild(DireccionFlotillaSelectComponent) dirFlotillas: DireccionFlotillaSelectComponent;
  
    


    constructor(private modalService: NgbModal,
      private cliCatalogoService: ClientCatalogService,
      private brandService: BrandService,
      private direccionFlotillasSelectServices: DireccionFlotillasSelectService,
      private httpRequestService: HttpRequestService,
      config: NgbModalConfig,
      private router: Router,
      private toastrService: ToastrService,) {
        config.backdrop = 'static';
        config.keyboard = false;
      }
    
    ngOnInit() {
      this.solicitudGrupo = JSON.parse(localStorage.getItem('reasignacion'));  
      this.getRequests();
      // this.initForm();
      // this.clearForm();

        this.subscribeIdFlotila = this.direccionFlotillasSelectServices.isSelected.subscribe(dirFlotilla => {
          if (dirFlotilla) {
            this.currentIdFlotilla = dirFlotilla;
            localStorage.setItem('idFlotilla', dirFlotilla);
            this.clearForm();
            if (this.solicitudCotizacion) {
              this.getMarcas();
            }
          }
        });

    }

    getRequests = () => {
      this.httpRequestService.get(`solicitud/getReasignacionDetalle?vinesXml=""&idMarca=${this.solicitudGrupo.idMarca}&catalogo=${this.solicitudGrupo.catalogo}&anio=${this.solicitudGrupo.anio}&versionUnidad=${this.solicitudGrupo.version}`).subscribe((res: any) => {
        this.vehiculos = res;
        this.subscribeIdFlotila = this.direccionFlotillasSelectServices.isSelected.subscribe(dirFlotilla => {
          if (dirFlotilla) {
            this.currentIdFlotilla = dirFlotilla;
            this.form.controls.idVin.setValue('');
            // this.getSolicitudesFilter('flotilla');
          }
        });
      });
    }  

    clearForm = () => {
      if (this.clienteNgSelect) {
        this.clienteNgSelect.clearModel();
        this.clienteFinalSelected.clearModel();
        this.clienteFacturarSelected.clearModel();
      }
    }

    ngOnDestroy() {
        this.subscribeIdFlotila.unsubscribe();
    }

    getMarcas = () => {
      this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => {
        this.marcas = dataMarcas;
          if (this.solicitudCotizacion) {
            this.form.controls.idMarca.setValue(this.solicitudCotizacion.idMarca);
          }
      });
    }

    addReasigna= () => {
    this.paqueteModal = this.modalService.open(ReassignFormModalComponent, { size: 'lg' });
    this.paqueteModal.componentInstance.vines = this.VinesSelected
    this.paqueteModal.componentInstance.idSolCot = this.idSolicitudCotizacion
    }

    onSelect(event) {
      this.VinesSelected=[];
      if (event.selected){
        event.selected.forEach(element => {
          this.VinesSelected.push({"VIN":element.vin,"idSolicitudCotizacion":element.idSolicitudCotizacion})
        });
      }
    }

    getSolicitudCotizacionVehiculos = () => {
      this.httpRequestService.get('solicitud/getSolicitudCotizacionVehiculo?idSolicitudCotizacion=' + this.idSolicitudCotizacion).subscribe((data: any[]) => {
        this.vehiculos = data.map(v => {
          v.idCatalogo = v.catalogo;
          v.version = v.versionUnidad;
          v.nombreColorInt = v.colorInterior;
          v.nombreColorExt = v.colorExterior;
          v.modeloNombre = v.modelo;
          return v;
        });
      });
    }

    onActivate (event) {
      if (event.type === 'click') {
          event.rowElement.querySelector('[type="checkbox"]').dispatchEvent(new Event('click'));
      }
    }
  }
