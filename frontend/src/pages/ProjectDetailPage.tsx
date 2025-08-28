import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { useParams } from 'react-router-dom';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Project Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Project ID: {projectId}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box textAlign="center" py={8}>
            <Typography variant="h6" gutterBottom>
              Project Detail Page
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This page will show detailed information about the selected project.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
