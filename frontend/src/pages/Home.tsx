import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Grid,
  TextField, 
  Typography, 
  Card, 
  CardContent,
  useTheme,
} from '@mui/material';

const Home: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper', 
          pt: 8, 
          pb: 6,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url("/path/to/bonsai-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Your Missed Questions. Your Custom Lessons. Your Growth.
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Upload a real SAT practice test, and Bonsai builds a training path just for you—powered by real tutor videos, not guesswork.
          </Typography>
          <Box
            sx={{
              mt: 5,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <TextField
              label="Email Address"
              variant="outlined"
              placeholder="Enter your email"
              sx={{ minWidth: { sm: 300 } }}
            />
            <Button variant="contained" color="primary" size="large">
              Join the Beta Waitlist
            </Button>
          </Box>
          <Typography 
            variant="subtitle1" 
            align="center" 
            sx={{ mt: 2 }}
          >
            Launching Fall 2025 – Free access during beta.
          </Typography>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8, bgcolor: '#f9f9f9' }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            How Bonsai Prep Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {/* Step 1 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    1. Upload Your SAT Practice Test Score Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use one of the official College Board practice tests.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Step 2 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    2. Get a Custom Skill Quiz
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We build a short quiz to pinpoint your exact strengths and weaknesses.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Step 3 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    3. Watch Tutor-Crafted Video Lessons
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on what you miss, you'll unlock videos made by expert tutors to target your specific content and strategy gaps.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Step 4 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    4. Reinforce & Track Your Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    After each lesson, you'll practice with more curated questions—and when you master a skill, your bonsai tree grows a new branch.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Not Just Smarter. Better. Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Not Just Smarter. Better.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                ✅ Real Tutor Videos
              </Typography>
              <Typography variant="body1">
                Every lesson is handcrafted by an expert—not AI-generated or generic.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                ✅ Truly Personalized
              </Typography>
              <Typography variant="body1">
                You only see what applies to your actual gaps—nothing more, nothing less.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                ✅ Diagnostic-Driven
              </Typography>
              <Typography variant="body1">
                It all starts with your real SAT data, not random drills.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                ✅ Visual Progress
              </Typography>
              <Typography variant="body1">
                Your growing bonsai tree shows exactly what you've mastered.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body1" align="center">
            © 2025 Bonsai Prep. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 