import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { DndTreeDatabaseService, TreeItem } from './dnd-tree-database.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {
  BaseGroupList,
  BaseListOfGroup,
  IListConfig, IListItem,
  IListItemAction,
  IListItemFieldDescription
} from '../list-module/base-list.component';


class TreeItemFlatNode<T> {
  item: IListItem<T>;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-dnd-tree',
  templateUrl: 'dnd-tree.component.html',
  styleUrls: ['dnd-tree.component.scss'],
  providers: [DndTreeDatabaseService]
})
export class DndTreeComponent<T> implements OnInit {
  @Input() listName: string;
  @Input() dataList: any[] = [];
  @Input() config: IListConfig;
  @Output() itemClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemAction: EventEmitter<IListItemAction> = new EventEmitter<IListItemAction>();
  @ContentChild('customTemplate') customTemplate: TemplateRef<any>;
  groupDivider: (data: any[], type: any) => any[];
  _groupedList: BaseGroupList<T> = new BaseGroupList<T>('');


  flatNodeMap = new Map<TreeItemFlatNode<T>, TreeItem>();
  nestedNodeMap = new Map<TreeItem, TreeItemFlatNode<T>>();

  selectedParent: TreeItemFlatNode<T> | null = null;

  newItemName = '';
  treeControl: FlatTreeControl<TreeItemFlatNode<T>>

  treeFlattener: MatTreeFlattener<TreeItem, TreeItemFlatNode<T>>;
  dataSource: MatTreeFlatDataSource<TreeItem, TreeItemFlatNode<T>>;
  selection = new SelectionModel<TreeItemFlatNode<T>>(true);

  constructor(private _database: DndTreeDatabaseService) {
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

  ngOnInit(): void {
    this.groupDivider = this.config.groupDivider ? this.config.groupDivider : this.groupDivider;
    this._database.initialize(this.dataList);
  }


  getLevel = (node: TreeItemFlatNode<T>) => node.level;
  isExpandable = (node: TreeItemFlatNode<T>) => node.expandable;
  getChildren = (node: TreeItem): TreeItem[] => node.children;
  hasChild = (_: number, _nodeData: TreeItemFlatNode<T>) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: TreeItemFlatNode<T>) => _nodeData.item === undefined;

  private async divideOnGroups(): Promise<void> {
    this._groupedList.clear();
    if (this.config.groups && this.config.groups.length && this.config.groupDivider) {
      this.config.groups.forEach(group => {
        const groupInst = new BaseListOfGroup<T>(group.name);
        const filteredGroupData = this.groupDivider(this.dataList, group.type);
        filteredGroupData.map(item => {
          groupInst.insertTo(this.getMappedItem(item));
        });
        this._groupedList.addGroup(groupInst);
      });
    }
    else {
      const groupInst = new BaseListOfGroup<T>('');
      this.dataList.forEach(item => {
        groupInst.insertTo(this.getMappedItem(item));
      });
      this._groupedList.addGroup(groupInst);
    }
  }

  public openDetailView(item: TreeItemFlatNode<T>): void {

  }

  private getMappedItem(item: any): TreeItem {
    const dataItem: TreeItem = new TreeItem();
    dataItem.id = item.id;
    dataItem.data = item;
    dataItem.fields = [];

    this.config.listDescription.map((listDesc: IListItemFieldDescription) => {
      dataItem.fields.push({
        value: listDesc.valueGetter ? listDesc.valueGetter(item) : item[listDesc.field],
        ...listDesc
      });
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
  addNewItem(node: TreeItemFlatNode<T>) {
    const parentNode = this.flatNodeMap.get(node);
    const newItem = new TreeItem();
    this._database.insertItem(parentNode ? parentNode : null, [newItem]);
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TreeItemFlatNode<T>, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }
}


