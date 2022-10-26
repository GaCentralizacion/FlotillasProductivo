import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { ErrorService } from './error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  providers: [ErrorService]
})
export class ErrorComponent implements OnInit {

  errorMessage: string;
  errorSubscription: Subscription;

  constructor() {
    this.errorSubscription = ErrorService.errorSubscription.subscribe((errorMessage: string) => {
      this.errorMessage = errorMessage;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    }, error => {
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }

  closeErrorMessage() {
    this.errorMessage = null;
  }

}
