import { Component, OnInit } from '@angular/core';
import { Cotizacion, Cliente, ClienteFilter, GrupoUnidades } from 'src/app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { PricingService, ClientCatalogService } from 'src/app/services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pricing-viewer-conditions',
  templateUrl: './pricing-viewer.conditions.component.html',
  styleUrls: ['./pricing-viewer.conditions.component.scss']
})
export class PricingViewerEditorComponent implements OnInit {

  public idCotizacion;
  request = {
    fileContent: ''
  };
  htmlContent;
  config: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '400px',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Condiciones de Entrega...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: false,
    toolbarPosition: 'top',
};


  constructor(
    private router: Router,
    private pricingService: PricingService,
    private route: ActivatedRoute,
    private clientService: ClientCatalogService,
    private activeModal: NgbActiveModal,
    private toasterService: ToastrService
    ) { }

  ngOnInit() {
      this.pricingService.getCondicionesEntrega(this.idCotizacion).subscribe( response => {
          this.htmlContent = (response.toString());
      });
  }

  save() {
    this.request.fileContent = btoa(this.htmlContent);
    this.pricingService.updateCondicionesEntrega(this.idCotizacion, this.request).subscribe( response => {
      this.toasterService.success('Actualizado Correctamente');
      this.activeModal.close(false);
    });
  }

  cancel() {
    this.activeModal.close(false);
  }

}
