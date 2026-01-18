import React from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { User } from '@/types';

interface UserActionsProps {
  user: User;
  onToggleStatus: (userId: string, newStatus: 'active' | 'inactive') => void;
  isUpdating?: boolean;
}

/**
 * UserActions Component
 *
 * Renders action buttons for a user row.
 * Currently shows activate/deactivate toggle.
 *
 * TODO FOR CANDIDATE:
 * 1. Implement optimistic UI - update the button state immediately
 *    before the API call completes.
 * 2. Handle error case - revert the optimistic update if API fails.
 * 3. Add a confirmation dialog before deactivating a user (optional).
 */
export const UserActions: React.FC<UserActionsProps> = ({
  user,
  onToggleStatus,
  isUpdating = false,
}) => {
  const handleToggle = () => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    onToggleStatus(user.userId, newStatus);
  };

  if (isUpdating) {
    return <CircularProgress size={20} />;
  }

  return (
    <Tooltip
      title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
    >
      <IconButton
        onClick={handleToggle}
        color={user.status === 'active' ? 'error' : 'success'}
        size="small"
        aria-label={
          user.status === 'active' ? 'Deactivate user' : 'Activate user'
        }
      >
        {user.status === 'active' ? <CancelIcon /> : <CheckCircleIcon />}
      </IconButton>
    </Tooltip>
  );
};
