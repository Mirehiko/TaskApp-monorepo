import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Target } from '../../../shared/interfaces';
import { TargetService } from '../../../shared/services/target.service';
import { AuthService } from '../../../shared/services/auth.service';


@Component({
  selector: 'app-list-target',
  templateUrl: './list-target.component.html',
  styleUrls: ['./list-target.component.scss']
})
export class ListTargetComponent implements OnInit, OnDestroy {
  targets: Target[] = [];
  cSub: Subscription;
  isLoading = true;

  constructor(
    private targetService: TargetService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // this.cSub = this.targetService.getTargetsByUserId(this.authService.user._id)
    //   .subscribe(data => {
    //     data.targets.forEach(target => {
    //       console.log(data.targetTypes)
    //       console.log(target)
    //       target.type = data.targetTypes.filter(type => type.key === target.type)[0].value;
    //       delete target.user;
    //     });
    //     this.targets = data.targets;
    //     this.isLoading = false;
    //   }, err => console.log(err));
  }

  ngOnDestroy(): void {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
  }
}
