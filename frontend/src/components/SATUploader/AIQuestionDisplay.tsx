import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Card,
  CardContent,
  CardActions,
  Alert,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';

export interface AIQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  relatedToQuestion?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

interface AIQuestionDisplayProps {
  questions: AIQuestion[];
  title?: string;
  onSaveResults?: (results: QuizResult[]) => void;
}

interface QuizResult {
  questionIndex: number;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeTaken?: number; // in seconds
}

const AIQuestionDisplay: React.FC<AIQuestionDisplayProps> = ({
  questions,
  title = 'AI-Generated Practice Questions',
  onSaveResults
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<(string | null)[]>(
    Array(questions.length).fill(null)
  );
  const [submittedAnswers, setSubmittedAnswers] = useState<boolean[]>(
    Array(questions.length).fill(false)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[currentIndex];
  
  const handleOptionSelect = (option: string) => {
    if (!submittedAnswers[currentIndex]) {
      const newSelectedOptions = [...selectedOptions];
      newSelectedOptions[currentIndex] = option;
      setSelectedOptions(newSelectedOptions);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOptions[currentIndex] !== null && !submittedAnswers[currentIndex]) {
      const newSubmittedAnswers = [...submittedAnswers];
      newSubmittedAnswers[currentIndex] = true;
      setSubmittedAnswers(newSubmittedAnswers);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
    } else if (!quizCompleted) {
      // End of quiz reached
      setQuizCompleted(true);
      setShowSummary(true);
      
      // Prepare results to save
      if (onSaveResults) {
        const results: QuizResult[] = questions.map((_, index) => ({
          questionIndex: index,
          selectedAnswer: selectedOptions[index],
          isCorrect: selectedOptions[index] === questions[index].correctAnswer
        }));
        onSaveResults(results);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowExplanation(false);
    }
  };

  const isCorrect = (index: number) => 
    selectedOptions[index] === questions[index].correctAnswer;

  const getCompletionScore = () => {
    const completed = submittedAnswers.filter(Boolean).length;
    return Math.round((completed / questions.length) * 100);
  };

  const getCorrectScore = () => {
    const correctCount = questions.reduce((count, _, index) => 
      isCorrect(index) && submittedAnswers[index] ? count + 1 : count, 0);
    
    return Math.round((correctCount / questions.length) * 100);
  };

  const renderQuestionCard = () => {
    const isSubmitted = submittedAnswers[currentIndex];
    const isAnswerCorrect = isCorrect(currentIndex);
    
    return (
      <Card elevation={3} sx={{ mb: 3, overflow: 'visible' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Typography variant="subtitle1">
            Question {currentIndex + 1} of {questions.length}
          </Typography>
          {currentQuestion.difficulty && (
            <Chip 
              label={currentQuestion.difficulty.toUpperCase()}
              size="small"
              color={
                currentQuestion.difficulty === 'easy' ? 'success' :
                currentQuestion.difficulty === 'medium' ? 'primary' : 'error'
              }
              sx={{ color: 'white', fontWeight: 'bold' }}
            />
          )}
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
            {currentQuestion.question}
          </Typography>
          
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup 
              value={selectedOptions[currentIndex] || ''}
              onChange={(e) => handleOptionSelect(e.target.value)}
            >
              {currentQuestion.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  disabled={isSubmitted}
                  control={
                    <Radio 
                      color={
                        isSubmitted
                          ? option === currentQuestion.correctAnswer
                            ? 'success'
                            : selectedOptions[currentIndex] === option && !isAnswerCorrect
                              ? 'error'
                              : 'primary'
                          : 'primary'
                      }
                    />
                  }
                  label={
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: isSubmitted 
                          ? option === currentQuestion.correctAnswer 
                            ? 'success.main' 
                            : selectedOptions[currentIndex] === option && !isAnswerCorrect
                              ? 'error.main'
                              : 'text.primary'
                          : 'text.primary'
                      }}
                    >
                      {option}
                    </Typography>
                  }
                  sx={{ 
                    mb: 1, 
                    p: 1, 
                    borderRadius: 1,
                    bgcolor: isSubmitted 
                      ? option === currentQuestion.correctAnswer 
                        ? 'success.light' 
                        : selectedOptions[currentIndex] === option && !isAnswerCorrect
                          ? 'error.light'
                          : 'transparent'
                      : 'transparent',
                    '&:hover': {
                      bgcolor: isSubmitted 
                        ? option === currentQuestion.correctAnswer 
                          ? 'success.light' 
                          : selectedOptions[currentIndex] === option && !isAnswerCorrect
                            ? 'error.light'
                            : 'action.hover'
                        : 'action.hover',
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          
          {isSubmitted && (
            <Box sx={{ mt: 3 }}>
              <Alert 
                severity={isAnswerCorrect ? "success" : "error"}
                icon={isAnswerCorrect ? <CheckCircleIcon /> : <CancelIcon />}
              >
                {isAnswerCorrect 
                  ? "Correct! Great job!" 
                  : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
              </Alert>
              
              {showExplanation && currentQuestion.explanation && (
                <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.light' }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LightbulbIcon sx={{ mr: 1 }} /> Explanation:
                  </Typography>
                  <Typography variant="body2">
                    {currentQuestion.explanation}
                  </Typography>
                </Paper>
              )}
              
              {currentQuestion.explanation && !showExplanation && (
                <Button 
                  variant="text" 
                  color="info" 
                  onClick={() => setShowExplanation(true)}
                  sx={{ mt: 1 }}
                >
                  Show Explanation
                </Button>
              )}
            </Box>
          )}
        </CardContent>
        
        <Divider />
        
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Button 
            startIcon={<NavigateBeforeIcon />}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          
          <Box>
            {!isSubmitted ? (
              <Button 
                variant="contained" 
                color="primary"
                disabled={selectedOptions[currentIndex] === null}
                onClick={handleSubmitAnswer}
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary"
                endIcon={<NavigateNextIcon />}
                onClick={handleNext}
              >
                {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            )}
          </Box>
        </CardActions>
      </Card>
    );
  };

  const renderSummary = () => {
    const correctCount = questions.reduce((count, _, index) => 
      isCorrect(index) && submittedAnswers[index] ? count + 1 : count, 0);
    
    return (
      <Dialog 
        open={showSummary} 
        onClose={() => setShowSummary(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <AutoAwesomeIcon sx={{ mr: 1 }} /> Practice Results
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              {correctCount} out of {questions.length} Correct
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {getCorrectScore()}% Accuracy
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Question Summary
          </Typography>
          
          <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 3 }}>
            {questions.map((question, index) => (
              <Box 
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 30, 
                    height: 30, 
                    borderRadius: '50%', 
                    mr: 2,
                    bgcolor: submittedAnswers[index]
                      ? isCorrect(index) ? 'success.light' : 'error.light'
                      : 'grey.300',
                    color: submittedAnswers[index]
                      ? isCorrect(index) ? 'success.contrastText' : 'error.contrastText'
                      : 'text.secondary'
                  }}
                >
                  {index + 1}
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 400 }}>
                    {question.question.length > 60 
                      ? question.question.substring(0, 60) + '...' 
                      : question.question}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  {submittedAnswers[index] ? (
                    <>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Your answer: {selectedOptions[index] || 'None'}
                      </Typography>
                      {isCorrect(index) 
                        ? <CheckCircleIcon color="success" fontSize="small" />
                        : <CancelIcon color="error" fontSize="small" />
                      }
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not answered
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button 
              variant="outlined" 
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
            >
              Print Results
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<DownloadIcon />}
              onClick={() => {
                // Download logic here
                alert('Download functionality would go here');
              }}
            >
              Download PDF
            </Button>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowSummary(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setCurrentIndex(0);
              setSelectedOptions(Array(questions.length).fill(null));
              setSubmittedAnswers(Array(questions.length).fill(false));
              setQuizCompleted(false);
              setShowSummary(false);
            }}
          >
            Retry Quiz
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Chip 
            label={`Completion: ${getCompletionScore()}%`}
            color="primary"
            variant="outlined"
          />
          
          {submittedAnswers.some(Boolean) && (
            <Chip 
              label={`Correct: ${getCorrectScore()}%`}
              color={getCorrectScore() >= 70 ? 'success' : getCorrectScore() >= 40 ? 'warning' : 'error'}
              variant="outlined"
            />
          )}
        </Box>
        
        {questions.length > 0 ? (
          renderQuestionCard()
        ) : (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No practice questions available
          </Typography>
        )}
        
        {quizCompleted && renderSummary()}
      </Paper>
    </Box>
  );
};

export default AIQuestionDisplay; 