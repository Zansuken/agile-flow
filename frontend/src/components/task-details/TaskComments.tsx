import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  List,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { commentService } from '../../services/commentService';
import type { Comment } from '../../types/comment';
import type { TaskUser } from '../../types/task';
import { formatDate } from './taskUtils';

interface TaskCommentsProps {
  taskId: string;
  currentUser: TaskUser | null;
  projectMembers: TaskUser[];
}

interface CommentItemProps {
  comment: Comment;
  currentUser: TaskUser | null;
  projectMembers: TaskUser[];
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onReply: (parentId: string, content: string, mentions: string[]) => void;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  projectMembers,
  onEdit,
  onDelete,
  onReply,
  depth = 0,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies] = useState(true);

  const canEdit = currentUser?.id === comment.authorId;
  const canDelete = canEdit; // Could extend for admin permissions

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
    handleMenuClose();
  };

  const handleEditSave = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      const mentions = commentService.parseMentions(replyContent);
      onReply(comment.id, replyContent.trim(), mentions);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const renderMentions = (content: string) => {
    return content.replace(/@(\w+)/g, (match, username) => {
      const user = projectMembers.find((member) =>
        member.displayName?.toLowerCase().includes(username.toLowerCase()),
      );
      return user
        ? `<span style="color: #1976d2; font-weight: 600;">@${user.displayName}</span>`
        : match;
    });
  };

  return (
    <Box
      id={`comment-${comment.id}`}
      sx={{
        ml: depth * 3,
        scrollMarginTop: '100px', // Space for sticky headers
      }}
    >
      <Box sx={{ p: 0, mb: 2, alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Avatar
            src={comment.author?.photoURL}
            sx={{ width: 32, height: 32, mt: 0.5 }}
          >
            {comment.author?.displayName?.charAt(0) || 'U'}
          </Avatar>{' '}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Comment Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: 'white', fontWeight: 'bold' }}
              >
                {comment.author?.displayName || 'Unknown User'}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                {formatDate(comment.createdAt)}
              </Typography>

              {comment.isEdited && (
                <Chip
                  label="edited"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                />
              )}

              {(canEdit || canDelete) && (
                <IconButton
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ color: 'rgba(255, 255, 255, 0.5)', ml: 'auto' }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Comment Content */}
            {isEditing ? (
              <Box sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    onClick={handleEditSave}
                    variant="contained"
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    onClick={handleEditCancel}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  whiteSpace: 'pre-wrap',
                  mb: 1,
                }}
                dangerouslySetInnerHTML={{
                  __html: renderMentions(comment.content),
                }}
              />
            )}

            {/* Action Buttons */}
            {!isEditing && depth < 2 && (
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => setIsReplying(!isReplying)}
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.75rem',
                  minHeight: 'auto',
                  p: 0.5,
                }}
              >
                Reply
              </Button>
            )}

            {/* Reply Input */}
            <Collapse in={isReplying}>
              <Box
                sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'flex-end' }}
              >
                <Avatar
                  src={currentUser?.photoURL}
                  alt={currentUser?.displayName}
                  sx={{ width: 24, height: 24 }}
                >
                  {currentUser?.displayName?.charAt(0) || 'U'}
                </Avatar>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    },
                  }}
                />
                <IconButton
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim()}
                  sx={{ color: 'white' }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Collapse>

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <Collapse in={showReplies}>
                <Box sx={{ mt: 2 }}>
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      currentUser={currentUser}
                      projectMembers={projectMembers}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onReply={onReply}
                      depth={depth + 1}
                    />
                  ))}
                </Box>
              </Collapse>
            )}
          </Box>
        </Box>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        {canEdit && (
          <MenuItem onClick={handleEdit} sx={{ color: 'white', minWidth: 120 }}>
            <EditIcon sx={{ mr: 1, fontSize: 16 }} />
            Edit
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem
            onClick={() => {
              onDelete(comment.id);
              handleMenuClose();
            }}
            sx={{ color: '#f44336', minWidth: 120 }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export const TaskComments: React.FC<TaskCommentsProps> = ({
  taskId,
  currentUser,
  projectMembers,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const taskComments = await commentService.getTaskComments(taskId);
      setComments(taskComments);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Handle comment focusing from notifications
  useEffect(() => {
    const focusComment = searchParams.get('focusComment');

    if (focusComment && comments.length > 0) {
      // Clear any existing timeout
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }

      // Delay to ensure comments are rendered
      focusTimeoutRef.current = setTimeout(() => {
        const commentElement = document.getElementById(
          `comment-${focusComment}`,
        );

        if (commentElement) {
          commentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });

          // Apply focus styling
          commentElement.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          commentElement.style.borderRadius = '8px';
          commentElement.style.padding = '8px';
          commentElement.style.margin = '8px 0';
          commentElement.style.transition = 'background-color 0.3s ease';

          // Remove focus highlight after 3 seconds
          setTimeout(() => {
            commentElement.style.backgroundColor = '';
            commentElement.style.borderRadius = '';
            commentElement.style.padding = '';
            commentElement.style.margin = '';
            commentElement.style.transition = '';
          }, 3000);

          // Remove the focus parameter from URL
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('focusComment');
          setSearchParams(newSearchParams, { replace: true });
        } else {
          // List all comment elements for debugging if needed
          const allCommentElements =
            document.querySelectorAll('[id^="comment-"]');
          console.warn(
            'Comment element not found for ID:',
            `comment-${focusComment}`,
            'Available:',
            Array.from(allCommentElements).map((el) => el.id),
          );
        }
      }, 100);
    }

    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, [comments, searchParams, setSearchParams]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const mentions = commentService.parseMentions(newComment);
      await commentService.createComment(taskId, {
        content: newComment.trim(),
        mentions,
      });
      setNewComment('');
      await loadComments(); // Refresh comments
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      const mentions = commentService.parseMentions(content);
      await commentService.updateComment(commentId, {
        content,
        mentions,
      });
      await loadComments(); // Refresh comments
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      await loadComments(); // Refresh comments
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  const handleReply = async (
    parentId: string,
    content: string,
    mentions: string[],
  ) => {
    try {
      await commentService.createComment(taskId, {
        content,
        parentId,
        mentions,
      });
      await loadComments(); // Refresh comments
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reply');
    }
  };

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

      {error && (
        <Typography
          variant="body2"
          sx={{ color: '#f44336', mb: 2, textAlign: 'center' }}
        >
          {error}
        </Typography>
      )}

      {/* Add new comment */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar
            src={currentUser?.photoURL}
            alt={currentUser?.displayName}
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
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment... (use @username to mention someone)"
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
            disabled={!newComment.trim() || loading}
            onClick={handleAddComment}
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
      {loading ? (
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            py: 3,
          }}
        >
          Loading comments...
        </Typography>
      ) : (
        <List sx={{ p: 0 }}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              projectMembers={projectMembers}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onReply={handleReply}
            />
          ))}
        </List>
      )}

      {comments.length === 0 && !loading && (
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
