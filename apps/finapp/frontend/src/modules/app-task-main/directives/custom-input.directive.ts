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
  @Input() lockEnter: boolean = false;
  @Input() placeholder: string = '';
  @Input() classList: string = '';
  protected focused: boolean = false;
  protected deleted: boolean = false;
  protected parentElement = document.createElement('div');
  protected placeholderElement = document.createElement('span');
  protected initiated: boolean = false;


  @HostListener('focus')
  @HostListener('click') onMouseClick(e: MouseEvent) {
    this.setStyles(this.defaultEditStyle);
    this.focused = true;
  }

  @HostListener('keydown', ['$event']) onEnterDown(e: KeyboardEvent) {
    this.changePlaceholderState();

    if (e.keyCode === KeyCodeName.ENTER && this.lockEnter) {
      e.preventDefault();
      this.onChange(this.el.nativeElement.innerHTML);
      this.onEnter.emit(this.el.nativeElement.innerHTML);
    }
  }

  @HostListener('keyup', ['$event']) onInput(e: KeyboardEvent) {
    this.changePlaceholderState();

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
    this.changePlaceholderState();
  }


  constructor(
    @Inject(ElementRef) protected el: ElementRef,
  ) {
    this.parentElement.classList.add('control-container');
    this.placeholderElement.classList.add('control-placeholder');
  }

  initControl() {
    if (this.initiated) {
      return;
    }
    this.placeholderElement.innerHTML = this.placeholder;
    this.placeholderElement.style.position = 'absolute';
    this.placeholderElement.style.zIndex = '0';
    this.parentElement.style.position = 'relative';
    if (this.classList) {
      this.parentElement.classList.add(...this.classList.split(' '));
    }
    this.el.nativeElement.style.position = 'relative';
    this.el.nativeElement.style.zIndex = '1';
    this.el.nativeElement.parentElement.replaceChild(this.parentElement, this.el.nativeElement);
    this.parentElement.append(this.placeholderElement);
    this.parentElement.append(this.el.nativeElement);
    this.changePlaceholderState();
  }

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
    if (changes['editable']?.currentValue) {
      this.setStyles(this.defaultEditStyle);
      this.focused = true;

      setTimeout(() => {
        this.el.nativeElement.focus();
        const sel = document.getSelection();
        sel?.selectAllChildren(this.el.nativeElement);
        sel?.collapseToEnd();
      }, 0);
    }
  }

  ngAfterViewInit(): void {
    this.initControl();
    this.setStyles(this.defaultStyle);
  }

  private setStyles(style: IElementStyle): void {
    this.el.nativeElement.style.backgroundColor = style.bgColor || '';
    this.el.nativeElement.style.color = style.color || '';
    if (!this.focused) {
      this.el.nativeElement.style.cursor = style.cursor || 'default';
    }
    this.el.nativeElement.style.outline = style.outline || '0';
    this.el.nativeElement.contentEditable = `${!!style.contentEditable}`;
    this.el.nativeElement.parentElement.style.width = style.width;
    this.el.nativeElement.style.height = style.height || 'auto';
  }

  private changePlaceholderState(): void {
    this.placeholderElement.style.opacity = this.el.nativeElement.innerHTML.length ? '0' : '0.5';
  }

  private defaultStyle: IElementStyle = {
    color: 'inherit',
    bgColor: 'transparent',
    contentEditable: false,
    cursor: 'default',
    outline: '0',
    width: '100%',
    height: '14px'
  }

  private defaultHoverStyle: IElementStyle = {
    color: 'inherit',
    bgColor: 'transparent',
    contentEditable: true,
    cursor: 'text',
    outline: '0',
    width: '100%',
    height: '14px'
  }

  private defaultEditStyle: IElementStyle = {
    color: 'inherit',
    bgColor: 'transparent',
    contentEditable: true,
    cursor: 'text',
    outline: '0',
    width: '100%',
    height: '14px'
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
