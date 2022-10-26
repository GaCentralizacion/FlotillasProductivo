import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarToggleService } from '../header/sidebar-toggle-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  collapsed = false;
  subscription: Subscription;
  permissions = [];
  class = [];
  name: string;

  constructor(private sidebarToggleService: SidebarToggleService, private route: Router, private actived: ActivatedRoute) {
    this.subscription = this.sidebarToggleService.isCollapsed.subscribe((isCollapsed: boolean) => {
      this.collapsed = isCollapsed;
    });
  }

  ngOnInit() {
    this.collapsed = localStorage.getItem('isCollapsed') == 'true';
    const userInformation = JSON.parse(localStorage.getItem('app_token'));
    this.name = userInformation.data.user.name + ' ' + userInformation.data.user.firstname;

    userInformation.data.permissions.modules.forEach(element => {
        this.permissions.push(JSON.parse(element.caption));
    });

    this.permissions.forEach(element => {
      element.router = '/main' + element.router;
      this.class.push(element);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  routerLink(value) {
    if (this.route.url.startsWith('/main/lectura')) {
      return false;
    }
    this.route.navigate([value]);
  }

  isLink(value) {
    if (this.route.url.startsWith(value)) {
      return true;
    } else {
      return false;
    }
  }

}
