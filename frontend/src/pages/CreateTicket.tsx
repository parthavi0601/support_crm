import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import { NavigateNext as NavigateNextIcon, Send as SendIcon } from '@mui/icons-material';
import { createTicket } from '../services/api';
import { Ticket } from '../types';

export default function CreateTicket() {
  const nav = useNavigate();
  const [form, setForm] = useState({ customerName: '', customerEmail: '', subject: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = 'Customer Name is required';
    if (!form.customerEmail.trim()) e.customerEmail = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) e.customerEmail = 'Enter a valid email address';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await createTicket(form as Partial<Ticket>);
      toast.success(`Ticket ${data.ticketId} created successfully!`);
      setTimeout(() => nav('/'), 500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Dashboard
        </Link>
        <Typography color="text.primary">New Ticket</Typography>
      </Breadcrumbs>

      <Typography variant="h5" fontWeight="bold" gutterBottom>Create New Ticket</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Fill out the details below to open a new support request.
      </Typography>

      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={form.customerName}
                onChange={handleChange('customerName')}
                error={!!errors.customerName}
                helperText={errors.customerName}
                required
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
              />
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Description"
                value={form.description}
                onChange={handleChange('description')}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', gap: 2, pt: 2, mt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              >
                Create Ticket
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={RouterLink}
                to="/"
                disabled={loading}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
