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
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_js_extract_1 = require("pdf.js-extract");
class ScoreReportParser {
    constructor() {
        this.pdfExtract = new pdf_js_extract_1.PDFExtract();
    }
    /**
     * Parse a SAT score report PDF file
     * @param filePath Path to the PDF file
     * @returns ParsedScoreReport object
     */
    parseScoreReport(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract text content from PDF
                const data = yield this.pdfExtract.extract(filePath);
                // Join all the text content
                const textContent = data.pages.map(page => page.content.map(item => item.str).join(' ')).join(' ');
                // Extract report title
                const titleMatch = textContent.match(/SAT Practice (\d+).*?(\d{1,2}\/\d{1,2}\/\d{4}|\w+ \d{1,2}, \d{4})/);
                const reportTitle = titleMatch ? titleMatch[0] : 'SAT Practice Test';
                // Initialize empty results array
                const questions = [];
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
                        section: section,
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
            }
            catch (error) {
                console.error('Error parsing score report:', error);
                throw new Error(`Failed to parse score report: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new ScoreReportParser();
