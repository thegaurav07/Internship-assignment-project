import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from 'notistack';
import { DynamicGrid, UserActions, ErrorFallback } from '@/components';
import { useUsers, useUpdateUserStatus, useDebounce, useLocalStorage } from '@/hooks';
import { userColumnMetadata } from '@/utils';
import type { MRT_PaginationState, MRT_SortingState, MRT_VisibilityState } from 'material-react-table';
import type { User, ColumnMetadata } from '@/types';

/**
 * Users Page Component
 *
 * Displays a paginated, filterable list of users.
 *
 * KNOWN BUGS FOR CANDIDATE TO FIX:
 *
 * BUG #1: After changing user status, the table doesn't refresh.
 *         (Located in useUsers hook - cache invalidation issue)
 *
 * BUG #2: The 'Groups' column shows "[object Object]" instead of group names.
 *         (Located in DynamicGrid component - chiplist renderer issue)
 *
 * BUG #3: Page/filter state is not synced with URL params.
 *         When you change page or filter, URL doesn't update.
 *         When you refresh, pagination resets to page 1.
 *         (Located in this file - URL sync issue)
 *
 * INCOMPLETE FEATURES:
 *
 * 1. Search is not debounced - API is called on every keystroke.
 * 2. No loading skeleton - just shows spinner.
 * 3. No error boundary or proper error UI.
 */
export const UsersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  // BUG FIX #3: Initialize state from URL params directly to avoid flickering
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    (searchParams.get('status') as 'all' | 'active' | 'inactive') || 'all'
  );
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: searchParams.get('page') ? parseInt(searchParams.get('page')!) - 1 : 0,
    pageSize: 10,
  });

  // BONUS: Persist column visibility in localStorage
  const [columnVisibility, setColumnVisibility] = useLocalStorage<MRT_VisibilityState>(
    'users-table-column-visibility',
    {} // All columns visible by default
  );

  // BONUS: Initialize sorting from URL params and persist in URL
  const [sorting, setSorting] = useState<MRT_SortingState>(() => {
    const sortParam = searchParams.get('sort');
    const orderParam = searchParams.get('order');
    if (sortParam) {
      return [{ id: sortParam, desc: orderParam === 'desc' }];
    }
    return [];
  });

  // BUG FIX: Use debounced search to prevent API calls on every keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch users with debounced search
  const { data, isLoading, error } = useUsers({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    query: debouncedSearchQuery,
    status: statusFilter,
  });

  // BUG FIX #3: Update URL params when filters or sorting change
  useEffect(() => {
    const params: Record<string, string> = {};
    
    // Always include page parameter
    params.page = (pagination.pageIndex + 1).toString();
    
    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }
    if (debouncedSearchQuery) {
      params.search = debouncedSearchQuery;
    }
    
    // BONUS: Persist sort order in URL
    if (sorting.length > 0) {
      params.sort = sorting[0].id;
      params.order = sorting[0].desc ? 'desc' : 'asc';
    }
    
    setSearchParams(params, { replace: true });
  }, [pagination.pageIndex, statusFilter, debouncedSearchQuery, sorting, setSearchParams]);

  // Update user status mutation
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();

  // Handle status toggle
  const handleToggleStatus = (userId: string, newStatus: 'active' | 'inactive') => {
    updateStatus(
      { userId, status: newStatus },
      {
        onSuccess: (response) => {
          enqueueSnackbar(response.message, { variant: 'success' });
          // BUG: Table doesn't refresh after this!
        },
        onError: () => {
          enqueueSnackbar('Failed to update user status', { variant: 'error' });
        },
      }
    );
  };

  // Handle search input change (debouncing handled via useDebounce hook)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Reset to first page when searching
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: 'all' | 'active' | 'inactive') => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Handle pagination change
  const handlePaginationChange = (newPagination: MRT_PaginationState) => {
    setPagination(newPagination);
  };

  // Add actions column to metadata
  const columnsWithActions: ColumnMetadata[] = [
    ...userColumnMetadata,
    {
      key: 'actions',
      header: 'Actions',
      type: 'string',
      width: 100,
    },
  ];

  // Transform data to include actions renderer
  const usersWithActions = (data?.data?.users || []).map((user: User) => ({
    ...user,
    actions: (
      <UserActions
        user={user}
        onToggleStatus={handleToggleStatus}
        isUpdating={isUpdating}
      />
    ),
  }));

  // Error state with retry functionality
  if (error) {
    const isNetworkError = 
      error.message.includes('fetch') || 
      error.message.includes('network') ||
      error.message.includes('NetworkError');

    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Users
        </Typography>
        <ErrorFallback
          error={error as Error}
          onRetry={() => window.location.reload()}
          isNetworkError={isNetworkError}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Users
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Search Input */}
          <TextField
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) =>
                handleStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')
              }
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          {/* Results Count */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <Typography variant="body2" color="text.secondary">
              {data?.data?.totalCount || 0} users found
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Users Table */}
      <Paper>
        <DynamicGrid
          data={usersWithActions}
          columns={columnsWithActions}
          isLoading={isLoading}
          totalCount={data?.data?.totalCount || 0}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          sorting={sorting}
          onSortingChange={setSorting}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </Paper>
    </Box>
  );
};
