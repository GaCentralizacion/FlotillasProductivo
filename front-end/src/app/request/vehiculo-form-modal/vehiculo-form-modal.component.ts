import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Empresa, Marca, Sucursal, UnidadBpro } from 'src/app/models';
import { NewUnitsService } from 'src/app/services';
import { HttpRequestService } from 'src/app/services/http-request.service';

@Component({
  selector: 'app-vehiculo-form-modal',
  templateUrl: './vehiculo-form-modal.component.html',
  styleUrls: ['./vehiculo-form-modal.component.scss']
})
export class VehiculoFormModalComponent implements OnInit {
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
  formVehiculo: FormGroup;

  @ViewChild('ngSelectCatalogo') public ngSelectCatalogo: NgSelectComponent;
  @ViewChild('ngSelectVersion') ngSelectVersion: NgSelectComponent;
  @ViewChild('ngSelectAnio') ngSelectAnio: NgSelectComponent;
  // @ViewChild('ngSelectColorInterior') ngSelectColorInterior: NgSelectComponent;
  // @ViewChild('ngSelectColorExterior') ngSelectColorExterior: NgSelectComponent;
  @ViewChild('ngSelectColorModelo') ngSelectColorModelo: NgSelectComponent;
  @ViewChild('ngSelectColorClase') ngSelectColorClase: NgSelectComponent;

