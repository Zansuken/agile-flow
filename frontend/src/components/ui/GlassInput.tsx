import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import type { SelectProps } from '@mui/material/Select';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TextFieldProps } from '@mui/material/TextField';
import React from 'react';
import { glassInput } from '../../styles/glassStyles';

interface GlassInputProps extends Omit<TextFieldProps, 'sx'> {
  sx?: SxProps<Theme>;
}

interface GlassSelectProps extends Omit<SelectProps, 'sx'> {
  label?: string;
  options: Array<{ value: string | number; label: string }>;
  sx?: SxProps<Theme>;
}

/**
 * GlassInput Component
 * Reusable input component with glass-morphism styling
 */
export const GlassInput: React.FC<GlassInputProps> = ({ sx, ...props }) => {
  const inputStyles = glassInput();

  return (
    <TextField
      sx={[inputStyles, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  );
};

/**
 * GlassSelect Component
 * Reusable select component with glass-morphism styling
 */
export const GlassSelect: React.FC<GlassSelectProps> = ({
  label,
  options,
  sx,
  ...props
}) => {
  const inputStyles = glassInput();

  return (
    <FormControl
      sx={[inputStyles, ...(Array.isArray(sx) ? sx : [sx])]}
      fullWidth
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { GlassInput as default };
