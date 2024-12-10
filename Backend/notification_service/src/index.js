import express from "express";
import dotenv from 'dotenv';
import startNotificationService from "./services/notificationService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Notification Service is running!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

startNotificationService();

// Start the HTTP server and RabbitMQ consumer
app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
  });