import { Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { CustomMenuComponent } from './custom-menu.component';
import { fromEvent, map, merge, Subject, takeUntil, tap } from 'rxjs';


@Directive({
  selector: '[customContextMenu]'
})
export class CustomContextMenuDirective implements OnInit, OnDestroy {
  @Input() menuComponent: CustomMenuComponent;
  @Input() data: any;
  private _destroy$ = new Subject<void>();
  private _context$ = new Subject<void>();

  @HostBinding('class') class = 'context-menu';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (!this.menuComponent.available) {
      return;
    }
    this.menuComponent.data = this.data;
    const mainContext$ = fromEvent(this.el.nativeElement, 'contextmenu');
    const bindRightHandler = this.onRightClickHandler.bind(this);
    mainContext$.pipe(
      tap(bindRightHandler),
      takeUntil(this._context$)
    ).subscribe();
  }

  async ngOnDestroy(): Promise<void> {
    this.menuComponent.hide();
    this._context$.next();
    await this.destroy();
  }

  private async onRightClickHandler(e: any): Promise<void> {
    if (!this.menuComponent?.available) {
      await this.ngOnDestroy();
    }
    this.menuComponent.data = this.data;

    e.preventDefault();
    await this.destroy();

    const scroll$ = fromEvent(document, 'wheel');

    scroll$.pipe(
      tap(() => {
        if (this.menuComponent.visible && !this.isInViewport()) {
          this.hideMenuAndRemoveScrollListener();
        }
      }),
      takeUntil(this._destroy$)
    ).subscribe();

    const documentClick$ = fromEvent(document, 'click');
    const itemClick$ = fromEvent(this.el.nativeElement, 'click');
    const context$ = fromEvent(document, 'contextmenu');
    const outEvents$ = merge(documentClick$, itemClick$, context$);
    outEvents$.pipe(
      map((evt: any) => {
        evt.stopPropagation();
        if (evt.type === 'click' || !evt.target.closest('.context-menu')) {
          this.hideMenuAndRemoveScrollListener();
        }
      }),
      takeUntil(this._destroy$)
    ).subscribe();

    this.menuComponent.show({
      top: `${e.y}px`,
      left: `${e.x}px`,
    });
  }

  private async hideMenuAndRemoveScrollListener(): Promise<void> {
    this.menuComponent.hide();
    await this.destroy();
  }

  private async destroy(): Promise<void> {
    this._destroy$.next();
  }

  private isInViewport() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
