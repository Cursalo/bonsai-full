// MySQL Score Report model
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Interface representing a question in the score report
interface IQuestion {
  id?: number;
  score_report_id?: number;
  questionNumber: number;
  section: 'Math' | 'Reading and Writing';
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}

// Interface for AI-generated practice questions
interface IAIQuestion {
  id?: number;
  score_report_id?: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

// Main Score Report interface
export interface IScoreReport {
  id?: number;
  user_id: number;
  reportTitle: string;  // e.g., "SAT Practice 8 - March 6, 2025"
  uploadDate: Date;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questions?: IQuestion[];
  originalFileUrl?: string;  // Optional URL to the original PDF file 
  aiGeneratedQuestions?: IAIQuestion[]; // Optional array of AI-generated practice questions
  createdAt?: Date;
  updatedAt?: Date;
}

class ScoreReport {
  /**
   * Create a new score report
   * @param db MySQL connection
   * @param report Score report data
   * @returns Created score report ID
   */
  static async create(db: any, report: IScoreReport): Promise<number> {
    const [result] = await db.execute(
      `INSERT INTO score_reports 
       (user_id, reportTitle, uploadDate, totalQuestions, correctAnswers, incorrectAnswers, originalFileUrl) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        report.user_id,
        report.reportTitle,
        report.uploadDate || new Date(),
        report.totalQuestions,
        report.correctAnswers,
        report.incorrectAnswers,
        report.originalFileUrl || null
      ]
    );
    
    return (result as ResultSetHeader).insertId;
  }

  /**
   * Add questions to a score report
   * @param db MySQL connection
   * @param reportId Score report ID
   * @param questions Question data
   */
  static async addQuestions(db: any, reportId: number, questions: IQuestion[]): Promise<void> {
    if (!questions || questions.length === 0) return;
    
    // Prepare batch insert
    const values = questions.map(q => [
      reportId,
      q.questionNumber,
      q.section,
      q.correctAnswer,
      q.userAnswer,
      q.isCorrect ? 1 : 0
    ]);
    
    const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
    
    await db.execute(
      `INSERT INTO questions 
       (score_report_id, questionNumber, section, correctAnswer, userAnswer, isCorrect) 
       VALUES ${placeholders}`,
      values.flat()
    );
  }

  /**
   * Add AI-generated questions to a score report
   * @param db MySQL connection
   * @param reportId Score report ID
   * @param questions AI-generated question data
   */
  static async addAIQuestions(db: any, reportId: number, questions: IAIQuestion[]): Promise<void> {
    if (!questions || questions.length === 0) return;
    
    // Add each question individually because of the options array
    for (const question of questions) {
      await db.execute(
        `INSERT INTO ai_questions 
         (score_report_id, question, options, correctAnswer) 
         VALUES (?, ?, ?, ?)`,
        [
          reportId,
          question.question,
          JSON.stringify(question.options), // Store options as JSON
          question.correctAnswer
        ]
      );
    }
  }

  /**
   * Get a score report by ID
   * @param db MySQL connection
   * @param id Score report ID
   * @returns Score report with questions
   */
  static async getById(db: any, id: number): Promise<IScoreReport | null> {
    const [reports] = await db.execute(
      'SELECT * FROM score_reports WHERE id = ?',
      [id]
    );
    
    if (!reports || !(reports as RowDataPacket[]).length) {
      return null;
    }
    
    return (reports as RowDataPacket[])[0] as IScoreReport;
  }

  /**
   * Get a score report with questions by ID
   * @param db MySQL connection
   * @param id Score report ID
   * @returns Score report with questions
   */
  static async getWithQuestionsById(db: any, id: number): Promise<any | null> {
    const report = await this.getById(db, id);
    
    if (!report) {
      return null;
    }
    
    // Get questions
    const [questions] = await db.execute(
      'SELECT * FROM questions WHERE score_report_id = ? ORDER BY questionNumber',
      [id]
    );
    
    // Get AI questions
    const [aiQuestions] = await db.execute(
      'SELECT * FROM ai_questions WHERE score_report_id = ?',
      [id]
    );
    
    // Parse JSON options for AI questions
    const parsedAiQuestions = (aiQuestions as RowDataPacket[]).map((q: any) => ({
      ...q,
      options: JSON.parse(q.options)
    }));
    
    return {
      ...report,
      questions: questions as IQuestion[],
      aiGeneratedQuestions: parsedAiQuestions
    };
  }

  /**
   * Get all score reports for a user
   * @param db MySQL connection
   * @param userId User ID
   * @returns Array of score reports
   */
  static async getByUserId(db: any, userId: number): Promise<IScoreReport[]> {
    const [reports] = await db.execute(
      'SELECT * FROM score_reports WHERE user_id = ? ORDER BY createdAt DESC',
      [userId]
    );
    
    return (reports as RowDataPacket[]) as IScoreReport[];
  }
}

export default ScoreReport; 