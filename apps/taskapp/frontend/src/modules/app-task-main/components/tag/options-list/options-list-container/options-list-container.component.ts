import { Component, ElementRef, HostBinding } from '@angular/core';
import { IElementStyle } from '../../../interfaces/element-style.interface';

@Component({
  selector: 'options-list-container',
  templateUrl: 'options-list-container.component.html',
  styleUrls: ['options-list-container.component.scss']
})
export class OptionsListContainerComponent {
  private _visible: boolean = false;

  @HostBinding('class') get classes(): string {
    return this._visible ? 'options-list-wrapper options-list-wrapper--opened' : 'options-list-wrapper';
  }

  constructor(private el: ElementRef) {
  }

  public show(style: IElementStyle): void {
    this.setStyles(style);
    this._visible = true;
  }

  public hide(): void {
    this._visible = false;
  }

  private setStyles(style: IElementStyle): void {
    this.el.nativeElement.style.top = style.top;
    this.el.nativeElement.style.left = style.left;
  }

  public get visible(): boolean {
    return this._visible;
  }
}
