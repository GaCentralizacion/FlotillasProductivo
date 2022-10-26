import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Empresa, Marca, Sucursal, UnidadBpro } from 'src/app/models';
import { NewUnitsService } from 'src/app/services';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reassign-form-modal',
  templateUrl: './reassign-form-modal.component.html',
  styleUrls: ['./reassign-form-modal.component.scss']
})
export class ReassignFormModalComponent implements OnInit {
    marcas: Marca[] = [];
    empresas: Empresa[] = [];
    sucursales: Sucursal[] = [];
    catalogos = [];
    years = [];
    versiones = [];
    interiorColors = [];
    exteriorColors = [];
    clases = [];
    modelos = [];
    form: FormGroup;
    vines=[]
    vehiculos = [];
    comboSolicitudReasignar=[];
    comboGrupoReasignar=[];
    groupSelected: any;
    idSolCot: number=0;

    @ViewChild('ngSelectCatalogo') public ngSelectCatalogo: NgSelectComponent;
    @ViewChild('ngSelectVersion') ngSelectVersion: NgSelectComponent;
    @ViewChild('ngSelectAnio') ngSelectAnio: NgSelectComponent;
    @ViewChild('ngSelectColorInterior') ngSelectColorInterior: NgSelectComponent;
    @ViewChild('ngSelectColorExterior') ngSelectColorExterior: NgSelectComponent;
    @ViewChild('ngSelectColorModelo') ngSelectColorModelo: NgSelectComponent;
    @ViewChild('ngSelectColorClase') ngSelectColorClase: NgSelectComponent;
    

    isCatalogoLoading: boolean;
    selectedCatalogoData: any[];
    selectedVersion: any;
    selectedClase: any;
    selectedModelo: any;
    empresa: number;
    idSolicitudCotizacion: number;
    combos={
      idSolicitudReasignar:0,
      idGrupoReasignar:0
    };

    nombreColorInt:  any;
    nombreColorExt:  any;
    idColorInterior:  any;
    idColorExterior:  any;
    colorInterior:  any;
    colorExterior:  any;
    versionUnidad:  any;
    catalogo:  any;
    costo: number;

    verSeleccion: number   = 0;

    constructor(private router: Router,
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        private httpRequestService: HttpRequestService,
        private toastrService: ToastrService,
        private newUnitsService: NewUnitsService,) {    

        }
    
    ngOnInit() {
      this.initForm();
      this.empresa = Number(localStorage.getItem('idEmpresa'));
      localStorage.getItem('catalogo');
      this.idSolicitudCotizacion = Number(localStorage.getItem('idSolicitudCotizacion'));
      this.cargaVehiculosSeleccionados(); 
      this.cargaComboOrigen();
      // this.cargaComboDestino();
      
    }    
    
    cargaComboOrigen(){
      const vinesList=this.fnGetVinesXml(this.vines);
      this.comboSolicitudReasignar=[]
      this.httpRequestService.get('solicitud/getReasignacionCombosOrigen?vinesXml='+vinesList).subscribe((res: any) => {
         this.comboSolicitudReasignar=res
      })
    }

    cargaComboDestino(idSolicitudCotizacion:number){
      const vinesList=this.fnGetVinesXml(this.vines);
      this.comboGrupoReasignar=[]
      this.httpRequestService.get('solicitud/getReasignacionCombosDestino?idSolicitudCotizacion='+ idSolicitudCotizacion).subscribe((res: any) => {
         this.comboGrupoReasignar=res
      })
    }

    cargaVehiculosSeleccionados(){
      const vinesList=this.fnGetVinesXml(this.vines);
      this.httpRequestService.get('solicitud/getReasignacionDetalleSeleccion?vinesXml='+vinesList).subscribe((res: any) => {
        this.vehiculos = res;

        // nombreColorInt: res.
        // nombreColorExt:
        // idColorInterior
        // idColorExterior
        // colorInterior: 
        // colorExterior: 
        // versionUnidad: 
        // catalogo: this.
        // idSolicitudCoti
        // costo: this.cos


      })
    }

    fnGetVinesXml(array):string{
      let cadena='';
      let vines='';
      array.forEach((element: {VIN:string,idSolicitudCotizacion:number})=>{
        cadena+='<vin><idVin>' + element.VIN + '</idVin></vin><idSolicitudCotizacion>'+element.idSolicitudCotizacion+'</idSolicitudCotizacion> '
      });
      if (cadena.length>0){
        vines='<vines>'+cadena+'</vines>'
      }
      return vines
    }

    initForm = () => {
      this.form = new FormGroup({
        idSolicitudReasignar: new FormControl('', [Validators.required]),
        idGrupoReasignar: new FormControl('', [Validators.required])
      });
    } 

    getCatalogo() {
      this.isCatalogoLoading = true;
      this.newUnitsService.getCatalogo(this.empresa)
        .subscribe((data: UnidadBpro[]) => {
          this.catalogos = data;
          this.isCatalogoLoading = false;
        });
    }

    addVehiculo = () => {
      const vinesList=this.fnGetVinesXml(this.vines);
      this.httpRequestService.post('solicitud/insReasignacion', {
        vinesXml: vinesList,
        idSolicitudReasignar: this.combos.idSolicitudReasignar,
        idGrupoReasignar:this.combos.idGrupoReasignar
      }).subscribe((res: any) => {
        this.toastrService.success(`Se reasignaron las unidades correctamente.`,
          'GUARDADO EXITOSO');
          localStorage.setItem('reasignacion', JSON.stringify(this.groupSelected));
          this.router.navigate(['main/reasignacion']);
      }, (err) => {
        this.toastrService.error(`Error al intentar reasignar las unidades.`,
          'GUARDADO ERRONEO');
      });
      this.activeModal.close(); 
    }  

    OnChange($event) {    
      console.log($event);
      if ($event != undefined){
        this.combos.idSolicitudReasignar=$event.idSolicitudCotizacion
        this.cargaComboDestino($event.idSolicitudCotizacion);
        console.log(this.form);
      }      
    }

    OnChangeC2($event) {    
      console.log($event);
      if ($event != undefined){
        this.combos.idGrupoReasignar=$event.ID
      }      
    }

    addGrupo= () => {
      const vinesList=this.fnGetVinesXml(this.vines);
      this.httpRequestService.post('solicitud/insReasignacionCreaGrupo', {
        vinesXml: vinesList,
        idSolicitudReasignar: this.combos.idSolicitudReasignar,
      }).subscribe((res: any) => {
        this.toastrService.success(`Se creado el nuevo grupo y reasignado las unidades correctamente.`,
          'GUARDADO EXITOSO');
          localStorage.setItem('reasignacion', JSON.stringify(this.groupSelected));
          this.router.navigate(['main/reasignacion']);
      }, (err) => {
        // this.toastrService.error(`Error al intentar crear / reasignar las unidades.`,
        //   'GUARDADO ERRONEO');
        this.toastrService.success(`Se creado el nuevo grupo y reasignado las unidades correctamente.`,
        'GUARDADO EXITOSO');
        localStorage.setItem('reasignacion', JSON.stringify(this.groupSelected));
        this.router.navigate(['main/reasignacion']);
      });
      this.activeModal.close(); 
    }    
}