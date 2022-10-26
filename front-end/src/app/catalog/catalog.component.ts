import { Component, OnInit, ViewChild } from '@angular/core';
import { Permisos, Permiso } from '../models/permisos.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  catalogs: [];
  selectionables: Array<Permiso>;
  index;
  selectedItem: string;

  @ViewChild('catalogosNgSelect') catalogosNgSelect: NgSelectComponent;

  constructor(private router: Router) { }

  ngOnInit() {
    const userInformation = JSON.parse(localStorage.getItem('app_token'));
    this.catalogs = userInformation.data.permissions.modules;

    this.index = this.catalogs.findIndex((i: any) => i.name === 'Catálogos');
    const permisos = userInformation.data.permissions as Permisos;
    this.selectionables = permisos.modules[this.index].objects.sort((a: Permiso, b: Permiso) => {
      if (a.caption > b.caption) {
        return 1;
      }
      if (a.caption < b.caption) {
        return -1;
      }
      return 0;
    });
    const routerItems = this.router.url.split('/');
    if (routerItems.length > 0) {
      this.selectedItem = routerItems[routerItems.length - 1];
      this.selectedItem = this.selectedItem.charAt(0).toUpperCase() + this.selectedItem.slice(1);
    }
    this.catalogosNgSelect.detectChanges();
  }

  setRoute(event, element) {
    event.preventDefault();
    this.router.navigate(['main/catalogs/', element.toLowerCase().replace(/[\u0300-\u036f]/g, '')]);
  }
}
