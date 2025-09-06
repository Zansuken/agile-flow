import {
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  FolderOpen as ProjectsIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, currentUserData, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md and below for mobile/tablet

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {currentUserData?.displayName || currentUser?.email}
            </Typography>
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
