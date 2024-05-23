import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { log_levels } from '../schema/Log_Levels';

interface Props {
  logFilterValue: number; 
  onLogFilterChange: (newLogFilterValue: number) => void; 
}

const BasicSelect: React.FC<Props> = ({ logFilterValue, onLogFilterChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    const newLogFilterValue = event.target.value as unknown as number;
    onLogFilterChange(newLogFilterValue); 
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="log-filter-id">Minimum Log Filter</InputLabel>
        <Select
          labelId="log-filter-id"
          id="log-filter-label"
          value={logFilterValue.toString()}
          label="Minimum Log Filter"
          onChange={handleChange}
        >
          {Object.entries(log_levels).map(([level_value, level_name]) => (
            <MenuItem key={level_value} value={parseInt(level_value)}>
              {level_name}
            </MenuItem>
          ))}
          
        </Select>
      </FormControl>
    </Box>
  );
}

export default BasicSelect;