import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener, Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { KeyCodeName } from '../components/dnd-tree/base-tree.component';
import { IElementStyle } from '../components/interfaces/element-style.interface';


@Directive({
  selector: '[inputDirective]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CustomInputDirective),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => CustomInputDirective),
    }
  ]
})
export class CustomInputDirective implements ControlValueAccessor, Validator, OnChanges, AfterViewInit {
  value: string = '';
  touched = false;
  disabled = false;
  @Output() contentChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() onEnter: EventEmitter<string> = new EventEmitter<string>();
  @Input() editable: boolean = false;
  protected focused: boolean = false;
  protected deleted: boolean = false;

  @HostListener('focus')
  @HostListener('click') onMouseClick(e: MouseEvent) {
    this.setStyles(this.defaultEditStyle);
    this.focused = true;
  }

  @HostListener('keydown', ['$event']) onEnterDown(e: KeyboardEvent) {
    if (e.keyCode === KeyCodeName.ENTER) {
      e.preventDefault();
      this.onChange(this.el.nativeElement.innerHTML);
      this.onEnter.emit(this.el.nativeElement.innerHTML);
    }
  }

  @HostListener('keyup', ['$event']) onInput(e: KeyboardEvent) {
    if (this.deleted) {
      return;
    }
    this.onChange(this.el.nativeElement.innerHTML);
  }

  @HostListener('mouseenter') onMouseEnter(e: MouseEvent) {
    this.setStyles(this.defaultHoverStyle);
  }

  @HostListener('blur') onMouseLeave() {
    if (this.deleted) {
      return;
    }
    this.setStyles(this.defaultStyle);
    this.contentChanged.emit(this.el.nativeElement.innerHTML);
    this.focused = false;
  }


  constructor(
    @Inject(ElementRef) protected el: ElementRef,
  ) {}

  onChange: any = () => {}

  onTouch: any = () => {}

  writeValue(value: string) {
    this.value = value;
  }

  onCurrentChange(value: string): void {
    this.value = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouch = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouch();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== '') {
      return {
        mustHasValue: {
          value
        }
      };
    }
    return null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editable'].currentValue) {
      this.setStyles(this.defaultEditStyle);
      this.focused = true;

      setTimeout(() => {
        this.el.nativeElement.focus();
        const sel = document.getSelection();
        sel.selectAllChildren(this.el.nativeElement);
        sel.collapseToEnd();
      }, 0);
    }
  }

  ngAfterViewInit(): void {
    this.setStyles(this.defaultStyle);
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
    cursor: 'text',
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


@Directive({
  selector: '[listInputDirective]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CustomInputDirective),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => CustomInputDirective),
    }
  ]
})
export class CustomListInputDirective extends CustomInputDirective {
  onEnterDown(e: KeyboardEvent) {
    if (e.keyCode === KeyCodeName.ENTER) {
      e.preventDefault();
      this.onChange(this.el.nativeElement.innerHTML);
      this.onEnter.emit(this.el.nativeElement.innerHTML);
    }
    if ((e.keyCode === KeyCodeName.ESCAPE || e.keyCode === KeyCodeName.DELETE) && this.el.nativeElement.innerHTML.trim().length === 0) {
      this.deleted = true;
    }
  }
}
