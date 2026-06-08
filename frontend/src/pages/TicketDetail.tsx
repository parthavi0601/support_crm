import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Breadcrumbs,
  Link,
  Chip,
  Skeleton,
  MenuItem,
  Avatar,
  Stack,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { NavigateNext as NavigateNextIcon, Save as SaveIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { getTicketById, updateTicket } from '../services/api';
import { Ticket, Note, Activity } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';
import ActivityTimeline from '../components/Timeline';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Closed'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
const AGENT_OPTIONS = ['Unassigned', 'John', 'Sarah', 'Alex', 'David'];

const BADGE_COLORS: Record<string, 'warning' | 'secondary' | 'success' | 'default'> = {
  Open: 'warning',
  'In Progress': 'secondary',
  Closed: 'success',
};

const PRIORITY_COLORS: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
  Low: 'success',
  Medium: 'info',
  High: 'warning',
  Critical: 'error',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={500}
        display="block"
        lineHeight={1.2}
        mb={0.5}
        sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.6875rem' }}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} sx={{ wordBreak: 'break-word', fontSize: '0.875rem' }}>
        {value}
      </Typography>
    </Box>
  );
}

function PanelHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 1.75,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
        {title}
      </Typography>
      {action}
    </Box>
  );
}

export default function TicketDetail() {
  const { ticketId } = useParams();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const { data } = await getTicketById(ticketId as string);
      setTicket(data);
      setNotes(data.notes || []);
      setActivities(data.activities || []);
      setStatus(data.status);
      setPriority(data.priority);
      setAssignedTo(data.assignedTo);
    } catch {
      toast.error('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleSave = () => {
    if (status === 'Closed' && ticket?.status !== 'Closed') {
      setShowConfirm(true);
      return;
    }
    submitUpdate();
  };

  const submitUpdate = async () => {
    setSaving(true);
    setShowConfirm(false);
    try {
      await updateTicket(ticketId as string, { status, priority, assignedTo, note: noteText });
      toast.success('Ticket updated successfully!');
      setNoteText('');
      fetchTicket();
    } catch {
      toast.error('Failed to update ticket');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 3.5, borderRadius: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', mt: 10 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>Ticket not found</Typography>
        <Button component={RouterLink} to="/" variant="outlined" sx={{ borderRadius: 2.5, mt: 1 }}>
          Return to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 14 }} />}
        aria-label="breadcrumb"
        sx={{ mb: 2.5 }}
      >
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/"
          sx={{ fontSize: '0.8125rem', fontWeight: 500 }}
        >
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
          Ticket {ticket.ticketId}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3.5, gap: 2 }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 1.25, flexWrap: 'wrap', gap: 0.75 }}>
            <Chip
              label={ticket.ticketId}
              size="small"
              sx={{
                fontWeight: 600,
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.75rem',
                bgcolor: isDark ? alpha('#5b6cf0', 0.12) : alpha('#5b6cf0', 0.08),
                color: isDark ? '#7b8af5' : '#4a59d9',
              }}
            />
            <Chip label={ticket.status} color={BADGE_COLORS[ticket.status] || 'default'} size="small" />
            <Chip label={ticket.priority} color={PRIORITY_COLORS[ticket.priority] || 'default'} size="small" />
          </Stack>
          <Typography variant="h5" fontWeight={600} letterSpacing="-0.02em">
            {ticket.subject}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={2.5}>
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <PanelHeader title="Ticket Details" />
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <InfoItem label="Customer Name" value={ticket.customerName} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InfoItem label="Customer Email" value={ticket.customerEmail} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <InfoItem label="Assigned To" value={ticket.assignedTo} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem label="Created At" value={formatDate(ticket.createdAt)} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem label="Last Updated" value={formatDate(ticket.updatedAt)} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                      display="block"
                      mb={1}
                      sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.6875rem' }}
                    >
                      Description
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isDark ? alpha('#0e1520', 0.6) : alpha('#fafbfc', 0.8),
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.875rem' }}>
                        {ticket.description}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <PanelHeader
                title="Communication Timeline"
                action={
                  <Chip
                    label={`${notes.length} Note${notes.length !== 1 ? 's' : ''}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                  />
                }
              />

              {notes.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <DescriptionIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1, opacity: 0.6 }} />
                  <Typography variant="body2" color="text.secondary">No notes have been added yet.</Typography>
                </Box>
              ) : (
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    {notes.map((note, index) => (
                      <Box key={note._id || index} sx={{ display: 'flex', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 30,
                            height: 30,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block" mb={0.75}>
                            {formatDate(note.createdAt)}
                          </Typography>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              bgcolor: isDark ? alpha('#0e1520', 0.4) : alpha('#fafbfc', 0.6),
                            }}
                          >
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.875rem' }}>
                              {note.noteText}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>

            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <PanelHeader title="Activity History" />
              <Box sx={{ p: 2.5 }}>
                <ActivityTimeline activities={activities} />
              </Box>
            </Paper>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 3, overflow: 'hidden', position: 'sticky', top: 24 }}
          >
            <PanelHeader title="Update Ticket" />
            <Box sx={{ p: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ mb: 2.5 }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                size="small"
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                sx={{ mb: 2.5 }}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                size="small"
                label="Assigned To"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                sx={{ mb: 2.5 }}
              >
                {AGENT_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={4}
                size="small"
                label="Add Note"
                placeholder="Enter an internal note or response..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                sx={{ mb: 2.5 }}
              />

              <Button
                fullWidth
                variant="contained"
                size="medium"
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon sx={{ fontSize: 18 }} />}
                disabled={saving}
                onClick={handleSave}
                sx={{ borderRadius: 2.5, py: 1.1 }}
              >
                Save Changes
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Close this ticket?"
        message="Marking this ticket as Closed indicates the issue has been resolved. You can still add notes or reopen it later if needed."
        onConfirm={submitUpdate}
        onCancel={() => setShowConfirm(false)}
      />
    </Box>
  );
}
