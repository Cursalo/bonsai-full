import mongoose, { Document, Schema } from 'mongoose';

// Interface for answer options
interface IOption {
  id: string; // A, B, C, D
  text: string;
}

// Main Question interface
export interface IQuestion extends Document {
  questionId: string;  // Unique identifier
  text: string;  // The actual question text
  options: IOption[];  // Multiple choice options
  correctAnswer: string;  // e.g., "A", "B", etc.
  explanation: string;  // Explanation of the correct answer
  bbCode: string;  // BBx.yh.z code from Bonsai Questions
  sourceReference: string;  // Original source reference
  difficulty: 'Easy' | 'Medium' | 'Hard';
  skillId: mongoose.Types.ObjectId;  // Reference to the associated Skill
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  text: {
    type: String,
    required: true
  }
});

const QuestionSchema: Schema = new Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    text: {
      type: String,
      required: true
    },
    options: [OptionSchema],
    correctAnswer: {
      type: String,
      required: true,
      enum: ['A', 'B', 'C', 'D']
    },
    explanation: {
      type: String,
      required: true
    },
    bbCode: {
      type: String,
      required: true,
      trim: true
    },
    sourceReference: {
      type: String,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IQuestion>('Question', QuestionSchema); 