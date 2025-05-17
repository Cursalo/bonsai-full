import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Mock quiz data
const mockQuizData = [
  {
    id: 'q1',
    question: 'Which punctuation mark is used to indicate possession?',
    options: ['Comma (,)', 'Apostrophe (\')', 'Period (.)', 'Semicolon (;)'],
    correctAnswer: 'Apostrophe (\')',
  },
  {
    id: 'q2',
    question: 'What is the standard equation of a circle with center (h, k) and radius r?',
    options: [
      '(x-h)^2 + (y-k)^2 = r^2',
      'y = mx + b',
      'a^2 + b^2 = c^2',
      'Ax + By = C',
    ],
    correctAnswer: '(x-h)^2 + (y-k)^2 = r^2',
  },
  {
    id: 'q3',
    question: 'In the context of reading comprehension, what does it mean to infer?',
    options: [
      'To state the main idea directly', 
      'To find specific details mentioned in the text',
      'To draw a conclusion based on evidence and reasoning',
      'To summarize the passage',
    ],
    correctAnswer: 'To draw a conclusion based on evidence and reasoning',
  },
  {
    id: 'q4',
    question: 'If 3x + 5 = 14, what is the value of x?',
    options: [
      '3', 
      '5',
      '9',
      '19/3',
    ],
    correctAnswer: '3',
  },
  {
    id: 'q5',
    question: 'Which of the following is a sentence fragment?',
    options: [
      'Running through the park.',
      'She sings beautifully.',
      'The cat slept.',
      'Because it was raining.', 
    ],
    correctAnswer: 'Running through the park.', // Note: 'Because it was raining.' is also a fragment (subordinate clause).
  },
  {
    id: 'q6',
    question: 'In the sentence, "The politician\'s ambiguous statement confused the reporters," what does ambiguous mean?',
    options: [
      'Clear and direct',
      'Loud and forceful',
      'Open to more than one interpretation',
      'Quiet and hesitant',
    ],
    correctAnswer: 'Open to more than one interpretation',
  },
  {
    id: 'q7',
    question: 'A rectangle has a length of 8 units and a width of 5 units. What is its area?',
    options: [
      '13 square units',
      '26 square units',
      '40 square units',
      '64 square units',
    ],
    correctAnswer: '40 square units',
  },
  {
    id: 'q8',
    question: 'Choose the sentence with the correct subject-verb agreement:',
    options: [
      'The team of players are ready.',
      'Each of the students have a book.',
      'The flock of birds flies south.',
      'Neither the cat nor the dogs eats that food.',
    ],
    correctAnswer: 'The flock of birds flies south.',
  },
  {
    id: 'q9',
    question: 'What is 20% of 150?',
    options: [
      '20',
      '30',
      '40',
      '50',
    ],
    correctAnswer: '30',
  },
  {
    id: 'q10',
    question: 'The main purpose of the first paragraph is typically to:',
    options: [
      'Provide supporting details.',
      'Introduce the main topic and thesis.',
      'Offer counterarguments.',
      'Conclude the essay.',
    ],
    correctAnswer: 'Introduce the main topic and thesis.',
  },
];

// Define props interface
interface QuizProps {
  onQuizComplete: () => void; // Callback to signal skill mastery
}

const Quiz: React.FC<QuizProps> = ({ onQuizComplete }) => { // Destructure props
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = mockQuizData[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockQuizData.length) * 100;

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: event.target.value,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      // Calculate score here to decide if skill is mastered
      const score = calculateScore(); 
      // Example threshold: master skill if score > 50%
      if (score > mockQuizData.length / 2) { 
        onQuizComplete(); // Call the function passed from App.tsx
      }
    }
  };

  const calculateScore = () => {
    let score = 0;
    mockQuizData.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / mockQuizData.length) * 100;
    let feedback = 'Good job!';
    if (percentage < 50) feedback = 'Keep practicing!';
    else if (percentage > 80) feedback = 'Excellent work!';

    return (
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            textAlign: 'center', 
            borderRadius: theme => theme.shape.borderRadius // Use theme border radius
          }}
        >
          <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
            Quiz Completed!
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Your Score: {score} / {mockQuizData.length} ({percentage.toFixed(0)}%)
          </Typography>
          <Alert 
            severity={percentage > 70 ? "success" : percentage > 40 ? "warning" : "error"} 
            sx={{ mb: 3, justifyContent: 'center' }} // Center alert content
          >
            {feedback}
          </Alert>
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            onClick={() => navigate('/dashboard')} 
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 8, 
          p: { xs: 2, sm: 4 }, 
          borderRadius: theme => theme.shape.borderRadius // Use theme border radius
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Question {currentQuestionIndex + 1} of {mockQuizData.length}
          </Typography>
          <LinearProgress variant="determinate" value={progress} color="primary" sx={{ height: 8, borderRadius: 4 }}/>
        </Box>
        
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel component="legend" sx={{ mb: 3, typography: 'h5', fontWeight: 'medium', color: 'text.primary' }}>
            {currentQuestion.question}
          </FormLabel>
          <RadioGroup
            aria-label={`question-${currentQuestion.id}`}
            name={`question-${currentQuestion.id}`}
            value={selectedAnswers[currentQuestion.id] || ''}
            onChange={handleAnswerChange}
            sx={{ gap: 1.5 }}
          >
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option;
              return (
                <FormControlLabel 
                  key={option} 
                  value={option} 
                  control={<Radio color="primary" />}
                  label={option} 
                  sx={{ 
                    p: 1.5, 
                    m: 0, 
                    borderRadius: theme => theme.shape.borderRadius,
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? 'primary.light' : 'transparent',
                    transition: 'background-color 0.2s, border-color 0.2s',
                    '&:hover': { 
                      bgcolor: isSelected ? 'primary.light' : 'action.hover' 
                    }
                  }}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion.id]}
            size="large"
          >
            {currentQuestionIndex < mockQuizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Quiz; 