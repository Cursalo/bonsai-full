-- Bonsai Prep Database Schema
-- For app.bonsaiprep.com

-- Drop database if it exists (use this only in development)
-- DROP DATABASE IF EXISTS bonsaiprep_db;
-- CREATE DATABASE bonsaiprep_db;
-- USE bonsaiprep_db;

-- Users table - for students, teachers, and administrators
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  profile_image_url VARCHAR(255),
  grade TINYINT,
  school VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX (email),
  INDEX (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exam categories (Math, Reading, Writing, etc.)
CREATE TABLE IF NOT EXISTS exam_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Practice tests/exams
CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  time_limit_minutes INT,
  total_questions INT NOT NULL,
  passing_score INT,
  difficulty_level ENUM('easy', 'medium', 'hard', 'very_hard') DEFAULT 'medium',
  is_official BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES exam_categories(id),
  INDEX (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Question types (multiple choice, grid-in, etc.)
CREATE TABLE IF NOT EXISTS question_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT NOT NULL,
  question_type_id INT NOT NULL,
  question_text TEXT NOT NULL,
  question_image_url VARCHAR(255),
  answer_explanation TEXT,
  difficulty_level ENUM('easy', 'medium', 'hard', 'very_hard') DEFAULT 'medium',
  category_id INT,
  points INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  FOREIGN KEY (question_type_id) REFERENCES question_types(id),
  FOREIGN KEY (category_id) REFERENCES exam_categories(id),
  INDEX (exam_id),
  INDEX (question_type_id),
  INDEX (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Answer options for multiple choice questions
CREATE TABLE IF NOT EXISTS answer_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  option_text TEXT NOT NULL,
  option_image_url VARCHAR(255),
  is_correct BOOLEAN DEFAULT FALSE,
  option_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  INDEX (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User exam attempts
CREATE TABLE IF NOT EXISTS user_exam_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  exam_id INT NOT NULL,
  score DECIMAL(5,2),
  total_questions INT,
  correct_answers INT,
  start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP NULL,
  status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
  time_spent_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  INDEX (user_id),
  INDEX (exam_id),
  INDEX (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User answers to questions
CREATE TABLE IF NOT EXISTS user_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  question_id INT NOT NULL,
  attempt_id INT NOT NULL,
  selected_option_id INT,
  text_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (attempt_id) REFERENCES user_exam_attempts(id),
  FOREIGN KEY (selected_option_id) REFERENCES answer_options(id),
  INDEX (user_id),
  INDEX (question_id),
  INDEX (attempt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Score reports (more detailed than the basic score in attempts)
CREATE TABLE IF NOT EXISTS score_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  attempt_id INT NOT NULL,
  total_score INT NOT NULL,
  math_score INT,
  reading_score INT,
  writing_score INT,
  strengths TEXT,
  weaknesses TEXT,
  recommendations TEXT,
  percentile INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (attempt_id) REFERENCES user_exam_attempts(id),
  INDEX (user_id),
  INDEX (attempt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Instructional videos
CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255),
  duration_seconds INT,
  category_id INT,
  difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'intermediate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES exam_categories(id),
  INDEX (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Video-Question relationship (which videos help with which questions)
CREATE TABLE IF NOT EXISTS video_question_map (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_id INT NOT NULL,
  question_id INT NOT NULL,
  relevance_score TINYINT DEFAULT 5,
  FOREIGN KEY (video_id) REFERENCES videos(id),
  FOREIGN KEY (question_id) REFERENCES questions(id),
  UNIQUE KEY (video_id, question_id),
  INDEX (video_id),
  INDEX (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User video progress
CREATE TABLE IF NOT EXISTS user_video_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  video_id INT NOT NULL,
  watch_progress_seconds INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (video_id) REFERENCES videos(id),
  UNIQUE KEY (user_id, video_id),
  INDEX (user_id),
  INDEX (video_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  features TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active', 'canceled', 'expired') DEFAULT 'active',
  payment_method VARCHAR(50),
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),
  INDEX (user_id),
  INDEX (plan_id),
  INDEX (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription_id INT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id),
  INDEX (user_id),
  INDEX (subscription_id),
  INDEX (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  proficiency_level DECIMAL(3,2) DEFAULT 0.00,
  questions_attempted INT DEFAULT 0,
  questions_correct INT DEFAULT 0,
  exams_completed INT DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0.00,
  last_activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES exam_categories(id),
  UNIQUE KEY (user_id, category_id),
  INDEX (user_id),
  INDEX (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Study plans
CREATE TABLE IF NOT EXISTS study_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  target_score INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Study plan items (exams and videos to complete)
CREATE TABLE IF NOT EXISTS study_plan_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plan_id INT NOT NULL,
  item_type ENUM('exam', 'video') NOT NULL,
  item_id INT NOT NULL,
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP NULL,
  order_index INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES study_plans(id),
  INDEX (plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial data for question types
INSERT INTO question_types (name, description) VALUES 
('multiple_choice', 'Standard multiple choice question with one correct answer'),
('grid_in', 'Math grid-in question with numerical answer'),
('multiple_select', 'Question with multiple correct answers to select');

-- Initial data for exam categories
INSERT INTO exam_categories (name, description) VALUES 
('Math', 'Mathematics section covering algebra, problem solving, data analysis, etc.'),
('Reading', 'Reading comprehension and analysis'),
('Writing', 'Grammar, clarity, and effective language use');

-- Create admin user
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES 
('admin@bonsaiprep.com', '$2a$12$1234567890123456789012uYtL5EWfZVnyfyzy8xc5ZR.Y5TwXote', 'Admin', 'User', 'admin');

-- Basic subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features, is_active) VALUES 
('Free', 'Basic access with limited features', 0.00, 0.00, 'Access to sample tests\nBasic score tracking', TRUE),
('Standard', 'Full access to all practice tests and basic features', 14.99, 149.99, 'All practice tests\nDetail score reports\nBasic study plans', TRUE),
('Premium', 'Complete access to all features and premium content', 24.99, 249.99, 'All Standard features\nCustomized study plans\nOne-on-one tutoring sessions\nAdvanced analytics', TRUE); 