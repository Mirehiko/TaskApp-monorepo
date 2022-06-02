import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UtilService } from '../../../shared/services/util.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Card, Operation } from '../../../shared/interfaces';
import { CardService } from '../../../shared/services/card.service';


@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss']
})
export class FormCardComponent implements OnInit, OnDestroy {

  isNew = true;
  isLoading = true;
  form: FormGroup;

  // cardTypes = [];
  card: Card;
  operations: Operation[] = [];
  wholeSub$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private cardService: CardService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      // balance: new FormControl(0, Validators.required), // еще нужно сделать проверку на число
    });

    this.form.disable();

    this.wholeSub$ = combineLatest(
      this.route.params.pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.cardService.getCardById(params['id']);
          }
          return of(null);
        })
      ),
      this.utilService.getCardTypes()
    ).subscribe(
      ([card, cardTypes]) => {
        // this.cardTypes = cardTypes;
        console.log(cardTypes);
        // this.form.patchValue({
        //   type: this.cardTypes.filter((type) => type.key === 'debit')[0]
        //     .key,
        // });

        if (card) {
          this.card = card;
          console.log(card);
          // this.form.patchValue({
          //   name: card.name,
          //   balance: card.balance,
          //   type: this.cardTypes.filter((type) => type.key === this.card.type)[0].key
          // });
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
      const sendCard = this.form.value;
      sendCard.user = this.authService.user.id;
      // if (this.isNew) {
      //   obs$ = this.cardService.create(sendCard);
      // } else {
      //   obs$ = this.cardService.update(this.card._id, sendCard);
      // }
      // obs$.subscribe(
      //   (card) => {
      //     if (this.isNew) {
      //       console.log('Card was created', card);
      //       this.form.patchValue({
      //         name: '',
      //         type: this.cardTypes.filter(
      //           (type) => type.key === 'debit'
      //         )[0].key,
      //       });
      //     } else {
      //       this.card = card;
      //       console.log('Изменения сохранены');
      //       this.form.patchValue({
      //         name: card.name,
      //         type: this.cardTypes.filter(
      //           (type) => type.key === this.card.type
      //         )[0].key,
      //       });
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

  deleteCard(): void {
    const decision = window.confirm(`Вы уверены, что хотите удалить карту ${this.card.name}?`);

    if (decision) {
      // this.cardService.delete(this.card._id)
      //   .subscribe(
      //     response => console.log(response.message),
      //     error => console.log(error.error.message),
      //     () => this.router.navigate(['/cabinet', 'cards'])
      //   );
    }
  }
}
