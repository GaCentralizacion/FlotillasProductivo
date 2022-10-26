import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pricing-manager',
  templateUrl: './pricing-manager.component.html',
  styleUrls: ['./pricing-manager.component.scss'],
  providers: []
})
export class PricingManagerComponent implements OnInit {
  public idFlotilla: string;
  public idCotizacion: string;
  public idUsuario: string;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.idCotizacion = params.idCotizacion;
      this.idFlotilla = params.idFlotilla;
      this.idUsuario = params.idUsuario;
    });
  }
}
