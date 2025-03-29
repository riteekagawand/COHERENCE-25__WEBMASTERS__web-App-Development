const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Add CORS
const trafficRoutes = require('./routes/trafficRoute'); // Note: trafficRoute (singular) matches your file name
const utilityRoutes = require('./routes/utilityRoute'); // Note: utilityRoute (singular) matches your file name
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Enable CORS to allow requests from http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type'], // Allowed headers
}));

app.use(express.json());

app.use('/api/traffic', trafficRoutes);
app.use('/api/utilities', utilityRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});