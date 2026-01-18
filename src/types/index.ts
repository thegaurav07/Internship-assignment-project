// Role type
export interface Role {
  roleId: string;
  roleName: string;
}

// Group type with nested roles
export interface Group {
  groupId: string;
  groupName: string;
  roles: Role[];
}

// User type with nested groups
export interface User {
  userId: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
  groups: Group[];
}

// API Response type
export interface UsersApiResponse {
  data: {
    totalCount: number;
    users: User[];
  };
}

// Pagination params
export interface PaginationParams {
  page: number;
  pageSize: number;
  query?: string;
  status?: 'active' | 'inactive' | 'all';
}

// Column metadata type for dynamic grid
export type ColumnType = 'string' | 'badge' | 'date' | 'chiplist';

export interface ColumnMetadata {
  key: string;
  header: string;
  type: ColumnType;
  width?: number;
  pinned?: 'left' | 'right';
  sorting?: boolean;
  format?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
