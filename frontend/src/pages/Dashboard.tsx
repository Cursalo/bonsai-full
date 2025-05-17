import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  LinearProgress,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import UploadIcon from '@mui/icons-material/Upload';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import InsightsIcon from '@mui/icons-material/Insights';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ForestIcon from '@mui/icons-material/Forest';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FlagIcon from '@mui/icons-material/Flag';
import SettingsIcon from '@mui/icons-material/Settings';
import BonsaiTree from '../components/BonsaiTree';

// Mock data for the dashboard
const mockUserData = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  lastLogin: '2 days ago',
  completedLessons: 5,
  skillsMastered: 7,
};

// Adjusted skills data to reflect 7 mastered/strong skills
const mockSkillsData = [
  { name: 'Punctuation', proficiency: 95, status: 'Mastered' },
  { name: 'Linear Equations', proficiency: 90, status: 'Mastered' },
  { name: 'Reading: Main Idea', proficiency: 88, status: 'Strong' },
  { name: 'Vocabulary in Context', proficiency: 85, status: 'Strong' },
  { name: 'Geometry: Circles', proficiency: 82, status: 'Strong' },
  { name: 'Subject-Verb Agreement', proficiency: 80, status: 'Strong' },
  { name: 'Data Analysis: Basic Charts', proficiency: 80, status: 'Strong' },
  { name: 'Essay Structure', proficiency: 70, status: 'Proficient' },
  { name: 'Advanced Functions', proficiency: 60, status: 'Needs Practice' },
  { name: 'Reading: Tone', proficiency: 55, status: 'Needs Practice' },
];

// Define props interface
interface DashboardProps {
  skillsMastered: number;
}

const Dashboard: React.FC<DashboardProps> = ({ skillsMastered }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Helper function to determine progress bar color based on proficiency
  const getProgressColor = (proficiency: number): "success" | "warning" | "error" => {
    if (proficiency >= 80) return "success";
    if (proficiency >= 60) return "warning";
    return "error";
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Bonsai Prep - Dashboard
          </Typography>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {mockUserData.name.charAt(0)}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': { width: 240 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bonsai Prep
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem component={Link} to="/dashboard">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem component={Link} to="/upload">
            <ListItemIcon>
              <UploadIcon />
            </ListItemIcon>
            <ListItemText primary="Upload Score Report" />
          </ListItem>
          <ListItem component={Link} to="/lessons">
            <ListItemIcon>
              <PlayLessonIcon />
            </ListItemIcon>
            <ListItemText primary="My Lessons" />
          </ListItem>
          <ListItem component={Link} to="/progress">
            <ListItemIcon>
              <InsightsIcon />
            </ListItemIcon>
            <ListItemText primary="Progress" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem component={Link} to="/profile">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem component={Link} to="/logout">
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'grey.100',
          p: { xs: 2, md: 3 },
          width: '100%',
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Welcome back, {mockUserData.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Last login: {mockUserData.lastLogin}
            </Typography>
          </Box>

          {/* Main Dashboard Grid: Tree + Actions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Bonsai Tree Section */}
            <Grid size={{ xs: 12, md: 6, lg: 5 }}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  borderRadius: theme => theme.shape.borderRadius,
                  height: '100%',
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between' 
                }}
              >
                <BonsaiTree progress={skillsMastered} /> 
                <Typography variant="body1" align="center" sx={{ mt: 1, mb: 1, color: 'text.secondary' }}>
                  You've mastered {skillsMastered} skills so far! Keep growing!
                </Typography>
              </Paper>
            </Grid>

            {/* Quick Actions Section */}
            <Grid size={{ xs: 12, md: 6, lg: 7 }}>
              <Box sx={{ mb: 2 }}> 
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium' }} gutterBottom>
                  Quick Actions
                </Typography>
              </Box>
              <Grid container spacing={2.5}>
                {/* Action Cards */}
                {[
                  { icon: FileUploadIcon, title: 'Upload New Report', text: 'Upload an SAT practice test score report to get personalized lessons.', link: '/upload', buttonText: 'Upload Report' },
                  { icon: ModelTrainingIcon, title: 'Continue Learning', text: 'You have lessons available in your current path.', link: '/lessons', buttonText: 'Go to Lessons' },
                  { icon: FitnessCenterIcon, title: 'Practice Skills', text: 'Test your knowledge with practice questions for your current skills.', link: '/quiz', buttonText: 'Start Quiz' },
                  { icon: AssessmentIcon, title: 'View Progress', text: 'See detailed charts and insights on your skill development.', link: '/progress', buttonText: 'See Progress' },
                  { icon: FlagIcon, title: 'Set Goals', text: 'Define your target score or specific skills to focus on.', link: '#', buttonText: 'Set Goals' },
                  { icon: SettingsIcon, title: 'Manage Profile', text: 'Update your account information and preferences.', link: '/profile', buttonText: 'Edit Profile' },
                ].map((action, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}> 
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: theme => theme.shape.borderRadius, elevation: 2 }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <action.icon sx={{ mr: 1, color: 'primary.main' }} />
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.text}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ px: 2, pb: 2 }}>
                        <Button size="small" component={Link} to={action.link} variant="outlined" color="primary">
                          {action.buttonText}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Skills Breakdown Section */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: theme => theme.shape.borderRadius, elevation: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
                  <BarChartIcon sx={{ mr: 1, verticalAlign: 'bottom', color: 'primary.main' }}/>
                  Skills Breakdown
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Based on your recent activity and uploaded reports.
                </Typography>
                <List dense disablePadding>
                  {mockSkillsData.map((skill, index) => (
                    <ListItemButton 
                      key={skill.name} 
                      sx={{ 
                        mb: 1.5, 
                        p: 1.5, 
                        borderRadius: theme => theme.shape.borderRadius,
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body1" component="span" sx={{ fontWeight: 'medium' }}>{skill.name}</Typography>
                          <Typography variant="body2" component="span" color={getProgressColor(skill.proficiency) + '.dark'} sx={{ fontWeight: 'bold' }}>{skill.status}</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={skill.proficiency} 
                          color={getProgressColor(skill.proficiency)}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 