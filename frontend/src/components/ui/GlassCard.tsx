import { MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React from 'react';
import { DESIGN_TOKENS } from '../../constants';
import {
  glassCard,
  glassChip,
  glassTypography,
} from '../../styles/glassStyles';

interface GlassCardProps {
  title?: string;
  subtitle?: string;
  avatar?: string;
  avatarAlt?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  chips?: Array<{ label: string; color?: 'primary' | 'secondary' | 'default' }>;
  onMenuClick?: () => void;
  sx?: SxProps<Theme>;
  borderRadius?: keyof typeof DESIGN_TOKENS.borderRadius;
}

/**
 * GlassCard Component
 * Reusable card component with glass-morphism styling
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  subtitle,
  avatar,
  avatarAlt,
  children,
  actions,
  chips = [],
  onMenuClick,
  sx,
  borderRadius = 'medium',
}) => {
  const cardStyles = glassCard(borderRadius);

  return (
    <Card sx={[cardStyles, ...(Array.isArray(sx) ? sx : [sx])]}>
      {(title || subtitle || avatar || onMenuClick) && (
        <CardHeader
          avatar={avatar ? <Avatar src={avatar} alt={avatarAlt} /> : undefined}
          action={
            onMenuClick ? (
              <IconButton onClick={onMenuClick} sx={glassTypography.primary}>
                <MoreVert />
              </IconButton>
            ) : undefined
          }
          title={
            title ? (
              <Typography variant="h6" sx={glassTypography.heading}>
                {title}
              </Typography>
            ) : undefined
          }
          subheader={
            subtitle ? (
              <Typography variant="body2" sx={glassTypography.secondary}>
                {subtitle}
              </Typography>
            ) : undefined
          }
        />
      )}

      <CardContent sx={{ color: 'inherit' }}>
        {children}

        {chips.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {chips.map((chip, index) => (
              <Chip
                key={index}
                label={chip.label}
                size="small"
                sx={glassChip()}
              />
            ))}
          </Box>
        )}
      </CardContent>

      {actions && (
        <CardActions sx={{ justifyContent: 'flex-end' }}>{actions}</CardActions>
      )}
    </Card>
  );
};

export default GlassCard;
