import GetAccount from "../../application/usecase/GetAccount";
import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecase/Signup";
import RequestRide from "../../application/usecase/RequestRide";
import GetRide from "../../application/usecase/GetRide";
import StartRide from "../../application/usecase/StartRide";
import AcceptRide from "../../application/usecase/AcceptRide";
import Registry from "../di/Registry";
import inject from "../di/Inject";

// interface adapter
export default class MainController {
	@inject("signup")
	signup?: Signup;
	@inject("requestRide")
	requestRide?: RequestRide;
	@inject("getAccount")
	getAccount?: GetAccount;
	@inject("getRide")
	getRide?: GetRide;
	@inject("httpServer")
	httpServer?: HttpServer;

	constructor (
	) {
		this.httpServer?.on("post", "/signup", async (params: any, body: any) => {
			const output = await this.signup?.execute(body);
			return output;
		});

		this.httpServer?.on("post", "/request_ride", async function (params: any, body: any) {
			const output = await Registry.getInstance().inject("requestRide").execute(body);
			return output;
		});

		this.httpServer?.on("get", "/accounts/:accountId", async function (params: any, body: any) {
			const output = await Registry.getInstance().inject("getAccount").execute(params.accountId);
			return output;
		});

		this.httpServer?.on("get", "/rides/:rideId", async function (params: any, body: any) {
			const output = await Registry.getInstance().inject("getRide").execute(params.rideId);
			return output;
		});
	}
}
