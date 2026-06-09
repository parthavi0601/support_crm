import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
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
  ToggleButton,
  ToggleButtonGroup,
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
  FilterList as FilterListIcon,
  History as HistoryIcon,
  AddOutlined as CreatedIcon,
  SwapHoriz as StatusIcon,
  FlagOutlined as PriorityIcon,
  NoteAdd as NoteIcon,
  PersonOutlined as AssignIcon,
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

const ACTION_META: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  TICKET_CREATED: { color: '#22c55e', label: 'Created', icon: <CreatedIcon sx={{ fontSize: 14 }} /> },
  STATUS_CHANGED: { color: '#3b82f6', label: 'Status', icon: <StatusIcon sx={{ fontSize: 14 }} /> },
  PRIORITY_CHANGED: { color: '#f59e0b', label: 'Priority', icon: <PriorityIcon sx={{ fontSize: 14 }} /> },
  NOTE_ADDED: { color: '#5b6cf0', label: 'Note', icon: <NoteIcon sx={{ fontSize: 14 }} /> },
  ASSIGNMENT_CHANGED: { color: '#ec4899', label: 'Assigned', icon: <AssignIcon sx={{ fontSize: 14 }} /> },
};

const STATUS_TABS = [
  { key: 'All', countKey: 'Total' as const },
  { key: 'Open', countKey: 'Open' as const },
  { key: 'In Progress', countKey: 'In Progress' as const },
  { key: 'Closed', countKey: 'Closed' as const },
];

