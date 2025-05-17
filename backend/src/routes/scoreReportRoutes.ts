import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ScoreReportParser from '../utils/ScoreReportParser';
import { ScoreReport } from '../models';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create upload middleware
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow only PDFs
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Route to upload a score report
router.post('/upload', upload.single('scoreReport'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // TODO: Get user ID from authenticated session
    const userId = req.body.userId || '64f5a7b9e85f48e3e841d3a3'; // Placeholder user ID
    
    // Parse the uploaded PDF
    const filePath = req.file.path;
    const parsedReport = await ScoreReportParser.parseScoreReport(filePath);
    
    // Create a new score report record
    const scoreReport = new ScoreReport({
      user: userId,
      reportTitle: parsedReport.reportTitle,
      totalQuestions: parsedReport.totalQuestions,
      correctAnswers: parsedReport.correctAnswers,
      incorrectAnswers: parsedReport.incorrectAnswers,
      questions: parsedReport.questions,
      originalFileUrl: req.file.path
    });
    
    // Save to database
    await scoreReport.save();
    
    // Check if the user wants AI-generated practice questions
    const generateQuestions = req.body.generateQuestions === 'true';
    
    if (generateQuestions) {
      try {
        // Generate AI practice questions (default count: 10)
        const questionCount = parseInt(req.body.questionCount) || 10;
        const aiQuestions = await ScoreReportParser.generateQuestionsWithAI(parsedReport, questionCount);
        
        // Update the score report with AI questions
        scoreReport.aiGeneratedQuestions = aiQuestions;
        await scoreReport.save();
        
        return res.status(201).json({
          message: 'Score report uploaded and processed with AI practice questions',
          reportId: scoreReport._id,
          parsedData: parsedReport,
          aiGeneratedQuestions: aiQuestions
        });
      } catch (aiError) {
        console.error('Error generating AI questions:', aiError);
        // Still return success but with a note about AI generation failure
        return res.status(201).json({
          message: 'Score report uploaded and processed successfully, but AI question generation failed',
          reportId: scoreReport._id,
          parsedData: parsedReport,
          aiError: aiError instanceof Error ? aiError.message : String(aiError)
        });
      }
    }
    
    res.status(201).json({
      message: 'Score report uploaded and processed successfully',
      reportId: scoreReport._id,
      parsedData: parsedReport
    });
  } catch (error) {
    console.error('Error processing score report:', error);
    res.status(500).json({
      error: 'Failed to process score report',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Route to generate AI practice questions for an existing report
router.post('/generate-questions/:reportId', async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const questionCount = parseInt(req.body.questionCount) || 10;
    
    // Find the existing report
    const scoreReport = await ScoreReport.findById(reportId);
    
    if (!scoreReport) {
      return res.status(404).json({ error: 'Score report not found' });
    }
    
    // Convert Mongoose document to plain object for the parser
    const reportData = {
      reportTitle: scoreReport.reportTitle,
      totalQuestions: scoreReport.totalQuestions,
      correctAnswers: scoreReport.correctAnswers,
      incorrectAnswers: scoreReport.incorrectAnswers,
      questions: scoreReport.questions
    };
    
    // Generate AI practice questions
    const aiQuestions = await ScoreReportParser.generateQuestionsWithAI(reportData, questionCount);
    
    // Update the score report with AI questions
    scoreReport.aiGeneratedQuestions = aiQuestions;
    await scoreReport.save();
    
    res.status(200).json({
      message: 'AI practice questions generated successfully',
      reportId: scoreReport._id,
      aiGeneratedQuestions: aiQuestions
    });
  } catch (error) {
    console.error('Error generating AI practice questions:', error);
    res.status(500).json({
      error: 'Failed to generate AI practice questions',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Route to get an existing report with practice questions
router.get('/:reportId', async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    
    // Find the existing report
    const scoreReport = await ScoreReport.findById(reportId);
    
    if (!scoreReport) {
      return res.status(404).json({ error: 'Score report not found' });
    }
    
    res.status(200).json({
      reportId: scoreReport._id,
      reportTitle: scoreReport.reportTitle,
      uploadDate: scoreReport.uploadDate,
      totalQuestions: scoreReport.totalQuestions,
      correctAnswers: scoreReport.correctAnswers,
      incorrectAnswers: scoreReport.incorrectAnswers,
      questions: scoreReport.questions,
      aiGeneratedQuestions: scoreReport.aiGeneratedQuestions || []
    });
  } catch (error) {
    console.error('Error retrieving score report:', error);
    res.status(500).json({
      error: 'Failed to retrieve score report',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Route to get all score reports for a user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const scoreReports = await ScoreReport.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json(scoreReports);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch score reports',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router; 