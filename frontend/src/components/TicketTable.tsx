import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  IconButton,
  Tooltip
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { Ticket } from '../types';

interface TicketTableProps {
  tickets: Ticket[];
  loading: boolean;
}

const BADGE_COLORS: Record<string, 'warning' | 'secondary' | 'success' | 'default'> = {
  Open: 'warning',
  'In Progress': 'secondary',
  Closed: 'success',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton width={80} /></TableCell>
      <TableCell><Skeleton width={120} /></TableCell>
      <TableCell><Skeleton width={150} /></TableCell>
      <TableCell><Skeleton width={180} /></TableCell>
      <TableCell><Skeleton width={80} height={24} sx={{ borderRadius: 4 }} /></TableCell>
      <TableCell><Skeleton width={80} /></TableCell>
      <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
    </TableRow>
  );
}

export default function TicketTable({ tickets, loading }: TicketTableProps) {
  const nav = useNavigate();

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderTop: 'none', borderRadius: 0 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tickets table">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Ticket ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                No tickets found. Try adjusting your search or filters.
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow
                key={ticket._id}
                hover
                onClick={() => nav(`/ticket/${ticket.ticketId}`)}
                sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Chip label={ticket.ticketId} size="small" color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
                </TableCell>
                <TableCell sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ticket.customerName}
                </TableCell>
                <TableCell sx={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'text.secondary' }}>
                  {ticket.customerEmail}
                </TableCell>
                <TableCell sx={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ticket.subject}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={ticket.status} 
                    size="small" 
                    color={BADGE_COLORS[ticket.status] || 'default'} 
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {formatDate(ticket.createdAt)}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Ticket">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        nav(`/ticket/${ticket.ticketId}`);
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
