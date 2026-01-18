import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_VisibilityState,
} from 'material-react-table';
import { Chip, Box } from '@mui/material';
import type { ColumnMetadata, User, Group } from '@/types';
import { formatDate } from '@/utils';
import { TableLoadingSkeleton } from './TableLoadingSkeleton';

interface DynamicGridProps {
  data: User[];
  columns: ColumnMetadata[];
  isLoading?: boolean;
  totalCount: number;
  pagination: MRT_PaginationState;
  onPaginationChange: (pagination: MRT_PaginationState) => void;
  sorting?: MRT_SortingState;
  onSortingChange?: (sorting: MRT_SortingState) => void;
  columnVisibility?: MRT_VisibilityState;
  onColumnVisibilityChange?: (visibility: MRT_VisibilityState) => void;
  onRowAction?: (user: User, action: string) => void;
}

/**
 * Renders cell content based on column type
 *
 * BUG: The 'chiplist' type for groups is not rendering correctly.
 * It should display group names as chips, but something is wrong.
 * TODO: Fix the chiplist renderer to properly display groups.: completed
 */
const renderCellByType = (
  value: unknown,
  columnMeta: ColumnMetadata
): React.ReactNode => {
  switch (columnMeta.type) {
    case 'string':
      return value as string;

    case 'badge':
      const status = value as 'active' | 'inactive';
      return (
        <Chip
          label={status}
          size="small"
          color={status === 'active' ? 'success' : 'default'}
          sx={{ textTransform: 'capitalize' }}
        />
      );

    case 'date':
      return formatDate(value as string, columnMeta.format);

    case 'chiplist':
      // BUG FIX: Now correctly accessing groupId and groupName properties
      const groups = value as Group[];
      if (!groups || groups.length === 0) {
        return <span style={{ color: '#999' }}>No groups</span>;
      }

      return (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {groups.map((group) => (
            <Chip
              key={group.groupId}
              label={group.groupName}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      );

    default:
      return String(value);
  }
};

/**
 * DynamicGrid Component
 *
 * A metadata-driven data grid using Material React Table.
 * Columns are generated dynamically based on the provided metadata.
 *
 * Features:
 * - Dynamic column generation from metadata
 * - Custom cell renderers for different data types
 * - Server-side pagination
 * - Sorting support
 */
export const DynamicGrid: React.FC<DynamicGridProps> = ({
  data,
  columns,
  isLoading = false,
  totalCount,
  pagination,
  onPaginationChange,
  sorting = [],
  onSortingChange,
  columnVisibility = {},
  onColumnVisibilityChange,
}) => {
  // Show loading skeleton instead of spinner
  if (isLoading && data.length === 0) {
    return <TableLoadingSkeleton columns={columns} rowCount={pagination.pageSize} />;
  }

  // Generate MRT columns from metadata
  const tableColumns = useMemo<MRT_ColumnDef<User>[]>(() => {
    return columns.map((colMeta) => ({
      accessorKey: colMeta.key,
      header: colMeta.header,
      size: colMeta.width,
      enableSorting: colMeta.sorting ?? false,
      enablePinning: !!colMeta.pinned,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return renderCellByType(value, colMeta);
      },
    }));
  }, [columns]);

  const table = useMaterialReactTable({
    columns: tableColumns,
    data,
    enableRowSelection: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableHiding: true, // Enable column visibility toggle
    enableSorting: true,
    manualPagination: true,
    manualSorting: false, // Client-side sorting for now
    rowCount: totalCount,
    state: {
      isLoading: false, // We handle loading with skeleton
      pagination,
      sorting,
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;
      onPaginationChange(newPagination);
    },
    onSortingChange: (updater) => {
      if (onSortingChange) {
        const newSorting =
          typeof updater === 'function' ? updater(sorting) : updater;
        onSortingChange(newSorting);
      }
    },
    onColumnVisibilityChange: (updater) => {
      if (onColumnVisibilityChange) {
        const newVisibility =
          typeof updater === 'function' ? updater(columnVisibility) : updater;
        onColumnVisibilityChange(newVisibility);
      }
    },
    muiTableContainerProps: {
      sx: { maxHeight: '600px' },
    },
    muiTableBodyRowProps: () => ({
      sx: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      },
    }),
  });

  return <MaterialReactTable table={table} />;
};
