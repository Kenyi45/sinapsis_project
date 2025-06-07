import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'badge' | 'actions';
  format?: (value: any) => string;
  badgeColors?: { [key: string]: string };
}

export interface TableAction {
  icon: string;
  label: string;
  color?: string;
  handler: (row: any) => void;
  disabled?: (row: any) => boolean;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc' | null;
}

export interface PaginationEvent {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable implements OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() selectable = false;
  @Input() pagination = true;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() sortColumn: string | null = null;
  @Input() sortDirection: 'asc' | 'desc' | null = null;
  @Input() emptyMessage = 'No hay datos disponibles';

  @Output() sort = new EventEmitter<SortEvent>();
  @Output() paginate = new EventEmitter<PaginationEvent>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() rowClick = new EventEmitter<any>();

  selectedRows: Set<any> = new Set();
  allSelected = false;
  indeterminate = false;
  displayedData: any[] = [];
  totalPages = 0;
  pageNumbers: number[] = [];

  ngOnInit(): void {
    this.updateDisplayedData();
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['pageSize'] || changes['currentPage']) {
      this.updateDisplayedData();
      this.updatePagination();
    }
    if (changes['data']) {
      this.updateSelectionState();
    }
  }

  private updateDisplayedData(): void {
    if (!this.pagination) {
      this.displayedData = [...this.data];
      return;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedData = this.data.slice(startIndex, endIndex);
  }

  private updatePagination(): void {
    if (!this.pagination) return;

    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (this.sortColumn === column.key) {
      if (this.sortDirection === 'asc') {
        direction = 'desc';
      } else if (this.sortDirection === 'desc') {
        direction = null;
      }
    }

    this.sortColumn = direction ? column.key : null;
    this.sortDirection = direction;

    this.sort.emit({
      column: column.key,
      direction
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    this.paginate.emit({
      page: this.currentPage,
      pageSize: this.pageSize
    });
  }

  toggleAllSelection(): void {
    if (this.allSelected) {
      this.selectedRows.clear();
    } else {
      this.displayedData.forEach(row => this.selectedRows.add(row));
    }
    this.updateSelectionState();
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  toggleRowSelection(row: any): void {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
    this.updateSelectionState();
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  private updateSelectionState(): void {
    const selectedCount = this.selectedRows.size;
    const totalCount = this.displayedData.length;
    
    this.allSelected = selectedCount > 0 && selectedCount === totalCount;
    this.indeterminate = selectedCount > 0 && selectedCount < totalCount;
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  getCellValue(row: any, column: TableColumn): any {
    const value = row[column.key];
    
    if (column.format) {
      return column.format(value);
    }

    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      case 'boolean':
        return value ? 'Sí' : 'No';
      default:
        return value ?? '-';
    }
  }

  getBadgeClass(value: any, column: TableColumn): string {
    if (!column.badgeColors || !value) return 'bg-gray-100 text-gray-800';
    
    const colorClass = column.badgeColors[value.toString()];
    return colorClass || 'bg-gray-100 text-gray-800';
  }

  getSortIcon(column: TableColumn): string {
    if (!column.sortable) return '';
    
    if (this.sortColumn !== column.key) return 'unfold_more';
    
    return this.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  isActionDisabled(action: TableAction, row: any): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  executeAction(action: TableAction, row: any, event: Event): void {
    event.stopPropagation();
    if (!this.isActionDisabled(action, row)) {
      action.handler(row);
    }
  }

  // Helper methods for template
  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getMax(a: number, b: number): number {
    return Math.max(a, b);
  }
}
