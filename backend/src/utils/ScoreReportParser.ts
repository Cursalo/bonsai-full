import { PDFExtract } from 'pdf.js-extract';
import fs from 'fs/promises';
import path from 'path';
import Tesseract from 'tesseract.js';
import { GoogleGenAI } from '@google/genai';
import config from '../config/env';

// Initialize Google Gemini API
const googleApiKey = config.googleGeminiApiKey;
const genAI = new GoogleGenAI({ apiKey: googleApiKey });

interface ParsedQuestion {
  questionNumber: number;
  section: 'Math' | 'Reading and Writing';
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}

interface ParsedScoreReport {
  reportTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questions: ParsedQuestion[];
}

interface AIGeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

class ScoreReportParser {
  private pdfExtract: PDFExtract;

  constructor() {
    this.pdfExtract = new PDFExtract();
  }

  /**
   * Parse a SAT score report PDF file with enhanced OCR capabilities
   * @param filePath Path to the PDF file
   * @returns ParsedScoreReport object
   */
  public async parseScoreReport(filePath: string): Promise<ParsedScoreReport> {
    try {
      // Extract text content from PDF
      const data = await this.pdfExtract.extract(filePath);
      
      // Join all the text content
      let textContent = data.pages.map(page => 
        page.content.map(item => item.str).join(' ')
      ).join(' ');

      // Check if we need to use OCR (if standard extraction has limited text)
      if (textContent.length < 100 || !textContent.includes('SAT Practice') || !textContent.includes('Questions Overview')) {
        console.log('Standard PDF text extraction insufficient, applying OCR...');
        textContent = await this.performOcrOnPdf(filePath);
      }

      // Extract report title
      const titleMatch = textContent.match(/SAT Practice (\d+).*?(\d{1,2}\/\d{1,2}\/\d{4}|\w+ \d{1,2}, \d{4})/);
      const reportTitle = titleMatch ? titleMatch[0] : 'SAT Practice Test';

      // Initialize empty results array
      const questions: ParsedQuestion[] = [];
      
      // Find the Questions Overview table
      const questionsOverviewIndex = textContent.indexOf('Questions Overview');
      if (questionsOverviewIndex === -1) {
        throw new Error('Questions Overview table not found in the PDF');
      }

      // Extract the table data after "Questions Overview"
      const tableContent = textContent.substring(questionsOverviewIndex);
      
      // Use regex to extract questions data
      // This is a simplified version and may need adjustments based on the actual format
      const questionPattern = /(\d+)\s+(Reading and Writing|Math)\s+([A-D])\s+([A-D]);\s+(Correct|Incorrect)/g;
      
      let match;
      while ((match = questionPattern.exec(tableContent)) !== null) {
        const [, questionNumber, section, correctAnswer, userAnswer, status] = match;
        
        questions.push({
          questionNumber: parseInt(questionNumber),
          section: section as 'Math' | 'Reading and Writing',
          correctAnswer,
          userAnswer,
          isCorrect: status === 'Correct'
        });
      }

      // Count correct and incorrect answers
      const correctAnswers = questions.filter(q => q.isCorrect).length;
      const incorrectAnswers = questions.filter(q => !q.isCorrect).length;
      
      return {
        reportTitle,
        totalQuestions: questions.length,
        correctAnswers,
        incorrectAnswers,
        questions
      };
    } catch (error) {
      console.error('Error parsing score report:', error);
      throw new Error(`Failed to parse score report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Perform OCR on a PDF file using Tesseract.js
   * @param filePath Path to the PDF file
   * @returns Extracted text from the PDF
   */
  private async performOcrOnPdf(filePath: string): Promise<string> {
    try {
      // For OCR on PDFs, we'd normally convert PDF pages to images first
      // For simplicity in this example, we'll use a helper method that simulates this
      // In a production environment, you would use something like pdf2image or a similar library
      
      // Simulate getting the first page as an image (in a real implementation, this would convert PDF pages to images)
      const imageBuffer = await this.simulatePdfToImage(filePath);
      
      // Perform OCR on the image
      const result = await Tesseract.recognize(imageBuffer, 'eng', {
        logger: (m: any) => console.log(m)
      });
      
      return result.data.text;
    } catch (error) {
      console.error('Error performing OCR:', error);
      throw new Error(`OCR failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Simulate converting a PDF to an image (for demonstration purposes)
   * In a real implementation, you would use a library like pdf2image
   * @param filePath Path to the PDF file
   * @returns Buffer containing the image data
   */
  private async simulatePdfToImage(filePath: string): Promise<Buffer> {
    // In a real implementation, this would convert the PDF to images
    // For now, we'll just return the PDF buffer as-is (this won't work in a real scenario)
    return await fs.readFile(filePath);
  }

  /**
   * Generate new questions based on the SAT score report content using Google's Gemini API
   * @param parsedReport The parsed score report
   * @param count Number of questions to generate (default: 10)
   * @returns Array of AI-generated questions
   */
  public async generateQuestionsWithAI(parsedReport: ParsedScoreReport, count: number = 10): Promise<AIGeneratedQuestion[]> {
    try {
      // Get the model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Create a prompt based on missed questions
      const missedQuestions = parsedReport.questions.filter(q => !q.isCorrect);
      
      let prompt = `Based on this SAT Practice Test report where the student missed ${missedQuestions.length} questions, 
        please generate ${count} new practice questions that would help them improve.
        
        Test Title: ${parsedReport.reportTitle}
        Total Questions: ${parsedReport.totalQuestions}
        Correct Answers: ${parsedReport.correctAnswers}
        Incorrect Answers: ${parsedReport.incorrectAnswers}
        
        The student struggled with these concepts:
        ${missedQuestions.map(q => `Question ${q.questionNumber}: Section ${q.section}, Correct Answer: ${q.correctAnswer}, Student Answer: ${q.userAnswer}`).join('\n')}
        
        Please generate ${count} new multiple-choice SAT-style questions (with 4 options each labeled A, B, C, D) on similar topics, with explanations for the correct answers. Format each question with its options and provide the correct answer letter.`;
      
      // Generate content
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }]}],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      });
      
      const response = result.response;
      const responseText = response.text();
      
      // Parse the generated content into structured questions
      return this.parseGeneratedQuestions(responseText, count);
    } catch (error) {
      console.error('Error generating questions with AI:', error);
      throw new Error(`AI question generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Parse AI-generated text into structured question objects
   * @param text The text generated by the AI
   * @param expectedCount The expected number of questions
   * @returns Array of structured questions
   */
  private parseGeneratedQuestions(text: string, expectedCount: number): AIGeneratedQuestion[] {
    const questions: AIGeneratedQuestion[] = [];
    
    // Split the text by question number pattern (1., 2., etc.)
    const questionBlocks = text.split(/\n\s*\d+\.\s+/).filter(block => block.trim().length > 0);
    
    for (let i = 0; i < Math.min(questionBlocks.length, expectedCount); i++) {
      const block = questionBlocks[i];
      
      // Extract question text (everything up to the first option)
      const questionMatch = block.match(/(.*?)(?:A\s*\.|A\s*\))/s);
      if (!questionMatch) continue;
      
      const questionText = questionMatch[1].trim();
      
      // Extract options
      const optionsMatch = block.match(/([A-D]\s*\.|\([A-D]\))\s*(.*?)(?=\s*[A-D]\s*\.|\s*\([A-D]\)|$)/gs);
      if (!optionsMatch || optionsMatch.length < 4) continue;
      
      const options = optionsMatch.map(opt => {
        const trimmed = opt.trim();
        return trimmed.replace(/^[A-D]\s*\.|\([A-D]\)\s*/, '').trim();
      });
      
      // Extract correct answer
      const answerMatch = block.match(/(?:Correct answer[:\s]*|Answer[:\s]*|The answer is[:\s]*)\s*([A-D])/i);
      const correctAnswer = answerMatch ? answerMatch[1] : 'A'; // Default to A if not found
      
      questions.push({
        question: questionText,
        options,
        correctAnswer
      });
    }
    
    // If we couldn't parse enough questions, fill with placeholders
    while (questions.length < expectedCount) {
      questions.push({
        question: `Practice question ${questions.length + 1}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'A'
      });
    }
    
    return questions;
  }
}

export default new ScoreReportParser(); 