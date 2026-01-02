require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const { connectDB, connectRedis } = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Databases
connectDB();
let redisClient;
(async () => {
  redisClient = await connectRedis();
})();

// Socket.io
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('BrandShield User Backend Running');
});

// Proxy endpoint to trigger AI analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://backend-ai:8000';
    
    // Call AI Service
    const response = await axios.post(`${aiServiceUrl}/analyze`, req.body);
    const data = response.data;

    // If Red Alert, broadcast to sockets
    if (data.forecast && data.forecast.alert_level === 'RED') {
      io.emit('alert', data);
      
      // Store alert in MongoDB (Simplified)
      // const Alert = require('./models/Alert');
      // await Alert.create(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error calling AI service:', error.message);
    res.status(500).json({ error: 'Failed to analyze data' });
  }
});

// Webhook for AI service to push alerts directly (optional)
app.post('/api/webhook/alert', (req, res) => {
  const alertData = req.body;
  io.emit('alert', alertData);
  res.status(200).send('Alert received');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
