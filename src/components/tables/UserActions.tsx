import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
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
 * Renders action buttons for a user row with improved UX.
 * Features:
 * - Proper hover states and styling
 * - Confirmation dialog before deactivating users
 * - Full accessibility support (ARIA labels, keyboard navigation)
 * - Loading states
 */
export const UserActions: React.FC<UserActionsProps> = ({
  user,
  onToggleStatus,
  isUpdating = false,
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleToggle = () => {
    // Show confirmation dialog only when deactivating
    if (user.status === 'active') {
      setConfirmDialogOpen(true);
    } else {
      // Activate immediately without confirmation
      onToggleStatus(user.userId, 'active');
    }
  };

  const handleConfirmDeactivate = () => {
    onToggleStatus(user.userId, 'inactive');
    setConfirmDialogOpen(false);
  };

  const handleCancelDeactivate = () => {
    setConfirmDialogOpen(false);
  };

  if (isUpdating) {
    return (
      <CircularProgress 
        size={20} 
        aria-label="Updating user status"
      />
    );
  }

  const isActive = user.status === 'active';

  return (
    <>
      <Tooltip
        title={isActive ? 'Deactivate User' : 'Activate User'}
        arrow
        enterDelay={300}
      >
        <IconButton
          onClick={handleToggle}
          color={isActive ? 'error' : 'success'}
          size="small"
          aria-label={isActive ? `Deactivate ${user.name}` : `Activate ${user.name}`}
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: isActive 
                ? 'error.light' 
                : 'success.light',
              '& .MuiSvgIcon-root': {
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              },
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: isActive ? 'error.main' : 'success.main',
              outlineOffset: '2px',
            },
          }}
        >
          {isActive ? <CancelIcon /> : <CheckCircleIcon />}
        </IconButton>
      </Tooltip>

      {/* Confirmation Dialog for Deactivation */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelDeactivate}
        aria-labelledby="deactivate-dialog-title"
        aria-describedby="deactivate-dialog-description"
      >
        <DialogTitle id="deactivate-dialog-title">
          Confirm Deactivation
        </DialogTitle>
        <DialogContent>
          <Typography id="deactivate-dialog-description">
            Are you sure you want to deactivate <strong>{user.name}</strong>?
            This will revoke their access to the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDeactivate}
            color="inherit"
            autoFocus
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeactivate}
            color="error"
            variant="contained"
          >
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
