import React, { useState, ChangeEvent, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Link,
  Checkbox,
  FormControlLabel,
  TextField,
  FormControl,
  FormHelperText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const UploadReport: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [generateAIQuestions, setGenerateAIQuestions] = useState<boolean>(true);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [reportId, setReportId] = useState<string>('');
  const [aiQuestions, setAiQuestions] = useState<any[]>([]);

  const steps = [
    'Upload Score Report',
    'Processing Report',
    'View Personalized Path',
  ];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError('');
    
    // Check file type
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are accepted');
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('scoreReport', selectedFile);
      formData.append('generateQuestions', generateAIQuestions.toString());
      formData.append('questionCount', questionCount.toString());

      // Move to the next step
      setActiveStep(1);
      
      // Send to backend API
      const response = await fetch('/api/score-reports/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }
      
      const data = await response.json();
      setReportId(data.reportId);
      
      // If AI questions were generated, store them
      if (data.aiGeneratedQuestions) {
        setAiQuestions(data.aiGeneratedQuestions);
      }
      
      // Move to final step
      setActiveStep(2);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload and process the file');
      setActiveStep(0); // Go back to first step on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuestionCountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0 && value <= 30) {
      setQuestionCount(value);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Upload SAT Score Report
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <>
            <Typography variant="body1" align="center" paragraph>
              Upload your official College Board SAT Practice Test score report (PDF format).
              We'll analyze your results and create a personalized learning path.
            </Typography>
            
            {uploadError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {uploadError}
              </Alert>
            )}
            
            <Box
              sx={{
                border: '2px dashed',
                borderColor: isDragging ? 'primary.main' : 'grey.400',
                borderRadius: 2,
                p: 3,
                mb: 3,
                backgroundColor: isDragging ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">
                Drag & Drop your PDF file here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported format: PDF, Max size: 5MB
              </Typography>
            </Box>
            
            {selectedFile && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="body1">
                  Selected file: {selectedFile.name}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 3, mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={generateAIQuestions}
                    onChange={(e) => setGenerateAIQuestions(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>Generate AI practice questions based on missed questions</Typography>
                  </Box>
                }
              />
              
              {generateAIQuestions && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <TextField
                    label="Number of questions to generate"
                    type="number"
                    value={questionCount}
                    onChange={handleQuestionCountChange}
                    InputProps={{ inputProps: { min: 1, max: 30 } }}
                    variant="outlined"
                    size="small"
                  />
                  <FormHelperText>Generate 1-30 practice questions (default: 10)</FormHelperText>
                </FormControl>
              )}
            </Box>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              sx={{ mt: 2 }}
            >
              {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Upload & Process'}
            </Button>
            
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don't have a score report? <Link href="https://satsuite.collegeboard.org/sat/practice-preparation/practice-tests" target="_blank" rel="noopener">Get a practice test</Link> from the College Board website.
            </Typography>
          </>
        )}
        
        {activeStep === 1 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6">
              {generateAIQuestions ? 
                'Processing your score report and generating practice questions...' :
                'Processing your score report...'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {generateAIQuestions ?
                "We're analyzing your answers to identify skill gaps, create your personalized learning path, and generate relevant practice questions." :
                "We're analyzing your answers to identify skill gaps and create your personalized learning path."}
            </Typography>
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Your personalized learning path is ready!
            </Typography>
            <Typography variant="body1" paragraph>
              We've analyzed your score report and identified areas to focus on.
              {aiQuestions.length > 0 && ` We've also generated ${aiQuestions.length} custom practice questions based on your missed questions.`}
            </Typography>
            
            {aiQuestions.length > 0 && (
              <Box sx={{ mb: 3, mt: 2, textAlign: 'left', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  <AutoAwesomeIcon sx={{ mr: 1, fontSize: 'small', verticalAlign: 'middle' }} />
                  Sample practice question:
                </Typography>
                <Typography variant="body1" paragraph>
                  {aiQuestions[0].question}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Plus {aiQuestions.length - 1} more questions to practice with!
                </Typography>
              </Box>
            )}
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate(`/dashboard?reportId=${reportId}`)}
            >
              View Your Learning Path
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UploadReport; 