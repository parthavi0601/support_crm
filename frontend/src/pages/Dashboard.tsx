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
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Stack,
  Pagination
} from '@mui/material';
import { Add as AddIcon, ConfirmationNumber as ConfirmationNumberIcon, ErrorOutlined as ErrorOutlineIcon, Autorenew as AutorenewIcon, CheckCircleOutlined as CheckCircleOutlineIcon, Sort as SortIcon } from '@mui/icons-material';

import { getAllTickets, getRecentActivity } from '../services/api';
import { Ticket, Stats } from '../types';
import SearchBar from '../components/SearchBar';
import StatusFilter from '../components/StatusFilter';
import TicketTable from '../components/TicketTable';
import StatsCard from '../components/StatsCard';

const PAGE_LIMIT = 10;

function timeAgo(dateStr: string) {
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function Dashboard() {
  const nav = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats>({ Total: 0, Open: 0, 'In Progress': 0, Closed: 0 });
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [activity, setActivity] = useState<Ticket[]>([]);
  const [actLoading, setActLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllTickets({ search, status, page, limit: PAGE_LIMIT, sort });
      setTickets(data.tickets);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (err) {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, page, sort]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    getRecentActivity()
      .then((res) => setActivity(res.data))
      .catch(() => setActivity([]))
      .finally(() => setActLoading(false));
  }, []);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleStatus = (v: string) => { setStatus(v); setPage(1); };
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => setPage(value);

  return (
    <Box sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Monitor and manage support tickets</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => nav('/create')}
          disableElevation
        >
          New Ticket
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard label="Total Tickets" value={stats.Total} color="primary" icon={<ConfirmationNumberIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard label="Open" value={stats.Open} color="warning" icon={<ErrorOutlineIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard label="In Progress" value={stats['In Progress']} color="secondary" icon={<AutorenewIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard label="Closed" value={stats.Closed} color="success" icon={<CheckCircleOutlineIcon />} />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8} xl={9}>
          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                <SearchBar value={search} onChange={handleSearch} />
                <StatusFilter value={status} onChange={handleStatus} />
              </Stack>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<SortIcon />}
                onClick={() => { setSort(s => s === 'latest' ? 'oldest' : 'latest'); setPage(1); }}
                color="inherit"
              >
                {sort === 'latest' ? 'Latest First' : 'Oldest First'}
              </Button>
            </Box>
            
            <TicketTable tickets={tickets} loading={loading} />
            
            {!loading && totalPages > 1 && (
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: 1, borderColor: 'divider' }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4} xl={3}>
          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="bold">Recent Activity</Typography>
            </Box>
            
            {actLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : activity.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No recent activity</Typography>
              </Box>
            ) : (
              <List disablePadding>
                {activity.map((item, i) => (
                  <React.Fragment key={item._id}>
                    <ListItem 
                      alignItems="flex-start" 
                      button 
                      onClick={() => nav(`/ticket/${item.ticketId}`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: item.status === 'Closed' ? 'success.main' : item.status === 'In Progress' ? 'secondary.main' : 'warning.main' }}>
                          {item.status === 'Closed' ? <CheckCircleOutlineIcon fontSize="small" /> : item.status === 'In Progress' ? <AutorenewIcon fontSize="small" /> : <ErrorOutlineIcon fontSize="small" />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" fontWeight="bold">{item.ticketId}</Typography>
                            <Typography variant="caption" color="text.secondary">{timeAgo(item.updatedAt)}</Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {item.customerName}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {i < activity.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
