import axios from "axios";
import AccountGatewayHttp from "../../src/infra/gateway/AccountGatewayHttp";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import PaymentGatewayHttp from "../../src/infra/gateway/PaymentGatewayHttp";

test.skip("Deve criar uma conta de passageiro", async function () {
	const httpClient = new AxiosAdapter();
	const paymentGateway = new PaymentGatewayHttp(httpClient);
	const inputProcessPayment = {
		rideId: "123456789",
		fare: 10
	}
	const outputProcessPayment = await paymentGateway.process(inputProcessPayment);
	expect(outputProcessPayment.status).toBe("approved");
});
