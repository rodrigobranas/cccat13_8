import GetAccount from "../../application/usecase/GetAccount";
import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecase/Signup";

// interface adapter
export default class MainController {

	constructor (readonly httpServer: HttpServer, signup: Signup, getAccount: GetAccount) {
		httpServer.on("post", "/signup", async function (params: any, body: any) {
			const output = await signup.execute(body);
			return output;
		});

		httpServer.on("get", "/accounts/:accountId", async function (params: any, body: any) {
			const output = await getAccount.execute(params.accountId);
			return output;
		});
	}
}