const panelHeaderSx = (isDark: boolean) => ({
  px: 2.5,
  py: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid',
  borderColor: 'divider',
  background: isDark
    ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)'
    : 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(250,251,252,0.6) 100%)',
});

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

  const handleStatusChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value) { setStatus(value); setPage(1); }
  };

  const selectSx = {
    minWidth: 120,
    '& .MuiOutlinedInput-root': {
      bgcolor: isDark ? alpha('#0e1520', 0.5) : '#fff',
    },
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 3.5, lg: 4 }, maxWidth: 1440, mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2.5,
          mb: 3,
          pb: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <TrueFocus
            sentence="Support Dashboard"
            manualMode={false}
            blurAmount={5}
            borderColor={theme.palette.primary.main}
            glowColor={alpha(theme.palette.primary.main, 0.6)}
            animationDuration={1}
            pauseBetweenAnimations={1}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1.25, maxWidth: 440, lineHeight: 1.6, fontSize: '0.875rem' }}
          >
            Manage and track all your customer support tickets
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 17 }} />}
          onClick={() => nav('/create')}
          sx={{
            borderRadius: 2.5,
            px: 2.75,
            py: 1.1,
            flexShrink: 0,
            boxShadow: isDark
              ? `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`
              : `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
            '&:hover': {
              boxShadow: isDark
                ? `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`
                : `0 6px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
            },
          }}
        >
          New Ticket
        </Button>
      </Box>

      {/* Stats — equal-width columns so every ticket is identical size */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
          mb: 3,
          width: '100%',
        }}
      >
        {[
          { label: 'Total Tickets', value: stats.Total, color: 'primary' as const, icon: <ConfirmationNumberIcon /> },
          { label: 'Open', value: stats.Open, color: 'warning' as const, icon: <ErrorOutlineIcon /> },
          { label: 'In Progress', value: stats['In Progress'], color: 'secondary' as const, icon: <AutorenewIcon /> },
          { label: 'Closed', value: stats.Closed, color: 'success' as const, icon: <CheckCircleOutlineIcon /> },
        ].map((card) => (
          <Box key={card.label} sx={{ width: '100%', minWidth: 0 }}>
            <StatsCard {...card} variant="dashboard" />
          </Box>
        ))}
      </Box>

      <Grid container spacing={2.5}>
        {/* Tickets panel */}
        <Grid item xs={12} lg={8} xl={9}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.3)'
                : '0 8px 32px rgba(26,35,50,0.06)',
            }}
          >
            <Box sx={panelHeaderSx(isDark)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, isDark ? 0.15 : 0.1),
                    color: 'primary.main',
                  }}
                >
                  <FilterListIcon sx={{ fontSize: 17 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                    All Tickets
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {loading ? 'Loading…' : `${tickets.length} shown · ${stats.Total} total`}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search by ID, customer, subject…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  sx={{
                    flex: 1,
                    maxWidth: { md: 300 },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDark ? alpha('#0e1520', 0.5) : '#fff',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ flex: 1 }}>
                  <FormControl size="small" sx={selectSx}>
                    <InputLabel>Priority</InputLabel>
                    <Select value={priority} label="Priority" onChange={(e: SelectChangeEvent) => { setPriority(e.target.value); setPage(1); }}>
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Critical">Critical</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={selectSx}>
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

                  <FormControl size="small" sx={{ ...selectSx, minWidth: 140 }}>
                    <InputLabel>Sort</InputLabel>
                    <Select value={sort} label="Sort" onChange={(e: SelectChangeEvent) => { setSort(e.target.value); setPage(1); }}>
                      <MenuItem value="latest">Latest First</MenuItem>
                      <MenuItem value="oldest">Oldest First</MenuItem>
                      <MenuItem value="priority">Priority ↓</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>

              <ToggleButtonGroup
                exclusive
                value={status}
                onChange={handleStatusChange}
                size="small"
                sx={{
                  mt: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.75,
                  '& .MuiToggleButtonGroup-grouped': {
                    border: `1px solid ${theme.palette.divider} !important`,
                    borderRadius: '8px !important',
                    mx: '0 !important',
                    px: 1.75,
                    py: 0.6,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    color: 'text.secondary',
                    bgcolor: isDark ? alpha('#0e1520', 0.4) : alpha('#fff', 0.8),
                    transition: 'all 0.15s ease',
                    '&.Mui-selected': {
                      bgcolor: isDark ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      borderColor: `${alpha(theme.palette.primary.main, 0.4)} !important`,
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: isDark ? alpha(theme.palette.primary.main, 0.25) : alpha(theme.palette.primary.main, 0.14),
                      },
                    },
                    '&:hover': {
                      bgcolor: isDark ? alpha('#fff', 0.04) : alpha('#000', 0.03),
                    },
                  },
                }}
              >
                {STATUS_TABS.map(({ key, countKey }) => (
                  <ToggleButton key={key} value={key}>
                    {key} <Box component="span" sx={{ ml: 0.75, opacity: 0.65, fontWeight: 400 }}>({stats[countKey]})</Box>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
              <TicketTable tickets={tickets} loading={loading} />
            </Box>

            {!loading && totalPages > 1 && (
              <Box
                sx={{
                  px: 2.5,
                  py: 1.75,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  bgcolor: isDark ? alpha('#0e1520', 0.35) : alpha('#fafbfc', 0.7),
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Page {page} of {totalPages}
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  shape="rounded"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Activity panel */}
        <Grid item xs={12} lg={4} xl={3}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              height: '100%',
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.3)'
                : '0 8px 32px rgba(26,35,50,0.06)',
            }}
          >
            <Box sx={panelHeaderSx(isDark)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha('#8b5cf6', isDark ? 0.15 : 0.1),
                    color: '#8b5cf6',
                  }}
                >
                  <HistoryIcon sx={{ fontSize: 17 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                    Recent Activity
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Live feed · last 5 events
                  </Typography>
                </Box>
              </Box>
            </Box>

            {actLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={24} thickness={3.5} />
              </Box>
            ) : activity.length === 0 ? (
              <Box sx={{ py: 8, px: 3, textAlign: 'center' }}>
                <HistoryIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1.5, opacity: 0.4 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  No recent activity
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                  Actions will appear here
                </Typography>
              </Box>
            ) : (
              <List disablePadding sx={{ py: 1 }}>
                {activity.map((item, i) => {
                  const meta = ACTION_META[item.actionType] || {
                    color: '#5b6cf0',
                    label: item.actionType,
                    icon: <StatusIcon sx={{ fontSize: 14 }} />,
                  };
                  const isLast = i === activity.length - 1;

                  return (
                    <ListItem
                      key={item._id}
                      button
                      onClick={() => nav(`/ticket/${item.ticketId}`)}
                      sx={{
                        px: 2.5,
                        py: 1.5,
                        alignItems: 'flex-start',
                        gap: 1.5,
                        position: 'relative',
                        transition: 'background-color 0.15s ease',
                        '&:hover': {
                          bgcolor: isDark ? alpha('#5b6cf0', 0.06) : alpha('#5b6cf0', 0.04),
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative', flexShrink: 0, pt: 0.25 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(meta.color, isDark ? 0.15 : 0.1),
                            color: meta.color,
                            border: `1px solid ${alpha(meta.color, 0.2)}`,
                            position: 'relative',
                            zIndex: 1,
                          }}
                        >
                          {meta.icon}
                        </Box>
                        {!isLast && (
                          <Box
                            sx={{
                              position: 'absolute',
                              left: '50%',
                              top: 34,
                              bottom: -20,
                              width: 1,
                              bgcolor: isDark ? alpha('#fff', 0.08) : alpha('#000', 0.06),
                              transform: 'translateX(-50%)',
                              zIndex: 0,
                            }}
                          />
                        )}
                      </Box>

                      <ListItemText
                        disableTypography
                        sx={{ m: 0 }}
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.4 }}>
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
                              component="span"
                              sx={{
                                color: meta.color,
                                fontWeight: 600,
                                fontSize: '0.625rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              {meta.label}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.45,
                                mb: 0.4,
                                fontSize: '0.75rem',
                              }}
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
