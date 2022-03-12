import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from '../../../shared/interfaces';
import { CategoryService } from '../../../shared/services/category.service';


@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss']
})
export class AdminCategoriesComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  cSub$: Subscription;
  isFormVisible = false;

  constructor(
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.cSub$ = this.categoryService.fetch()
      .subscribe(categories => {
        this.categories = categories;
        console.log(this.categories)
      },
      err => console.log(err));
  }

  ngOnDestroy(): void {
    if(this.cSub$) {
      this.cSub$.unsubscribe();
    }
  }
}
