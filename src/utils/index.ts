export { userColumnMetadata } from './columnConfig';

/**
 * Format date string to readable format
 */
export const formatDate = (dateString: string, format?: string): string => {
  const date = new Date(dateString);

  if (format === 'YYYY-MM-DD') {
    return date.toISOString().split('T')[0];
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
