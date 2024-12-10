import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'notification_queue';

// Function to create RabbitMQ connection
const createRabbitMQConnection = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    process.exit(1); 
  }
};

export default createRabbitMQConnection;
