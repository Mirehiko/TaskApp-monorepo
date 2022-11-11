import { Directive, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';


@Directive({
  selector: '[appNestedListItem]',
})
export class NestedListItemDirective implements OnInit, OnChanges {
  public itemTemplate: TemplateRef<any>;
  private _appNestedListItem: any;
  @Input() set appNestedListItem(item: any) {
    this._appNestedListItem = item[0];
  };
  @Input() dataItem: any;

  get item(): any {
    return this._appNestedListItem;
  }

  constructor(private templateRef: TemplateRef<any>) {
    this.itemTemplate = this.templateRef;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }
}
