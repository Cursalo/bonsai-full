"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./utils/db");
// Import routes
const scoreReportRoutes_1 = __importDefault(require("./routes/scoreReportRoutes"));
// Load environment variables
dotenv_1.default.config();
// Create Express server
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Basic route
app.get('/', (req, res) => {
    res.send('Bonsai Prep API is running');
});
// Apply routes
app.use('/api/reports', scoreReportRoutes_1.default);
// Connect to MySQL database
(0, db_1.testConnection)()
    .then((connected) => {
    if (connected) {
        console.log('MySQL connection successful');
    }
    else {
        console.error('MySQL connection failed - app may not function correctly');
    }
})
    .catch(err => console.error('MySQL connection error:', err));
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
exports.default = app;
