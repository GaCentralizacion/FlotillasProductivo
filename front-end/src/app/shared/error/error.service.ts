import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  @Output() static errorSubscription = new EventEmitter<string>();

  constructor() {
  }

  emitError(errorMessage: string) {
    ErrorService.errorSubscription.emit(errorMessage);
  }
}
