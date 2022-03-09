import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { UtilService } from 'src/app/shared/services/util.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BillService } from 'src/app/shared/services/bill.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Bill, Operation } from 'src/app/shared/interfaces';
import { switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-bill-form',
  templateUrl: './bill-form.component.html',
  styleUrls: ['./bill-form.component.scss'],
})
export class BillFormComponent implements OnInit, OnDestroy {
  isNew = true;
  billTypes = [];
  form: FormGroup;
  bill: Bill;
  wholeSub$: Subscription;
  isLoading = true;
  operations: Operation[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      balance: new FormControl(0, Validators.required), // еще нужно сделать проверку на число
    });

    this.form.disable();

    this.wholeSub$ = combineLatest(
      this.route.params.pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.billService.getBillById(params['id']);
          }
          return of(null);
        })
      ),
      this.utilService.getBillTypes()
    ).subscribe(
      ([bill, billTypes]) => {
        console.log('billTypes:', billTypes);
        console.log('bill:', bill);

        this.billTypes = billTypes;
        this.form.patchValue({
          type: this.billTypes.filter((type) => type.key === 'checking')[0]
            .key,
        });


        if (bill) {
          this.bill = bill;
          this.form.patchValue({
            name: bill.name,
            balance: bill.balance,
            type: this.billTypes.filter((type) => type.key === this.bill.type)[0]
              .key,
          });
        }
        this.form.enable();
        this.isLoading = false;
      },
      (err) => console.log(err)
    );
  }

  ngOnDestroy(): void {
    if (this.wholeSub$) {
      this.wholeSub$.unsubscribe();
    }
  }

  submit(): void {
    this.form.disable();
    let obs$;

    if (!this.form.invalid) {
      if (this.isNew) {
        obs$ = this.billService.create(this.form.value);
      } else {
        obs$ = this.billService.update(this.bill._id, this.form.value);
      }
      obs$.subscribe(
        (bill) => {
          if (this.isNew) {
            console.log('Bill was created', bill);
            this.form.patchValue({
              name: '',
              balance: 0,
              type: this.billTypes.filter(
                (type) => type.key === 'checking'
              )[0].key,
            });
          } else {
            this.bill = bill;
            console.log('Изменения сохранены');
            this.form.patchValue({
              name: bill.name,
              balance: bill.balance,
              type: this.billTypes.filter(
                (type) => type.key === this.bill.type
              )[0].key,
            });
          }
          this.form.enable();
        },
        (err) => console.log(err),
        () => {
          this.form.enable();
        }
      );
    }
  }

  deleteBill(): void {
    const decision = window.confirm(`Вы уверены, что хотите удалить категорию ${this.bill.name}?`);

    if (decision) {
      this.billService.delete(this.bill._id)
        .subscribe(
          response => console.log(response.message),
          error => console.log(error.error.message),
          () => this.router.navigate(['/cabinet', 'bills'])
        );
    }
  }
}
