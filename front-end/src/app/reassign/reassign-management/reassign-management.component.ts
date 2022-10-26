import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SelectionType } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Empresa, Marca, Sucursal, UnidadBpro } from 'src/app/models';
import { BrandService, NewUnitsService } from 'src/app/services';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { AlertComponentComponent } from 'src/app/shared/alert-component/alert-component.component';
import { DireccionFlotillaSelectComponent } from 'src/app/shared/direccion-flotilla-select/direccion-flotilla-select.component';
import { DireccionFlotillasSelectService } from 'src/app/shared/direccion-flotilla-select/direccion-flotillas-select.service';

@Component({
  selector: 'app-reassign-management',
  templateUrl: './reassign-management.component.html',
  styleUrls: ['./reassign-management.component.scss']
})
export class ReassignManagementComponent implements OnInit {
  SelectionType = SelectionType;
  form: FormGroup;
  marcas: Marca[] = [];
  empresas: Empresa[] = [];
  sucursales: Sucursal[] = [];
  solicitudes = [];
  solicitudesFilter = [];
  groupSelected: any;

  solicitudCotizacion: any;
  idSolicitudCotizacion: number;

  vehiculos = [];
  

  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  @ViewChild(DireccionFlotillaSelectComponent) dirFlotillas: DireccionFlotillaSelectComponent;
  subscribeIdFlotila: any;
  currentIdFlotilla: any;

  constructor(private router: Router,
    private httpRequestService: HttpRequestService,
    private modalService: NgbModal,
    private newUnitsService: NewUnitsService,
    private brandService: BrandService,
    private direccionFlotillasSelectServices: DireccionFlotillasSelectService,
    private toastrService: ToastrService,
    config: NgbModalConfig,) {
      config.backdrop = 'static';
      config.keyboard = false;
    }

    ngOnInit() {
      localStorage.removeItem('reasignacion');
      localStorage.removeItem('idSolicitudCotizacion');      
      this.getMarcas();
      this.getRequests();
      this.initForm();    
    }

    getRequests = () => {
      this.httpRequestService.get('solicitud/getReasignacion').subscribe((res: any) => {
        this.vehiculos = res;
        this.subscribeIdFlotila = this.direccionFlotillasSelectServices.isSelected.subscribe(dirFlotilla => {
          if (dirFlotilla) {
            this.currentIdFlotilla = dirFlotilla;
            this.form.controls.idMarca.setValue('');
            this.form.controls.idEmpresa.setValue('');
            this.form.controls.idSucursal.setValue('');
            this.getSolicitudesFilter('flotilla');
          }
        });
      });
    }  

    goToNewRequest = () => {
      localStorage.setItem('reasignacion', JSON.stringify(this.groupSelected));
      this.router.navigate(['main/reasignacion/reasigna']);
    }
  
    onSelect = ($event: any) => {
      this.groupSelected = $event.selected[0];
    }

   
    getMarcas = () => {
      this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => {
        this.marcas = dataMarcas;
      });
    }

    getSolicitudesFilter = (filter: string) => {
      switch (filter) {
        case 'flotilla':
          this.solicitudesFilter = this.solicitudes.filter(s => {
            return s.idDireccionFlotillas == this.currentIdFlotilla;
          });
          break;
        case 'marca':
          this.solicitudesFilter = this.solicitudes.filter(s => {
            return s.idDireccionFlotillas == this.currentIdFlotilla
              && s.idMarca == this.form.value.idMarca;
          });
          break;
        case 'empresa':
          this.solicitudesFilter = this.solicitudes.filter(s => {
            return s.idDireccionFlotillas == this.currentIdFlotilla
              && s.idMarca == this.form.value.idMarca
              && s.idEmpresa == this.form.value.idEmpresa
          });
          break;
          case 'sucursal':
            this.solicitudesFilter = this.solicitudes.filter(s => {
              return s.idDireccionFlotillas == this.currentIdFlotilla
                && s.idMarca == this.form.value.idMarca
                && s.idEmpresa == this.form.value.idEmpresa
                && s.idSucursal == this.form.value.idSucursal
            });
            break;
      }
  
    }

    initForm = () => {
      this.form = new FormGroup({
        idMarca: new FormControl('', [Validators.required]),
        idEmpresa: new FormControl('', [Validators.required]),
        idSucursal: new FormControl('', [Validators.required]),
      });
  
      this.form.controls.idMarca.valueChanges.subscribe(idMarca => {
        if (idMarca) {
          this.empresas = [];
          this.sucursales = [];
          this.empresaNgSelect.clearModel();
          this.sucursalNgSelect.clearModel();
          this.form.controls.idEmpresa.setValue('');
          this.form.controls.idSucursal.setValue('');
          this.getSolicitudesFilter('marca');
          this.brandService.getCompany(idMarca).subscribe((dataEmpresas: Empresa[]) => {
            this.empresas = dataEmpresas;
          });
        }
      });
    }


  
}