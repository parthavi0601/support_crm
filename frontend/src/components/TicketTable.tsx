import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { Ticket } from '../types';

interface TicketTableProps {
  tickets: Ticket[];
  loading: boolean;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  Open: { color: '#b45309', bg: '#fffbeb' },
  'In Progress': { color: '#6d28d9', bg: '#f5f3ff' },
  Closed: { color: '#15803d', bg: '#ecfdf3' },
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  Low: { color: '#15803d', bg: '#ecfdf3' },
  Medium: { color: '#1d4ed8', bg: '#eff6ff' },
  High: { color: '#b45309', bg: '#fffbeb' },
  Critical: { color: '#b91c1c', bg: '#fef2f2' },
};

const STATUS_CONFIG_DARK: Record<string, { color: string; bg: string }> = {
  Open: { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
  'In Progress': { color: '#a78bfa', bg: 'rgba(139,92,246,0.12)' },
  Closed: { color: '#4ade80', bg: 'rgba(34,197,94,0.12)' },
};

const PRIORITY_CONFIG_DARK: Record<string, { color: string; bg: string }> = {
  Low: { color: '#4ade80', bg: 'rgba(34,197,94,0.12)' },
  Medium: { color: '#60a5fa', bg: 'rgba(59,130,246,0.12)' },
  High: { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
  Critical: { color: '#f87171', bg: 'rgba(239,68,68,0.12)' },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = ['#5b6cf0', '#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#64748b'];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 9 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton animation="wave" height={18} width={i === 0 ? 70 : i === 3 ? 180 : 100} sx={{ borderRadius: 1 }} />
        </TableCell>
      ))}
    </TableRow>
  );
}

function Badge({ label, cfg }: { label: string; cfg: { color: string; bg: string } }) {
  return (
    <Typography
      variant="caption"
      fontWeight={500}
      sx={{
        color: cfg.color,
        px: 1.25,
        py: 0.4,
        borderRadius: 1.5,
        bgcolor: cfg.bg,
        display: 'inline-block',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        fontSize: '0.75rem',
      }}
    >
      {label}
    </Typography>
  );
}

export default function TicketTable({ tickets, loading }: TicketTableProps) {
  const nav = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const headers = ['Ticket ID', 'Customer', 'Email', 'Subject', 'Priority', 'Status', 'Assigned To', 'Created', ''];

  return (
    <TableContainer sx={{ borderRadius: 0, border: 'none' }}>
      <Table sx={{ minWidth: 800 }} aria-label="tickets table">
        <TableHead>
          <TableRow>
            {headers.map((h) => (
              <TableCell key={h} align={h === '' ? 'right' : 'left'}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9}>
                <Box sx={{ py: 10, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    No tickets found
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => {
              const pCfg = isDark ? PRIORITY_CONFIG_DARK[ticket.priority] : PRIORITY_CONFIG[ticket.priority];
              const sCfg = isDark ? STATUS_CONFIG_DARK[ticket.status] : STATUS_CONFIG[ticket.status];
              const avatarColor = getAvatarColor(ticket.customerName);

              return (
                <TableRow
                  key={ticket._id}
                  hover
                  onClick={() => nav(`/ticket/${ticket.ticketId}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{
                        color: isDark ? '#7b8af5' : '#4a59d9',
                        letterSpacing: '0.02em',
                        fontFamily: 'ui-monospace, monospace',
                        fontSize: '0.75rem',
                      }}
                    >
                      {ticket.ticketId}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: alpha(avatarColor, isDark ? 0.85 : 1),
                          fontSize: '0.625rem',
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(ticket.customerName)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 130, fontSize: '0.8125rem' }}>
                        {ticket.customerName}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', maxWidth: 160, display: 'block', fontSize: '0.75rem' }}
                      noWrap
                    >
                      {ticket.customerEmail}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                      {ticket.subject}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {pCfg && <Badge label={ticket.priority} cfg={pCfg} />}
                  </TableCell>

                  <TableCell>
                    {sCfg && <Badge label={ticket.status} cfg={sCfg} />}
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        color: ticket.assignedTo === 'Unassigned' ? 'text.disabled' : 'text.secondary',
                        fontWeight: ticket.assignedTo === 'Unassigned' ? 400 : 500,
                        fontStyle: ticket.assignedTo === 'Unassigned' ? 'italic' : 'normal',
                        fontSize: '0.75rem',
                      }}
                    >
                      {ticket.assignedTo}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      {formatDate(ticket.createdAt)}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="View ticket" placement="left">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          nav(`/ticket/${ticket.ticketId}`);
                        }}
                        sx={{
                          width: 28,
                          height: 28,
                          color: 'text.disabled',
                          '&:hover': {
                            bgcolor: isDark ? 'rgba(91,108,240,0.12)' : 'rgba(91,108,240,0.08)',
                            color: 'primary.main',
                          },
                        }}
                      >
                        <ChevronRightIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
