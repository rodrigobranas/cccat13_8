import HttpServer from "../http/HttpServer";
import RequestRide from "../../application/usecase/RequestRide";
import GetRide from "../../application/usecase/GetRide";
import StartRide from "../../application/usecase/StartRide";
import AcceptRide from "../../application/usecase/AcceptRide";
import Registry from "../di/Registry";
import inject from "../di/Inject";
import Queue from "../queue/Queue";

// interface adapter
export default class MainController {
	@inject("requestRide")
	requestRide?: RequestRide;
	@inject("getRide")
	getRide?: GetRide;
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("queue")
	queue?: Queue

	constructor (
	) {

		this.httpServer?.on("post", "/request_ride", async function (params: any, body: any) {
			const output = await Registry.getInstance().inject("requestRide").execute(body);
			return output;
		});

		// command handler - tempo de processamento (SLA), resiliente
		this.httpServer?.on("post", "/request_ride_async", async (params: any, body: any) => {
			await this.queue?.publish("requestRide", body);
		});

		this.httpServer?.on("get", "/rides/:rideId", async function (params: any, body: any) {
			const output = await Registry.getInstance().inject("getRide").execute(params.rideId);
			return output;
		});
	}
}
