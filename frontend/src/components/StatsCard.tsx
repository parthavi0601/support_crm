import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'warning' | 'secondary' | 'success';
}

export default function StatsCard({ label, value, icon, color }: StatsCardProps) {
  const theme = useTheme();

  return (
    <Card 
      elevation={0}
      sx={{ 
        border: `1px solid ${theme.palette.divider}`,
        borderLeft: `4px solid ${theme.palette[color].main}`,
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[2]
        }
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
        <Box 
          sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: `${theme.palette[color].main}20`, // 20% opacity
            color: `${theme.palette[color].main}`
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="overline" color="text.secondary" fontWeight={600} lineHeight={1.2}>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={900}>
            {value ?? 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
