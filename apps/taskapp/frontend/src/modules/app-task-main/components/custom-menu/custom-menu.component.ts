import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import { IElementStyle } from '../interfaces/element-style.interface';
import { DomService } from '../../services/cdk-dom.service';


@Component({
  selector: 'app-custom-menu',
  templateUrl: 'custom-menu.component.html',
  styleUrls: ['custom-menu.component.scss']
})
export class CustomMenuComponent {
  private _visible: boolean = false;
  public data: any;
  public menuContainer: any;
  @ViewChild('templatePortalContent') templatePortalContent: TemplateRef<unknown>;
  @Input() public available: boolean = true;
  @Output() onClickEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private el: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private domService: DomService
  ) {
  }

  public show(style: IElementStyle): void {
    this._visible = true;
    this.menuContainer = this.domService.attachTemplate(this.templatePortalContent, this._viewContainerRef).rootNodes[0];
    this.setStyles(style);
  }

  public hide(): void {
    this._visible = false;
    this.domService.removeComponent();
  }

  private setStyles(style: IElementStyle): void {
    this.menuContainer.style.top = style.top;
    this.menuContainer.style.left = style.left;
  }

  public get visible(): boolean {
    return this._visible;
  }

}
