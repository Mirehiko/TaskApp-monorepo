import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BillService } from '../../../shared/services/bill.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Bill } from '../../../shared/interfaces';


@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss']
})
export class BillListComponent implements OnInit, OnDestroy {
  bills: Bill[] = [];
  bSub: Subscription;
  isLoading = true;

  constructor(
    private billService: BillService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.bSub = this.billService.getBillsByUserId(this.authService.user.id)
      .subscribe(data => {
        console.log(data)
        // data.bills.forEach(bill => {
        //   bill.type = data.billTypes.filter(type => type.key === bill.type)[0].value;
        //   bill.status = data.billStatus.filter(status => status.key === bill.status)[0].value;
        //   delete bill.user;
        // });
        this.bills = data.bills;
        this.isLoading = false;
      }, err => console.log(err));
  }

  ngOnDestroy(): void {
    if (this.bSub) {
      this.bSub.unsubscribe();
    }
  }

}
