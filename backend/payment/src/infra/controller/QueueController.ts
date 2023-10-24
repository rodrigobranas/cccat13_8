import ProcessPayment from "../../application/usecase/ProcessPayment";
import inject from "../di/Inject";
import Queue from "../queue/Queue";

export default class QueueController {
	@inject("processPayment")
	processPayment?: ProcessPayment
	@inject("queue")
	queue?: Queue

	constructor () {
		this.queue?.consume("rideFinished", "rideFinished.processPayment", async (input: any) => {
			await this.processPayment?.execute(input);
		});
	}
}
