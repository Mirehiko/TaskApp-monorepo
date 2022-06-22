import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { IElementStyle } from '../components/interfaces/element-style.interface';


@Directive({
  selector: '[appTitleEditable]'
})
export class TitleEditableDirective implements AfterViewInit {
  @Output() contentChanged: EventEmitter<string> = new EventEmitter<string>();
  private focused: boolean = false;

  constructor(private el: ElementRef) {

  }

  ngAfterViewInit(): void {
    this.setStyles(this.defaultStyle);
  }

  @HostListener('click') onMouseClick(e: MouseEvent) {
    this.setStyles(this.defaultEditStyle);
    this.focused = true;
  }

  @HostListener('mouseenter') onMouseEnter(e: MouseEvent) {
    this.setStyles(this.defaultHoverStyle);
  }

  @HostListener('blur') onMouseLeave() {
    this.setStyles(this.defaultStyle);
    this.contentChanged.emit(this.el.nativeElement.innerHTML);
    this.focused = false;
  }

  private setStyles(style: IElementStyle): void {
    this.el.nativeElement.style.backgroundColor = style.bgColor;
    this.el.nativeElement.style.color = style.color;
    if (!this.focused) {
      this.el.nativeElement.style.cursor = style.cursor;
    }
    this.el.nativeElement.style.outline = style.outline;
    this.el.nativeElement.contentEditable = style.contentEditable;
    this.el.nativeElement.parentElement.style.width = style.width;
  }

  private defaultStyle: IElementStyle = {
    color: 'inherit',
    bgColor: 'transparent',
    contentEditable: false,
    cursor: 'default',
    outline: '0',
    width: '100%'
  }

  private defaultHoverStyle: IElementStyle = {
    color: 'inherit',
    bgColor: 'transparent',
    contentEditable: true,
    cursor: 'default',
    outline: '0',
    width: '100%'
  }

  private defaultEditStyle: IElementStyle = {
    color: 'inherit',
    bgColor: 'transparent',
    contentEditable: true,
    cursor: 'text',
    outline: '0',
    width: '100%'
  }
}
