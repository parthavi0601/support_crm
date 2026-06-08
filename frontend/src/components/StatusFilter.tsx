import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const TABS = ['All', 'Open', 'In Progress', 'Closed'];

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      onChange={handleChange}
      size="small"
      aria-label="Ticket Status Filter"
    >
      {TABS.map((tab) => (
        <ToggleButton key={tab} value={tab} sx={{ textTransform: 'none', fontWeight: 500 }}>
          {tab}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
