import amqp from 'amqplib';
import User from '../models/userModel.js'

export const consumeMessages = async (exchange, routingKey) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel(); //hello

        await channel.assertExchange(exchange, 'direct', { durable: true });

        const queue = 'user-events-us';
        await channel.assertQueue(queue, { durable: true });

        await channel.bindQueue(queue, exchange, routingKey);

        console.log('Admin Service is waiting for messages...');
        
        channel.consume(queue, async (message) => {
            if (message !== null) {
                const event = JSON.parse(message.content.toString());
                console.log('Received message:', event);

                switch(event.type){
                    case 'USER_ADDED':
                        const { userId, name, username, email, hashedPassword } = event.payload;
                        const user = await User.findById(userId);
                        if(!user){
                            const userData = new User({ _id : userId, name, username, email, password : hashedPassword });
                            await userData.save();
                            console.log('add')
                        }
                        break;
                    case 'USER_UPDATED':
                        await User.findByIdAndUpdate(event.payload._id, event.payload);
                        console.log('edit')
                        break;
                    case 'USER_DELETED':
                        await User.findByIdAndDelete(event.payload.userId);
                        console.log('delete')
                        break;
                    default:
                        console.warn('Unknown event type:', event.type);
                }

                channel.ack(message);
            }
        });
    } catch (err) {
        console.error(err);
    }
};