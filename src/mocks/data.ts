import type { User, Group, Role } from '@/types';

// Predefined roles
const roles: Role[] = [
  { roleId: 'role-1', roleName: 'Admin' },
  { roleId: 'role-2', roleName: 'Manager' },
  { roleId: 'role-3', roleName: 'Standard User' },
  { roleId: 'role-4', roleName: 'Viewer' },
  { roleId: 'role-5', roleName: 'Editor' },
];

// Predefined groups
const groups: Group[] = [
  { groupId: 'grp-1', groupName: 'Administrators', roles: [roles[0]] },
  { groupId: 'grp-2', groupName: 'Management Team', roles: [roles[1], roles[4]] },
  { groupId: 'grp-3', groupName: 'Standard Users', roles: [roles[2]] },
  { groupId: 'grp-4', groupName: 'Read Only', roles: [roles[3]] },
  { groupId: 'grp-5', groupName: 'Content Team', roles: [roles[4], roles[2]] },
];

// First names and last names for random generation
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Aizen', 'Ichigo', 'Naruto', 'Sasuke', 'Luffy', 'Zoro', 'Goku', 'Vegeta',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
];

// Generate random date in the past 2 years
const generateRandomDate = (): string => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString();
};

// Generate random groups for a user (1-3 groups)
const generateRandomGroups = (): Group[] => {
  const numGroups = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...groups].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numGroups);
};

// Generate 100 mock users
export const generateMockUsers = (): User[] => {
  const users: User[] = [];

  for (let i = 1; i <= 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

    users.push({
      userId: `user-${i}`,
      name,
      email,
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      createdAt: generateRandomDate(),
      groups: generateRandomGroups(),
    });
  }

  return users;
};

// Store users in memory (simulates database)
let mockUsers: User[] = generateMockUsers();

// Get all users (with filtering and pagination)
export const getUsers = (params: {
  page?: number;
  pageSize?: number;
  query?: string;
  status?: string;
}): { users: User[]; totalCount: number } => {
  let filtered = [...mockUsers];

  // Filter by search query
  if (params.query) {
    const query = params.query.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((user) => user.status === params.status);
  }

  const totalCount = filtered.length;

  // Pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const startIndex = (page - 1) * pageSize;
  const paginatedUsers = filtered.slice(startIndex, startIndex + pageSize);

  return {
    users: paginatedUsers,
    totalCount,
  };
};

// Update user status
export const updateUserStatus = (
  userId: string,
  status: 'active' | 'inactive'
): User | null => {
  const userIndex = mockUsers.findIndex((u) => u.userId === userId);
  if (userIndex === -1) return null;

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    status,
  };

  return mockUsers[userIndex];
};

// Get user by ID
export const getUserById = (userId: string): User | null => {
  return mockUsers.find((u) => u.userId === userId) || null;
};

// Reset mock data (for testing)
export const resetMockData = (): void => {
  mockUsers = generateMockUsers();
};
