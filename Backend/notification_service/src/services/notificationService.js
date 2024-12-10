import createRabbitMQConnection from '../config/rabbitmq.js';
import sendEmailNotification from '../config/nodemailer.js';



const processNotification = async (msg) => {
  const content = JSON.parse(msg.content.toString());
  const { type, recipient, message } = content;

  console.log(type, recipient, message, 'Received Notification');
  switch (type) {
    case 'email':
      sendEmailNotification(recipient, 'New Notification', message);
      console.log('Email notification sent');
      return;
    default:
      console.log(`Unknown notification type: ${type}`);
      throw new Error('Unknown notification type');
  }
};

const startNotificationService = async () => {
  const channel = await createRabbitMQConnection();

  console.log('Notification Service is listening for messages...');
  channel.consume('notification_queue', async (msg) => {
    if (msg) {
      try {
        console.log('Received message:', msg.content.toString());
        await processNotification(msg);
        channel.ack(msg);
        console.log('Notification processed successfully.');
      } catch (error) {
        console.error('Error processing notification:', error);
        channel.nack(msg);
      }
    }
  });
};


export default startNotificationService;

