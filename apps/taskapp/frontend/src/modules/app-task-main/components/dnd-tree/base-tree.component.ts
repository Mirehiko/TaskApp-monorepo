import { MatTree, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IActionListItem,
  IListConfig,
  IListItemAction,
  ITreeItem,
  ListItemOption
} from '../list-module/base-list.component';
import { BaseTreeDatabaseService } from '../../services/base-data.service';


class TreeItemFlatNode<T> extends ITreeItem<T> {
  level: number;
  expandable: boolean;
  selected: boolean;
}


@Component({
  selector: 'app-base-tree',
  template: '',
  styles: [],
  providers: []
})
export class BaseTreeComponent<T> implements OnInit, OnChanges {
  @Input() listName: string;
  @Input() dataList: ITreeItem<T>[] = [];
  @Input() config: IListConfig;
  @Input() menuItems: IActionListItem<any>[] = [];
  @Output() itemClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemAction: EventEmitter<IListItemAction> = new EventEmitter<IListItemAction>();
  @ViewChild('tree') private tree: MatTree<T>;
  groupDivider: (data: any[], type: any) => any[];
  groupedData: ITreeItem<T>[] = [];
  public currentFocusId: number = -2;

  flatNodeMap = new Map<TreeItemFlatNode<T>, ITreeItem<T>>();
  nestedNodeMap = new Map<ITreeItem<T>, TreeItemFlatNode<T>>();

  selectedParent: TreeItemFlatNode<T> | null = null;
  selectedItems: TreeItemFlatNode<T>[] = [];
  newItemName = '';
  treeControl: FlatTreeControl<TreeItemFlatNode<T>>

  treeFlattener: MatTreeFlattener<ITreeItem<T>, TreeItemFlatNode<T>>;
  dataSource: MatTreeFlatDataSource<ITreeItem<T>, TreeItemFlatNode<T>>;
  selection = new SelectionModel<TreeItemFlatNode<T>>(true);

  hasGroups: boolean = false;

