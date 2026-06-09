import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';

/** Fixed vintage ticket dimensions — all dashboard stat cards share this exact size */
export const VINTAGE_TICKET_HEIGHT = 96;
export const VINTAGE_TICKET_STUB_WIDTH = 56;

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'warning' | 'secondary' | 'success' | 'error' | 'info';
  trend?: string;
  variant?: 'default' | 'dashboard';
}

function VintageTicketCard({
  label,
  value,
  icon,
  palette,
  trend,
  isDark,
  paperBg,
  pageBg,
  divider,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  palette: { main: string };
  trend?: string;
  isDark: boolean;
  paperBg: string;
  pageBg: string;
  divider: string;
}) {
  const stubBg = isDark
    ? alpha(palette.main, 0.12)
    : alpha(palette.main, 0.07);
  const vintagePaper = isDark ? paperBg : '#fdfbf7';

  const notchSx = {
    content: '""',
    position: 'absolute' as const,
    top: '50%',
    width: 14,
    height: 14,
    borderRadius: '50%',
    bgcolor: pageBg,
    border: `1px solid ${divider}`,
    transform: 'translateY(-50%)',
    zIndex: 3,
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        height: { xs: 80, sm: VINTAGE_TICKET_HEIGHT },
        boxSizing: 'border-box',
        filter: isDark
          ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))'
          : 'drop-shadow(0 2px 6px rgba(26,35,50,0.08))',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          height: { xs: 80, sm: VINTAGE_TICKET_HEIGHT },
          boxSizing: 'border-box',
          display: 'flex',
          borderRadius: '6px',
          bgcolor: vintagePaper,
          border: `1px solid ${isDark ? divider : alpha(palette.main, 0.18)}`,
          overflow: 'hidden',
          backgroundImage: isDark
            ? `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                ${alpha('#fff', 0.015)} 2px,
                ${alpha('#fff', 0.015)} 4px
              )`
            : `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                ${alpha('#000', 0.012)} 2px,
                ${alpha('#000', 0.012)} 4px
              )`,
          // Hide notch circles on mobile — they overflow 7px outside card edges
          '@media (max-width: 599px)': {
            '&::before': { display: 'none' },
            '&::after': { display: 'none' },
          },
          '@media (min-width: 600px)': {
            overflow: 'visible',
            '&::before': {
              ...notchSx,
              left: -7,
              borderRightColor: 'transparent',
              boxShadow: `inset -2px 0 0 ${alpha(palette.main, 0.15)}`,
            },
            '&::after': {
              ...notchSx,
              right: -7,
              borderLeftColor: 'transparent',
              boxShadow: `inset 2px 0 0 ${alpha(palette.main, 0.15)}`,
            },
          },
        }}
      >
        {/* Stub */}
        <Box
          sx={{
            width: { xs: 44, sm: VINTAGE_TICKET_STUB_WIDTH },
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: stubBg,
            borderRight: `2px dashed ${alpha(palette.main, isDark ? 0.35 : 0.28)}`,
            borderRadius: '6px 0 0 6px',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: { xs: 28, sm: 34 },
              height: { xs: 28, sm: 34 },
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isDark ? alpha(palette.main, 0.2) : alpha(palette.main, 0.12),
              color: palette.main,
              border: `1.5px solid ${alpha(palette.main, 0.35)}`,
              '& .MuiSvgIcon-root': { fontSize: { xs: 15, sm: 18 } },
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Body */}
        <Box
          sx={{
            flex: '1 1 0',
            px: { xs: 1.25, sm: 1.75 },
            py: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 0,
            width: 0,
            height: { xs: 80, sm: VINTAGE_TICKET_HEIGHT },
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="caption"
            noWrap
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              lineHeight: 1.25,
              height: 16,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 0.35,
              fontFamily: '"Inter", sans-serif',
              display: 'block',
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            letterSpacing="-0.04em"
            lineHeight={1}
            sx={{
              color: 'text.primary',
              fontFeatureSettings: '"tnum"',
              fontFamily: '"Inter", ui-monospace, monospace',
              fontSize: { xs: '1.4rem', sm: '1.75rem' },
            }}
          >
            {value ?? 0}
          </Typography>
          {trend && (
            <Typography variant="caption" sx={{ color: palette.main, fontWeight: 500, mt: 0.5 }}>
              {trend}
            </Typography>
          )}
        </Box>

        {/* Corner perforation dots */}
        <Box
          sx={{
            position: 'absolute',
            right: 10,
            top: 8,
            bottom: 8,
            width: 3,
            backgroundImage: `radial-gradient(circle, ${alpha(palette.main, 0.25)} 1px, transparent 1px)`,
            backgroundSize: '3px 6px',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
      </Box>
    </Box>
  );
}

export default function StatsCard({ label, value, icon, color, trend, variant = 'default' }: StatsCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const palette = theme.palette[color];

  if (variant === 'dashboard') {
    return (
      <VintageTicketCard
        label={label}
        value={value}
        icon={icon}
        palette={palette}
        trend={trend}
        isDark={isDark}
        paperBg={theme.palette.background.paper}
        pageBg={theme.palette.background.default}
        divider={theme.palette.divider}
      />
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
