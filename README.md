<<<<<<< HEAD
# 🌿 Bonsai Prep

Personalized SAT Prep That Grows With You.

## Overview

Bonsai Prep is a SaaS platform offering personalized SAT preparation. It differentiates itself by using students' actual practice test results to create customized learning paths featuring video lessons from expert tutors. The core value proposition is efficient, targeted learning based on identified weaknesses, visualizing progress through a metaphorical growing bonsai tree.

## Features

- **Score Report Upload**: Upload your official College Board SAT practice test score reports.
- **Personalized Learning**: Get a custom learning path based on your specific weaknesses.
- **Expert Video Lessons**: Watch targeted video lessons from expert tutors.
- **Visual Progress Tracking**: See your growth represented as a bonsai tree that grows with your mastery.
- **Practice Questions**: Reinforce your learning with curated practice questions.

## Project Structure

The project is divided into two main components:

### Frontend (`/frontend`)

A React application built with:
- TypeScript
- React Router for navigation
- Material UI for components
- Axios for API calls

### Backend (`/backend`)

A Node.js application built with:
- Express.js
- TypeScript
- MongoDB (via Mongoose)
- PDF parsing for score reports

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/bonsai-prep.git
   cd bonsai-prep
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd frontend
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Backend API

The main API endpoints include:

- **POST /api/reports/upload**: Upload a score report PDF
- **GET /api/reports/:reportId**: Get a specific report
- **GET /api/skills/user**: Get skills for the current user
- **GET /api/videos/recommended**: Get recommended videos

### Frontend Pages

- **Home**: Landing page with product info
- **Login/Signup**: Authentication pages
- **Dashboard**: Main user interface after login
- **Upload**: Upload score report
- **Lessons**: View and watch video lessons
- **Practice**: Answer practice questions

## License

[MIT License](LICENSE)

## Acknowledgments

- College Board for SAT practice tests
- All the expert tutors who contributed to the video lessons
- Icon made by Freepik from www.flaticon.com 
=======
# bonsaiapp
>>>>>>> a6d5ab6156ad58b0fd3c9bf85113bab5e88dd4a7
