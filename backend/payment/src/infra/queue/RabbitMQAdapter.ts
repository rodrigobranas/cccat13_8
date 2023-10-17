import Queue from "./Queue";
import amqp from "amqplib";

export default class RabbitMQAdapter implements Queue {
	
	async publish(queue: string, input: any): Promise<void> {
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();
		channel.assertQueue(queue, { durable: true });
		channel.sendToQueue(queue, Buffer.from(JSON.stringify(input)));
	}

	async consume(queue: string, callback: Function): Promise<void> {
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();
		channel.assertQueue(queue, { durable: true });
		channel.consume(queue, async function (msg: any) {
			const input = msg.content.toString();
			await callback(input);
			channel.ack(msg);
		});
	}

}