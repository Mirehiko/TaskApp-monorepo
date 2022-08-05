// import { Output, EventEmitter } from '@angular/core';
//
// export abstract class SelectableListComponent {
//   @Output() selected = new EventEmitter<Item>();
//   @Output() unselected = new EventEmitter<Item>();
//
//   selectedItems: Item[] = [];
//   select(item: Item) {
//     this.selected.emit(item);
//     this.selectedItems = [...this.selectedItems, item];
//   }
//
//   unselect(item: Item) {
//     this.unselected.emit(item);
//     this.selectedItems = this.selectedItems.filter(({value}) => value !== item.value);
//   }
//
//   isItemSelected(item: Item) {
//     return this.selectedItems.some(({value}) => item.value === value);
//   }
// }
