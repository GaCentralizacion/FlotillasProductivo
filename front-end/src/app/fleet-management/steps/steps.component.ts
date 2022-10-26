import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PricingService } from 'src/app/services';
import { Cotizacion } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-steps-fleet',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
})
export class StepsFleetComponent implements OnInit, AfterViewInit {
  step: number;
  steps: any = [];
  public isActive = false;
  public isComplete = false;
  idFlotilla: string;
  idUsuario: string;
  idCotizacion: string;
  idLicitacion: string;
  cotizacion: Cotizacion;

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private pricingService: PricingService) {
    this.steps = [
      { name: 'unidades', icon: 'fa fa-car', class: 'active', completed: false, blocked: true },
      { name: 'digitalización', icon: 'fa fa-barcode', class: '', completed: false, blocked: true },
	  { name: 'expediente digital', icon: 'fas fa-file-contract', class: '', completed: false, blocked: true },
      { name: 'producción', icon: 'fa fa-cogs', class: '', completed: false, blocked: false },
      { name: 'reporte de avance', icon: 'fa fa-chart-bar', class: '', completed: false, blocked: true },
    ];
  }

  private getParams() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idFlotilla = params.idFlotilla as string;
      this.idCotizacion = params.idCotizacion as string;
      this.idLicitacion = params.idLicitacion as string;
      this.step = Number(params.step);
    });
  }

  ngOnInit() {
    /*    this.getParams();
        if (this.idCotizacion) {
          this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
            if (cotizacion) {
              this.cotizacionStep = cotizacion.step;
              this.cleanClass();
            }
            this.checkStep();
          }, (err) => {
            this.toastrService.warning('Se produjo un error al intetar capturar el paso en l que se encuentra la cotizacion',
              'ERROR AL NAVEGAR EN LA COTIZACIÓN');
          });
        }*/
  }

  ngAfterViewInit(): void {
  }

  navigateTo(endPoint: string) {
    this.getParams();
    this.router.navigate([`main/gestionFlotilla/manager/${endPoint}`], {
      queryParams: {
        idFlotilla: this.idFlotilla,
        idLicitacion: this.idLicitacion,
        idCotizacion: this.idCotizacion
      }
    });
  }

  cleanClass() {
    this.steps.map((ele) => {
      ele.class = '';
    });
  }

  checkStep() {
    for (let i = 0; i < this.steps.length; i++) {
      this.steps[i].blocked = false;
      this.steps[i].class = 'completed';
      if (this.step == i) {
        this.steps[i].class = 'active';
      }
    }

    switch (this.step) {
      case 0:
        this.navigateTo('unidades');
        break;
      case 1:
          this.navigateTo('digital');
        break;
      case 2:
        this.navigateTo('controlDocumental');
        break;
      case 3:
        this.navigateTo('produccion');
        this.steps[3].blocked = false;
        this.steps[3].class = 'completed';
        this.steps[0].class = 'active';
        break;
      case 4:
        this.navigateTo('reporte');
        break;
	  case 5:
        this.navigateTo('entregas');
        break;
      
      default:
        this.navigateTo('');
    }
  }

  activeClass(event) {
    const target = event.target || event.srcElement || event.currentTarget;
    if (target.attributes.id.nodeValue == 'unidades') {
      this.step = 0;
      this.cleanClass();
      this.checkStep();
    }
    if (target.attributes.id.nodeValue == 'digitalización') {
      this.step = 1;
      this.cleanClass();
      this.checkStep();
    }
	if (target.attributes.id.nodeValue == 'expediente digital') {
      this.step = 2;
      this.cleanClass();
      this.checkStep();
    }
	if (target.attributes.id.nodeValue == 'producción') {
      this.step = 3;
      this.cleanClass();
      this.checkStep();
    }
	if (target.attributes.id.nodeValue == 'reporte de avance') {
      this.step = 4;
      this.cleanClass();
      this.checkStep();
    }
    if (target.attributes.id.nodeValue == 'entregas') {
      this.step = 5;
      this.cleanClass();
      this.checkStep();
    }

  }
}
