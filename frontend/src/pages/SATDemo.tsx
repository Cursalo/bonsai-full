import React, { useState } from 'react';
import { Box, Typography, Container, Paper, Tabs, Tab, Divider } from '@mui/material';
import { AdvancedUploader, AIQuestionDisplay, AIQuestion } from '../components/SATUploader';

const SATDemo: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Sample AI generated questions for demo purposes
  const [sampleQuestions, setSampleQuestions] = useState<AIQuestion[]>([
    {
      question: "Based on the results of your SAT practice, which of the following is the most effective strategy for improving your performance in Reading and Writing questions?",
      options: [
        "Memorize vocabulary words from a dictionary",
        "Focus on understanding the main idea and supporting details in passages",
        "Skip difficult questions and only answer easy ones",
        "Read passages quickly without analyzing the content"
      ],
      correctAnswer: "Focus on understanding the main idea and supporting details in passages",
      explanation: "Your score report shows that you had difficulty with questions requiring deep comprehension of passage structure and rhetorical strategies. Focusing on understanding main ideas and supporting details will help address this weakness.",
      difficulty: "medium",
      category: "Reading Strategy"
    },
    {
      question: "In your SAT practice, you struggled with identifying the author's purpose. Which approach would most effectively help improve this skill?",
      options: [
        "Reading the passage once quickly",
        "Analyzing the tone, word choice, and structure of the passage",
        "Focusing only on the first and last paragraphs",
        "Skipping difficult passages"
      ],
      correctAnswer: "Analyzing the tone, word choice, and structure of the passage",
      explanation: "Author's purpose is often revealed through tone, word choice, and structure. Your performance indicates a need for deeper analysis of these elements.",
      difficulty: "hard",
      category: "Author's Purpose"
    },
    {
      question: "Your SAT practice shows a pattern of errors in questions involving data interpretation. Which approach would help improve your performance in this area?",
      options: [
        "Memorizing formulas without understanding them",
        "Avoiding graphs and charts whenever possible",
        "Practicing by identifying key information in graphs and connecting it to the questions",
        "Guessing on all data-based questions"
      ],
      correctAnswer: "Practicing by identifying key information in graphs and connecting it to the questions",
      explanation: "Your score report indicates difficulty with extracting relevant information from data presentations and applying it correctly. Practice in identifying key information will help address this weakness.",
      difficulty: "medium",
      category: "Data Analysis"
    },
    {
      question: "Based on your performance in math questions, which of the following concepts should you prioritize studying?",
      options: [
        "Basic arithmetic operations",
        "Linear equations and systems",
        "Quadratic functions and equations",
        "Advanced calculus concepts"
      ],
      correctAnswer: "Quadratic functions and equations",
      explanation: "Your score report shows that you missed several questions involving quadratic functions and equations. This appears to be a specific area of weakness that you should focus on.",
      difficulty: "medium",
      category: "Mathematics"
    },
    {
      question: "In your SAT practice, you struggled with questions related to pronoun references. Which strategy would best help improve this skill?",
      options: [
        "Skipping all questions about pronouns",
        "Memorizing grammar rules without applying them",
        "Practicing identifying the noun that each pronoun refers to in context",
        "Reading the passages backwards"
      ],
      correctAnswer: "Practicing identifying the noun that each pronoun refers to in context",
      explanation: "Your score report indicates difficulty with tracking pronoun references in complex texts. Practice in explicitly identifying antecedents will help address this weakness.",
      difficulty: "easy",
      category: "Grammar"
    }
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // This would normally come from API after successful upload
  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    // In a real app, we would get the questions from the backend
    setTabValue(1); // Switch to the Questions tab
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
          SAT Practice Report Analyzer Demo
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          This demo showcases our enhanced SAT report analyzer with OCR capabilities and AI-powered question generation.
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            variant="fullWidth"
          >
            <Tab label="Upload SAT Report" />
            <Tab label="AI Practice Questions" disabled={!uploadSuccess && tabValue !== 1} />
          </Tabs>
        </Box>
        
        {tabValue === 0 && (
          <Box>
            <AdvancedUploader />
            
            {/* Demo mode buttons for testing without actual file upload */}
            <Box sx={{ mt: 4, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Demo Mode Controls
              </Typography>
              <Typography variant="body2" paragraph>
                For demonstration purposes, you can simulate a successful upload:
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <button 
                  onClick={handleUploadSuccess}
                  style={{
                    padding: '8px 16px',
                    background: '#f5f5f5',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Simulate Successful Upload with AI Questions
                </button>
              </Box>
            </Box>
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <AIQuestionDisplay 
              questions={sampleQuestions} 
              title="AI-Generated Practice Questions Based on Your SAT Results"
            />
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          About This Demo
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" paragraph>
          This demo showcases two key features of our enhanced SAT preparation system:
        </Typography>
        <Typography component="ol" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Advanced OCR-Enabled Upload:</strong> Our system can now automatically extract text from PDF SAT score reports, even when the PDF contains scanned images rather than selectable text. This is powered by Tesseract.js, a leading OCR library.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>AI-Generated Practice Questions:</strong> Based on the student's performance in the SAT practice test, our system uses Google's Gemini API to generate personalized practice questions that target the specific areas where the student needs improvement.
            </Typography>
          </li>
        </Typography>
        <Typography variant="body2">
          In a real implementation, the system would analyze the student's actual SAT report to identify weakness areas, then generate targeted questions to help improve those specific skills.
        </Typography>
      </Box>
    </Container>
  );
};

export default SATDemo; 