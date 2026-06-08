import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { Typography, Box, useTheme, alpha } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Autorenew as AutorenewIcon,
  Warning as WarningIcon,
  NoteAdd as NoteAddIcon,
  AddOutlined as AddOutlinedIcon
} from '@mui/icons-material';
import { Activity } from '../types';

interface ActivityTimelineProps {
  activities: Activity[];
}

const ACTION_CONFIG: Record<string, { color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', icon: React.ReactNode }> = {
  TICKET_CREATED: { color: 'success', icon: <AddOutlinedIcon sx={{ fontSize: 14 }} /> },
  STATUS_CHANGED: { color: 'info', icon: <AutorenewIcon sx={{ fontSize: 14 }} /> },
  PRIORITY_CHANGED: { color: 'error', icon: <WarningIcon sx={{ fontSize: 14 }} /> },
  NOTE_ADDED: { color: 'primary', icon: <NoteAddIcon sx={{ fontSize: 14 }} /> },
  ASSIGNMENT_CHANGED: { color: 'warning', icon: <AssignmentIcon sx={{ fontSize: 14 }} /> },
};

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatActionLabel(actionType: string) {
  return actionType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!activities || activities.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">No activity recorded yet.</Typography>
      </Box>
    );
  }

  return (
    <Timeline position="right" sx={{ p: 0, m: 0, '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 } }}>
      {activities.map((activity, index) => {
        const config = ACTION_CONFIG[activity.actionType] || { color: 'primary' as const, icon: <AutorenewIcon sx={{ fontSize: 14 }} /> };
        const isLast = index === activities.length - 1;

        return (
          <TimelineItem key={activity._id} sx={{ minHeight: 64 }}>
            <TimelineOppositeContent sx={{ display: 'none' }} />
            <TimelineSeparator>
              <TimelineDot
                color={config.color}
                variant="outlined"
                sx={{ boxShadow: 'none', p: 0.75, m: 0 }}
              >
                {config.icon}
              </TimelineDot>
              {!isLast && (
                <TimelineConnector sx={{ bgcolor: isDark ? alpha('#fff', 0.08) : alpha('#000', 0.06) }} />
              )}
            </TimelineSeparator>
            <TimelineContent sx={{ py: '10px', px: 1.5 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: isDark ? alpha('#0e1520', 0.4) : alpha('#fafbfc', 0.6),
                }}
              >
                <Typography variant="caption" fontWeight={600} display="block" mb={0.5} sx={{ fontSize: '0.75rem' }}>
                  {formatActionLabel(activity.actionType)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75, fontSize: '0.8125rem', lineHeight: 1.5 }}>
                  {activity.description}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6875rem' }}>
                  {formatDateTime(activity.createdAt)}
                </Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
