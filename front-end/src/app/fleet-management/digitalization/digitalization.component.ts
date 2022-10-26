import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PricingService } from 'src/app/services';
import { ToastrService } from  'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';


@Component({
  selector: 'app-digitalization',
  templateUrl: './digitalization.component.html',
  styleUrls: ['./digitalization.component.scss']
})
export class DigitalizationComponent implements OnInit {

  urlPie: SafeResourceUrl;
  idCotizacion;

  constructor(
    public sanitizer: DomSanitizer, 
    private pricingService: PricingService,
    private toasterService: ToastrService,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getParams();
    const email = (JSON.parse(localStorage.getItem('app_token')).data.user.email);
    this.pricingService.usuarioCentralizacion(email)

    .subscribe(
      data => {
        const res =  JSON.parse(JSON.stringify(data));
          const idUsuarioCent = res.data[0].idUsuario;
          if(res.success == 1){
            this.urlPie = this.sanitizer.bypassSecurityTrustResourceUrl
            (environment.And_Dig + idUsuarioCent + '&FL=1&cotizacion=' + this.idCotizacion);
          }
      },
      (error:HttpErrorResponse) => {
        this.toasterService.error(error.error.message, 'Digitalización')
        this.urlPie = this.sanitizer.bypassSecurityTrustResourceUrl('http://');
      }
  )
  }

  private getParams() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idCotizacion = params.idCotizacion as string;
    });
  }

}
