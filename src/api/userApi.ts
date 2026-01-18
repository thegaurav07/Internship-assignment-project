import type { User, UsersApiResponse, PaginationParams } from '@/types';

const API_BASE = '/api';

/**
 * Fetch users with pagination and filters
 */
export const fetchUsers = async (
  params: PaginationParams
): Promise<UsersApiResponse> => {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  });

  if (params.query) {
    searchParams.set('query', params.query);
  }

  if (params.status && params.status !== 'all') {
    searchParams.set('status', params.status);
  }

  const response = await fetch(`${API_BASE}/users?${searchParams}`);

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

/**
 * Update user status (activate/deactivate)
 */
export const updateUserStatus = async (
  userId: string,
  status: 'active' | 'inactive'
): Promise<{ success: boolean; data: User; message: string }> => {
  const response = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update user status');
  }

  return response.json();
};
