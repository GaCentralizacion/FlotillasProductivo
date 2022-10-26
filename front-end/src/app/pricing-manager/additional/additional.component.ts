import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrupoUnidades, Cotizacion, Cfdi, TipoOrden, PaqueteAccesorios } from 'src/app/models';
import { PricingService, ClientCatalogService, AccesorioCatalogService } from 'src/app/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PricingManagerService } from '../pricing.manager.service';
import { AdditionalService } from './additional.service';
import { SelectionTabComponent } from './selection-tab/selection-tab.component';

//SISCO
import { SolicitudCotizacionSisco } from 'src/app/models/accesorio.model'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-additional',
  templateUrl: './additional.component.html',
  styleUrls: ['./additional.component.scss'],
  providers: [PricingManagerService]
})
export class AdditionalComponent implements OnInit {
  form1: FormGroup;
  idFlotilla: string;
  idUsuario: number;
  idCotizacion: string;
  idLicitacion: string;
  financiera: string;
  step: number;
  grupoUnidades: GrupoUnidades[];
  cotizacion: Cotizacion;
  lastCotizacion: Cotizacion;
  idTipoOrden: string;
  idCfdi: string;
  idCfdiAux: any
  idCfdiAdic: string;
  tipoOrden: TipoOrden[];
  cfdi: Cfdi;
  activo = true;
  curadio = {
    suma: true,
    nosuma: false
  };
  imprime = false;
  sumaType = 'Suma';
  //SISCO
  closeResult = '';
  mensajeValidacion = '';
  modalReference;
  srtTipoOrden = '';
  srtCFDI = '';
  enviandoSisco = false;

  ordenesSisco: any;

