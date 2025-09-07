import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RecentProject } from '../../services/dashboardService';
import { userService, type UserProfile } from '../../services/userService';
import { HoverCard } from '../animations';

export interface TeamAvatarsProps {
  memberIds: string[];
  maxAvatars?: number;
  size?: 'small' | 'medium' | 'large';
  showTooltips?: boolean;
}

const sizeConfig = {
  small: { width: 24, height: 24, fontSize: '0.75rem' },
  medium: { width: 32, height: 32, fontSize: '0.875rem' },
  large: { width: 40, height: 40, fontSize: '1rem' },
};

export const TeamAvatars: React.FC<TeamAvatarsProps> = ({
  memberIds,
  maxAvatars = 3,
  size = 'medium',
  showTooltips = true,
}) => {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!memberIds?.length) {
        setLoading(false);
        return;
      }

      try {
        const memberProfiles = await userService.getUsersByIds(
          memberIds.slice(0, maxAvatars),
        );
        setMembers(memberProfiles);
      } catch (error) {
        console.error('Error fetching member details:', error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [memberIds, maxAvatars]);

  if (loading) {
    // Show skeleton avatars while loading
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <AvatarGroup
          max={maxAvatars + 1}
          sx={{
            '& .MuiAvatar-root': {
              ...sizeConfig[size],
              border: '2px solid rgba(255, 255, 255, 0.3)',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.5,
                },
                '100%': {
                  opacity: 1,
                },
              },
            },
          }}
        >
          {Array.from({ length: Math.min(memberIds.length, maxAvatars) }).map(
            (_, index) => (
              <Avatar key={index} sx={sizeConfig[size]} />
            ),
          )}
        </AvatarGroup>
      </Box>
    );
  }

  if (!members.length && memberIds.length > 0) {
    // Show placeholder when we have member IDs but couldn't load profiles
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <AvatarGroup
          max={maxAvatars + 1}
          sx={{
            '& .MuiAvatar-root': {
              ...sizeConfig[size],
              border: '2px solid rgba(255, 255, 255, 0.3)',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: sizeConfig[size].fontSize,
              fontWeight: 500,
            },
          }}
        >
          <Avatar sx={sizeConfig[size]}>?</Avatar>
        </AvatarGroup>
      </Box>
    );
  }

  if (!members.length) {
    return null;
  }

  const displayMembers = members.slice(0, maxAvatars);
  const remainingCount = Math.max(0, memberIds.length - maxAvatars);

  const renderAvatar = (member: UserProfile) => {
    const avatar = (
      <Avatar
        key={member.id}
        src={member.photoURL}
        sx={{
          ...sizeConfig[size],
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          fontSize: sizeConfig[size].fontSize,
          fontWeight: 600,
        }}
      >
        {member.displayName.charAt(0).toUpperCase()}
      </Avatar>
    );

    if (showTooltips) {
      return (
        <Tooltip key={member.id} title={member.displayName} arrow>
          {avatar}
        </Tooltip>
      );
    }

    return avatar;
  };

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <AvatarGroup
        max={maxAvatars + 1}
        sx={{
          '& .MuiAvatar-root': {
            ...sizeConfig[size],
            border: '2px solid rgba(255, 255, 255, 0.3)',
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: sizeConfig[size].fontSize,
            fontWeight: 600,
            '&:hover': {
              transform: 'scale(1.1)',
              zIndex: 10,
            },
            transition: 'transform 0.2s ease',
          },
          '& .MuiAvatarGroup-avatar': {
            bgcolor: 'rgba(102, 126, 234, 1)',
            color: 'rgba(255, 255, 255, 0.8)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            fontSize: sizeConfig[size].fontSize,
            fontWeight: 500,
          },
        }}
      >
        {displayMembers.map((member) => renderAvatar(member))}
        {remainingCount > 0 && (
          <Avatar
            sx={{
              ...sizeConfig[size],
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.8)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              fontSize: sizeConfig[size].fontSize,
              fontWeight: 500,
            }}
          >
            +{remainingCount}
          </Avatar>
        )}
      </AvatarGroup>
    </Box>
  );
};

interface RecentProjectsProps {
  project: RecentProject;
}

export const ProjectCard: FC<RecentProjectsProps> = ({ project }) => {
  const navigate = useNavigate();
  return (
    <HoverCard key={project.id}>
      <Card
        sx={{
          height: '100%',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 2,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-5px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          },
          transition: 'all 0.3s ease',
        }}
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              'linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))',
          }}
        />

        <CardContent sx={{ p: 3 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Chip
              label={project.status}
              size="small"
              sx={{
                backgroundColor:
                  project.status === 'Completed'
                    ? 'rgba(76, 175, 80, 0.2)'
                    : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            />
            <TeamAvatars
              memberIds={project.memberIds}
              maxAvatars={3}
              size="small"
            />
          </Box>

          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ color: 'white' }}
          >
            {project.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            {project.description}
          </Typography>

          <Box mb={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: 'white' }}
              >
                Progress
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ color: 'white' }}
              >
                {project.progress}%
              </Typography>
            </Box>
            <Box
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${project.progress}%`,
                  background:
                    'linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            Due: {new Date(project.dueDate).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </HoverCard>
  );
};
