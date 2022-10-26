import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../environments/environment';
@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss']
})
export class ProductionComponent implements OnInit {
  urlPie: SafeResourceUrl;
  step: number;
  idFlotilla: string;
  idCotizacion: string;
  idLicitacion: string;
  private urlLicitacion = environment.And_Prod;
  private idUsuario:number;

  constructor(private activeRoute: ActivatedRoute, public sanitizer: DomSanitizer, private _http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idFlotilla = params.idFlotilla as string;
      this.idCotizacion = params.idCotizacion as string;
      this.idLicitacion = params.idLicitacion as string;
      this.step = Number(params.step);
    });
    this.idUsuario = Number(localStorage.getItem('idUsuario'));
    this.getIdCotizacion();
    // this.urlPie = this.sanitizer.bypassSecurityTrustResourceUrl('http://192.168.20.121:4030/#/licitacion/idLicitacion=20');
  }

  private getIdCotizacion() {

    let Params = new HttpParams();
    Params = Params.append('idCotizacion', this.idCotizacion);
    this._http.get(`${this.urlLicitacion}/api/licitacion/obtenerIdLicitacion`, { params: Params }).subscribe(data => {
      window.open(`${this.urlLicitacion}/#/licitacion/?idLicitacion=${data[0].idLicitacion}&idUsuario=${this.idUsuario}`);

      this.router.navigate([`main/gestionFlotilla/manager/unidades`], {
        queryParams: {
          idFlotilla: this.idFlotilla,
          idLicitacion: this.idLicitacion,
          idCotizacion: this.idCotizacion
        }
      });
    });
  }

}
