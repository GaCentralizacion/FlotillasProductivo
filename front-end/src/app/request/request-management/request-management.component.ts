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
  selector: 'app-request-management',
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.scss']
})
export class RequestManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  SelectionType = SelectionType;
  form: FormGroup;
  marcas: Marca[] = [];
  empresas: Empresa[] = [];
  sucursales: Sucursal[] = [];
  solicitudes = [];
  solicitudesFilter = [];
  groupSelected: any;

  solicitadas: number;


  @ViewChild('empresaNgSelect') public empresaNgSelect: NgSelectComponent;
  @ViewChild('sucursalNgSelect') public sucursalNgSelect: NgSelectComponent;
  @ViewChild(DireccionFlotillaSelectComponent) dirFlotillas: DireccionFlotillaSelectComponent;
  subscribeIdFlotila: any;
  currentIdFlotilla: any;
  indicadores: any;

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
    localStorage.removeItem('solicitud');
    localStorage.removeItem('idSolicitudCotizacion');
    this.getRequests();
    this.getIndicadores();
    this.getMarcas();
    this.initForm();
  }

  ngAfterViewInit() {
    this.currentIdFlotilla = this.dirFlotillas.direccionSelected.name;
  }

  getMarcas = () => {
    this.brandService.getBrands().subscribe((dataMarcas: Marca[]) => {
      this.marcas = dataMarcas;
      this.brandService.getBrandsExternal().subscribe((dataMarcasExternas: Marca[]) => {
        for (var a = 0; a < dataMarcasExternas.length; a++) {
          this.marcas.push(dataMarcasExternas[a])
        }
      });
    });
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
          this.brandService.getCompanyExternal(idMarca).subscribe((dataEmpresasExternas: Empresa[]) => {                       
            if(dataEmpresas.length == 0){
              this.empresas = dataEmpresasExternas
            }else{             
              for (var a = 0; a < dataEmpresasExternas.length; a++) {
                dataEmpresas.push(dataEmpresasExternas[a])
              }
              this.empresas = dataEmpresas;
            }           
          });
        });
      }
    });

    this.form.controls.idEmpresa.valueChanges.subscribe(empresa => {
      this.sucursales = [];
      this.sucursalNgSelect.clearModel();
      this.form.controls.idSucursal.setValue('');
      this.getSolicitudesFilter('empresa');
      if (empresa) {
        this.brandService.getBranchOffice(empresa).subscribe((dataSucursales: Sucursal[]) => {
          this.brandService.getBranchOfficeExternal(empresa).subscribe((dataSucursalesExternas: Sucursal[]) => {
            if(dataSucursales.length == 0){
              this.sucursales = dataSucursalesExternas
            }else{             
              for (var a = 0; a < dataSucursalesExternas.length; a++) {
                dataSucursales.push(dataSucursalesExternas[a])
              }
              this.sucursales = dataSucursales;
            }   
          });
        });
      }
    });

    this.form.controls.idSucursal.valueChanges.subscribe(idSucursal => {
      this.getSolicitudesFilter('sucursal');
    });
  }

  getRequests = () => {
    this.httpRequestService.get('solicitud/getSolicitudes').subscribe((res: any) => {
      this.solicitudes = res;
      this.solicitudesFilter = res;
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

  getIndicadores = () => {
    this.httpRequestService.get(`solicitud/getGestorSolicitudIndicadores`).subscribe((res: any) => {
      this.indicadores = res[0];
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

    this.httpRequestService.get(`solicitud/getGestorSolicitudIndicadores?idFlotilla=${this.currentIdFlotilla}&idMarca=${this.form.value.idMarca}&idEmpresa=${this.form.value.idEmpresa}&idSucursal=${this.form.value.idSucursal}`)
    .subscribe((res: any) => {
      this.indicadores = res[0];
    });

  }

  goToNewRequest = () => {
    this.router.navigate(['main/solicitud/nueva']);
  }

  onSelect = ($event: any) => {
    this.groupSelected = $event.selected[0];
  }


  goToEdit = () => {
    localStorage.setItem('solicitud', JSON.stringify(this.groupSelected));
    localStorage.setItem('idSolicitudCotizacion', this.groupSelected.idSolicitudCotizacion);
    this.router.navigate(['main/solicitud/nueva']);
  }

  deleteSolicitud = ($event: any) => {
    const rf = this.modalService.open(AlertComponentComponent, { size: 'sm' });
    rf.componentInstance.data = {
      title: 'Alerta, eliminar solicitud',
      message: 'Al eliminar la sol se eliminarán los pedidos y entregas configuradas.',
      msgOk: 'Eliminar',
      msgCancel: 'Cancelar'
    };
    rf.result.then((result) => {
      if (result) {
        this.httpRequestService.post('solicitud/deleteSolicitud', {
          idSolicitudCotizacion: $event.idSolicitudCotizacion
        }).subscribe((res: any) => {
          this.toastrService.success(`Se ha eliminado la solicitud de forma exitosa.`,
            'BORRADO EXITOSO');
          if (!res) {
            this.getRequests();
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.subscribeIdFlotila) {
      this.subscribeIdFlotila.unsubscribe();
    }
  }

}
