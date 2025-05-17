import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { testConnection } from './utils/db';

// Import routes
import scoreReportRoutes from './routes/scoreReportRoutes';

// Load environment variables
dotenv.config();

// Create Express server
const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Bonsai Prep API is running');
});

// Apply routes
app.use('/api/reports', scoreReportRoutes);

// Connect to MySQL database
testConnection()
  .then((connected) => {
    if (connected) {
      console.log('MySQL connection successful');
    } else {
      console.error('MySQL connection failed - app may not function correctly');
    }
  })
  .catch(err => console.error('MySQL connection error:', err));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app; 