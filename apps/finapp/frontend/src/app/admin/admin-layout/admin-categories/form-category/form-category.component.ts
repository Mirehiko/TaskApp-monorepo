import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from 'src/app/shared/interfaces';
import { CategoryService } from 'src/app/shared/services/category.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-form-category',
  templateUrl: './form-category.component.html',
  styleUrls: ['./form-category.component.scss']
})
export class FormCategoryComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef;
  image: File;
  imagePreview: string | ArrayBuffer = '';
  isNew = true;
  form: FormGroup;
  category: Category;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      url: new FormControl(null, Validators.required),
      type: new FormControl(null),
    });

    this.form.disable();

    this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['id']) {
          this.isNew = false;
          return this.categoryService.getCategoryById(params['id']);
        }
        return of(null);
      })
    ).subscribe((category: Category) => {
      if (category) {
        this.category = category;
        console.log(category)
        this.form.patchValue({
          name: category.name,
          url: category.url,
          // type: category.type
        });
        // this.imagePreview = category.imageSrc;
        // MaterialService.updateTextInputs();
      }
      this.form.enable();
    }, error => console.log(error.error.message));
  }

  deleteCategory(): void {
    const decision = window.confirm(`Вы уверены, что хотите удалить категорию ${this.category.name}?`);

    if (decision) {
      this.categoryService.delete(this.category._id)
        .subscribe(
          response => console.log(response.message),
          error => console.log(error.error.message),
          () => this.router.navigate(['/admin', 'categories'])
        );
    }
  }

  submit(): void {
    this.form.disable();
    let obs$;

    if (this.isNew) {

      obs$ = this.categoryService.create(this.form.value);
      // obs$ = this.categoryService.create(this.form.value.name, this.image);
    }
    else {
      obs$ = this.categoryService.update(this.category._id, this.form.value);
      // obs$ = this.categoryService.update(this.category._id, this.form.value.name, this.image);
    }

    obs$.subscribe(
      category => {
        if (this.isNew) {
          console.log('Категория создана');
          this.form.reset();
        }
        else {
          this.category = category;
          console.log('Изменения сохранены');
        }
        this.form.enable();
      },
      error => {
        console.log(error.error.message);
        this.form.enable();
      }
    );
  }

  // triggerClick() {
  //   this.inputRef.nativeElement.click();
  // }

  // onFileUpload(event: any) {
  //   const file = event.target.files[0];
  //   this.image = file;

  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     this.imagePreview = reader.result;
  //   };

  //   reader.readAsDataURL(file);
  // }
}
