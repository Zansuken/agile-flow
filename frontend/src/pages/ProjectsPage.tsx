import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  FolderOpen as ProjectIcon,
} from '@mui/icons-material';

export const ProjectsPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all your agile projects in one place.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Create project feature coming soon!')}
        >
          Create Project
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box textAlign="center" py={8}>
            <ProjectIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No projects found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Get started by creating your first project. Projects help you organize tasks and sprints.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => alert('Create project feature coming soon!')}
            >
              Create Your First Project
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
