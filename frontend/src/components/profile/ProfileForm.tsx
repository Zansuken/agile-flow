import { Save as SaveIcon } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types';

interface ProfileFormProps {
  userData: User;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ userData }) => {
  const { updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: userData.displayName || '',
    photoURL: userData.photoURL || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleInputChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      // Clear message when user starts typing
      if (message) setMessage(null);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateUserProfile(
        formData.displayName,
        formData.photoURL || undefined,
      );
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    formData.displayName !== (userData.displayName || '') ||
    formData.photoURL !== (userData.photoURL || '');

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 600,
          mb: 3,
        }}
      >
        Personal Information
      </Typography>

      {message && (
        <Alert
          severity={message.type}
          sx={{
            mb: 3,
            background:
              message.type === 'success'
                ? 'rgba(46, 125, 50, 0.1)'
                : 'rgba(211, 47, 47, 0.1)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${
              message.type === 'success'
                ? 'rgba(46, 125, 50, 0.3)'
                : 'rgba(211, 47, 47, 0.3)'
            }`,
            color: 'white',
            '& .MuiAlert-icon': {
              color: message.type === 'success' ? '#4caf50' : '#f44336',
            },
          }}
        >
          {message.text}
        </Alert>
      )}

      {/* Profile Picture Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, fontWeight: 500 }}
        >
          Profile Picture
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
          <Avatar
            src={formData.photoURL || userData.photoURL}
            alt={formData.displayName || userData.displayName}
            sx={{
              width: 80,
              height: 80,
              border: '3px solid rgba(255, 255, 255, 0.2)',
              background:
                'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)',
              fontSize: '2rem',
              fontWeight: 600,
            }}
          >
            {!formData.photoURL &&
              !userData.photoURL &&
              (formData.displayName || userData.displayName)
                ?.charAt(0)
                ?.toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Photo URL"
              placeholder="https://example.com/your-photo.jpg"
              value={formData.photoURL}
              onChange={handleInputChange('photoURL')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#c084fc',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#c084fc',
                  },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                display: 'block',
                mt: 1,
              }}
            >
              Enter a URL to your profile picture
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

      {/* Display Name Section */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Display Name"
          placeholder="Enter your display name"
          value={formData.displayName}
          onChange={handleInputChange('displayName')}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#c084fc',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: '#c084fc',
              },
            },
          }}
        />
      </Box>

      {/* Account Information (Read-only) */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, fontWeight: 500 }}
        >
          Account Information
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={userData.email}
          disabled
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        />

        <TextField
          fullWidth
          label="Role"
          value={userData.role}
          disabled
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        />
      </Box>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading || !hasChanges}
          sx={{
            background: hasChanges
              ? 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)'
              : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': hasChanges
              ? {
                  background:
                    'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
                }
              : {},
            '&:disabled': {
              color: 'rgba(255, 255, 255, 0.5)',
              background: 'rgba(255, 255, 255, 0.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};
