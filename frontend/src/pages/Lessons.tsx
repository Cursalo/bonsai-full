import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom'; // Assuming navigation might be needed
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icon for complete button
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Icon for back button

// Mock data for lesson
const mockLesson = {
  title: 'Number of Solutions', // Updated title based on iframe
  videoId: '1081342531', // Extracted from the Vimeo link
  description: 'This lesson explains how to determine the number of solutions for linear equations.', // Example description
  relatedSkills: ['Algebra', 'Linear Equations', 'Solving Systems'], // Example skills
};

// Define props interface
interface LessonsProps {
  onLessonClick: () => void; // Callback to signal skill mastery
}

const Lessons: React.FC<LessonsProps> = ({ onLessonClick }) => {
  // Using the src from the provided iframe snippet
  const vimeoSrc = `https://player.vimeo.com/video/${mockLesson.videoId}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`; 

  const handleMarkComplete = () => {
    onLessonClick(); // Call the function passed from App.tsx
    // Potentially navigate away or show a success message
    console.log('Lesson marked complete!');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          mt: 3, 
          mb: 3, 
          borderRadius: theme => theme.shape.borderRadius // Use theme default (4px)
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          component="h1" 
          sx={{ 
            fontWeight: 'medium', 
            mb: 3, 
            color: 'text.primary' // Ensure primary text color 
          }}
        >
          {mockLesson.title}
        </Typography>
        
        <Box 
          sx={{ 
            position: 'relative', 
            paddingTop: '55.19%', // Specific Vimeo embed padding 
            mb: 3, 
            borderRadius: theme => theme.shape.borderRadius, // Use theme default (4px)
            overflow: 'hidden', 
            backgroundColor: 'black' // Background for letterboxing if needed
          }}
        > 
          <iframe 
            src={vimeoSrc} 
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              border: 0,
              borderRadius: 'inherit'
            }}
            title={mockLesson.title}
          >
          </iframe>
        </Box>

        <Typography 
          variant="body1" 
          paragraph 
          sx={{ 
            mb: 3, 
            fontSize: '1.1rem', 
            lineHeight: 1.7, 
            color: 'text.primary' 
          }} 
        >
          {mockLesson.description}
        </Typography>

        <Box sx={{ mt: 2, mb: 4 }}> 
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 'medium', 
              mb: 1.5, 
              color: 'text.secondary'
            }}
          >
            Related Skills:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {mockLesson.relatedSkills.map(skill => (
              <Chip 
                key={skill} 
                label={skill} 
                color="primary" 
                variant="outlined" 
                size="small" 
                sx={{ mr: 1, mb: 1, color: 'text.primary', borderColor: 'divider', borderRadius: theme => theme.shape.borderRadius }} // Use theme default (4px)
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderTop: '1px solid', 
          borderColor: 'divider', // Standard divider color
          pt: 3 
        }}>
          <Button 
            variant="text" // Use text variant for less emphasis 
            component={Link} 
            to="/dashboard"
            startIcon={<ArrowBackIcon />} // Add back icon
            sx={{ mr: 2 }}
          > 
            Back to Dashboard
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleMarkComplete}
            size="large"
            startIcon={<CheckCircleOutlineIcon />}
            sx={{
              borderRadius: theme => theme.shape.borderRadius, // Use theme default (4px)
              px: 4, // Keep padding for shape
              fontWeight: 'bold',
              color: 'white' // Ensure text contrast
            }}
          >
            Mark as Complete
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Lessons; 