import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { useParams } from 'react-router-dom';

export const KanbanPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Kanban Board
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Project ID: {projectId}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box textAlign="center" py={8}>
            <Typography variant="h6" gutterBottom>
              Kanban Board
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This page will show the Kanban board with drag-and-drop task management.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
