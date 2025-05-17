import mongoose, { Document, Schema } from 'mongoose';

// Interface for video progress
interface IVideoProgress {
  videoId: mongoose.Types.ObjectId;
  watchedSeconds: number;
  completed: boolean;
  lastWatched: Date;
}

// Interface for question attempt
interface IQuestionAttempt {
  questionId: mongoose.Types.ObjectId;
  userAnswer: string;
  isCorrect: boolean;
  attemptDate: Date;
}

// Interface for skill mastery
interface ISkillMastery {
  skillId: mongoose.Types.ObjectId;
  masteryLevel: number;  // 0-100 percentage
  attemptsCount: number;
  correctCount: number;
  mastered: boolean;  // true when masteryLevel >= threshold (e.g., 80%)
  masteredDate?: Date;
}

// Main Progress interface
export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  videoProgress: IVideoProgress[];
  questionAttempts: IQuestionAttempt[];
  skillMastery: ISkillMastery[];
  createdAt: Date;
  updatedAt: Date;
}

const VideoProgressSchema: Schema = new Schema({
  videoId: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  watchedSeconds: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastWatched: {
    type: Date,
    default: Date.now
  }
});

const QuestionAttemptSchema: Schema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  attemptDate: {
    type: Date,
    default: Date.now
  }
});

const SkillMasterySchema: Schema = new Schema({
  skillId: {
    type: Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  masteryLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  attemptsCount: {
    type: Number,
    default: 0
  },
  correctCount: {
    type: Number,
    default: 0
  },
  mastered: {
    type: Boolean,
    default: false
  },
  masteredDate: {
    type: Date
  }
});

const ProgressSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    videoProgress: [VideoProgressSchema],
    questionAttempts: [QuestionAttemptSchema],
    skillMastery: [SkillMasterySchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IProgress>('Progress', ProgressSchema); 