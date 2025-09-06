import {
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  FolderOpen as ProjectsIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, currentUserData, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  return (
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexGrow: 1,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
        >
          <img
            src="/logo.png"
            alt="AgileFlow Logo"
            style={{
              height: '100%',
              maxHeight: '48px',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: { xs: 0.5, sm: 1 },
            mr: { xs: 1, sm: 3 },
            flexWrap: 'wrap',
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

        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}
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
  );
};
