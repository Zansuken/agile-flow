import {
  AccountCircle as AccountIcon,
  ClearAll as ClearAllIcon,
  Dashboard as DashboardIcon,
  Delete as DeleteIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  FolderOpen as ProjectsIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../types/notification';
import { formatDate } from '../task-details/taskUtils';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, currentUserData, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md and below for mobile/tablet

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const userNotifications =
          await notificationService.getUserNotifications();
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter((n) => !n.isRead).length);
      } catch (error) {
        console.error('❌ Failed to load notifications:', error);
      }
    };

    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleClearAllNotifications = async () => {
    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  const handleDeleteNotification = async (
    notificationId: string,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation(); // Prevent notification click
    try {
      await notificationService.deleteNotification(notificationId);

      // Remove from local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(
        (n) => n.id === notificationId,
      );
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationItemClick = async (notification: Notification) => {
    try {
      // Delete the notification when clicked (user has seen it)
      await notificationService.deleteNotification(notification.id);

      // Remove from local state
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));

      // Update unread count if the deleted notification was unread
      if (!notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      // Navigate to task and focus on comment
      if (notification.taskId && notification.projectId) {
        const projectId = notification.projectId;
        const taskId = notification.taskId;
        const commentId = notification.commentId;

        // Close notification dropdown
        handleNotificationClose();

        // Navigate to task details with comment focus
        if (commentId) {
          navigate(
            `/projects/${projectId}/tasks/${taskId}?focusComment=${commentId}`,
          );
        } else {
          navigate(`/projects/${projectId}/tasks/${taskId}`);
        }
      } else {
        console.warn('⚠️ Notification missing required data:', {
          taskId: notification.taskId,
          projectId: notification.projectId,
          notification,
        });
      }
    } catch (error) {
      console.error('Failed to handle notification click:', error);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleDrawerClose(); // Close drawer when navigating on mobile
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleClose();
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { label: 'Projects', path: '/projects', icon: ProjectsIcon },
  ];

  // Mobile Drawer Component
  const drawer = (
    <Box sx={{ width: 250, height: '100%' }}>
      {/* Navigation Items */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          height: 'calc(100% - 64px)', // Account for header height
          mt: '64px',
          pt: 2,
        }}
      >
        <List sx={{ px: 1 }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: 3,
                    mx: 1,
                    py: 1.5,
                    background: isActive
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(255, 255, 255, 0.2)'
                      : '1px solid transparent',
                    backdropFilter: isActive ? 'blur(10px)' : 'none',
                    boxShadow: isActive
                      ? '0 4px 16px rgba(0, 0, 0, 0.1)'
                      : 'none',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Icon
                      sx={{
                        color: 'white',
                        fontSize: 22,
                        filter: isActive
                          ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                          : 'none',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: isActive ? 600 : 500,
                        color: 'white',
                        fontSize: '1rem',
                        textShadow: isActive
                          ? '0 2px 4px rgba(0,0,0,0.3)'
                          : 'none',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ py: 1, px: { xs: 1, sm: 2 } }}>
          {/* Mobile: Burger menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                ml: 1,
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo - centered on mobile, left-aligned on desktop */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexGrow: isMobile ? 1 : 0,
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
          >
            <img
              src="/logo.png"
              alt="AgileFlow Logo"
              onClick={() => navigate('/dashboard')}
              style={{
                height: '100%',
                maxHeight: '48px',
                cursor: 'pointer',
              }}
            />
          </Box>

          {/* Desktop: Navigation items */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 0.5, sm: 1 },
                mx: { xs: 1, sm: 3 },
                flexWrap: 'wrap',
                flexGrow: 1,
              }}
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <Button
                    key={item.path}
                    startIcon={
                      <Icon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
                    }
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: 'white',
                      borderRadius: '25px',
                      px: { xs: 1.5, sm: 3 },
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      minWidth: { xs: 'auto', sm: 'auto' },
                      border: isActive
                        ? '1px solid rgba(255, 255, 255, 0.4)'
                        : '1px solid transparent',
                      bgcolor: isActive
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'transparent',
                      backdropFilter: isActive ? 'blur(10px)' : 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                      '& .MuiButton-startIcon': {
                        mr: { xs: 0.5, sm: 1 },
                      },
                    }}
                  >
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      {item.label}
                    </Box>
                  </Button>
                );
              })}
            </Box>
          )}

          {/* User profile section - always visible */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              ml: isMobile ? 0 : 'auto',
            }}
          >
            {/* Notification Bell */}
            <IconButton
              size="large"
              aria-label="notifications"
              onClick={handleNotificationClick}
              sx={{
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                p: { xs: 0.5, sm: 1 },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Badge>
            </IconButton>

            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column',
                alignItems: 'flex-end',
                mr: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                {currentUserData?.displayName || 'User'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem',
                  lineHeight: 1,
                }}
              >
                {currentUser?.email}
              </Typography>
            </Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                border: '2px solid rgba(255, 255, 255, 0.3)',
                p: { xs: 0.5, sm: 1 },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {currentUserData?.photoURL ? (
                <Avatar
                  src={currentUserData.photoURL}
                  alt={currentUserData.displayName}
                  sx={{
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                  }}
                />
              ) : (
                <AccountIcon
                  sx={{
                    color: 'white',
                    fontSize: { xs: 24, sm: 28 },
                  }}
                />
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  mt: 1,
                  minWidth: 180,
                },
                '& .MuiMenuItem-root': {
                  color: 'white',
                  fontWeight: 500,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                },
              }}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            {/* Notification Popover */}
            <Popover
              id="notifications-popover"
              open={Boolean(notificationAnchor)}
              anchorEl={notificationAnchor}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{
                '& .MuiPaper-root': {
                  background: 'rgba(15, 15, 25, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 1,
                  minWidth: 420,
                  maxHeight: 600,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <Paper
                sx={{
                  background: 'transparent',
                  maxHeight: 520,
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '3px',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    pb: 1,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationsIcon sx={{ color: 'white', fontSize: 20 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                      }}
                    >
                      Notifications
                    </Typography>
                    {unreadCount > 0 && (
                      <Chip
                        label={unreadCount}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255, 64, 64, 0.8)',
                          color: 'white',
                          fontSize: '0.75rem',
                          height: 20,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    )}
                  </Box>
                  {notifications.length > 0 && (
                    <Button
                      size="small"
                      startIcon={<ClearAllIcon sx={{ fontSize: 16 }} />}
                      onClick={handleClearAllNotifications}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem',
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2,
                        py: 0.5,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      Clear all
                    </Button>
                  )}
                </Box>
                {notifications.length === 0 ? (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <NotificationsIcon
                      sx={{
                        fontSize: 48,
                        color: 'rgba(255, 255, 255, 0.3)',
                        mb: 1,
                      }}
                    />
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      No notifications yet
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.8rem',
                      }}
                    >
                      We'll notify you when something happens
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {notifications.slice(0, 10).map((notification, index) => (
                      <ListItemButton
                        key={notification.id}
                        onClick={() =>
                          handleNotificationItemClick(notification)
                        }
                        sx={{
                          borderBottom:
                            index < notifications.slice(0, 10).length - 1
                              ? '1px solid rgba(255, 255, 255, 0.06)'
                              : 'none',
                          backgroundColor: notification.isRead
                            ? 'transparent'
                            : 'rgba(102, 146, 255, 0.08)',
                          borderLeft: notification.isRead
                            ? 'none'
                            : '3px solid rgba(102, 146, 255, 0.6)',
                          py: 2,
                          px: 3,
                          '&:hover': {
                            backgroundColor: notification.isRead
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(102, 146, 255, 0.12)',
                          },
                          pr: 7, // Add padding to make room for delete button
                          position: 'relative',
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            width: '100%',
                          }}
                        >
                          {/* Notification Icon */}
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: notification.isRead
                                ? 'rgba(255, 255, 255, 0.3)'
                                : 'rgba(102, 146, 255, 0.8)',
                              mt: 1,
                              flexShrink: 0,
                            }}
                          />

                          {/* Content */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: 'white',
                                fontWeight: notification.isRead ? 500 : 600,
                                fontSize: '0.9rem',
                                lineHeight: 1.3,
                                mb: 0.5,
                              }}
                            >
                              {notification.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.8rem',
                                lineHeight: 1.4,
                                mb: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {notification.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                              }}
                            >
                              {formatDate(notification.createdAt)}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Delete Button */}
                        <IconButton
                          size="small"
                          onClick={(event) =>
                            handleDeleteNotification(notification.id, event)
                          }
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: 12,
                            color: 'rgba(255, 255, 255, 0.4)',
                            width: 28,
                            height: 28,
                            '&:hover': {
                              color: 'rgba(255, 64, 64, 0.8)',
                              backgroundColor: 'rgba(255, 64, 64, 0.1)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Paper>
            </Popover>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 250,
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
          },
          '& .MuiBackdrop-root': {
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};
