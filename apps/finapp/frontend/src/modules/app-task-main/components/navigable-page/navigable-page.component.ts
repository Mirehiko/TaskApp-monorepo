import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-navigable-page',
  templateUrl: 'navigable-page.component.html',
  styleUrls: ['navigable-page.component.scss']
})
export class NavigablePageComponent {
  @Input() pageName: string = '';
  public isMenuVisible: boolean = true;

  public toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }
}
