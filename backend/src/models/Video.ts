import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  videoId: string;  // Unique identifier
  title: string;
  description: string;
  url: string;  // URL to video file/stream
  duration: number;  // in seconds
  thumbnail: string;  // URL to thumbnail image
  skillId: mongoose.Types.ObjectId;  // Reference to the associated Skill
  tutor: {
    name: string;
    title: string;
    avatar?: string;
  };
  tags: string[];
  transcriptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: true
    },
    tutor: {
      name: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      avatar: {
        type: String
      }
    },
    tags: [{
      type: String,
      trim: true
    }],
    transcriptUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IVideo>('Video', VideoSchema); 