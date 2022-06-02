import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UtilService } from '../../../shared/services/util.service';
import { UserRestService } from '../../../shared/services/user.service';
import { BillService } from '../../../shared/services/bill.service';
import { AuthService } from '../../../shared/services/auth.service';
import { OperationService } from '../../../shared/services/operation.service';
import { CategoryService } from '../../../shared/services/category.service';


@Component({
  selector: 'app-form-operation',
  templateUrl: './form-operation.component.html',
  styleUrls: ['./form-operation.component.scss']
})
export class FormOperationComponent implements OnInit, OnDestroy {

  // operationTypes = [];
  form: FormGroup;
  wholeSub$: Subscription;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private catService: CategoryService,
    private authService: AuthService,
    private billService: BillService,
    private operationService: OperationService,
    private userService: UserRestService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      value: new FormControl(0, Validators.required), // еще нужно сделать проверку на число
      from: new FormControl(null),
      to: new FormControl(null),
      category: new FormControl(null),
      description: new FormControl(null),
    });

    this.form.disable();

    // 0. Получаем список своих счетов
    // 1. Ищем и получаем юзера, которому хотим перевести бабос
    // 2. Получаем счета юзера, доступные для перевода.
    // 3. Отправляем
    this.wholeSub$ = combineLatest(
      this.billService.getBillsByUserId(this.authService.user.id),
      this.utilService.getOperationTypes(),
      this.catService.fetch()
    ).subscribe(
      ([billList, operationTypes, categories]) => {
        console.log('operationTypes:', operationTypes);
        console.log('billList:', billList);

        // this.operationTypes = operationTypes;
        // this.form.patchValue({
        //   type: this.operationTypes.filter((type) => type.key === 'checking')[0]
        //     .key,
        // });

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
    // let obs$;

    if (!this.form.invalid) {
    }
  }
}
