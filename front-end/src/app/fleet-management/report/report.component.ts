import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})

export class ReportComponent implements OnInit {
  urlPie: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlPie = this.sanitizer.bypassSecurityTrustResourceUrl('http://192.168.20.121:4020/');
  }

}
