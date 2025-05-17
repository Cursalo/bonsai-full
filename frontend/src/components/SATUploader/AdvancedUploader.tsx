import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Stepper, 
  Step, 
  StepLabel,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Slider,
  Chip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ScienceIcon from '@mui/icons-material/Science';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const AdvancedUploader: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generateQuestions, setGenerateQuestions] = useState(true);
  const [questionCount, setQuestionCount] = useState(10);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ocrRequired, setOcrRequired] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [scoreReport, setScoreReport] = useState<any>(null);

  const steps = ['Select SAT File', 'Configure Options', 'Upload & Process'];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    
    if (selectedFile) {
      // Only accept PDF files
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
      
      // Move to next step
      if (activeStep === 0) {
        setActiveStep(1);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    const droppedFile = event.dataTransfer.files?.[0] || null;
    
    if (droppedFile) {
      // Only accept PDF files
      if (droppedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setError(null);
      
      // Move to next step
      if (activeStep === 0) {
        setActiveStep(1);
      }
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('scoreReport', file);
    formData.append('generateQuestions', generateQuestions.toString());
    formData.append('questionCount', questionCount.toString());
    
    try {
      const response = await axios.post(
        `${API_URL}/score-reports/upload`, 
        formData, 
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 50) / progressEvent.total);
              setUploadProgress(progress); // Only go up to 50% for upload
            }
          }
        }
      );
      
      // Simulate processing progress
      let progress = 50;
      const interval = setInterval(() => {
        progress += 2;
        if (progress >= 90) {
          clearInterval(interval);
        }
        setUploadProgress(progress);
      }, 300);
      
      // Set data
      setScoreReport(response.data.scoreReport);
      setGeneratedQuestions(response.data.aiGeneratedQuestions || []);
      setOcrRequired(response.data.ocrWasUsed || false);
      setAiGenerated(response.data.aiGeneratedQuestions?.length > 0 || false);
      
      // Complete progress
      clearInterval(interval);
      setUploadProgress(100);
      setUploadSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload your SAT score report
            </Typography>
            
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 5, 
                bgcolor: 'background.paper',
                borderStyle: 'dashed',
                borderWidth: 2,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderColor: 'primary.main'
                }
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <CloudUploadIcon sx={{ fontSize: 60, color: 'action.active', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Drag & drop your PDF file here
              </Typography>
              <Typography variant="body2" color="textSecondary">
                or click to browse files
              </Typography>
              <input
                id="file-input"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Paper>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configure processing options
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Selected file: <b>{fileName}</b>
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                AI-Powered Features
              </Typography>
              
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={generateQuestions} 
                    onChange={(e) => setGenerateQuestions(e.target.checked)}
                    color="primary"
                  />
                }
                label="Generate practice questions from my results"
                sx={{ mb: 2, display: 'block' }}
              />
              
              {generateQuestions && (
                <Box sx={{ ml: 4, mb: 2 }}>
                  <Typography gutterBottom>
                    Number of questions to generate: {questionCount}
                  </Typography>
                  <Slider
                    value={questionCount}
                    onChange={(_, value) => setQuestionCount(value as number)}
                    step={1}
                    marks
                    min={5}
                    max={20}
                    valueLabelDisplay="auto"
                    sx={{ maxWidth: 300 }}
                  />
                </Box>
              )}
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
              >
                Continue
              </Button>
            </Box>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload and process your report
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3, position: 'relative' }}>
              {!uploadSuccess ? (
                <>
                  <Typography variant="body1" gutterBottom>
                    Your file will be processed using the following technologies:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                    <Chip icon={<PsychologyIcon />} label="PDF Text Extraction" color="primary" variant="outlined" />
                    <Chip icon={<ScienceIcon />} label="OCR (if needed)" color="secondary" variant="outlined" />
                    {generateQuestions && (
                      <Chip icon={<AutoAwesomeIcon />} label="AI Question Generation" color="success" variant="outlined" />
                    )}
                  </Box>
                  
                  <Box sx={{ position: 'relative', height: 10, mb: 3, bgcolor: 'grey.200', borderRadius: 5 }}>
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        borderRadius: 5,
                        bgcolor: 'primary.main',
                        transition: 'width 0.3s ease',
                        width: `${uploadProgress}%`
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    {loading ? (
                      <CircularProgress size={30} />
                    ) : (
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="large"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleSubmit}
                      >
                        Upload & Process
                      </Button>
                    )}
                  </Box>
                  
                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary" gutterBottom>
                    Processing Complete!
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', my: 2 }}>
                    <Chip label={`${scoreReport?.correctAnswers || 0} Correct Answers`} color="success" />
                    <Chip label={`${scoreReport?.incorrectAnswers || 0} Incorrect Answers`} color="error" />
                    {ocrRequired && (
                      <Chip icon={<ScienceIcon />} label="OCR was used" color="secondary" />
                    )}
                    {aiGenerated && (
                      <Chip 
                        icon={<AutoAwesomeIcon />} 
                        label={`${generatedQuestions.length} AI Questions Generated`} 
                        color="primary" 
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => {
                        // Navigate to report view, add your navigation logic here
                        alert("Navigate to report view with ID: " + scoreReport?._id);
                      }}
                    >
                      View Full Report
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
            
            {!uploadSuccess && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={handleBack} disabled={loading}>
                  Back
                </Button>
              </Box>
            )}
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main' }} />
          Enhanced SAT Report Analyzer
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent(activeStep)}
      </Paper>
    </Box>
  );
};

export default AdvancedUploader; 