  constructor(
    private _database: BaseTreeDatabaseService<T>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
      if (!this.hasGroups || !this._database.initGroups) {
        return;
      }
      this.dataSource.data.forEach(g => {
        this.treeControl.expand(this.nestedNodeMap.get(g)!);
      });
      this._database.initGroups = false;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['dataList']) {
      await this.initData();
    }
  }

  async initData(): Promise<void> {
    if (!this.groupDivider) {
      this.groupDivider = this.config.groupDivider ? this.config.groupDivider : this.groupDivider;
    }
    await this.divideOnGroups(this.dataList);
    this._database.initialize(this.groupedData);
  }

  private async divideOnGroups(list: ITreeItem<T>[]): Promise<void> {
    this.groupedData = [];
    if (this.config.groups && this.config.groups.length && this.config.groupDivider) {
      this.config.groups.forEach((group, index) => {
        const groupItem = this.addItemTemplate(-2, index, group.name, true);
        const filteredGroupData = this.groupDivider(list, group.type);
        filteredGroupData.map(item => {
          groupItem.children.push(item);
        });
        this.groupedData.push(groupItem);

      });
      this.hasGroups = true;
    }
    else {
      this.hasGroups = false;
      list.forEach(item => {
        console.log(item)
        this.groupedData.push(item);
      });
    }
  }

  getLevel = (node: TreeItemFlatNode<T>) => node.level;
  isExpandable = (node: TreeItemFlatNode<T>) => node.expandable;
  getChildren = (node: ITreeItem<T>): ITreeItem<T>[] => node.children;
  hasChild = (_: number, _nodeData: TreeItemFlatNode<T>) => _nodeData.expandable && !_nodeData.isGroup;
  isGroup = (_: number, _nodeData: TreeItemFlatNode<T>) => _nodeData.isGroup;
  hasNoContent = (_: number, _nodeData: TreeItemFlatNode<T>) => _nodeData === undefined;
  readonly trackBy = (_: number, node: TreeItemFlatNode<T>) => node.id;

  public selectItemOnClick(event: MouseEvent, item: TreeItemFlatNode<T>): void {
    if (item.isGroup) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();

    this.currentFocusId = item.data.id;
    if (!event.ctrlKey && !event.shiftKey) {
      this.selectedItems = [item];
      this.changeSelection(this.treeControl.dataNodes.findIndex(i => i.data.id === item.data.id));
      if (!this.config.lockNavigateToItemOnKey) {
        this.openDetailView(item.data.id);
      }
      return;
    }

    item.selected = !item.selected;
    this.currentFocusId = item.selected ? item.data.id : -2;
    this.selectedItems =
      item.selected ? this.selectedItems.concat(item) : this.selectedItems.filter(i => i.data.id != item.data.id);

    if (!this.config.lockNavigateToItemOnKey) {
      this.isMultiSelection() ? this.openMultiSelectionView() : this.openDetailView(item.data.id);
    }
  }

  public selectItemOnKey(event: KeyboardEvent, item: TreeItemFlatNode<T>): void {
    if (item.isGroup) {
      return;
    }
    let nextItem: TreeItemFlatNode<T>;
    let searchData: TreeItemFlatNode<T>[] = [];
    let checkLevel = false;
    let isMulti = false;
    let currentIndex;
    switch (event.keyCode) {
      case KeyCodeName.ARROW_LEFT:
      case KeyCodeName.ARROW_RIGHT: {return;}
      case KeyCodeName.ARROW_UP: {
        if (event.ctrlKey) {
          return;
        }
        isMulti = event.shiftKey;
        searchData = this.getLevelData(item);
        currentIndex = searchData.indexOf(item);
        nextItem = BaseTreeComponent.isFirstElement(currentIndex) ? searchData[searchData.length - 1] : searchData[currentIndex - 1];

        if (item.level > 0 && BaseTreeComponent.isFirstElement(currentIndex)) {
          nextItem = this.getNextAvailableNode(item, KeyCodeName.ARROW_UP);
        }
        else if (nextItem.expandable && this.treeControl.isExpanded(nextItem) ) {
          nextItem = this.getLastNodeOfExpanded(nextItem);
        }
        else {
          nextItem = BaseTreeComponent.isFirstElement(currentIndex) ? searchData[searchData.length - 1] : searchData[currentIndex - 1];
        }
        break;
      }
      case KeyCodeName.ARROW_DOWN: {
        if (event.shiftKey && event.ctrlKey) {
          checkLevel = true;
        }
        else if (event.ctrlKey) {
          return;
        }

        isMulti = event.shiftKey;

        searchData = this.getLevelData(item);
        currentIndex = searchData.indexOf(item);

        if (item.expandable && (checkLevel || this.treeControl.isExpanded(item))) {
          searchData = this.getChildrenByLevel(item, item.level + 1);
          nextItem = searchData[0];
        }
        else if (item.level > 0 && BaseTreeComponent.isLastElement(searchData, currentIndex)) {
          nextItem = this.getNextAvailableNode(item, KeyCodeName.ARROW_DOWN);
        }
        else {
          nextItem = BaseTreeComponent.isLastElement(searchData, currentIndex) ? searchData[0] : searchData[currentIndex + 1];
        }
        break;
      }
      case KeyCodeName.ENTER: {
        if (item.data.id === -1) {
          return;
        }
        if (event.shiftKey) {
          this.addNewChildrenItem(item);
        }
        else {
          this.addNewItem(item);
        }

        this.changeSelection(this.treeControl.dataNodes.findIndex(i => i.data.id === -1));
        return;
      }
      case KeyCodeName.HOME: {
        // TODO: go to top
        nextItem = this.treeControl.dataNodes[0];
        break;
      }
      case KeyCodeName.END: {
        // TODO: go to last or child of last (if opened)
        nextItem = this.treeControl.dataNodes[this.treeControl.dataNodes.length - 1];
        break;
      }
      case KeyCodeName.DELETE: {
        const element = event.target as HTMLElement;
        if (event.ctrlKey || element.innerHTML.trim().length === 0) {
          this.deleteNode(item);
        }
        return;
      }
      case KeyCodeName.ESCAPE: {
        if (item.data.id === -1) {
          this.deleteNode(item);
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

    if (!nextItem!) {
      return;
    }
    if (nextItem.isGroup) {
      return;
    }

    if (isMulti) {
      const selectionIndex = this.selectedItems.findIndex(i => i.data.id === nextItem.data.id);
      this.selectedItems =
        selectionIndex === -1
          ? this.selectedItems.concat(nextItem) : this.selectedItems.splice(0, selectionIndex + 1);
    }
    else {
      this.selectedItems = [nextItem];
    }

    this.currentFocusId = nextItem.data.id;
    this.changeSelection(this.treeControl.dataNodes.findIndex(i => i.data.id === nextItem.data.id), isMulti);
    if (!this.config.lockNavigateToItemOnKey) {
      this.isMultiSelection() ? this.openMultiSelectionView() : this.openDetailView(nextItem.data.id === -1 ? 'new' : nextItem.data.id);
    }
  }

  private isMultiSelection(): boolean {
    return this.selectedItems.length > 1;
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
    if (parent.data.parent_id) {
      upperLevelNodes = this.treeControl.dataNodes
        .filter(i => i.level === parent.level && i.data.parent_id === parent.data.parent_id);
    }
    else {
      upperLevelNodes = this.treeControl.dataNodes;
    }

    const currentIndex = upperLevelNodes.indexOf(parent);
    if (parent.data.parent_id === -1 && BaseTreeComponent.isLastElement(upperLevelNodes, currentIndex)) {
      return upperLevelNodes[0];
    }

    if (arrow === KeyCodeName.ARROW_DOWN) {
      if (BaseTreeComponent.isLastElement(upperLevelNodes, currentIndex)) {
        return this.getNextAvailableNode(this.getParentNode(parent)!, arrow);
      }
      return upperLevelNodes[currentIndex + 1];
    }
    else {
      if (parent.data.parent_id === -1 && BaseTreeComponent.isFirstElement(currentIndex)) {
        return upperLevelNodes[upperLevelNodes.length - 1];
      }
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
        return i.data.parent_id === item.data.parent_id;
      }
      return false;
    });
  }

  private getChildrenByLevel(node: TreeItemFlatNode<T>, level: number): TreeItemFlatNode<T>[] {
    return this.treeControl.getDescendants(node).filter(i => i.level === level);
  }

  private static isFirstElement(index: number): boolean {
    return index === 0;
  }

  private static isLastElement(list: any[], index: number): boolean {
    return index === list.length - 1;
  }

  private changeSelection(index: number, multiselect: boolean = false): void {
    this.treeControl.dataNodes.forEach((node, idx) => {
      if (multiselect) {
        node.selected = this.selectedItems.findIndex(i => i.data.id === node.data.id) !== -1;
      }
      else {
        node.selected = idx === index;
      }
    });
  }

  public openMultiSelectionView(): void {
    console.log('multiselection')
  }

  public async openDetailView(entityId: number | string): Promise<void> {
    if (!this.config.navigateTo) {
      throw new Error('navigateTo is required');
    }
    await this.router.navigate(
      [`${this.config.navigateTo}/${entityId === -1 ? 'new' : entityId}`],
      {relativeTo: this.activatedRoute});
  }

  transformer = (node: ITreeItem<T>, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.data.id === node.id
      ? existingNode : node as TreeItemFlatNode<T>;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    flatNode.isGroup = node.isGroup;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TreeItemFlatNode<T>): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.length > 0 &&
      descendants.every(child => {
        return this.selection.isSelected(child);
      });;
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
    if (node.data.id === -1) {
      if (data.trim().length === 0) {
        return;
      }
      this.saveNode(node, data);
      console.log('save new item')
    }
    else {
      if (data !== node.data.name) {
        this.saveNode(node, data);
        console.log('update item')
      }
    }
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
      this._database.addChildren(parentNode, [this.addItemTemplate(-1, node.data.id, '', false)]);
      this.treeControl.expand(node);
    }
    // else {
    //   this._database.insertItemTo(null, [newItem]);
    // }
  }

  private addItemTemplate(id: number, parent: number, name: string, isGroup: boolean): ITreeItem<T> {
    const item: ITreeItem<T> = new ITreeItem<T>();
    item.data = {};
    item.data.name = name;
    item.data.id = id;
    item.id = id;
    item.isGroup = isGroup;
    item.data.parent_id = parent;
    item.children = [];
    return item;
  }

  addNewItem(node: TreeItemFlatNode<T> | null = null) {
    const originNode = this.flatNodeMap.get(node!);
    this._database.insertTo(
      originNode!,
      [this.addItemTemplate(-1, node?.data.parent_id, '', false)]);
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

    if (node.data.id !== -1) {
      // TODO: Query to database
    }
  }



  onMenuAction(node: TreeItemFlatNode<T>, action: ListItemOption): void {
    switch (action) {
      case ListItemOption.COPY_LINK: {
        this.copyLink(node.id);
        break;
      }
      case ListItemOption.ADD_CHILD: {
        this.addNewChildrenItem(node);
        this.changeSelection(this.treeControl.dataNodes.findIndex(i => i.data.id === -1));
        break;
      }
      case ListItemOption.PIN: {
        if (node.pinned) {
          this._database.unpin('asd', node);
        }
        else {
          this._database.pin('asd', node);
        }
        break;
      }
      case ListItemOption.DELETE: {
        this.deleteNode(node);
        break;
      }
      default: {
        this.itemAction.emit({id: node.id, action});
      }
    }
  }

  copyLink(id: number): void {
    // TODO: Add variable to put domain into url
    navigator.clipboard.writeText(`${this.config.navigateTo}/${id === -1 ? 'new' : id}`);
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
