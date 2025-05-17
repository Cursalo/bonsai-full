import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './App.css';

// Import pages (to be created)
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import Lessons from './pages/Lessons';
import NotFound from './pages/NotFound';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#0cc16b', // Updated primary color
    },
    secondary: {
      main: '#ffc107', // Example secondary color
    },
    background: {
      default: '#f7f9fc', // Slightly lighter background for a cleaner look
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    // Add other typography overrides if needed
  },
  shape: {
    borderRadius: 4, // Set global border radius to 4px
  },
  components: {
    // Example: Default Button styling override
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Less shouting buttons
        },
      },
    },
    // Example: Default Paper styling override
    MuiPaper: {
      styleOverrides: {
        root: {
          // Add subtle shadow or other default paper styles if desired
        },
      },
    },
  },
});

function App() {
  // Start state at 7 to simulate progress
  const [skillsMastered, setSkillsMastered] = useState<number>(7);

  // Function to increment skills - pass this down
  const incrementSkillsMastered = () => {
    // In a real app, you might have logic to prevent going over a max
    setSkillsMastered(prevSkills => prevSkills + 1);
    console.log('Skill mastered! New count:', skillsMastered + 1); // Log for debugging
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={<Dashboard skillsMastered={skillsMastered} />} // Pass state down
          />
          <Route path="/upload" element={<UploadReport />} />
          <Route 
            path="/quiz" 
            element={<Quiz onQuizComplete={incrementSkillsMastered} />} // Pass updater function
          />
          <Route 
            path="/lessons" 
            element={<Lessons onLessonClick={incrementSkillsMastered} />} // Pass updater function
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
