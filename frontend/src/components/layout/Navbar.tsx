import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FolderOpen as ProjectsIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
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
      position="static" 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            color: 'white',
            background: 'linear-gradient(45deg, #ffffff, rgba(255, 255, 255, 0.8))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AgileFlow
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mr: 3 }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Button
                key={item.path}
                startIcon={<Icon />}
                onClick={() => navigate(item.path)}
                sx={{
                  color: 'white',
                  borderRadius: '25px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid transparent',
                  bgcolor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  backdropFilter: isActive ? 'blur(10px)' : 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
              display: { xs: 'none', sm: 'block' }
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
                sx={{ width: 36, height: 36 }}
              />
            ) : (
              <AccountIcon sx={{ color: 'white', fontSize: 28 }} />
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
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
