-- Bonsai Prep Database Schema for Supabase
-- PostgreSQL version

-- Users table - handled by Supabase Auth
-- We'll create a profiles table to extend the auth.users table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  profile_image_url TEXT,
  grade INTEGER,
  school TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Exam categories (Math, Reading, Writing, etc.)
CREATE TABLE exam_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice tests/exams
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES exam_categories(id),
  time_limit_minutes INTEGER,
  total_questions INTEGER NOT NULL,
  passing_score INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'very_hard')) DEFAULT 'medium',
  is_official BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question types (multiple choice, grid-in, etc.)
CREATE TABLE question_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Questions table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id),
  question_type_id INTEGER NOT NULL REFERENCES question_types(id),
  question_text TEXT NOT NULL,
  question_image_url TEXT,
  answer_explanation TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'very_hard')) DEFAULT 'medium',
  category_id INTEGER REFERENCES exam_categories(id),
  points INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Answer options for multiple choice questions
CREATE TABLE answer_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_image_url TEXT,
  is_correct BOOLEAN DEFAULT FALSE,
  option_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User exam attempts
CREATE TABLE user_exam_attempts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  exam_id INTEGER NOT NULL REFERENCES exams(id),
  score DECIMAL(5,2),
  total_questions INTEGER,
  correct_answers INTEGER,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  status TEXT CHECK (status IN ('in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress',
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User answers to questions
CREATE TABLE user_answers (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  attempt_id INTEGER NOT NULL REFERENCES user_exam_attempts(id),
  selected_option_id INTEGER REFERENCES answer_options(id),
  text_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Score reports
CREATE TABLE score_reports (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  attempt_id INTEGER NOT NULL REFERENCES user_exam_attempts(id),
  total_score INTEGER NOT NULL,
  math_score INTEGER,
  reading_score INTEGER,
  writing_score INTEGER,
  strengths TEXT,
  weaknesses TEXT,
  recommendations TEXT,
  percentile INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instructional videos
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  category_id INTEGER REFERENCES exam_categories(id),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video-Question relationship
CREATE TABLE video_question_map (
  id SERIAL PRIMARY KEY,
  video_id INTEGER NOT NULL REFERENCES videos(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  relevance_score SMALLINT DEFAULT 5,
  UNIQUE (video_id, question_id)
);

-- User video progress
CREATE TABLE user_video_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  video_id INTEGER NOT NULL REFERENCES videos(id),
  watch_progress_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_watched TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, video_id)
);

-- Setup RLS policies for all tables
-- This is a simplified example; you would want to define more granular policies

-- Enable RLS on all tables
ALTER TABLE exam_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_question_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_video_progress ENABLE ROW LEVEL SECURITY;

-- Create public read policies
CREATE POLICY "Anyone can read exam categories" ON exam_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read exams" ON exams FOR SELECT USING (true);
CREATE POLICY "Anyone can read question types" ON question_types FOR SELECT USING (true);
CREATE POLICY "Anyone can read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Anyone can read answer options" ON answer_options FOR SELECT USING (true);
CREATE POLICY "Anyone can read videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Anyone can read video_question_map" ON video_question_map FOR SELECT USING (true);

-- Create user-specific policies
CREATE POLICY "Users can view their own exam attempts" 
  ON user_exam_attempts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exam attempts" 
  ON user_exam_attempts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own answers" 
  ON user_answers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answers" 
  ON user_answers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own score reports" 
  ON score_reports FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own video progress" 
  ON user_video_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own video progress" 
  ON user_video_progress FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video progress" 
  ON user_video_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id); 