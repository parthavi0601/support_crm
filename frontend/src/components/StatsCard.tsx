import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'warning' | 'secondary' | 'success' | 'error' | 'info';
  trend?: string;
  variant?: 'default' | 'dashboard';
}

export default function StatsCard({ label, value, icon, color, trend, variant = 'default' }: StatsCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const palette = theme.palette[color];

  if (variant === 'dashboard') {
    return (
      <Box
        sx={{
          position: 'relative',
          p: 2.25,
          pl: 2.75,
          borderRadius: 2.5,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark
            ? '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.25)'
            : '0 1px 0 rgba(255,255,255,0.8) inset, 0 4px 20px rgba(26,35,50,0.04)',
          height: '100%',
          width: '100%',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '18%',
            bottom: '18%',
            width: 3,
            borderRadius: '0 3px 3px 0',
            bgcolor: palette.main,
          },
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: isDark
              ? `linear-gradient(135deg, ${alpha(palette.main, 0.22)} 0%, ${alpha(palette.main, 0.08)} 100%)`
              : `linear-gradient(135deg, ${alpha(palette.main, 0.14)} 0%, ${alpha(palette.main, 0.06)} 100%)`,
            color: palette.main,
            border: `1px solid ${alpha(palette.main, isDark ? 0.2 : 0.12)}`,
            '& .MuiSvgIcon-root': { fontSize: 20 },
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              mb: 0.35,
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            letterSpacing="-0.04em"
            lineHeight={1}
            sx={{ color: 'text.primary', fontFeatureSettings: '"tnum"' }}
          >
            {value ?? 0}
          </Typography>
          {trend && (
            <Typography variant="caption" sx={{ color: palette.main, fontWeight: 500, mt: 0.5, display: 'block' }}>
              {trend}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark
          ? '0 1px 2px rgba(0,0,0,0.2)'
          : '0 1px 2px rgba(26,35,50,0.04)',
        height: '100%',
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8125rem' }}>
          {label}
        </Typography>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(palette.main, isDark ? 0.15 : 0.1),
            color: palette.main,
            '& .MuiSvgIcon-root': { fontSize: 18 },
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        variant="h4"
        fontWeight={600}
        letterSpacing="-0.03em"
        lineHeight={1}
        sx={{ color: 'text.primary' }}
      >
        {value ?? 0}
      </Typography>

      {trend && (
        <Typography variant="caption" sx={{ display: 'block', color: palette.main, fontWeight: 500, mt: 1 }}>
          {trend}
        </Typography>
      )}
    </Box>
  );
}
