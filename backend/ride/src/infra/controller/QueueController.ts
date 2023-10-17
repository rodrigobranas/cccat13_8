import RequestRide from "../../application/usecase/RequestRide";
import inject from "../di/Inject";
import Queue from "../queue/Queue";

export default class QueueController {
	@inject("queue")
	queue?: Queue
	@inject("requestRide")
	requestRide?: RequestRide

	constructor () {
		this.queue?.consume("requestRide", async (input: any) => {
			await this.requestRide?.execute(input);
		});
	}
}