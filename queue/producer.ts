import amqp from "amqplib";

async function main () {
	const connection = await amqp.connect("amqp://localhost");
	const channel = await connection.createChannel();
	channel.assertQueue("test", { durable: true });
	const input = {
		rideId: "1234566789",
		fare: 10
	}
	channel.sendToQueue("test", Buffer.from(JSON.stringify(input)));
}

main();
