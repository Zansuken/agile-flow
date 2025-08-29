import {
  Alert,
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  TextField,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import type { CreateProjectDto } from '../types/project';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: `linear-gradient(135deg, 
      ${alpha(theme.palette.background.paper, 0.95)} 0%, 
      ${alpha(theme.palette.background.default, 0.9)} 100%)`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    borderRadius: theme.spacing(2),
    minWidth: 480,
    maxWidth: 600,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    borderRadius: theme.spacing(1),
    '&:hover': {
      border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
    },
    '&.Mui-focused': {
      border: `1px solid ${theme.palette.primary.main}`,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    transform: 'translateY(-1px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  '&:disabled': {
    background: alpha(theme.palette.text.disabled, 0.2),
    color: theme.palette.text.disabled,
  },
}));

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (projectData: CreateProjectDto) => Promise<void>;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateProjectDto>({
    name: '',
    description: '',
    key: '',
  });
  const [errors, setErrors] = useState<Partial<CreateProjectDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateProjectDto> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Project name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Project name must be less than 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Key validation
    if (!formData.key.trim()) {
      newErrors.key = 'Project key is required';
    } else if (!/^[A-Z]{2,10}$/.test(formData.key)) {
      newErrors.key = 'Key must be 2-10 uppercase letters only';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof CreateProjectDto) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Auto-format key field
      if (field === 'key') {
        setFormData((prev) => ({
          ...prev,
          key: value
            .toUpperCase()
            .replace(/[^A-Z]/g, '')
            .slice(0, 10),
        }));
      }
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to create project',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', key: '' });
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
          Create New Project
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}
            >
              {submitError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submitError}
                </Alert>
              )}

              <StyledTextField
                label="Project Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Enter a descriptive project name"
                fullWidth
                required
              />

              <StyledTextField
                label="Project Key"
                value={formData.key}
                onChange={handleInputChange('key')}
                error={!!errors.key}
                helperText={
                  errors.key ||
                  'Must be 2-10 uppercase letters (e.g., PROJ, DEV)'
                }
                placeholder="PROJ"
                fullWidth
                required
                inputProps={{
                  style: { textTransform: 'uppercase' },
                  maxLength: 10,
                }}
              />

              <StyledTextField
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Describe what this project is about..."
                fullWidth
                multiline
                rows={4}
                required
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleClose}
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                '&:hover': { bgcolor: alpha('#fff', 0.1) },
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <GradientButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </GradientButton>
          </DialogActions>
        </form>
      </motion.div>
    </StyledDialog>
  );
};
