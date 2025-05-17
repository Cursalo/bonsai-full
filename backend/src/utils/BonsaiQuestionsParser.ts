import fs from 'fs';
import path from 'path';

interface ParsedOption {
  id: string;
  text: string;
}

interface ParsedQuestion {
  questionNumber: number;
  text: string;
  options: ParsedOption[];
  correctAnswer: string;
  bbCode: string;
  solution: string;
}

class BonsaiQuestionsParser {
  /**
   * Parse the Bonsai Questions file
   * @param filePath Path to the Bonsai Questions text file
   * @returns Array of parsed questions
   */
  public async parseQuestionsFile(filePath: string): Promise<ParsedQuestion[]> {
    try {
      // Read the file
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      
      // Split the content by questions
      const lines = fileContent.split('\n');
      const questions: ParsedQuestion[] = [];
      
      let currentQuestion: Partial<ParsedQuestion> = {};
      let currentOptionId = '';
      let isReadingOptions = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) continue;
        
        // Check for BB code (spiraled from BB...)
        if (line.startsWith('*spiraled from BB')) {
          const bbCodeMatch = line.match(/\*spiraled from (BB[\d\.h]+)/);
          if (bbCodeMatch) {
            currentQuestion.bbCode = bbCodeMatch[1];
          }
          continue;
        }
        
        // Check for question number
        const questionNumberMatch = line.match(/^(\d+)\.$/);
        if (questionNumberMatch) {
          // Save previous question if it exists
          if (currentQuestion.questionNumber && currentQuestion.text) {
            questions.push(currentQuestion as ParsedQuestion);
          }
          
          // Start a new question
          currentQuestion = {
            questionNumber: parseInt(questionNumberMatch[1]),
            text: '',
            options: [],
            correctAnswer: '',
            bbCode: '',
            solution: ''
          };
          isReadingOptions = false;
          continue;
        }
        
        // Check for options
        const optionMatch = line.match(/^([A-D])\)\s(.+)$/);
        if (optionMatch) {
          isReadingOptions = true;
          const [, id, text] = optionMatch;
          currentOptionId = id;
          if (!currentQuestion.options) currentQuestion.options = [];
          currentQuestion.options.push({ id, text });
          continue;
        }
        
        // Check for solution line
        if (line.startsWith('Solution:')) {
          const solutionMatch = line.match(/Solution:\s*([A-D])/);
          if (solutionMatch) {
            currentQuestion.correctAnswer = solutionMatch[1];
            currentQuestion.solution = line.replace('Solution:', '').trim();
          }
          continue;
        }
        
        // If we're not in any special section, this is part of the question text
        if (!isReadingOptions && currentQuestion.questionNumber) {
          currentQuestion.text += (currentQuestion.text ? ' ' : '') + line;
        }
      }
      
      // Add the last question
      if (currentQuestion.questionNumber && currentQuestion.text) {
        questions.push(currentQuestion as ParsedQuestion);
      }
      
      return questions;
    } catch (error) {
      console.error('Error parsing Bonsai Questions file:', error);
      throw new Error(`Failed to parse Bonsai Questions file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export default new BonsaiQuestionsParser(); 