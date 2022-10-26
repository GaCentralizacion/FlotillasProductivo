import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-component',
  templateUrl: './alert-component.component.html',
  styleUrls: ['./alert-component.component.scss']
})
export class AlertComponentComponent implements OnInit {

  @Input() public data = {};

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,) { }

  ngOnInit() {
  }

  ok = () => {
    this.activeModal.close(true);
  }

  cancel = () => {
    this.activeModal.close(false);
  }

}
