import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Breadcrumbs,
  Link,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Paper
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Send as SendIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { createTicket } from '../services/api';
import { Ticket } from '../types';

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#22c55e',
  Medium: '#3b82f6',
  High: '#f59e0b',
  Critical: '#ef4444',
};

const sectionLabelSx = {
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  color: 'text.secondary',
  fontSize: '0.6875rem',
  display: 'block',
  mb: 0.5,
};

export default function CreateTicket() {
  const nav = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    subject: '',
    description: '',
    priority: 'Medium',
    assignedTo: 'Unassigned',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = 'Customer name is required';
    if (!form.customerEmail.trim()) e.customerEmail = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) e.customerEmail = 'Enter a valid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleChange = (field: keyof typeof form) => (e: any) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await createTicket(form as Partial<Ticket>);
      toast.success(`Ticket ${data.ticketId} created!`);
      setTimeout(() => nav('/'), 400);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = PRIORITY_COLORS[form.priority] || '#5b6cf0';

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 760, mx: 'auto' }}>
      <Box sx={{ mb: 3.5 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 14 }} />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: '0.8125rem', fontWeight: 500 }}
          >
            <HomeIcon sx={{ fontSize: 14 }} />
            Dashboard
          </Link>
          <Typography sx={{ color: 'text.primary', fontSize: '0.8125rem', fontWeight: 500 }}>
            New Ticket
          </Typography>
        </Breadcrumbs>

        <Typography variant="h5" fontWeight={600} letterSpacing="-0.02em" sx={{ mb: 0.75 }}>
          Create Support Ticket
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fill in the details below to open a new support request
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            height: 3,
            backgroundColor: priorityColor,
            transition: 'background-color 0.25s ease',
          }}
        />

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography sx={sectionLabelSx}>Customer Information</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={form.customerName}
                onChange={handleChange('customerName')}
                error={!!errors.customerName}
                helperText={errors.customerName}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Customer Email"
                value={form.customerEmail}
                onChange={handleChange('customerEmail')}
                error={!!errors.customerEmail}
                helperText={errors.customerEmail}
                required
                size="small"
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 0.5 }}>
              <Typography sx={sectionLabelSx}>Ticket Details</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={form.subject}
                onChange={handleChange('subject')}
                error={!!errors.subject}
                helperText={errors.subject}
                required
                size="small"
                placeholder="Brief description of the issue"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Description"
                value={form.description}
                onChange={handleChange('description')}
                error={!!errors.description}
                helperText={errors.description}
                required
                placeholder="Describe the issue in detail..."
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 0.5 }}>
              <Typography sx={sectionLabelSx}>Classification</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={form.priority}
                  label="Priority"
                  onChange={handleChange('priority')}
                  renderValue={(val) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: PRIORITY_COLORS[val as string] }} />
                      {val}
                    </Box>
                  )}
                >
                  {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                    <MenuItem key={p} value={p}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: PRIORITY_COLORS[p] }} />
                        {p}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Assign To</InputLabel>
                <Select value={form.assignedTo} label="Assign To" onChange={handleChange('assignedTo')}>
                  <MenuItem value="Unassigned">
                    <Box sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Unassigned</Box>
                  </MenuItem>
                  {['John', 'Sarah', 'Alex', 'David'].map((agent) => (
                    <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  pt: 2,
                  mt: 1,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: 16 }} />}
                  sx={{ px: 3, borderRadius: 2.5 }}
                >
                  {loading ? 'Creating…' : 'Create Ticket'}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={RouterLink}
                  to="/"
                  disabled={loading}
                  sx={{ color: 'text.secondary', borderRadius: 2.5 }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
