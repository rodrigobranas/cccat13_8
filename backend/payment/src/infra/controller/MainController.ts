import HttpServer from "../http/HttpServer";
import Registry from "../di/Registry";
import inject from "../di/Inject";
import ProcessPayment from "../../application/usecase/ProcessPayment";

// interface adapter
export default class MainController {
	@inject("processPayment")
	processPayment?: ProcessPayment
	@inject("httpServer")
	httpServer?: HttpServer

	constructor (
	) {
		this.httpServer?.on("post", "/process_payment", async (params: any, body: any) => {
			const output = await this.processPayment?.execute(body);
			return output;
		});
	}
}
