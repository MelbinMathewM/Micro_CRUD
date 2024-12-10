import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'notification_queue';

export const sendNotification = async (type, recipient, message) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    const notification = {
      type,
      recipient,
      message,
    };

    // Send the notification to RabbitMQ queue
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(notification)), { persistent: true });
    console.log('Notification sent:', notification);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const publishMessage = async (exchange, routingKey, event) => {
  try{
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'direct', { durable: true });

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(event)), { persistent : true })

    console.log(`Event published to exchange "${exchange}" with routing key "${routingKey}":`, event);

    setTimeout(() => {
      channel.close();
      connection.close();
    } , 500);

  }catch(err){
    console.error('Error publishing event:', err);
  }
}
