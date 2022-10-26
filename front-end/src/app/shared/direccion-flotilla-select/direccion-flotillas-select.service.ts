import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DireccionFlotillasSelectService {

  @Output() isSelected = new EventEmitter<string>();
  @Output() direccionFlotillas = new EventEmitter<string[]>();

  constructor() { }

  emitSelected(idDireccionFlotillaSelected: string) {
    this.isSelected.emit(idDireccionFlotillaSelected);
  }

  emitDireccionFlotillas(flotillas: any[]){
    this.direccionFlotillas.emit(flotillas);
  }
}
