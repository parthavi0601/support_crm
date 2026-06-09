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

// ─── Mobile card skeleton ────────────────────────────────────────────────────
function MobileSkeletonCard() {
  return (
    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Box sx={{ flex: 1 }}>
          <Skeleton height={14} width="60%" sx={{ mb: 0.5 }} />
          <Skeleton height={12} width="80%" />
        </Box>
        <Skeleton variant="rounded" height={20} width={56} />
      </Box>
    </Box>
  );
}

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
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0 }} />
      <Typography
        variant="caption"
        fontWeight={600}
        sx={{
          color: cfg.color,
          px: 1,
          py: 0.35,
          borderRadius: 1.25,
          bgcolor: cfg.bg,
          lineHeight: 1.3,
          whiteSpace: 'nowrap',
          fontSize: '0.6875rem',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function TicketTable({ tickets, loading }: TicketTableProps) {
  const nav = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const headers = ['Ticket ID', 'Customer', 'Email', 'Subject', 'Priority', 'Status', 'Assigned To', 'Created', ''];

  // ─── Mobile card list ────────────────────────────────────────────────────
  const mobileList = (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      {loading
        ? Array.from({ length: 5 }).map((_, i) => <MobileSkeletonCard key={i} />)
        : tickets.length === 0
        ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>No tickets found</Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>Try adjusting your search or filters</Typography>
          </Box>
        )
        : tickets.map((ticket) => {
            const pCfg = isDark ? PRIORITY_CONFIG_DARK[ticket.priority] : PRIORITY_CONFIG[ticket.priority];
            const sCfg = isDark ? STATUS_CONFIG_DARK[ticket.status] : STATUS_CONFIG[ticket.status];
            const avatarColor = getAvatarColor(ticket.customerName);
            return (
              <Box
                key={ticket._id}
                onClick={() => nav(`/ticket/${ticket.ticketId}`)}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'background-color 0.12s ease',
                  '&:hover': {
                    bgcolor: isDark ? alpha('#5b6cf0', 0.06) : alpha('#5b6cf0', 0.04),
                  },
                }}
              >
                {/* Row 1: avatar + name + ticket ID badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75, minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: alpha(avatarColor, isDark ? 0.85 : 1),
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(ticket.customerName)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
                      {ticket.customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem', display: 'block' }}>
                      {ticket.customerEmail}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 0.75,
                      py: 0.3,
                      borderRadius: 1,
                      border: `1px solid ${isDark ? alpha('#5b6cf0', 0.25) : alpha('#5b6cf0', 0.2)}`,
                      bgcolor: isDark ? alpha('#5b6cf0', 0.1) : alpha('#5b6cf0', 0.05),
                      flexShrink: 0,
                      width: 60,
                      overflow: 'hidden',
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      noWrap
                      sx={{ color: isDark ? '#7b8af5' : '#4a59d9', fontFamily: 'ui-monospace, monospace', fontSize: '0.6rem', width: '100%' }}
                    >
                      {ticket.ticketId}
                    </Typography>
                  </Box>
                </Box>

                {/* Row 2: subject */}
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ fontSize: '0.775rem', fontWeight: 500, color: 'text.primary', mb: 0.75, pl: 0.25 }}
                >
                  {ticket.subject}
                </Typography>

                {/* Row 3: badges + date + arrow */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  {sCfg && <Badge label={ticket.status} cfg={sCfg} />}
                  {pCfg && <Badge label={ticket.priority} cfg={pCfg} />}
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.675rem', ml: 'auto' }}>
                    {formatDate(ticket.createdAt)}
                  </Typography>
                  <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }} />
                </Box>
              </Box>
            );
          })
      }
    </Box>
  );

  return (
    <>
      {mobileList}
      <TableContainer sx={{ borderRadius: 0, border: 'none', display: { xs: 'none', md: 'block' } }}>
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
                  sx={{
                    cursor: 'pointer',
                    transition: 'background-color 0.12s ease',
                    '&:hover .ticket-id-pill': {
                      borderColor: isDark ? alpha('#5b6cf0', 0.4) : alpha('#5b6cf0', 0.3),
                      bgcolor: isDark ? alpha('#5b6cf0', 0.12) : alpha('#5b6cf0', 0.06),
                    },
                  }}
                >
                  <TableCell>
                    <Box
                      className="ticket-id-pill"
                      sx={{
                        display: 'inline-flex',
                        px: 1,
                        py: 0.35,
                        borderRadius: 1.25,
                        border: `1px solid ${isDark ? alpha('#5b6cf0', 0.2) : alpha('#5b6cf0', 0.15)}`,
                        bgcolor: isDark ? alpha('#5b6cf0', 0.08) : alpha('#5b6cf0', 0.04),
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        sx={{
                          color: isDark ? '#7b8af5' : '#4a59d9',
                          letterSpacing: '0.03em',
                          fontFamily: 'ui-monospace, monospace',
                          fontSize: '0.6875rem',
                        }}
                      >
                        {ticket.ticketId}
                      </Typography>
                    </Box>
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
    </>
  );
}
