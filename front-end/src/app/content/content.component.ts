import { Component, OnInit } from '@angular/core';
import { SidebarToggleService } from '../header/sidebar-toggle-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  collapsed = false;
  subscription: Subscription;

  constructor(private sidebarToggleService: SidebarToggleService) {
    this.subscription = this.sidebarToggleService.isCollapsed.subscribe((isCollapsed: boolean) => {
      this.collapsed = isCollapsed;
    });
  }

  ngOnInit() {
    this.collapsed = localStorage.getItem('isCollapsed') == 'true';
  }
}
