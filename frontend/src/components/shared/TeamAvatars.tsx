import { Avatar, AvatarGroup, Box, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { userService, type UserProfile } from '../../services/userService';

interface TeamAvatarsProps {
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
