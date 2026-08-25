import {
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  globalFilteringFeature,
  rowExpandingFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/react-table';

export const fileTreeFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowExpandingFeature,
  rowSelectionFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  filteredRowModel: createFilteredRowModel(),
  expandedRowModel: createExpandedRowModel(),
});

export type FileTreeFeatures = typeof fileTreeFeatures;
