import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { async } from '@angular/core/testing';
import { PricingService } from 'src/app/services';
import { Cotizacion } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [DataService]
})
export class StepperComponent implements OnInit, AfterViewInit {
  step: number;
  steps: any = [];
  public isActive = false;
  public isComplete = false;
  idFlotilla: string;
  idUsuario: string;
  idCotizacion: string;
  idLicitacion: string;
  cotizacionStep = 0;
  cotizacion: Cotizacion;

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private pricingService: PricingService) {
    this.steps = [
      { name: 'registro', icon: 'fas fa-file-alt', class: '', completed: false, blocked: true },
      { name: 'unidades', icon: 'fas fa-shuttle-van', class: '', completed: false, blocked: true },
      { name: 'adicionales', icon: 'fa fa-cogs', class: '', completed: false, blocked: false },
      { name: 'traslados', icon: 'fa fa-map', class: '', completed: false, blocked: true },
      { name: 'condiciones', icon: 'fas fa-file-contract', class: '', completed: false, blocked: true },
      { name: 'cotización', icon: 'fas fa-cash-register', class: '', completed: false, blocked: true },
    ];
  }

  private getParams() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idFlotilla = params.idFlotilla as string;
      this.idCotizacion = params.idCotizacion as string;
      this.idLicitacion = params.idLicitacion as string;
      this.step = Number(params.step);
      for (let i = 0; i < this.step; i++) {
        this.steps[i].class = 'completed';
      }
      this.steps[this.step].class = 'active';
    });
  }

  ngOnInit() {
    this.getParams();
    if (this.idCotizacion) {
      this.pricingService.getPricingById(this.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        if (cotizacion) {
          this.cotizacionStep = (cotizacion.step === 0 ) ? 1 : cotizacion.step;
          this.cleanClass();
        }
        this.checkStep();
      }, (err) => {
        this.toastrService.warning('Se produjo un error al intentar capturar el paso en el que se encuentra la cotizacion',
          'ERROR AL NAVEGAR EN LA COTIZACIÓN');
      });
    }
  }

  ngAfterViewInit(): void {
  }

  navigateTo(endPoint: string) {
    this.router.navigate([`main/cotizaciones/manager/${endPoint}`], {
      queryParams: {
        idFlotilla: this.idFlotilla,
        idLicitacion: this.idLicitacion,
        idCotizacion: this.idCotizacion,
        step: (this.step === 0) ? 1 : this.step
      }
    });
  }

  cleanClass() {
    this.steps.map((ele) => {
      ele.class = '';
    });
  }

  checkStep() {
    for (let i = 0; i <= this.cotizacionStep; i++) {
      this.steps[i].blocked = false;
      this.steps[i].class = 'completed';
      if (this.step == i) {
        this.steps[i].class = 'active';
      }
    }
    switch (this.step) {
      case 5:
        this.navigateTo('cotizacion');
        break;
      case 4:
        this.navigateTo('condiciones');
        break;
      case 3:
        this.navigateTo('traslados');
        break;
      case 2:
        this.navigateTo('adicionales');
        break;
      case 1:
        this.navigateTo('unidades');
        break;
      default:
        this.navigateTo('registro');
    }
  }

  activeClass(event) {
    const target = event.target || event.srcElement || event.currentTarget;
    if (target.attributes.id.nodeValue == 'registro' && this.steps[0].blocked == false) {
      this.step = 0;
      this.cleanClass();
      this.checkStep();
    }

    if (target.attributes.id.nodeValue == 'unidades' && this.steps[1].blocked == false) {
      this.step = 1;
      this.cleanClass();
      this.checkStep();
    }

    if (target.attributes.id.nodeValue == 'adicionales' && this.steps[2].blocked == false) {
      this.step = 2;
      this.cleanClass();
      this.checkStep();
    }

    if (target.attributes.id.nodeValue == 'traslados' && this.steps[3].blocked == false) {
      this.step = 3;
      this.cleanClass();
      this.checkStep();
    }

    if (target.attributes.id.nodeValue == 'condiciones' && this.steps[4].blocked == false) {
      this.step = 4;
      this.cleanClass();
      this.checkStep();
    }

    if (target.attributes.id.nodeValue == 'cotización' && this.steps[5].blocked == false) {
      this.step = 5;
      this.cleanClass();
      this.checkStep();
    }
  }
}
