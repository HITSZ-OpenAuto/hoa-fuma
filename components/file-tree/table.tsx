'use client';

import { useMemo, useState } from 'react';
import {
  ColumnFiltersState,
  ExpandedState,
  RowSelectionState,
  flexRender,
  useTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { FileNode } from '@/lib/types';
import { getFileNodes, getAcceleratedUrl, downloadBatchFiles } from './utils';
import { createColumns } from './columns';
import { fileTreeFeatures } from './table-features';
import { Toolbar } from './toolbar';

interface FileTreeTableProps {
  data: FileNode[];
  className?: string;
  url?: string;
}

function getInitialExpanded(data: FileNode[]): ExpandedState {
  const expanded: Record<string, boolean> = {};
  const stack: FileNode[][] = [data];

  while (stack.length > 0) {
    const nodes = stack.pop()!;
    for (const node of nodes) {
      if (node.type === 'folder' && node.defaultOpen) {
        expanded[node.id] = true;
      }
      if (node.children) {
        stack.push(node.children);
      }
    }
  }

  return expanded;
}

function getFilteredExpanded(data: FileNode[], filter: string): ExpandedState {
  const expanded: Record<string, boolean> = {};
  const query = filter.toLowerCase();

  function visit(nodes: FileNode[]): boolean {
    let subtreeMatches = false;

    for (const node of nodes) {
      const nodeMatches = node.name.toLowerCase().includes(query);
      const childrenMatch = node.children ? visit(node.children) : false;
      const matches = nodeMatches || childrenMatch;

      if (node.type === 'folder' && matches) {
        expanded[node.id] = true;
      }
      subtreeMatches ||= matches;
    }

    return subtreeMatches;
  }

  visit(data);
  return expanded;
}

export function FileTreeTable({ data, className, url }: FileTreeTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>(() =>
    getInitialExpanded(data)
  );
  const [isAccelerated, setIsAccelerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const columns = useMemo(
    () => createColumns({ isAccelerated }),
    [isAccelerated]
  );

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
    setExpanded(value ? getFilteredExpanded(data, value) : {});
  };

  const table = useTable({
    features: fileTreeFeatures,
    data,
    columns,
    state: {
      globalFilter,
      rowSelection,
      columnFilters,
      expanded,
    },
    onGlobalFilterChange: handleGlobalFilterChange,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.children,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    filterFromLeafRows: true,
    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const name = row.original.name;
      return name.toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  const selectedRowCount = Object.keys(rowSelection).length;
  const hasResults = table.getRowModel().rows.length > 0;

  const handleBatchDownload = async () => {
    if (selectedRowCount === 0) return;
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const allFiles = getFileNodes(data);
      const selectedFiles = allFiles
        .filter((file) => rowSelection[file.id])
        .map((file) => ({
          path: file.id,
          url: isAccelerated ? getAcceleratedUrl(file.url!) : file.url!,
          name: file.name,
        }));

      if (selectedFiles.length === 0) {
        toast.error('请选择要下载的文件');
        return;
      }

      await downloadBatchFiles(selectedFiles, setDownloadProgress);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Batch download failed:', error);
      toast.error(`下载失败: ${message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={cn('not-prose flex w-full flex-col gap-4', className)}>
      <Toolbar
        globalFilter={globalFilter}
        setGlobalFilter={handleGlobalFilterChange}
        isAccelerated={isAccelerated}
        setIsAccelerated={setIsAccelerated}
        isDownloading={isDownloading}
        downloadProgress={downloadProgress}
        selectedRowCount={selectedRowCount}
        onBatchDownload={handleBatchDownload}
        url={url}
      />

      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="text-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/50 whitespace-nowrap"
              >
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | { className?: string }
                    | undefined;
                  return (
                    <TableHead
                      key={header.id}
                      className={cn('h-9 py-2', meta?.className)}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {hasResults ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    row.original.type === 'folder' && 'h-12 cursor-pointer'
                  )}
                  onClick={
                    row.original.type === 'folder'
                      ? () => row.toggleExpanded()
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { className?: string }
                      | undefined;
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn('py-2', meta?.className)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  未找到相关文件
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
