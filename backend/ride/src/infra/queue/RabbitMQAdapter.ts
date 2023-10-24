import Queue from "./Queue";
import amqp from "amqplib";

export default class RabbitMQAdapter implements Queue {
	
	async publish(exchange: string, input: any): Promise<void> {
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();
		channel.assertExchange(exchange, "direct", { durable: true });
		channel.publish(exchange, "", Buffer.from(JSON.stringify(input)));
	}

	async consume(exchange: string, queue: string, callback: Function): Promise<void> {
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();
		channel.assertExchange(exchange, "direct", { durable: true });
		channel.assertQueue(queue, { durable: true });
		channel.bindQueue(queue, exchange, "");
		channel.consume(queue, async function (msg: any) {
			const input = JSON.parse(msg.content.toString());
			await callback(input);
			channel.ack(msg);
		});
	}

}