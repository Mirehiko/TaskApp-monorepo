import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { CustomMenuComponent } from './custom-menu.component';
import { fromEvent, merge, Subject, takeUntil, tap } from 'rxjs';


@Directive({
  selector: '[customContextMenu]'
})
export class CustomContextMenuDirective implements OnDestroy {
  @Input() menuComponent: CustomMenuComponent;
  private _destroy$ = new Subject<void>();
  private _context$ = new Subject<void>();

  constructor(private el: ElementRef) {
    const mainContext$ = fromEvent(el.nativeElement, 'contextmenu');
    const bindRightHandler = this.onRightClickHandler.bind(this);
    mainContext$.pipe(
      tap(bindRightHandler),
      takeUntil(this._context$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.menuComponent.hide();
    this._context$.next();
    this.destroy();
  }

  private onRightClickHandler(e: any): void {
    e.preventDefault();
    this.destroy();

    const scroll$ = fromEvent(document, 'wheel');

    scroll$.pipe(
      tap(() => {
        if (this.menuComponent.visible && !this.isInViewport()) {
          this.hideMenuAndRemoveScrollListener();
        }
      }),
      takeUntil(this._destroy$)
    ).subscribe();

    const click$ = fromEvent(document, 'click');
    const context$ = fromEvent(document, 'contextmenu');
    const outEvents$ = merge(click$, context$)
    outEvents$.pipe(
      tap((evt: any) => {
        evt.stopPropagation();
        if (evt.type === 'click' || !this.el.nativeElement.contains(evt.target)) {
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

  private hideMenuAndRemoveScrollListener(): void {
    this.menuComponent.hide();
    this.destroy();
  }

  private destroy(): void {
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
