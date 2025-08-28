import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { useParams } from 'react-router-dom';

export const SprintsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Sprints
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Project ID: {projectId}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box textAlign="center" py={8}>
            <Typography variant="h6" gutterBottom>
              Sprint Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This page will show sprint planning and management features.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
