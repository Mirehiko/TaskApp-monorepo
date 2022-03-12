import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { CardService } from '../../../shared/services/card.service';
import { Card } from '../../../shared/interfaces';


@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent implements OnInit, OnDestroy {
  cards: Card[] = [];
  cSub: Subscription;
  isLoading = true;

  constructor(
    private cardService: CardService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // this.cSub = this.cardService.getCardsByUserId(this.authService.user._id)
    //   .subscribe(data => {
    //     data.cards.forEach(card => {
    //       card.type = data.cardTypes.filter(type => type.key === card.type)[0].value;
    //       delete card.user;
    //     });
    //     this.cards = data.cards;
    //     this.isLoading = false;
    //   }, err => console.log(err));
  }

  ngOnDestroy(): void {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
  }
}
