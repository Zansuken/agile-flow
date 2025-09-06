import {
  Email as EmailIcon,
  Search as SearchIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import type { User } from '../../types';

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchResults: User[];
  searchLoading: boolean;
  inviteEmail: string;
  onInviteEmailChange: (email: string) => void;
  onAddMember: (userId: string) => void;
  onInviteByEmail: () => void;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onClose,
  searchQuery,
  onSearchQueryChange,
  searchResults,
  searchLoading,
  inviteEmail,
  onInviteEmailChange,
  onAddMember,
  onInviteByEmail,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Add Team Member
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Search for existing users or invite by email
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Search Users */}
        <Box mb={3}>
          <Typography variant="h6" mb={2}>
            Search Users
          </Typography>
          <TextField
            fullWidth
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchLoading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
          />
          {searchResults.length > 0 && (
            <Paper
              elevation={2}
              sx={{
                mt: 1,
                maxHeight: 200,
                overflow: 'auto',
                borderRadius: 2,
              }}
            >
              <List dense>
                {searchResults.map((user) => (
                  <ListItemButton
                    key={user.id}
                    onClick={() => onAddMember(user.id)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={user.photoURL}
                        sx={{ width: 32, height: 32 }}
                      >
                        {user.displayName.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.displayName}
                      secondary={user.email}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Invite by Email */}
        <Box>
          <Typography variant="h6" mb={2}>
            Invite by Email
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter email address..."
            value={inviteEmail}
            onChange={(e) => onInviteEmailChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={onInviteByEmail}
            disabled={!inviteEmail.trim()}
            fullWidth
          >
            Send Invitation
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
