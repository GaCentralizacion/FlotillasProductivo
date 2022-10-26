import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  steps:any[];

  changeMessage(message: any) {
    this.messageSource.next(message)
  }

  manageStepper(newArray:any){
    this.steps = newArray;
  }

}