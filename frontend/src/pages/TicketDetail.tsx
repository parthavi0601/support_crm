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
  Divider,
  Avatar,
  Stack,
  CircularProgress
} from '@mui/material';
import { NavigateNext as NavigateNextIcon, Save as SaveIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { getTicketById, updateTicket } from '../services/api';
import { Ticket, Note } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Closed'];

const BADGE_COLORS: Record<string, 'warning' | 'secondary' | 'success' | 'default'> = {
  Open: 'warning',
  'In Progress': 'secondary',
  Closed: 'success',
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
      <Typography variant="overline" color="text.secondary" fontWeight={600} display="block" lineHeight={1.2} mb={0.5}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} sx={{ wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function TicketDetail() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [status, setStatus] = useState('');
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const { data } = await getTicketById(ticketId as string);
      setTicket(data);
      setNotes(data.notes || []);
      setStatus(data.status);
    } catch (err) {
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
      await updateTicket(ticketId as string, { status, note: noteText });
      toast.success('Ticket updated successfully!');
      setNoteText('');
      fetchTicket();
    } catch (err) {
      toast.error('Failed to update ticket');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} sx={{ mb: 4, borderRadius: 2 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', mt: 10 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>Ticket not found</Typography>
        <Button component={RouterLink} to="/" variant="outlined">Return to Dashboard</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Dashboard
        </Link>
        <Typography color="text.primary">Ticket {ticket.ticketId}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Chip label={ticket.ticketId} color="primary" variant="outlined" size="small" sx={{ fontWeight: 'bold' }} />
            <Chip label={ticket.status} color={BADGE_COLORS[ticket.status] || 'default'} size="small" sx={{ fontWeight: 500 }} />
          </Box>
          <Typography variant="h4" fontWeight="bold">{ticket.subject}</Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight="bold">Ticket Details</Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoItem label="Customer Name" value={ticket.customerName} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem label="Customer Email" value={ticket.customerEmail} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem label="Created At" value={formatDate(ticket.createdAt)} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoItem label="Last Updated" value={formatDate(ticket.updatedAt)} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="overline" color="text.secondary" fontWeight={600} display="block" mb={1}>
                      Description
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {ticket.description}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold">Communication Timeline</Typography>
                <Chip label={`${notes.length} Note${notes.length !== 1 ? 's' : ''}`} size="small" color="primary" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }} />
              </Box>
              
              {notes.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <DescriptionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">No notes have been added yet.</Typography>
                </Box>
              ) : (
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {notes.map((note, index) => (
                      <Box key={note._id || index} sx={{ display: 'flex', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem', fontWeight: 'bold' }}>
                          {index + 1}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                            {formatDate(note.createdAt)}
                          </Typography>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {note.noteText}
                            </Typography>
                          </Paper>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper variant="outlined" sx={{ borderRadius: 2, position: 'sticky', top: 24 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="bold">Update Ticket</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <TextField
                select
                fullWidth
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ mb: 3 }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Add Note"
                placeholder="Enter an internal note or response..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                sx={{ mb: 3 }}
              />
              
              <Button
                fullWidth
                variant="contained"
                disableElevation
                size="large"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={saving}
                onClick={handleSave}
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
