import UpdateRideProjection from "../../application/handler/UpdateRideProjection";
import inject from "../di/Inject";
import Queue from "../queue/Queue";

export default class QueueController {
	@inject("queue")
	queue?: Queue
	@inject("updateRideProjection")
	updateRideProjection?: UpdateRideProjection;

	constructor () {
		this.queue?.consume("rideFinished", "rideFinished.updateRideProjection", async (input: any) => {
			await this.updateRideProjection?.execute(input);
		});
	}
}