import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Stack,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  InputAdornment,
  TextField,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  ErrorOutlined as ErrorOutlineIcon,
  Autorenew as AutorenewIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import { getAllTickets, getRecentActivity } from '../services/api';
import { Ticket, Stats, Activity } from '../types';
import TicketTable from '../components/TicketTable';
import StatsCard from '../components/StatsCard';
import TrueFocus from '../components/TrueFocus';

const PAGE_LIMIT = 10;

function timeAgo(dateStr: string) {
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const ACTION_COLORS: Record<string, string> = {
  TICKET_CREATED: '#10b981',
  STATUS_CHANGED: '#3b82f6',
  PRIORITY_CHANGED: '#f59e0b',
  NOTE_ADDED: '#6366f1',
  ASSIGNMENT_CHANGED: '#ec4899',
};

const ACTION_LABELS: Record<string, string> = {
  TICKET_CREATED: 'Created',
  STATUS_CHANGED: 'Status',
  PRIORITY_CHANGED: 'Priority',
  NOTE_ADDED: 'Note',
  ASSIGNMENT_CHANGED: 'Assigned',
};

export default function Dashboard() {
  const nav = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats>({ Total: 0, Open: 0, 'In Progress': 0, Closed: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [assignedTo, setAssignedTo] = useState('All Agents');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activity, setActivity] = useState<Activity[]>([]);
  const [actLoading, setActLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllTickets({ search, status, priority, assignedTo, page, limit: PAGE_LIMIT, sort });
      setTickets(data.tickets);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages || 1);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, assignedTo, page, sort]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  useEffect(() => {
    getRecentActivity()
      .then((res) => setActivity(res.data))
      .catch(() => setActivity([]))
      .finally(() => setActLoading(false));
  }, []);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => setPage(value);

  const statusOptions = ['All', 'Open', 'In Progress', 'Closed'];
  const statusColors: Record<string, string> = {
    All: 'default',
    Open: 'warning',
    'In Progress': 'secondary',
    Closed: 'success',
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3.5,
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ mb: 0.5 }}>
            <TrueFocus
              sentence="Support Dashboard"
              manualMode={false}
              blurAmount={5}
              borderColor={theme.palette.primary.main}
              glowColor={alpha(theme.palette.primary.main, 0.6)}
              animationDuration={1}
              pauseBetweenAnimations={1}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, maxWidth: 420 }}>
            Manage and track all your customer support tickets
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 17 }} />}
          onClick={() => nav('/create')}
          sx={{ borderRadius: 2.5, px: 2.5, flexShrink: 0 }}
        >
          New Ticket
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3.5 }} alignItems="stretch">
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatsCard label="Total Tickets" value={stats.Total} color="primary" icon={<ConfirmationNumberIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatsCard label="Open" value={stats.Open} color="warning" icon={<ErrorOutlineIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatsCard label="In Progress" value={stats['In Progress']} color="secondary" icon={<AutorenewIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatsCard label="Closed" value={stats.Closed} color="success" icon={<CheckCircleOutlineIcon />} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8} xl={9}>
          <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                px: 2.5,
                py: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: isDark ? alpha('#0e1520', 0.6) : alpha('#fafbfc', 0.8),
              }}
            >
              {/* Search + Selects Row */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                <TextField
                  size="small"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  sx={{ minWidth: 220, flex: 1, maxWidth: 320 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 118 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select value={priority} label="Priority" onChange={(e: SelectChangeEvent) => { setPriority(e.target.value); setPage(1); }}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel>Agent</InputLabel>
                  <Select value={assignedTo} label="Agent" onChange={(e: SelectChangeEvent) => { setAssignedTo(e.target.value); setPage(1); }}>
                    <MenuItem value="All Agents">All Agents</MenuItem>
                    <MenuItem value="Unassigned">Unassigned</MenuItem>
                    <MenuItem value="John">John</MenuItem>
                    <MenuItem value="Sarah">Sarah</MenuItem>
                    <MenuItem value="Alex">Alex</MenuItem>
                    <MenuItem value="David">David</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 155 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sort} label="Sort By" onChange={(e: SelectChangeEvent) => { setSort(e.target.value); setPage(1); }}>
                    <MenuItem value="latest">Latest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="priority">Priority: High → Low</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction="row" spacing={0.75} sx={{ mt: 1.75, flexWrap: 'wrap', gap: '6px' }} useFlexGap>
                {statusOptions.map((s) => {
                  const isActive = status === s;
                  return (
                    <Chip
                      key={s}
                      label={s === 'All' ? `All (${stats.Total})` : `${s}${s === 'Open' ? ` (${stats.Open})` : s === 'In Progress' ? ` (${stats['In Progress']})` : s === 'Closed' ? ` (${stats.Closed})` : ''}`}
                      size="small"
                      onClick={() => { setStatus(s); setPage(1); }}
                      variant={isActive ? 'filled' : 'outlined'}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: 2,
                        height: 28,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        transition: 'all 0.15s ease',
                        ...(isActive
                          ? {
                              bgcolor: s === 'All' ? 'primary.main' : undefined,
                              color: s === 'All' ? 'primary.contrastText' : undefined,
                            }
                          : {
                              bgcolor: 'transparent',
                              borderColor: theme.palette.divider,
                              color: 'text.secondary',
                              '&:hover': {
                                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,35,50,0.03)',
                              },
                            }),
                      }}
                      color={isActive && s !== 'All' ? (statusColors[s] as any) : undefined}
                    />
                  );
                })}
              </Stack>
            </Box>

            <TicketTable tickets={tickets} loading={loading} />

            {!loading && totalPages > 1 && (
              <Box
                sx={{
                  px: 2.5,
                  py: 1.5,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  bgcolor: isDark ? alpha('#0e1520', 0.4) : alpha('#fafbfc', 0.6),
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 1.5,
                      fontSize: '0.8125rem',
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4} xl={3}>
          <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                px: 2.5,
                py: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: isDark ? alpha('#0e1520', 0.6) : alpha('#fafbfc', 0.8),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.8125rem' }}>
                Recent Activity
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                Latest 5
              </Typography>
            </Box>

            {actLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress size={22} thickness={4} />
              </Box>
            ) : activity.length === 0 ? (
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography variant="body2" color="text.disabled">
                  No recent activity
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {activity.map((item, i) => {
                  const dotColor = ACTION_COLORS[item.actionType] || '#6366f1';
                  const actionLabel = ACTION_LABELS[item.actionType] || item.actionType;
                  return (
                    <React.Fragment key={item._id}>
                      <ListItem
                        button
                        onClick={() => nav(`/ticket/${item.ticketId}`)}
                        sx={{
                          px: 2.5,
                          py: 1.75,
                          gap: 1.5,
                          alignItems: 'flex-start',
                          transition: 'background-color 0.15s ease',
                          '&:hover': {
                            bgcolor: isDark ? alpha('#5b6cf0', 0.06) : alpha('#5b6cf0', 0.04),
                          },
                        }}
                      >
                        <Box sx={{ pt: 0.6, flexShrink: 0 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: dotColor,
                            }}
                          />
                        </Box>

                        <ListItemText
                          disableTypography
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.35 }}>
                              <Typography
                                variant="caption"
                                fontWeight={600}
                                sx={{
                                  color: isDark ? '#7b8af5' : '#4a59d9',
                                  fontFamily: 'ui-monospace, monospace',
                                  fontSize: '0.7rem',
                                }}
                              >
                                {item.ticketId}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: dotColor,
                                  fontWeight: 500,
                                  px: 0.75,
                                  py: 0.15,
                                  borderRadius: 1,
                                  bgcolor: `${dotColor}14`,
                                  fontSize: '0.65rem',
                                  lineHeight: 1.5,
                                }}
                              >
                                {actionLabel}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block', lineHeight: 1.45, mb: 0.35, fontSize: '0.75rem' }}
                                noWrap
                              >
                                {item.description}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6875rem' }}>
                                {timeAgo(item.createdAt)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {i < activity.length - 1 && <Divider sx={{ mx: 2.5 }} />}
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
