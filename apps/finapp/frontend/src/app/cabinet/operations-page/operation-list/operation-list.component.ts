import { Component, Input, OnInit } from '@angular/core';
import { Operation } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.scss']
})
export class OperationListComponent implements OnInit {

  @Input() operations: Operation[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
