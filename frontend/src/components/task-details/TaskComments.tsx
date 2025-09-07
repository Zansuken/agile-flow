import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import type { TaskUser } from '../../types/task';
import { formatDate } from './taskUtils';
import type { Comment } from './types';

interface TaskCommentsProps {
  comments: Comment[];
  newComment: string;
  currentUser: TaskUser | null;
  onNewCommentChange: (comment: string) => void;
  onAddComment: () => void;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({
  comments,
  newComment,
  currentUser,
  onNewCommentChange,
  onAddComment,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Comments ({comments.length})
      </Typography>

      {/* Add new comment */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
            }}
          >
            {currentUser?.displayName?.charAt(0) || 'U'}
          </Avatar>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            placeholder="Add a comment..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            disabled={!newComment.trim()}
            onClick={onAddComment}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Add Comment
          </Button>
        </Box>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />

      {/* Comments list */}
      <List sx={{ p: 0 }}>
        {comments.map((comment) => (
          <ListItem key={comment.id} sx={{ p: 0, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Avatar src={comment.avatar} sx={{ width: 32, height: 32 }}>
                {comment.author.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'white', fontWeight: 'bold' }}
                  >
                    {comment.author}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  >
                    {formatDate(new Date(comment.createdAt))}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {comment.content}
                </Typography>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>

      {comments.length === 0 && (
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            py: 3,
          }}
        >
          No comments yet. Be the first to comment!
        </Typography>
      )}
    </Paper>
  );
};
