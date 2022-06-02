import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Bill, Operation, Target } from '../../../shared/interfaces';
import { UtilService } from '../../../shared/services/util.service';
import { TargetService } from '../../../shared/services/target.service';
import { AuthService } from '../../../shared/services/auth.service';


@Component({
  selector: 'app-form-target',
  templateUrl: './form-target.component.html',
  styleUrls: ['./form-target.component.scss']
})
export class FormTargetComponent implements OnInit, OnDestroy {

  action = 'create';
  isLoading = true;

  // targetTypes: any = [];
  form: FormGroup;
  target: Target;
  bill: Bill;
  operations: Operation[] = [];
  wholeSub$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private targetService: TargetService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      type: new FormControl('personal', Validators.required),
      targetValue: new FormControl(0, Validators.required),
      startedValue  : new FormControl(0),
      cover: new FormControl(null),
    });

    this.form.disable();

    this.wholeSub$ = combineLatest(
      this.route.params.pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.action = 'show';
            return this.targetService.getTargetById(params['id']);
          }
          return of(null);
        })
      ),
      this.utilService.getTargetTypes(),
      this.utilService.getTargetStatus(),
    ).subscribe(
      ([data, targetTypes, targetStatus]) => {
        // this.targetTypes = targetTypes;
        console.log(targetTypes);
        // this.form.patchValue({
        //   type: this.targetTypes.filter((type) => type.key === 'personal')[0]
        //     .key,
        // });
        console.log(data);
        if (data) {
          // this.target = data.target;
          // this.target.status = targetStatus.filter(status => status.key === this.target.status)[0].value;
          console.log(data.target);
          console.log(this.target);
          this.form.patchValue({
            name: data.target.name,
            // type: this.targetTypes.filter((type) => type.key === this.target.type)[0].key,
            targetValue: data.target.targetValue,
            cover: data.target.cover,
          });
          this.bill = data.bill;
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
      const sendTarget = this.form.value;
      sendTarget.user = this.authService.user.id;
      // if (this.action === 'create') {
      //   obs$ = this.targetService.create(sendTarget);
      // } else {
      //   obs$ = this.targetService.update(this.target._id, sendTarget);
      // }
      // obs$.subscribe(
      //   (target) => {
      //     if (this.action === 'create') {
      //       console.log('Target was created', target);
      //       this.form.patchValue({
      //         name: '',
      //         type: this.targetTypes.filter(
      //           (type) => type.key === 'personal'
      //         )[0].key,
      //         targetValue: 0,
      //         startedValue: 0,
      //         cover: null,
      //       });
      //     } else {
      //       this.target = target;
      //       console.log('Изменения сохранены');
      //       this.form.patchValue({
      //         name: target.name,
      //         type: this.targetTypes.filter(
      //           (type) => type.key === this.target.type
      //         )[0].key,
      //         targetValue: target.targetValue,
      //         cover: target.cover,
      //       });
      //       this.action = 'show'
      //     }
      //     this.form.enable();
      //   },
      //   (err) => console.log(err),
      //   () => {
      //     this.form.enable();
      //   }
      // );
    }
  }

  deleteTarget(): void {
    const decision = window.confirm(`Вы уверены, что хотите удалить цель ${this.target.name}?\n (затем выбрать счет для перевода средств чтобы не потерять средства)`);
    if (decision) {
      this.targetService.delete(this.target)
        .subscribe(
          response => console.log(response.message),
          error => console.log(error.error.message),
          () => this.router.navigate(['/cabinet', 'targets'])
        );
    }
  }
}