  isCatalogoLoading: boolean;
  selectedCatalogoData: any[];
  selectedVersion: any;
  selectedClase: any;
  selectedModelo: any;
  empresa: number;
  idSolicitudCotizacion: number;
  idSucursal: number;
  costoLista: number;

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private httpRequestService: HttpRequestService,
    private toastrService: ToastrService,
    private newUnitsService: NewUnitsService,) {

    }

  ngOnInit() {
    this.initForm();
    this.empresa = Number(localStorage.getItem('idEmpresa'));
    this.idSucursal= Number(localStorage.getItem('idSucursal'));
    this.idSolicitudCotizacion = Number(localStorage.getItem('idSolicitudCotizacion'));
    this.getCatalogo();
  }

  initForm = () => {
    this.formVehiculo = new FormGroup({
      idCatalogo: new FormControl('', [Validators.required]),
      anio: new FormControl('', [Validators.required]),
      version: new FormControl('', [Validators.required]),
      // interiorColor: new FormControl('', [Validators.required]),
      // exteriorColor: new FormControl('', [Validators.required]),
      clase: new FormControl('', [Validators.required]),
      modelo: new FormControl('', [Validators.required]),
      cantidad: new FormControl('', [Validators.required]),
      precioLista: new FormControl(0, [Validators.required]),
      requiereEquipamiento: new FormControl(false, [Validators.required]),
      observaciones: new FormControl('')
    });
  }

  getCatalogo() {
    this.isCatalogoLoading = true;
    this.newUnitsService.getCatalogo(this.empresa)
      .subscribe((data: UnidadBpro[]) => {
        //  this.catalogos = data;
        //  this.isCatalogoLoading = false;
        this.newUnitsService.getCatalogoExterno(this.empresa)
        .subscribe((dataExterno: UnidadBpro[]) => {                
          if(data.length == 0){
            this.catalogos = dataExterno
          }else{             
            for (var a = 0; a < dataExterno.length; a++) {
              data.push(dataExterno[a])
            }
            this.catalogos = data;
            this.isCatalogoLoading = false;
          } 
        });
      });
  }

  catalogoOnChange(catalogo: UnidadBpro): Promise<boolean> {
    this.ngSelectAnio.setDisabledState(true);
    this.clearAllSelects();

    return new Promise<boolean>((resolve, reject) => {
      if (catalogo == undefined) {
        resolve(false);
        return;
      }
      this.newUnitsService.getVersiones(this.empresa, catalogo.idUnidadBpro.replace('/', '%2F'))
        .subscribe((data: any[]) => {

          this.newUnitsService.getVersionesExterno(this.empresa, catalogo.idUnidadBpro.replace('/', '%2F'))
            .subscribe((dataExterno: any[]) => {
              const yearsNew = [] as any[];

              for (var a = 0; a < dataExterno.length; a++) {
                data.push(dataExterno[a])
              }
              data.forEach(dat => {
                yearsNew.push(dat.modelo);
              });
              this.selectedCatalogoData = data;

              this.years = [...yearsNew];
              this.ngSelectAnio.setDisabledState(false);
              resolve(true);
            });
        });
    });
  }

  clearAllSelects = () => {
    this.ngSelectColorModelo.handleClearClick();
    this.ngSelectColorClase.handleClearClick();
    this.ngSelectVersion.handleClearClick();
    this.ngSelectColorModelo.setDisabledState(true);
    this.ngSelectColorClase.setDisabledState(true);
    this.ngSelectVersion.setDisabledState(true);

    this.ngSelectAnio.clearModel();
    this.years = [];
    this.ngSelectVersion.clearModel();
    this.versiones = [];
    // this.ngSelectColorInterior.clearModel();
    // this.interiorColors = [];
    // this.ngSelectColorExterior.clearModel();
    // this.exteriorColors = [];
    this.ngSelectColorClase.clearModel();
    this.clases = [];
    this.ngSelectColorModelo.clearModel();
    this.modelos = [];


    this.formVehiculo.controls.version.setValue('');
    this.formVehiculo.controls.anio.setValue('');
    // this.formVehiculo.controls.interiorColor.setValue('');
    // this.formVehiculo.controls.exteriorColor.setValue('');
    this.formVehiculo.controls.clase.setValue('');
    this.formVehiculo.controls.modelo.setValue('');
    this.formVehiculo.controls.observaciones.setValue('');

  }

  yearOnChange(anio: string) {
    this.ngSelectVersion.setDisabledState(true);
    this.ngSelectColorModelo.setDisabledState(false);
    this.ngSelectColorClase.setDisabledState(false);

    return new Promise<boolean>((resolve, reject) => {

      if (anio == undefined) {
        resolve(false);
        return;
      }
      this.getPrecio(this.formVehiculo.value.anio);
      this.newUnitsService.getCostoCatalago(this.idSucursal + '', this.formVehiculo.value.idCatalogo.replace('/', '%2F'), anio).subscribe(res => {
        this.costoLista = Number(res[0].Costo);
      });
      // this.ngSelectColorInterior.clearModel();
      // this.formVehiculo.controls.interiorColor.setValue('');
      // this.ngSelectColorExterior.clearModel();
      // this.formVehiculo.controls.exteriorColor.setValue('');

      this.newUnitsService.getModelos(this.empresa, this.formVehiculo.value.idCatalogo, anio)
        .subscribe((data: any[]) => {

          this.newUnitsService.getModeloExterno(this.empresa, this.formVehiculo.value.idCatalogo, anio)
          .subscribe((dataExterno: any[]) => {            
            if(data[0].modelo == '0'){
              data.pop();
            this.newUnitsService.getCostoCatalagoExterno(this.empresa + '', this.formVehiculo.value.idCatalogo.replace('/', '%2F'), anio).subscribe(res => {
            this.costoLista = Number(res[0].Costo);
            });
            }
            if(dataExterno.length>0){      
              for (var a = 0; a < dataExterno.length; a++) {
                data.push(dataExterno[a])
              }
            }
           

          //--------------------------------
          const newDescs = [] as any[];
          
          const newDesc = { id: 1, nombre: data[0].descripcion };
          this.selectedVersion = data[0].descripcion;
          newDescs.push(newDesc);
          this.versiones = [...newDescs];
          setTimeout(() => {
            this.ngSelectVersion.select(this.ngSelectVersion.itemsList.items[0]);
          }, 500);

          const newClases = [] as any[];
          const newClase = { id: 1, nombre: data[0].clase };
          this.selectedClase = data[0].clase;
          newClases.push(newClase);
          this.clases = [...newClases];
          setTimeout(() => {
            this.ngSelectColorClase.select(this.ngSelectColorClase.itemsList.items[0]);
          }, 500);

          const newModelos = [] as any[];
          const newModelo = { id: 1, nombre: data[0].transmision };
          this.selectedModelo = data[0].transmision;
          newModelos.push(newModelo);
          this.modelos = [...newModelos];
          setTimeout(() => {
            this.ngSelectColorModelo.select(this.ngSelectColorModelo.itemsList.items[0]);
          }, 500);

          if (this.versiones.length > 1)
            this.ngSelectVersion.setDisabledState(false);

          this.ngSelectColorModelo.setDisabledState(true);
          this.ngSelectColorClase.setDisabledState(true);
          resolve(true);
        //--------------------------------

          })          
        });
      // forkJoin(
      //   // this.newUnitsService.getInterioresColors(this.empresa, this.formVehiculo.value.idCatalogo.replace('/', '%2F'), Number(anio)),
      //   // this.newUnitsService.getExteriorColors(this.empresa, this.formVehiculo.value.idCatalogo.replace('/', '%2F'), Number(anio))
      // ).subscribe((dataArray: any[]) => {
      //   this.ngSelectColorExterior.clearModel();
      //   this.formVehiculo.controls.exteriorColor.setValue('');
      //   this.interiorColors = dataArray[0].map(data => { data.fullLabel = data.nombre + ' - ' + data.idColor; return data; });
      //   this.exteriorColors = dataArray[1].map(data => { data.fullLabel = data.nombre + ' - ' + data.idColor; return data; });

      //   resolve(true);
      // });
    });
  }

  getPrecio = (anio: string) => {
    const precioLista = this.selectedCatalogoData.filter(catD => {
      return catD.modelo == anio;
    })[0].precioLista;
    this.formVehiculo.controls.precioLista.setValue(precioLista);
  }

  addVehiculo = () => {
    this.httpRequestService.post('solicitud/insertSolicitudGrupo', {
      ...this.formVehiculo.value,
      // nombreColorInt: this.interiorColors.find(c => c.idColor === this.formVehiculo.value.interiorColor).nombre,
      // nombreColorExt: this.exteriorColors.find(c => c.idColor === this.formVehiculo.value.exteriorColor).nombre,
      // idColorInterior: this.formVehiculo.value.interiorColor,
      // idColorExterior: this.formVehiculo.value.exteriorColor,
      // colorInterior: this.interiorColors.find(c => c.idColor === this.formVehiculo.value.interiorColor).nombre,
      // colorExterior: this.exteriorColors.find(c => c.idColor === this.formVehiculo.value.exteriorColor).nombre,
      versionUnidad: this.formVehiculo.value.version,
      catalogo: this.formVehiculo.value.idCatalogo,
      idSolicitudCotizacion: this.idSolicitudCotizacion,
      costo: this.costoLista,
      observaciones: this.formVehiculo.value.observaciones
    }).subscribe((res: any) => {
      this.toastrService.success(`Se ha guardado el vehiculo exitosamente.`,
        'GUARDADO EXITOSO');
        this.activeModal.close();
    });
  }

}
