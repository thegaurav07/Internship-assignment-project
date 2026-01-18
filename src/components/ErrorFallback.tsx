import React from 'react';
import {
  Typography,
  Button,
  Paper,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import WifiOffIcon from '@mui/icons-material/WifiOff';

interface ErrorFallbackProps {
  error: Error;
  onRetry?: () => void;
  isNetworkError?: boolean;
}

/**
 * ErrorFallback Component
 * 
 * A reusable error display component for query/mutation errors.
 * Shows user-friendly error messages with retry functionality.
 * 
 * Features:
 * - Distinguishes between network and other errors
 * - Provides retry functionality
 * - User-friendly error messages
 * - Responsive design
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  onRetry,
  isNetworkError = false,
}) => {
  const getErrorMessage = () => {
    if (isNetworkError) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }

    // Check for common error types
    if (error.message.includes('404')) {
      return 'The requested resource was not found.';
    }
    if (error.message.includes('403')) {
      return 'You do not have permission to access this resource.';
    }
    if (error.message.includes('401')) {
      return 'Your session has expired. Please log in again.';
    }
    if (error.message.includes('500')) {
      return 'A server error occurred. Please try again later.';
    }

    // Default error message
    return 'An unexpected error occurred. Please try again.';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: 'error.lighter',
        border: '1px solid',
        borderColor: 'error.light',
      }}
    >
      {isNetworkError ? (
        <WifiOffIcon
          sx={{
            fontSize: 64,
            color: 'error.main',
            mb: 2,
          }}
        />
      ) : (
        <ErrorOutlineIcon
          sx={{
            fontSize: 64,
            color: 'error.main',
            mb: 2,
          }}
        />
      )}

      <Typography variant="h6" gutterBottom color="error.dark">
        {isNetworkError ? 'Connection Error' : 'Error Loading Data'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {getErrorMessage()}
      </Typography>

      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          onClick={onRetry}
          startIcon={<RefreshIcon />}
          sx={{ mt: 1 }}
        >
          Retry
        </Button>
      )}
    </Paper>
  );
};
