import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Link,
  useTheme,
  alpha,
  IconButton,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { SlideIn, LoadingSpinner } from '../components/animations/index.js';

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
  const theme = useTheme();

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
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10, ${theme.palette.primary.light}05)`,
        py: { xs: 2, md: 3 },
        px: 2,
        margin: 0,
        position: 'relative',
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ width: '100%', maxWidth: 380 }}>
        <SlideIn direction="up">
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                width: '100%',
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.98)})`,
                backdropFilter: 'blur(10px)',
                boxShadow: theme.shadows[20],
              }}
            >
              {/* Header Section */}
              <Box textAlign="center" mb={2.5}>
                <SlideIn direction="up">
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: 2.5,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      mb: 1.5,
                      position: 'relative',
                    }}
                  >
                    <SecurityIcon sx={{ fontSize: 26, color: 'white' }} />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.success.main,
                        border: `2px solid ${theme.palette.background.paper}`,
                      }}
                    />
                  </Box>
                </SlideIn>

                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 0.5,
                  }}
                >
                  AgileFlow
                </Typography>

                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 0.5 }}>
                  {isSignUp ? 'Create your account' : 'Welcome back'}
                </Typography>

                <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                  {isSignUp
                    ? 'Join teams managing projects efficiently'
                    : 'Sign in to continue to your projects'}
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <SlideIn direction="up">
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    }}
                  >
                    {error}
                  </Alert>
                </SlideIn>
              )}

              {/* Google Login Button */}
              <SlideIn direction="up">
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  sx={{
                    mb: 2,
                    py: 1,
                    borderRadius: 2.5,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? <LoadingSpinner size={20} /> : 'Continue with Google'}
                </Button>
              </SlideIn>

              <Divider sx={{ my: 2, position: 'relative' }}>
                <Chip
                  label="or"
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                  }}
                />
              </Divider>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <SlideIn direction="up">
                  {isSignUp && (
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="displayName"
                      label="Full Name"
                      name="displayName"
                      autoComplete="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 1.5,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        },
                      }}
                    />
                  )}

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus={!isSignUp}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 1.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      },
                    }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={loading ? null : <ArrowForwardIcon />}
                    disabled={loading}
                    sx={{
                      py: 1.2,
                      borderRadius: 2.5,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: theme.shadows[8],
                      '&:hover': {
                        boxShadow: theme.shadows[12],
                        transform: 'translateY(-2px)',
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      },
                      '&:disabled': {
                        background: alpha(theme.palette.primary.main, 0.3),
                      },
                      transition: 'all 0.3s ease',
                      mb: 2,
                    }}
                  >
                    {loading ? (
                      <LoadingSpinner size={20} color="white" />
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </Button>
                </SlideIn>

                <SlideIn direction="up">
                  <Box textAlign="center">
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => setIsSignUp(!isSignUp)}
                      type="button"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {isSignUp
                        ? 'Already have an account? Sign in'
                        : "Don't have an account? Sign up"}
                    </Link>
                  </Box>
                </SlideIn>
              </Box>

              {/* Trust Indicators */}
              <SlideIn direction="up">
                <Box
                  sx={{
                    mt: 2.5,
                    pt: 2,
                    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Chip
                    label="🔒 Secure"
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                      fontSize: '0.7rem',
                    }}
                  />
                  <Chip
                    label="⚡ Fast"
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                      fontSize: '0.7rem',
                    }}
                  />
                  <Chip
                    label="🌟 Trusted"
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>
              </SlideIn>
            </Paper>
          </Box>
        </SlideIn>
      </Container>
    </Box>
  );
};
