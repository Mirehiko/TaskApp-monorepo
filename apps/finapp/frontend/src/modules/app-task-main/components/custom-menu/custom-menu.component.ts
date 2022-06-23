import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { IElementStyle } from '../interfaces/element-style.interface';


@Component({
  selector: 'app-custom-menu',
  templateUrl: 'custom-menu.component.html',
  styleUrls: ['custom-menu.component.scss']
})
export class CustomMenuComponent {
  private _visible: boolean = false;
  @Input() public available: boolean = true;

  @HostBinding('class') get classes(): string {
    return this._visible ? 'list-item-menu--opened' : '';
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