  @ViewChild('tipoOrdenNgSelect') public tipoOrdenNgSelect: NgSelectComponent;
  @ViewChild('cfdiNgSelect') public cfdiNgSelect: NgSelectComponent;
  @ViewChild(SelectionTabComponent) public tabs: SelectionTabComponent;
  isLoading = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private pricingService: PricingService,
    private toastrService: ToastrService,
    private catalogoService: ClientCatalogService,
    private modalService: NgbModal,
    public pricingManagerService: PricingManagerService,
    private additionalService: AdditionalService,
    private accesorioCatalogService: AccesorioCatalogService) {
    this.form1 = new FormGroup({
      tipoOrden: new FormControl(null, [Validators.required]),
      cfdi: new FormControl(null, [Validators.required])
    });
    this.additionalService.changeCotizacion.subscribe(item => {
      this.lastCotizacion = item;
    });
  }

  ngOnInit() {
    this.tipoOrden = [
      { idTipoOrden: 'FI', nombre: 'Facturacion Independiente' },
      { idTipoOrden: 'CU', nombre: 'Carga a la Factura' }
    ];
    this.getParams();
    this.getCotizacionesById();
    this.getCfdiCatalogo();

    // console.log('!this.activo=>', !this.activo)
    // console.log('this.pricingManagerService.onlyRead=>', this.pricingManagerService.onlyRead)
    // console.log('!this.idTipoOrden || (!this.idCfdi && this.idTipoOrden === FI)=>', !this.idTipoOrden || (!this.idCfdi && this.idTipoOrden === 'FI'))
    // console.log('this.hasAditional()=>', this.hasAditional())
    // console.log('disabled=>', !this.activo || this.pricingManagerService.onlyRead || ((!this.idTipoOrden || (!this.idCfdi && this.idTipoOrden === 'FI')) && this.hasAditional()))
  }

  changeValue() {
    this.imprime = !this.imprime;
    /*
    const request = {
      idCotizacion: this.cotizacion.idCotizacion,
      imprimeFactura: this.imprime
    };
    this.pricingService.actulizarImprimeFactura(request).subscribe(res => {});
    */

    // this.pricingService.updateCotizacionGruposTipoOrden(this.idCotizacion, this.idTipoOrden, (this.idCfdi === undefined) ? '99' : this.idCfdi, this.sumaType, this.imprime).subscribe(async (update) => {
    // this.tabs.actualizaGrupos();
    // });

  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      this.idFlotilla = params.idFlotilla;
      this.idCotizacion = params.idCotizacion;
      this.idLicitacion = params.idLicitacion;
      this.step = params.step;
    });
  }

  getCotizacionesById() {

    /*
    this.pricingService.getGrupoUnidadByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      console.log('cotizacion.grupoUnidades XXX: ');
      console.log(cotizacion.gruposUnidades);
    });
    */

    this.isLoading = true;
    //this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
    this.pricingService.getGrupoUnidadByIdCotizacion(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
      this.isLoading = false;
      if (cotizacion.status === 'EN PROCESO') {
        this.pricingManagerService.onlyRead = false;
      } else {
        this.pricingManagerService.onlyRead = true;
      }

      //OCT99 SOLO LECTURA
      if (this.pricingManagerService.perfilSoloLectura)
        this.pricingManagerService.onlyRead = true;

      cotizacion.gruposUnidades.map(grupoUnidad => {
        const paquetesAccesoriosAux = [];
        grupoUnidad.paquetesAccesorios.map(paqueteAccesorios => {
          paquetesAccesoriosAux.push(Object.assign(new PaqueteAccesorios(), paqueteAccesorios));
        });
        grupoUnidad.paquetesAccesorios = paquetesAccesoriosAux;

      });

      this.cotizacion = cotizacion;

      if (cotizacion.tipoCargoUnidad === 'NoSuma') {
        this.curadio.nosuma = true;
        this.curadio.suma = false;
      } else {
        this.curadio.nosuma = false;
        this.curadio.suma = true;
      }

      this.imprime = this.cotizacion.imprimeFactura;
      this.idCfdi = cotizacion.idCfdiAdicionales;
      this.idCfdiAux = cotizacion.idCfdiAdicionales;
      this.idTipoOrden = cotizacion.tipoOrden;

      if (this.idTipoOrden === 'CU')
        this.srtTipoOrden = 'Cargo a la factura';
      else
        this.srtTipoOrden = 'Facturación Independiente';

      if (cotizacion.tipoOrden === 'CU') {
        this.idCfdi = undefined;
        this.idCfdiAux = undefined;
        this.cfdiNgSelect.setDisabledState(true);

      }

      else if (cotizacion.tipoOrden === 'FI') {
        if (this.idCfdi == undefined) {
          this.idCfdi = {} as any;
          this.idCfdiAux = undefined;
        }
        console.log(this.idCfdi);
        this.cfdiNgSelect.setDisabledState(false);
      }
      this.financiera = this.cotizacion.nombreFinanciera;
    });
  }

  getCfdiCatalogo() {
    // this.catalogoService.getAllCFDI().subscribe((cfdi: Cfdi) => {
    //   this.cfdi = cfdi;
    this.pricingService
    .cfdiCliente('-1','-1','-1',this.idCotizacion)
      .subscribe((cfdi: Cfdi) => {
        this.cfdi = cfdi;

      var jsonArray = JSON.parse(JSON.stringify(cfdi));

      setTimeout(() => {
        jsonArray.filter(element => {
          if (element.idCfdi === this.idCfdi) {
            this.srtCFDI = element.nombre;
          }
        });
      }, 1000);

    });
  }

  tipoOrdenOnChange(tipoOrden: TipoOrden) {

    if (tipoOrden) {
      this.idTipoOrden = tipoOrden.idTipoOrden;
    }
    else {
      this.idTipoOrden = undefined;
    }

    this.pricingService.updateCotizacionGruposTipoOrden(this.idCotizacion, (this.idTipoOrden === undefined) ? '99' : this.idTipoOrden, '99', this.sumaType, this.imprime)
      .subscribe(async (update: any) => {
        if (update[0].Success === 0) {
          this.toastrService.warning(update[0].Mensaje);
        }
        else {
          this.tabs.actualizaGrupos();
        }

        // this.pricingService.updateCotizacionGruposTipoOrden(this.idCotizacion, (this.idTipoOrden === undefined) ? '99' : this.idTipoOrden, '99', this.sumaType, this.imprime).subscribe(async (update: any) => {
        //   if (update[0].Success === 0) {
        //     this.toastrService.warning(update[0].Mensaje);
        //   }
        //   else {
        //     this.tabs.actualizaGrupos();
        //   }
        // });

        if (tipoOrden.idTipoOrden === 'CU') {
          this.idCfdi = undefined;
          this.idCfdiAux = undefined;
          this.cfdiNgSelect.setDisabledState(true);
        } else {
          this.idCfdiAdic = this.idCfdi
          this.idCfdi = {} as any;
          this.idCfdiAux = undefined;
          this.cfdiNgSelect.setDisabledState(false);
        }
      });
  }

  cfdiOnChange(cfdi: Cfdi) {
    if (cfdi) {
      this.idCfdi = cfdi.idCfdi;
      this.idCfdiAux = cfdi.idCfdi;
    }
    else {
      this.idCfdi = undefined;
      this.idCfdiAux = undefined;
    }
    // this.pricingService.updateCotizacionGruposTipoOrden(this.idCotizacion, this.idTipoOrden, (this.idCfdi === undefined) ? '99' : this.idCfdi, this.sumaType, this.imprime).subscribe(async (update) => {
    //   this.tabs.actualizaGrupos();
    // });
  }

  private irATraslados() {
    this.router.navigate(['main/cotizaciones/manager/traslados'], {
      queryParams: {
        idFlotilla: this.idFlotilla,
        idLicitacion: this.idLicitacion,
        idCotizacion: this.idCotizacion,
        step: 3
      }
    });
  }

  continuar(modal) {
    //SISCO    1 adicionales
    this.pricingService.validaTipoOrden(this.cotizacion.idCotizacion).subscribe((result: any) => {
        this.mensajeValidacion = result[0].msg;
        if (result[0].Success !== 1) {
          this.pricingService.validaAccesoriosSisco(this.idCotizacion, 1).subscribe(async (resp) => {
            this.mensajeValidacion = resp[0].msg;

            if (resp[0].Success === 0) {
              this.enviandoSisco = false;
              this.modalReference = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
              }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              });
            } else {
              this.avanzaStepTraslados();
            }
          });
        } else {
          this.toastrService.warning(this.mensajeValidacion, `Tipo de orden`)
        }
      })
    }

  avanzaStepTraslados() {
    //console.log('avanzaStepTraslados');
    this.activo = false;
    if (this.cotizacion != undefined) {
      if (this.step < 3) {
        this.pricingService.updateStep(this.idCotizacion, 3).subscribe(() => {
          this.irATraslados();
          this.activo = true;
        });
      } else {
        this.irATraslados();
        this.activo = true;
      }
    }
  }

  agregarCotizacionSisco() {
    console.log('aditional.component:');

    this.enviandoSisco = true;
    this.ordenesSisco = [];
    this.accesorioCatalogService.getAccesoriosSISCO(this.idCotizacion).subscribe(async (respSisco1: any) => {

      let dateTime = new Date()
      //console.log(dateTime.getFullYear + '-' + dateTime.getMonth + '-' + dateTime.getDay + ' ' + dateTime.toTimeString());
      let date = ("0" + dateTime.getDate()).slice(-2);
      // current month
      let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
      // current year
      let year = dateTime.getFullYear();
      // prints date in YYYY-MM-DD format
      let fecha = year + "-" + month + "-" + date + " " + dateTime.toLocaleTimeString();
      //console.log(respSisco);
      this.accesorioCatalogService.getDatosSisco().subscribe(async (datos) => {

        //this.accesorioCatalogService.postSiscoLogin(datos[0].email, datos[0].password, datos[0].application, datos[0].urlLogin).subscribe(async (aut) => {
        // await this.loginSisco(datos[0].email, datos[0].password, datos[0].application, datos[0].urlLogin).then(async (aut: any[]) => {

            let token = environment.tokenSisco;
            //aut[0].data.security.token;

            respSisco1.forEach(async (accesorioSISCO) => {

              let solicitudSisco = new (SolicitudCotizacionSisco);

              solicitudSisco.rfcEmpresa = datos[0].rfcEmpresa;
              solicitudSisco.idCliente = datos[0].idCliente;
              solicitudSisco.numeroContrato = datos[0].numeroContrato;
              solicitudSisco.idCentroCosto = 0;
              solicitudSisco.idCentroCostoFolio = "";
              solicitudSisco.idObjeto = datos[0].idObjeto;
              solicitudSisco.idTipoObjeto = datos[0].idTipoObjeto;
              solicitudSisco.idClase = datos[0].idClase;
              solicitudSisco.idTipoSolicitud = datos[0].idTipoSolicitud;
              solicitudSisco.fecha = fecha;
              solicitudSisco.Propiedades = "";
              solicitudSisco.partidas = (accesorioSISCO.partidas === null) ? "" : accesorioSISCO.partidas;
              solicitudSisco.partidasNuevas = (accesorioSISCO.partidasNuevas === null) ? "" : accesorioSISCO.partidasNuevas;//"<partidas><partida><cantidad>5</cantidad><descripcion>Espejo X-Plus Flotilla</descripcion></partida></partidas>";
              solicitudSisco.comentarios = "Prueba alta solicitud Flotilla";
              solicitudSisco.idEmpresaBPRO = 0;
              solicitudSisco.idSucursalBPRO = 0;
              solicitudSisco.idAreaBPRO = 0;
              solicitudSisco.idUsuario=datos[0].idUsuario;

              this.accesorioCatalogService.postInsSolicitudCompra(solicitudSisco, token, datos[0].urlPostInsSolicitudCompra).subscribe(async (respSisco) => {

                if (respSisco[0].error === "") {

                  let respuestas = respSisco[0].recordsets;

                  //console.log(respuestas)

                  let recordsets: string = '<recordsets>';

                  respuestas.forEach(async (element) => {
                    recordsets += '<recordset>';
                    recordsets += this.OBJtoXML(element);
                    recordsets += '<idSolCompras>' + accesorioSISCO.idSolCompras + '</idSolCompras>';
                    recordsets += '</recordset>';
                  });
                  recordsets += '</recordsets>';

                  let solicitudSiscoRespuesta = {
                    "idCotizacion": this.idCotizacion,
                    "respuesta": recordsets
                  };

                  //console.log('recordset:');
                  //console.log(solicitudSiscoRespuesta);



                  this.accesorioCatalogService.guardaSISCOSolicitudFlotillas(solicitudSiscoRespuesta).subscribe(async (respSiscoAvanza) => {

                    respuestas[0].forEach(element => {

                      /* BEGIN COAL-LBM*/
                      this.ordenesSisco.push({ 'noOrden': element.numeroOrden })
                      /* END   COAL-LBM*/

                      //console.log(recordsets);

                      this.toastrService.info('Orden GENERADA en SISCO: ' + element.numeroOrden, 'Envio a SISCO');

                      if (element.error == "") {

                        let solicitudSiscoAvanza = {
                          "idSolicitud": element.idSolicitud,
                          "idTipoSolicitud": datos[0].idTipoSolicitud,
                          "idClase": datos[0].idClase,
                          "rfcEmpresa": datos[0].rfcEmpresa,
                          "idCliente": datos[0].idCliente,
                          "numeroContrato": datos[0].numeroContrato,
                          "pasoAvanza": (element.tipoSolicitudBPRO === "EM") ? "EstudioMercado" : "Cotizacion",
                          "faseAvanza": (element.tipoSolicitudBPRO === "EM") ? "Solicitud" : "Proceso"
                        };

                        this.accesorioCatalogService.PutAvanzaOrdenEspecifico(solicitudSiscoAvanza, token, datos[0].urlPutAvanzaOrdenEspecifico).subscribe(async (respSiscoAvanza) => {

                          this.toastrService.show('Orden AVANZADA en SISCO: ' + element.numeroOrden, 'Envio a SISCO');

                        });
                      }
                    });//foreach
                    //this.modalService.dismissAll();
                    //this.avanzaStepTraslados();

                    /* BEGIN COAL-LBM*/
                    console.log('this.ordenesSisco', this.ordenesSisco)
                    if (this.ordenesSisco.length === respSisco1.length) {
                      this.enviaCorreoSisco(datos[0].urlLoginSiscoV3)
                    }
                    /* END COAL-LBM*/

                  });
                }
                else {
                  this.toastrService.error('Ocurro un error al realizar la Solicitud en SISCO: ' + respSisco[0].error, 'Envio a SISCO');
                }
                //this.enviaCorreoSisco(datos[0].urlLogin)
              },
                error => {
                  //this.toastrService.error('Ocurro un error al realizar la Solicitud en SISCO: ' + error.message, 'Envio a SISCO');
                  this.toastrService.error('Ocurro un error al realizar la Solicitud en SISCO: ' + error.error.excepcion.originalError.info.message, 'Envio a SISCO');
                });

            });//foreach accesorios


            this.modalService.dismissAll();
            this.avanzaStepTraslados();
            //});
          // })//LOGIN SISCO
          // .catch(err => {
          //   let error = JSON.parse(err[0].Error);
          //   this.toastrService.error(error.errors[0].description, 'LOGIN SISCO');
          // });
      });
    });
  }

  //Envio de Correo COAL-LBM
  enviaCorreoSisco(urlLogin: any) {
    console.log("enviaCorreoSisco")
    try {
      console.log("enviaCorreoSisco1")
      const Arrcorreos: any = [];
      let FlotillaDescripcion: any;
      this.pricingService.getConsultaCorreosCompras(this.idCotizacion).subscribe((resp: any) => {
        resp.forEach((element: { email: any; idFlotilla: any }) => {
          FlotillaDescripcion = element.idFlotilla;
          Arrcorreos.push({ 'email': element.email })
        })
        let parametrosCorreo = {
          'emails': Arrcorreos,
          'cotizacion': this.idCotizacion,
          'idFlotilla': FlotillaDescripcion,
          'link': urlLogin,
          'ordenesSisco': this.ordenesSisco
        }
        console.log("enviaCorreoSisco3")
        console.log(parametrosCorreo)
        this.pricingService.enviarEmail(parametrosCorreo).subscribe((res: any) => {
          console.log("correo enviado correctamente")
        })
      })
    } catch (error) {
      console.log("Error al enviar el correo ", error)
    }
  }


  OBJtoXML(obj) {
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += "<" + prop + ">";
          xml += this.OBJtoXML(new Object(obj[prop][array]));
          xml += "</" + prop + ">";
        }
      } else if (typeof obj[prop] == "object") {
        xml += this.OBJtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
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

  hasAditional() {
    let has = false;

    if (this.cotizacion || this.lastCotizacion) {
      if (this.lastCotizacion) {
        this.cotizacion = this.lastCotizacion;
      }

      this.cotizacion.gruposUnidades.forEach(grp => {
        if (grp.paquetesAccesorios.length > 0 ||
          grp.paquetesServicioUnidad.length > 0 ||
          grp.paquetesTramites.length > 0 ||
          grp.accesoriosSinPaquete.length > 0 ||
          grp.serviciosUnidadSinPaquete.length > 0 ||
          grp.tramitesSinPaquete.length > 0) {
          has = true;
        }
      });

    }
    return has;
  }

  onProfitSelectionChange(value) {
    this.sumaType = value;
    /*
    const request = {
      idCotizacion: this.cotizacion.idCotizacion,
      tipoCargoUnidad: value
    };
    this.pricingService.sumaTipoCargoUnidad(request).subscribe(res => {
    });
    */
    // this.pricingService.updateCotizacionGruposTipoOrden(this.idCotizacion, this.idTipoOrden, (this.idCfdi === undefined) ? '99' : this.idCfdi, this.sumaType, this.imprime).subscribe(async (update) => {
    //   this.tabs.actualizaGrupos();
    // });
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
