import amqp from 'amqplib';

export const publishMessage = async (exchange, routingKey, event) => {
    try{
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
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