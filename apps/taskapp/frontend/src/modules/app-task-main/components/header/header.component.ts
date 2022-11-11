import { Component } from '@angular/core';
import { AuthDataService } from '../../services/auth-data.service';


@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent {
  constructor(
    private authDataService: AuthDataService,
  ) {
  }
}
