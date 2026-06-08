import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, useTheme } from '@mui/material';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  ConfirmationNumber, ErrorOutlined, Autorenew, CheckCircleOutlined, Warning, Assignment
} from '@mui/icons-material';

import { getAnalytics } from '../services/api';
import { AnalyticsData } from '../types';
import StatsCard from '../components/StatsCard';

const STATUS_COLORS = ['#f59e0b', '#8b5cf6', '#22c55e'];
const PRIORITY_COLORS: Record<string, string> = {
  Low: '#22c55e',
  Medium: '#3b82f6',
  High: '#f59e0b',
  Critical: '#ef4444',
};
const AGENT_COLORS = ['#5b6cf0', '#8b5cf6', '#f59e0b', '#22c55e', '#8b9cb3'];

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
}

function ChartCard({ title, subtitle, children, height = 260 }: ChartCardProps) {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
        height: height + 76,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ letterSpacing: '-0.01em', fontSize: '0.875rem' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={height}>
          {children as React.ReactElement}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

const tooltipStyle = (isDark: boolean) => ({
  contentStyle: {
    background: isDark ? '#121a27' : '#ffffff',
    border: `1px solid ${isDark ? '#1e2a3a' : '#e8ecf1'}`,
    borderRadius: 10,
    fontSize: 12,
    color: isDark ? '#e8edf4' : '#1a2332',
    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.35)' : '0 8px 24px rgba(26,35,50,0.08)',
  },
  itemStyle: { color: isDark ? '#8b9cb3' : '#5c6b7f' },
  labelStyle: { color: isDark ? '#e8edf4' : '#1a2332', fontWeight: 600 },
});

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const tt = tooltipStyle(isDark);

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load analytics data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={28} thickness={4} />
      </Box>
    );
  }
  if (error || !data) {
    return (
      <Box sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
        <Alert severity="error" sx={{ borderRadius: 2.5 }}>{error || 'Unknown error.'}</Alert>
      </Box>
    );
  }

  const axisStyle = {
    style: { fontSize: 11, fill: isDark ? '#8b9cb3' : '#5c6b7f' },
  };

  const gridStroke = isDark ? '#1e2a3a' : '#f0f3f7';

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h5" fontWeight={600} letterSpacing="-0.02em" sx={{ mb: 0.75 }}>
          Analytics Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time insights into your support operations
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        {[
          { label: 'Total Tickets', value: data.totalTickets, color: 'primary', icon: <ConfirmationNumber /> },
          { label: 'Open', value: data.openTickets, color: 'warning', icon: <ErrorOutlined /> },
          { label: 'In Progress', value: data.inProgressTickets, color: 'secondary', icon: <Autorenew /> },
          { label: 'Closed', value: data.closedTickets, color: 'success', icon: <CheckCircleOutlined /> },
          { label: 'Critical', value: data.criticalTickets, color: 'error', icon: <Warning /> },
          { label: 'Avg Notes', value: data.averageNotesPerTicket, color: 'info', icon: <Assignment /> },
        ].map((card) => (
          <Grid item xs={6} sm={4} md={2} key={card.label} sx={{ display: 'flex' }}>
            <StatsCard {...card as any} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <ChartCard title="Tickets by Status" subtitle="Distribution across all statuses" height={250}>
            <PieChart>
              <Pie
                data={data.statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={96}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.statusDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip {...tt} />
            </PieChart>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={7}>
          <ChartCard title="Tickets by Priority" subtitle="Volume across priority levels" height={250}>
            <BarChart data={data.priorityDistribution} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="name" tick={axisStyle as any} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle as any} axisLine={false} tickLine={false} />
              <RechartsTooltip {...tt} />
              <Bar dataKey="value" name="Tickets" radius={[6, 6, 0, 0]}>
                {data.priorityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#5b6cf0'} />
                ))}
              </Bar>
            </BarChart>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <ChartCard title="Agent Workload" subtitle="Tickets assigned per agent" height={250}>
            <BarChart data={data.agentWorkload} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
              <XAxis type="number" tick={axisStyle as any} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" width={76} tick={axisStyle as any} axisLine={false} tickLine={false} />
              <RechartsTooltip {...tt} />
              <Bar dataKey="tickets" name="Tickets" radius={[0, 6, 6, 0]}>
                {data.agentWorkload.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={AGENT_COLORS[index % AGENT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={7}>
          <ChartCard title="Creation Trend" subtitle="New tickets over the last 14 days" height={250}>
            <AreaChart data={data.ticketCreationTrend}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b6cf0" stopOpacity={isDark ? 0.25 : 0.12} />
                  <stop offset="95%" stopColor="#5b6cf0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="date" tick={axisStyle as any} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle as any} axisLine={false} tickLine={false} />
              <RechartsTooltip {...tt} />
              <Area
                type="monotone"
                dataKey="tickets"
                stroke="#5b6cf0"
                strokeWidth={2}
                fill="url(#trendGradient)"
                name="New Tickets"
                dot={{ r: 2.5, fill: '#5b6cf0', strokeWidth: 0 }}
                activeDot={{ r: 4, fill: '#5b6cf0', strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
