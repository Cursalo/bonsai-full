"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ScoreReportParser_1 = __importDefault(require("../utils/ScoreReportParser"));
const models_1 = require("../models");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads');
        // Create directory if it doesn't exist
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Create upload middleware
const upload = (0, multer_1.default)({
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
router.post('/upload', upload.single('scoreReport'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // TODO: Get user ID from authenticated session
        const userId = req.body.userId || '64f5a7b9e85f48e3e841d3a3'; // Placeholder user ID
        // Parse the uploaded PDF
        const filePath = req.file.path;
        const parsedReport = yield ScoreReportParser_1.default.parseScoreReport(filePath);
        // Create a new score report record
        const scoreReport = new models_1.ScoreReport({
            user: userId,
            reportTitle: parsedReport.reportTitle,
            totalQuestions: parsedReport.totalQuestions,
            correctAnswers: parsedReport.correctAnswers,
            incorrectAnswers: parsedReport.incorrectAnswers,
            questions: parsedReport.questions,
            originalFileUrl: req.file.path
        });
        // Save to database
        yield scoreReport.save();
        res.status(201).json({
            message: 'Score report uploaded and processed successfully',
            reportId: scoreReport._id,
            parsedData: parsedReport
        });
    }
    catch (error) {
        console.error('Error processing score report:', error);
        res.status(500).json({
            error: 'Failed to process score report',
            message: error instanceof Error ? error.message : String(error)
        });
    }
}));
// Route to get all score reports for a user
router.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const scoreReports = yield models_1.ScoreReport.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(scoreReports);
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to fetch score reports',
            message: error instanceof Error ? error.message : String(error)
        });
    }
}));
// Route to get a specific score report by ID
router.get('/:reportId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportId = req.params.reportId;
        const scoreReport = yield models_1.ScoreReport.findById(reportId);
        if (!scoreReport) {
            return res.status(404).json({ error: 'Score report not found' });
        }
        res.status(200).json(scoreReport);
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to fetch score report',
            message: error instanceof Error ? error.message : String(error)
        });
    }
}));
exports.default = router;
