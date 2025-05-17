import ScoreReportParser from '../utils/ScoreReportParser';
import config from '../config/env';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Test script to verify the Gemini API integration
 */
async function testGeminiIntegration() {
  console.log('Testing Gemini API integration for question generation...');
  console.log(`Using API key: ${config.googleGeminiApiKey.slice(0, 5)}...${config.googleGeminiApiKey.slice(-5)}`);
  
  // Create a mock parsed score report
  const mockReport = {
    reportTitle: 'SAT Practice 8 - March 6, 2025',
    totalQuestions: 58,
    correctAnswers: 45,
    incorrectAnswers: 13,
    questions: [
      {
        questionNumber: 1,
        section: 'Reading and Writing' as const,
        correctAnswer: 'A',
        userAnswer: 'C',
        isCorrect: false
      },
      {
        questionNumber: 5,
        section: 'Reading and Writing' as const,
        correctAnswer: 'B',
        userAnswer: 'D',
        isCorrect: false
      },
      {
        questionNumber: 12,
        section: 'Math' as const,
        correctAnswer: 'C',
        userAnswer: 'A',
        isCorrect: false
      }
    ]
  };
  
  try {
    console.log('Generating 3 practice questions...');
    const questions = await ScoreReportParser.generateQuestionsWithAI(mockReport, 3);
    
    console.log(`Successfully generated ${questions.length} practice questions.`);
    
    // Output the questions to a file for inspection
    const outputDir = path.join(__dirname, '../../tests');
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, 'gemini-questions.json');
    await fs.writeFile(outputPath, JSON.stringify(questions, null, 2));
    
    console.log(`Saved generated questions to ${outputPath}`);
    
    // Display a sample question
    if (questions.length > 0) {
      console.log('\nSample question:');
      console.log(`Question: ${questions[0].question}`);
      console.log('Options:');
      questions[0].options.forEach((option, index) => {
        const letter = String.fromCharCode(65 + index); // A, B, C, D
        console.log(`${letter}. ${option}`);
      });
      console.log(`Correct answer: ${questions[0].correctAnswer}`);
    }
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testGeminiIntegration().catch(console.error);
}

export default testGeminiIntegration; 