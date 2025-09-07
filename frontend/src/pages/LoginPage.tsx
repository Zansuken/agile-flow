import {
  Email as EmailIcon,
  Google as GoogleIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner, SlideIn, FloatingCircles } from '../components/animations/index.js';
import { Logo } from '../components/Logo';
import { useAuth } from '../hooks/useAuth.js';

export const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signup(email, password, displayName);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Circles */}
      <FloatingCircles variant="login" />

      {/* Main Content */}
      <Container
        maxWidth="sm"
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 3 },
        }}
      >
        <SlideIn direction="up">
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 1,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: { xs: '100%', sm: 400 },
              mx: 'auto',
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={{ xs: 2, sm: 3 }}>
              <Logo
                size={60}
                variant="full"
                sx={{
                  mb: 2,
                  filter: 'drop-shadow(0 4px 12px rgba(168, 85, 247, 0.3))',
                }}
              />
              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight="normal"
                mb={0.5}
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Welcome back
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Sign in to your project management workspace
              </Typography>
            </Box>

            {/* Google Sign In Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                py: { xs: 1.25, sm: 1.5 },
                mb: { xs: 2.5, sm: 3 },
                borderColor: '#dadce0',
                color: '#3c4043',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  borderColor: '#dadce0',
                },
              }}
            >
              Continue with Google
            </Button>

            {/* Divider */}
            <Box display="flex" alignItems="center" mb={{ xs: 2.5, sm: 3 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                px={2}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                OR CONTINUE WITH
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: { xs: 1.5, sm: 2 } }}>
                {error}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {isSignUp && (
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  sx={{ mb: { xs: 1.5, sm: 2 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <Typography
                variant="body2"
                color="text.primary"
                mb={1}
                fontWeight={500}
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                sx={{ mb: { xs: 1.5, sm: 2 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Typography
                variant="body2"
                color="text.primary"
                mb={1}
                fontWeight={500}
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                sx={{ mb: { xs: 2.5, sm: 3 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        pr: 1,
                      }}
                    >
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size={window.innerWidth < 600 ? 'small' : 'medium'}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: { xs: 1.25, sm: 1.5 },
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                {loading ? (
                  <LoadingSpinner size={20} color="white" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            {/* Sign up link */}
            <Box textAlign="center">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setIsSignUp(!isSignUp)}
                  type="button"
                  sx={{
                    color: '#667eea',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </SlideIn>
      </Container>
    </Box>
  );
};
