# Bonsai Prep SAT Score Report Analyzer

This backend system processes SAT score reports uploaded by students, analyzes their performance, and generates personalized practice questions using AI.

## Features

- **Enhanced PDF Processing**: Upload and process SAT score reports with robust PDF text extraction
- **OCR Capabilities**: Automatically applies OCR (Optical Character Recognition) when needed for image-based PDFs
- **AI-Powered Practice**: Generates personalized practice questions using Google's Gemini API based on the student's performance
- **Customizable Questions**: Control the number and difficulty of AI-generated practice questions

## Getting Started

### Prerequisites

- Node.js v18+ and npm
- MongoDB (local or remote)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/bonsai-prep.git
cd bonsai-prep/backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=3001
DB_URI=mongodb://localhost:27017/bonsai-prep
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
UPLOAD_DIR=uploads
```

Replace `your-gemini-api-key` with your actual Google Gemini API key. You can obtain one from [Google AI Studio](https://makersuite.google.com/).

4. Start the development server
```bash
npm run dev
```

## API Endpoints

### Upload Score Report
- **POST** `/api/score-reports/upload`
- **Description**: Uploads and processes a PDF score report
- **Parameters**:
  - `scoreReport` (file): The PDF file to upload
  - `generateQuestions` (boolean): Whether to generate AI practice questions
  - `questionCount` (number): Number of practice questions to generate (default: 10)
- **Response**: JSON containing the processed report data and AI-generated questions (if requested)

### Generate Questions for Existing Report
- **POST** `/api/score-reports/generate-questions/:reportId`
- **Description**: Generates new practice questions for an existing report
- **URL Parameters**:
  - `reportId`: ID of the existing score report
- **Body Parameters**:
  - `questionCount` (number): Number of practice questions to generate (default: 10)
- **Response**: JSON containing the generated questions

### Get Score Report
- **GET** `/api/score-reports/:reportId`
- **Description**: Retrieves a specific score report with its questions
- **URL Parameters**:
  - `reportId`: ID of the score report to retrieve
- **Response**: JSON with the report data and practice questions

## Technologies Used

- **Express.js**: Web framework for the API
- **Mongoose**: MongoDB object modeling
- **Multer**: File upload handling
- **pdf.js-extract**: PDF text extraction
- **Tesseract.js**: OCR for image-based PDFs
- **Google Gemini API**: AI model for generating practice questions

## Development

### Running Tests

Test the Gemini API integration:
```bash
npx ts-node src/tests/testGeminiIntegration.ts
```

## Troubleshooting

### Common Issues

1. **PDF Parsing Errors**: If the system fails to extract text from a PDF, it will automatically attempt OCR. However, some heavily image-based PDFs may still be challenging to process.

2. **API Key Issues**: If you see authorization errors, ensure your Gemini API key is correctly set in the `.env` file.

3. **Question Generation Fails**: The Gemini API has rate limits and token limits. If generating many questions, consider reducing the count or implementing retry logic.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 