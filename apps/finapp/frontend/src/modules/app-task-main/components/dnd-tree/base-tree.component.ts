import { MatTree, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import {
  IActionListItem,
  IListConfig,
  IListItem,
  IListItemAction,
  IListItemFieldDescription, ListItemOption
} from '../list-module/base-list.component';
import { BaseDataChildrenService } from '../../services/base-data.service';

class TreeItemFlatNode<T> {
  item: IListItem<T>;
  level: number;
  expandable: boolean;
  selected: boolean;
}

interface ITreeGroup<T> {
  name: string;
  dataSource: MatTreeFlatDataSource<IListItem<T>, TreeItemFlatNode<T>>
}

@Component({
  selector: 'app-base-tree',
  template: '',
  styles: [],
  providers: []
})
export class BaseTreeComponent<T extends {id: number; pinned?: boolean, [index: string]: any}> implements OnInit {
  @Input() listName: string;
  @Input() dataList: any[] = [];
  @Input() config: IListConfig;
  @Input() menuItems: IActionListItem<any>[] = [];
  @Output() itemClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemAction: EventEmitter<IListItemAction> = new EventEmitter<IListItemAction>();
  @ViewChild('tree') private tree: MatTree<T>;
  groupDivider: (data: any[], type: any) => any[];
  public groups: ITreeGroup<T>[] = [];

  flatNodeMap = new Map<TreeItemFlatNode<T>, IListItem<T>>();
  nestedNodeMap = new Map<IListItem<T>, TreeItemFlatNode<T>>();

  selectedParent: TreeItemFlatNode<T> | null = null;
  selectedItems: TreeItemFlatNode<T>[] = [];
  newItemName = '';
  treeControl: FlatTreeControl<TreeItemFlatNode<T>>

  treeFlattener: MatTreeFlattener<IListItem<T>, TreeItemFlatNode<T>>;
  dataSource: MatTreeFlatDataSource<IListItem<T>, TreeItemFlatNode<T>>;
  selection = new SelectionModel<TreeItemFlatNode<T>>(true);

  constructor(
    private _database: BaseDataChildrenService<T>,
    private router: Router,
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<TreeItemFlatNode<T>>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database._dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  async ngOnInit(): Promise<void> {
    this.groupDivider = this.config.groupDivider ? this.config.groupDivider : this.groupDivider;
    this._database.initialize(this.dataList);
  }


  getLevel = (node: TreeItemFlatNode<T>) => node.level;
  isExpandable = (node: TreeItemFlatNode<T>) => node.expandable;
  getChildren = (node: IListItem<T>): IListItem<T>[] => node.children;
  hasChild = (_: number, _nodeData: TreeItemFlatNode<T>) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: TreeItemFlatNode<T>) => _nodeData.item === undefined;

  public selectItemOnClick(event: MouseEvent, item: TreeItemFlatNode<T>): void {
    event.stopPropagation();
    event.preventDefault();

    if (!event.ctrlKey && !event.shiftKey) {
      this.selectedItems = [item];
      this.openDetailView(item.item.id);
      this.changeSelection(this.treeControl.dataNodes.findIndex(i => i.item.id === item.item.id));
      return;
    }
    item.selected = !item.selected;
    this.selectedItems =
      item.selected ? this.selectedItems.concat(item) : this.selectedItems.filter(i => i.item.id != item.item.id);
    if (this.selectedItems.length > 1) {
      this.openMultiSelectionView();
    }
    else {
      this.openDetailView(item.item.id);
    }
  }

  public selectItemOnKey(event: KeyboardEvent, item: TreeItemFlatNode<T>): void {
    let nextItem: TreeItemFlatNode<T>;
    let searchData: TreeItemFlatNode<T>[] = [];
    let checkLevel = false;

    switch (event.keyCode) {
      case KeyCodeName.ARROW_LEFT:
      case KeyCodeName.ARROW_RIGHT: {return;}
      case KeyCodeName.ARROW_UP: {
        searchData = this.getLevelData(item);
        const currentIndex = searchData.indexOf(item);
        nextItem = this.isFirstElement(currentIndex) ? searchData[searchData.length - 1] : searchData[currentIndex - 1];

        if (nextItem.expandable && this.treeControl.isExpanded(nextItem) && item.level === 0) {
          nextItem = this.getLastNodeOfExpanded(nextItem);
        }
        else if (item.level > 0 && this.isFirstElement(currentIndex)) {
          nextItem = this.getNextAvailableNode(item, KeyCodeName.ARROW_UP);
        }
        else {
          nextItem = this.isFirstElement(currentIndex) ? searchData[searchData.length - 1] : searchData[currentIndex - 1];
        }
        break;
      }
      case KeyCodeName.ARROW_DOWN: {
        if (event.shiftKey) {
          checkLevel = true;
        }

        searchData = this.getLevelData(item);
        const currentIndex = searchData.indexOf(item);

        if (item.expandable && (checkLevel || this.treeControl.isExpanded(item))) {
          searchData = this.getChildrenByLevel(item, item.level + 1);
          nextItem = searchData[0];
        }
        else if (item.level > 0 && this.isLastElement(searchData, currentIndex)) {
          nextItem = this.getNextAvailableNode(item, KeyCodeName.ARROW_DOWN);
        }
        else {
          nextItem = this.isLastElement(searchData, currentIndex) ? searchData[0] : searchData[currentIndex + 1];
        }
        break;
      }
      case KeyCodeName.ENTER: {
        if (item.item.id === -1) {
          return;
        }
        if (event.shiftKey) {
          this.addNewChildrenItem(item);
        }
        else {
          this.addNewItem(item);
        }

        this.changeSelection(this.treeControl.dataNodes.findIndex(i => i.item.id === -1));
        return;
      }
      case KeyCodeName.HOME: {
        nextItem = this.treeControl.dataNodes[0];
        break;
      }
      case KeyCodeName.END: {
        nextItem = this.treeControl.dataNodes[this.treeControl.dataNodes.length - 1];
        break;
      }
      case KeyCodeName.DELETE: {
        this.deleteNode(item);
        return;
      }
      case KeyCodeName.ESCAPE: {
        if (item.item.id === -1) {
          this.deleteNode(item);
          return;
        }
        return;
      }
      default: {
        // return;
      }
    }

    if (item.expandable && checkLevel) {
      this.expandNodes(item);
    }
    if (nextItem) {
      this.changeSelection(this.treeControl.dataNodes.findIndex(i => i.item.id === nextItem.item.id));
    }
  }

  private getLastNodeOfExpanded(item: TreeItemFlatNode<T>): TreeItemFlatNode<T> {
    if (item.expandable && this.treeControl.isExpanded(item)) {
      const children = this.getChildrenByLevel(item, item.level + 1);
      return this.getLastNodeOfExpanded(children[children.length - 1]);
    }
    else {
      return item;
    }
  }

  private getNextAvailableNode(parent: TreeItemFlatNode<T>, arrow: KeyCodeName.ARROW_UP | KeyCodeName.ARROW_DOWN): TreeItemFlatNode<T> {
    let upperLevelNodes;
    if (parent.item.data.parent_id) {
      upperLevelNodes = this.treeControl.dataNodes
        .filter(i => i.level === parent.level && i.item.data.parent_id === parent.item.data.parent_id);
    }
    else {
      upperLevelNodes = this.treeControl.dataNodes;
    }

    const currentIndex = upperLevelNodes.indexOf(parent);
    if (parent.item.data.parent_id === -1 && this.isLastElement(upperLevelNodes, currentIndex)) {
      return upperLevelNodes[0];
    }

    if (arrow === KeyCodeName.ARROW_DOWN) {
      if (this.isLastElement(upperLevelNodes, currentIndex)) {
        return this.getNextAvailableNode(this.getParentNode(parent)!, arrow);
      }
      else {
        return upperLevelNodes[currentIndex + 1];
      }
    }
    else {
      return this.getParentNode(parent!)!;
    }
  }

  private expandNodes(node: TreeItemFlatNode<T>): void {
    if (node.expandable) {
      this.treeControl.expand(node);
    }
    const parent = this.getParentNode(node);
    if (parent) {
      this.expandNodes(parent);
    }
  }

  private getLevelData(item: TreeItemFlatNode<T>): TreeItemFlatNode<T>[] {
    return this.treeControl.dataNodes.filter(i => {
      if (i.level === item.level) {
        return i.item.data.parent_id === item.item.data.parent_id;
      }
      return false;
    });
  }

  private getChildrenByLevel(node: TreeItemFlatNode<T>, level: number): TreeItemFlatNode<T>[] {
    return this.treeControl.getDescendants(node).filter(i => i.level === level);
  }

  private isFirstElement(index: number): boolean {
    return index === 0;
  }

  private isLastElement(list: any[], index: number): boolean {
    return index === list.length - 1;
  }

  private changeSelection(index: number): void {
    this.treeControl.dataNodes.forEach((node, idx) => {
      if (idx === index) {
        node.selected = true;
      }
      else {
        node.selected = false;
      }
    });
  }

  public openMultiSelectionView(): void {

  }

  public async openDetailView(entityId: number): Promise<void> {
    if (!this.config.navigateTo) {
      throw new Error('navigateTo is required');
    }
    await this.router.navigate([`${this.config.navigateTo}/${entityId}`]);
  }

  private getMappedItem(item: T): IListItem<T> {
    const dataItem: IListItem<T> = new IListItem<T>();
    dataItem.id = item.id;
    dataItem.data = item;
    // dataItem.fields = [];

    this.config.listDescription.map((listDesc: IListItemFieldDescription) => {
      // dataItem.fields.push({
      //   value: listDesc.valueGetter ? listDesc.valueGetter(item) : item[listDesc.field],
      //   ...listDesc
      // });
      if (item?.pinned) {
        dataItem.pinned = item.pinned;
      }
    });
    return dataItem;
  }

  transformer = (node: any, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item.id === node.id ? existingNode : new TreeItemFlatNode<T>();
    flatNode.item = this.getMappedItem(node);
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TreeItemFlatNode<T>): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.selection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TreeItemFlatNode<T>): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.selection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TreeItemFlatNode<T>): void {
    this.selection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.selection.isSelected(node)
      ? this.selection.select(...descendants)
      : this.selection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.selection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TreeItemFlatNode<T>): void {
    this.selection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  public updateTitle(data: string, node: TreeItemFlatNode<T>): void {
    if (node.item.id === -1) {
      if (data.trim().length === 0) {
        return;
      }
      this.saveNode(node, data);
      console.log('save new item')
    }
    else {
      if (data !== node.item.data.name) {
        this.saveNode(node, data);
        console.log('update item')
      }
    }

    console.log(data)
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TreeItemFlatNode<T>): void {
    let parent: TreeItemFlatNode<T> | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TreeItemFlatNode<T>): void {
    const nodeSelected = this.selection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.selection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.selection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.selection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TreeItemFlatNode<T>): TreeItemFlatNode<T> | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewChildrenItem(node: TreeItemFlatNode<T>) {
    const parentNode = this.flatNodeMap.get(node);
    if (parentNode) {
      this._database.addChildren(parentNode, [this.addItemTemplate(node)]);
      this.treeControl.expand(node);
    }
    // else {
    //   this._database.insertItemTo(null, [newItem]);
    // }
  }

  private addItemTemplate(node: TreeItemFlatNode<T>): IListItem<T> {
    const item = new IListItem<T>();
    item.id = -1;
    item.parent_id = node?.item.data.parent_id;
    return item;
  }

  addNewItem(node: TreeItemFlatNode<T> | null = null) {
       const originNode = this.flatNodeMap.get(node!);
    const parentNode = this.getParentNode(node!);
    const originParentNode = this.flatNodeMap.get(parentNode!);
    this._database.insertItemTo(originParentNode!, originNode!, [this.addItemTemplate(node!)]);
  }

  /** Save the node to database */
  saveNode(node: TreeItemFlatNode<T>, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }

  deleteNode(node: TreeItemFlatNode<T>) {
    const originNode = this.flatNodeMap.get(node!);
    this.flatNodeMap.delete(node);
    this.nestedNodeMap.delete(originNode!);
    this._database.removeItem(originNode!);

    if (node.item.id !== -1) {
      // TODO: Query to database
    }
  }

  onMenuAction(node: number, action: ListItemOption): void {
    this.itemAction.emit({id: node, action});
  }
}

export enum KeyCodeName {
  ARROW_UP = 38,
  ARROW_DOWN = 40,
  ARROW_LEFT = 37,
  ARROW_RIGHT = 39,
  ENTER = 13,
  DELETE = 46,
  HOME = 36,
  END = 35,
  ESCAPE = 27
}
