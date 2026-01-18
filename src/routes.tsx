import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts';
import { UsersPage } from '@/pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <UsersPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
    ],
  },
]);
