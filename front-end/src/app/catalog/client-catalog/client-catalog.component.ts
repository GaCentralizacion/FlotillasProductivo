import { Component, OnInit } from '@angular/core';
import { ClientCatalogService } from '../../services';
import { forkJoin } from 'rxjs';
import { ClienteFilter, RelCFDIFlotilla, RelDireccionFlotilla, Page, PageInfo } from '../../models';
import { ErrorService } from '../../shared/error/error.service';

@Component({
  selector: 'app-client-catalog',
  templateUrl: './client-catalog.component.html',
  styleUrls: ['./client-catalog.component.scss'],
  providers: [ClientCatalogService]
})
export class ClientCatalogComponent implements OnInit {
  page = new Page();
  rows = [];
  flotillas: any;
  selected = [];
  added = [];
  idCliente: number;
  sendArray: { idCliente: number, direccionesFlotillas: RelDireccionFlotilla[] }[];
  related = [];
  allCfdi = [];
  CFDIArray: { idCliente: number, cfdis: RelCFDIFlotilla[] }[];
  filterClients: ClienteFilter;
  searchText = '';
  searchTextName = '';
  searchTextUnidad = null;
  searchTextAccesorio = null;
  totalRegistros: number;
  numeroPagina = 0;


  selectedItems = [];
  settings = {};
  settingsCFDI = {};

  constructor(private serverService: ClientCatalogService, private errorService: ErrorService) {
    this.page.size = 10;
  }

  ngOnInit() {
    this.sendArray = [];
    this.CFDIArray = [];
    this.filterClients = {
      pagina: this.numeroPagina + 1,
      numeroRegistros: 10,
      rfc: '',
      nombreCompleto: '',
      idDireccionFlotillas: '',
      idCfdiUnidades: '',
      idCfdiAccesorios: ''
    };

    forkJoin(
      this.serverService.postClienteFilter(this.filterClients),
      this.serverService.getAllFlotillas(),
      this.serverService.getRelClientFlotilla(),
      this.serverService.getAllCFDI(),
      this.serverService.getRelClientCFDI(),
    ).subscribe((responseArray: any[]) => {
      let filteredClients: any;
      let flotillas: any[];
      let relFlotillas: any[];
      let CFDI: any[];
      let relCFDI: any[];

      [filteredClients, flotillas, relFlotillas, CFDI, relCFDI] = responseArray;
      this.totalRegistros = filteredClients.clientes.length;
      filteredClients.clientes.map(cliente => {
        cliente.direccionesFlotillas = flotillas.filter(flotilla => {
          return relFlotillas.some(rel => {
            return rel.idDireccionFlotillas === flotilla.idDireccionFlotillas && rel.idCliente === cliente.idCliente;
          });
        });
      });

      filteredClients.clientes.map(cliente => {
        // tslint:disable-next-line:no-shadowed-variable
        cliente.direccionesCFDIUnidades = CFDI.filter(CFDI => {
          return relCFDI.some(rel => {
            return rel.idCfdiUnidades === CFDI.idCfdi && rel.idCliente === cliente.idCliente;
          });
        });
      });

      filteredClients.clientes.map(cliente => {
        // tslint:disable-next-line:no-shadowed-variable
        cliente.direccionesCFDIAccesorios = CFDI.filter(CFDI => {
          return relCFDI.some(rel => {
            return rel.idCfdiAccesorios === CFDI.idCfdi && rel.idCliente === cliente.idCliente;
          });
        });
      });

      this.rows = filteredClients.clientes;
      this.flotillas = flotillas;
      this.allCfdi = CFDI;


    }, error => {
      console.error(error)
    });
    this.settings = {
      text: 'Seleccionar Flotillas',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Ninguno',
      classes: 'myclass custom-class',
      primaryKey: 'idDireccionFlotillas',
      labelKey: 'nombre',
      singleSelection: false
    };

    this.settingsCFDI = {
      text: 'CFDI - Unidades',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Ninguno',
      classes: 'myclass custom-class',
      primaryKey: 'idCfdi',
      labelKey: 'nombre',
      singleSelection: true
    };
  }

  cambiaPagina(pageInfo: PageInfo) {
    this.filterClients.pagina = pageInfo.offset + 1;
    this.serverService.postClienteFilter(this.filterClients).subscribe((data: any) => {
      this.totalRegistros = data.clientes.length;
      console.log(">>data pagina " + this.filterClients.pagina + " Total " + this.totalRegistros);
      this.rows = data.clientes;
    }, error => {
      console.log(error);
    });
  }


  onSelectDeselecItem(item: any, row: any) {
    this.sendArray = this.sendArray.filter(itemSend => itemSend.idCliente !== row.idCliente);

    const itemToSend = { idCliente: row.idCliente, direccionesFlotillas: [] };
    row.direccionesFlotillas.forEach(element => {
      // tslint:disable-next-line:max-line-length
      itemToSend.direccionesFlotillas.push({ idCliente: row.idCliente, idDireccionFlotillas: element.idDireccionFlotillas } as RelDireccionFlotilla);
    });
    this.sendArray.push(itemToSend);
  }

