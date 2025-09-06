import { Delete as DeleteIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import React from 'react';
import type { User } from '../../types';
import type { Project } from '../../types/project';
import { SlideIn } from '../animations/index.js';

interface ProjectMember extends User {
  projectRole?: string;
  joinedAt?: Date;
}

interface TeamMembersListProps {
  members: ProjectMember[];
  project: Project;
  canManage: () => boolean;
  currentUserId?: string;
  onRemoveMember: (memberId: string) => void;
  getRoleDisplayName: (role: string) => string;
}

export const TeamMembersList: React.FC<TeamMembersListProps> = ({
  members,
  project,
  canManage,
  currentUserId,
  onRemoveMember,
  getRoleDisplayName,
}) => {
  return (
    <SlideIn direction="up">
      <Card
        sx={{
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <CardHeader
          title={
            <Typography variant="h6" sx={{ color: 'white' }}>
              Team Members ({members.length})
            </Typography>
          }
          subheader={
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Manage your project team
            </Typography>
          }
        />
        <CardContent>
          <List sx={{ p: 0 }}>
            {members.map((member) => (
              <ListItem
                key={member.id}
                sx={{
                  borderRadius: 2,
                  mb: 2,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  '&:last-child': { mb: 0 },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}
                secondaryAction={
                  canManage() &&
                  member.id !== project.ownerId &&
                  member.id !== currentUserId ? (
                    <IconButton
                      edge="end"
                      onClick={() => onRemoveMember(member.id)}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          color: '#ff6b6b',
                          backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : undefined
                }
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                  }}
                >
                  <Avatar
                    src={member.photoURL}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {member.displayName.charAt(0).toUpperCase()}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: 'column', sm: 'row' }}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      gap={{ xs: 0.5, sm: 1 }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                          color: 'white',
                          fontSize: { xs: '1rem', sm: '1.25rem' },
                        }}
                      >
                        {member.displayName}
                      </Typography>
                      {member.id === project.ownerId && (
                        <Chip
                          label="Owner"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      }}
                    >
                      {member.email}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexWrap="wrap"
                      gap={{ xs: 0.5, sm: 1 }}
                      mt={0.5}
                    >
                      <Chip
                        label={getRoleDisplayName(member.role)}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      />
                      {member.projectRole && (
                        <Chip
                          label={member.projectRole}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: 'white',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </SlideIn>
  );
};
