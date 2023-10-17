import PaymentGateway from "../../application/gateway/PaymentGateway";
import HttpClient from "../http/HttpClient";

export default class PaymentGatewayHttp implements PaymentGateway {

	constructor (readonly httpClient: HttpClient) {
	}

	async process(input: any): Promise<any> {
		return this.httpClient.post(`http://localhost:3002/process_payment`, input);
	}

}
