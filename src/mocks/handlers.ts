import { http, HttpResponse, delay } from 'msw';
import { getUsers, updateUserStatus } from './data';

export const handlers = [
  // GET /api/users - Fetch users with pagination and filters
  http.get('/api/users', async ({ request }) => {
    // Simulate network delay
    await delay(500);

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const query = url.searchParams.get('query') || '';
    const status = url.searchParams.get('status') || 'all';

    const result = getUsers({ page, pageSize, query, status });

    return HttpResponse.json({
      data: {
        totalCount: result.totalCount,
        users: result.users,
      },
    });
  }),

  // PATCH /api/users/:id - Update user status
  http.patch('/api/users/:id', async ({ params, request }) => {
    // Simulate network delay
    await delay(300);

    const { id } = params;
    const body = await request.json() as { status: 'active' | 'inactive' };

    const updatedUser = updateUserStatus(id as string, body.status);

    if (!updatedUser) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: updatedUser,
      message: `User status updated to ${body.status}`,
    });
  }),
];
