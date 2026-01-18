import type { ColumnMetadata } from '@/types';

/**
 * Column metadata configuration for the Users table
 *
 * This defines how each column should be rendered in the table.
 * The table component uses this metadata to dynamically generate columns.
 */
export const userColumnMetadata: ColumnMetadata[] = [
  {
    key: 'name',
    header: 'Name',
    type: 'string',
    pinned: 'left',
    width: 220,
    sorting: true,
  },
  {
    key: 'email',
    header: 'Email',
    type: 'string',
    width: 260,
    sorting: true,
  },
  {
    key: 'status',
    header: 'Status',
    type: 'badge',
    width: 120,
  },
  {
    key: 'createdAt',
    header: 'Joined',
    type: 'date',
    format: 'YYYY-MM-DD',
    width: 140,
  },
  {
    key: 'groups',
    header: 'Groups',
    type: 'chiplist',
    width: 280,
  },
];
