import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default {
  port: process.env.PORT || 3001,
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/bonsai-prep',
  googleGeminiApiKey: process.env.GOOGLE_GEMINI_API_KEY || 'AIzaSyDYfhXsy3Rmd5BVClw4AeHHKmIIgFFoB_w',
  uploadDir: process.env.UPLOAD_DIR || 'uploads'
}; 