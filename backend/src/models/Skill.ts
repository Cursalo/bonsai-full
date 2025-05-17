import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  skillId: string;  // Unique identifier (e.g., "SEC-Punctuation-Commas")
  name: string;  // Human-readable name (e.g., "Using Commas Correctly")
  category: string;  // Main category (e.g., "Standard English Conventions")
  subcategory: string;  // Subcategory (e.g., "Punctuation")
  description: string;
  bbCodes: string[];  // Array of BBx.yh.z codes associated with this skill
  videoLessons: mongoose.Types.ObjectId[];  // References to Video documents
  practiceQuestions: mongoose.Types.ObjectId[];  // References to Question documents
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema: Schema = new Schema(
  {
    skillId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    subcategory: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    bbCodes: [{
      type: String,
      trim: true
    }],
    videoLessons: [{
      type: Schema.Types.ObjectId,
      ref: 'Video'
    }],
    practiceQuestions: [{
      type: Schema.Types.ObjectId,
      ref: 'Question'
    }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ISkill>('Skill', SkillSchema); 