import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approve-confirmation-modal',
  templateUrl: './approve-confirmation-modal.component.html',
  styleUrls: ['./approve-confirmation-modal.component.scss']
})
export class ApproveConfirmationModalComponent implements OnInit {
  
  @Input() public rule: any;

  constructor(private modalService: NgbModal, 
              public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
}
