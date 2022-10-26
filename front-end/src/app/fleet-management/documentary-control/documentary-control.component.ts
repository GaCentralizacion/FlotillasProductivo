import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PricingService } from 'src/app/services';
import { ToastrService } from  'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-documentary-control',
  templateUrl: './documentary-control.component.html',
  styleUrls: ['./documentary-control.component.scss']
})
export class DocumentaryControlComponent implements OnInit {
  urlPie: SafeResourceUrl;

  idCotizacion;

  constructor(
    public sanitizer: DomSanitizer, 
    private pricingService: PricingService,
    private activeRoute: ActivatedRoute,
    private toasterService: ToastrService,
    ) { }

  ngOnInit() {
    this.getParams();

    const email = (JSON.parse(localStorage.getItem('app_token')).data.user.email);

    this.pricingService.usuarioCentralizacion(email)
    //this.pricingService.getLicitiacionBpro(this.idCotizacion)
    .subscribe(data => {
      const res =  JSON.parse(JSON.stringify(data))
      const id = res.data[0].idUsuario
      if(res.success == 1){
        this.urlPie = this.sanitizer.
        bypassSecurityTrustResourceUrl(environment.And_Doc + id + '&FL=1&cotizacion=' + this.idCotizacion);
      }
    },
      (error:HttpErrorResponse) => {
        this.toasterService.error(error.error.message, 'Control Documental')
        this.urlPie = this.sanitizer.bypassSecurityTrustResourceUrl('http://');
      }

      //this.urlPie = this.sanitizer.
      // bypassSecurityTrustResourceUrl('http://192.168.20.121:4020/busqueda?contratoId=' + res[0].idLicitacion);
    );
  }

  private getParams() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idCotizacion = params.idCotizacion as string;
    });
  }


}
