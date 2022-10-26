import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cliente-informacion',
  templateUrl: './cliente-informacion.component.html',
  styleUrls: ['./cliente-informacion.component.scss']
})
export class ClienteInformacionComponent implements OnInit {

  @Input() clienteInfo: any = {};
  constructor() { }

  ngOnInit() {
  }

}
