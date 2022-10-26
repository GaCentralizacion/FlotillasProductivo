import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild(HeaderComponent) header: HeaderComponent;

  isOnlyRead = false;

  constructor(private route: Router) { }

  ngOnInit() {
    if (this.route.url.startsWith('/main/lectura')) {

      setTimeout( () => {
        if (this.header) {
          this.header.collapse();
        }
        this.isOnlyRead = true;
      }, 500);

    } else {
      this.isOnlyRead = false;
    }
  }

}
