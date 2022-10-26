import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarToggleService {

  @Output() isCollapsed = new EventEmitter<boolean>();

  constructor() { }

  emitCollapsed(collapsed: boolean) {
    this.isCollapsed.emit(collapsed);
  }
}
