import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: { borderRadius: 3.5, minWidth: 360, maxWidth: 420 }
      }}
    >
      <DialogTitle id="alert-dialog-title" fontWeight={600} sx={{ fontSize: '1rem', pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.6 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
        <Button onClick={onCancel} color="inherit" variant="outlined" sx={{ borderRadius: 2.5 }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" sx={{ borderRadius: 2.5 }} autoFocus>
          Close Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
}
