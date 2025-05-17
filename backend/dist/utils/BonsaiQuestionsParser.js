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
const fs_1 = __importDefault(require("fs"));
class BonsaiQuestionsParser {
    /**
     * Parse the Bonsai Questions file
     * @param filePath Path to the Bonsai Questions text file
     * @returns Array of parsed questions
     */
    parseQuestionsFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Read the file
                const fileContent = yield fs_1.default.promises.readFile(filePath, 'utf-8');
                // Split the content by questions
                const lines = fileContent.split('\n');
                const questions = [];
                let currentQuestion = {};
                let currentOptionId = '';
                let isReadingOptions = false;
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    // Skip empty lines
                    if (!line)
                        continue;
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
                            questions.push(currentQuestion);
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
                        if (!currentQuestion.options)
                            currentQuestion.options = [];
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
                    questions.push(currentQuestion);
                }
                return questions;
            }
            catch (error) {
                console.error('Error parsing Bonsai Questions file:', error);
                throw new Error(`Failed to parse Bonsai Questions file: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new BonsaiQuestionsParser();