  onSelectDeselecAllItems(item: any, row: any) {
    row.direccionesFlotillas = item;
    this.sendArray = this.sendArray.filter(itemSend => itemSend.idCliente !== row.idCliente);
    const itemToSend = { idCliente: row.idCliente, direccionesFlotillas: [] };
    row.direccionesFlotillas.forEach(element => {
      // tslint:disable-next-line:max-line-length
      itemToSend.direccionesFlotillas.push({ idCliente: row.idCliente, idDireccionFlotillas: element.idDireccionFlotillas } as RelDireccionFlotilla);
    });
    this.sendArray.push(itemToSend);
  }

  select(item: any, row: any, tipo: string) {
    let currentValue = this.CFDIArray.filter(itemSend => itemSend.idCliente === row.idCliente)[0];
    if (currentValue === undefined) {
      currentValue = {
        idCliente: row.idCliente, cfdis: [{
          idCfdiAccesorios: row.direccionesCFDIAccesorios.lenght > 0 ? row.direccionesCFDIAccesorios[0].idCfdi : null,
          idCfdiUnidades: row.direccionesCFDIUnidades.length > 0 ? row.direccionesCFDIUnidades[0].idCfdi : null,
          idCliente: row.idCliente
        }]
      };
    }

    this.CFDIArray = this.CFDIArray.filter(itemSend => itemSend.idCliente !== row.idCliente);
    const itemToSend = { idCliente: row.idCliente, cfdis: [] };

    // tslint:disable-next-line:max-line-length
    itemToSend.cfdis.push({ idCliente: row.idCliente, idCfdiUnidades: tipo === 'unidades' ? item.idCfdi : currentValue.cfdis[0].idCfdiUnidades, idCfdiAccesorios: tipo === 'accesorios' ? item.idCfdi : currentValue.cfdis[0].idCfdiAccesorios } as RelCFDIFlotilla);

    this.CFDIArray.push(itemToSend);
  }

  guardarCFDI() {
    this.serverService.postRelCFDIFlotilla(this.CFDIArray)
      .subscribe(data => {
      }, error => {
      });
  }

  guardarFlotillas() {
    this.serverService.postRelClienteFlotilla(this.sendArray)
      .subscribe(data => {
      });

    this.guardarCFDI();
  }

  change() {

    if (this.searchText.length >= 4 || this.searchTextName.length >= 4 || this.searchTextUnidad || this.searchTextAccesorio) {
      this.filterClients = {
        pagina: 1,
        numeroRegistros: 10,
        rfc: this.searchText,
        nombreCompleto: this.searchTextName,
        idDireccionFlotillas: '',
        idCfdiUnidades: this.searchTextUnidad,
        idCfdiAccesorios: this.searchTextAccesorio
      };

      this.serverService.postClienteFilter(this.filterClients).subscribe(data => {
        let clientes: any;
        clientes = data;

        forkJoin(
          this.serverService.postClienteFilter(this.filterClients),
          this.serverService.getAllFlotillas(),
          this.serverService.getRelClientFlotilla(),
          this.serverService.getAllCFDI(),
          this.serverService.getRelClientCFDI(),
        ).subscribe((responseArray: any[]) => {
          let filteredClients: any;
          let flotillas: any[];
          let relFlotillas: any[];
          let CFDI: any[];
          let relCFDI: any[];

          [filteredClients, flotillas, relFlotillas, CFDI, relCFDI] = responseArray;
          this.totalRegistros = filteredClients.clientes.length;
          filteredClients.clientes.map(cliente => {
            cliente.direccionesFlotillas = flotillas.filter(flotilla => {
              return relFlotillas.some(rel => {
                return rel.idDireccionFlotillas === flotilla.idDireccionFlotillas && rel.idCliente === cliente.idCliente;
              });
            });
          });

          filteredClients.clientes.map(cliente => {
            // tslint:disable-next-line:no-shadowed-variable
            cliente.direccionesCFDIUnidades = CFDI.filter(CFDI => {
              return relCFDI.some(rel => {
                return rel.idCfdiUnidades === CFDI.idCfdi && rel.idCliente === cliente.idCliente;
              });
            });
          });

          filteredClients.clientes.map(cliente => {
            // tslint:disable-next-line:no-shadowed-variable
            cliente.direccionesCFDIAccesorios = CFDI.filter(CFDI => {
              return relCFDI.some(rel => {
                return rel.idCfdiAccesorios === CFDI.idCfdi && rel.idCliente === cliente.idCliente;
              });
            });
          });

          this.rows = filteredClients.clientes;
          this.flotillas = flotillas;
          this.allCfdi = CFDI;


        }, error => {
          console.log(error);
        });

        this.rows = clientes.clientes;
        this.totalRegistros = clientes.length;
      });
    }
  }


}
