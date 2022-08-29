import { Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, map, merge, Subject, takeUntil, tap } from 'rxjs';
import { OptionsListContainerComponent } from './options-list-container/options-list-container.component';


@Directive({
  selector: '[optionsMenu]'
})
export class OptionsMenuDirective implements OnInit, OnDestroy {
  @Input() menuComponent: OptionsListContainerComponent;
  private _destroy$ = new Subject<void>();
  private _context$ = new Subject<void>();

  @HostBinding('class') class = 'options-list-wrapper';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const mainContext$ = fromEvent(this.el.nativeElement, 'click');
    const bindClickHandler = this.onClickHandler.bind(this);
    mainContext$.pipe(
      tap(bindClickHandler),
      takeUntil(this._context$)
    ).subscribe();
  }

  async ngOnDestroy(): Promise<void> {
    this.menuComponent.hide();
    this._context$.next();
    await this.destroy();
  }

  private async onClickHandler(e: any): Promise<void> {
    await this.destroy();

    e.preventDefault();
    e.stopPropagation();

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
    const outEvents$ = merge(documentClick$, itemClick$);
    outEvents$.pipe(
      map((evt: any) => {
        evt.stopPropagation();
        if (evt.type === 'click' || !evt.target.closest('.options-list-wrapper')) {
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
