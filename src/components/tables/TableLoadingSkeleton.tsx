import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { ColumnMetadata } from '@/types';

interface TableLoadingSkeletonProps {
  columns: ColumnMetadata[];
  rowCount?: number;
}

/**
 * TableLoadingSkeleton Component
 * 
 * Displays a skeleton loader that matches the table structure
 * while data is being fetched, providing better UX than a spinner.
 */
export const TableLoadingSkeleton: React.FC<TableLoadingSkeletonProps> = ({
  columns,
  rowCount = 10,
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} sx={{ width: column.width }}>
                <Skeleton variant="text" width="80%" height={24} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.type === 'badge' ? (
                    <Skeleton variant="rounded" width={70} height={24} />
                  ) : column.type === 'chiplist' ? (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Skeleton variant="rounded" width={60} height={24} />
                      <Skeleton variant="rounded" width={60} height={24} />
                    </Box>
                  ) : column.key === 'actions' ? (
                    <Skeleton variant="circular" width={32} height={32} />
                  ) : (
                    <Skeleton variant="text" width="90%" height={20} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
