import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';


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

  private setStyles(style: ITitleEditable): void {
    this.el.nativeElement.style.backgroundColor = style.bgColor;
    this.el.nativeElement.style.color = style.color;
    if (!this.focused) {
      this.el.nativeElement.style.cursor = style.cursor;
    }
    this.el.nativeElement.style.outline = style.outline;
    this.el.nativeElement.contentEditable = style.contentEditable;
    this.el.nativeElement.parentElement.style.width = style.width;
  }

  private defaultStyle: ITitleEditable = {
    color: 'inherit',
    bgColor: 'transparent',
    contentEditable: false,
    cursor: 'default',
    outline: '0',
    width: '100%'
  }

  private defaultHoverStyle: ITitleEditable = {
    color: 'inherit',
    bgColor: 'transparent',
    contentEditable: true,
    cursor: 'default',
    outline: '0',
    width: '100%'
  }

  private defaultEditStyle: ITitleEditable = {
    color: 'inherit',
    bgColor: 'transparent',
    contentEditable: true,
    cursor: 'text',
    outline: '0',
    width: '100%'
  }
}

interface ITitleEditable {
  color?: string;
  bgColor?: string;
  cursor?: string;
  outline?: string;
  contentEditable?: boolean;
  width?: string | number;
}

