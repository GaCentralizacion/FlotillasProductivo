import { Component, OnInit } from '@angular/core';
import { LogService } from '../services/log.service';
import { UserCatalogService } from '../services/user-catalog.service';


@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  providers: [LogService, UserCatalogService]
})

export class LogComponent implements OnInit {
  ngOnInit() {
  }

  constructor() { }
}
