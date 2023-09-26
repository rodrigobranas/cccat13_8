import { mount } from "@vue/test-utils";
import SignupView from "../../src/view/SignupView.vue";
import RequestRideView from "../../src/view/RequestRideView.vue";
import GetRideView from "../../src/view/GetRideView.vue";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import RideGatewayHttp from "../../src/infra/gateway/RideGatewayHttp";
import GeolocationGatewayBrowser from "../../src/infra/gateway/GeolocationGatewayBrowser";
import GeolocationGateway from "../../src/infra/gateway/GeolocationGateway";

function sleep (time: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
}

test("Deve solicitar uma corrida", async function () {
	const wrapperSignupView = mount(SignupView, {
		global: {
			provide: {
				rideGateway: new RideGatewayHttp(new AxiosAdapter())
			}
		}
	});
	wrapperSignupView.get(".signup-name").setValue("John Doe");
	wrapperSignupView.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
	wrapperSignupView.get(".signup-cpf").setValue("95818705552");
	wrapperSignupView.get(".signup-is-passenger").setValue(true);
	await wrapperSignupView.get(".signup-submit").trigger("click");
	await sleep(200);
	const accountId = wrapperSignupView.get(".signup-account-id").text();
	console.log(accountId);
	const geolocationGateway: GeolocationGateway = {
		async getGeolocation (): Promise<any> {
			return {
				lat: -27.584905257808835,
				long: -48.545022195325124
			}
		}
	}
	const wrapperRequestRideView = mount(RequestRideView, {
		global: {
			provide: {
				rideGateway: new RideGatewayHttp(new AxiosAdapter()),
				geolocationGateway
			}
		}
	});
	expect(wrapperRequestRideView.get(".request-ride-title").text()).toBe("Request Ride");
	wrapperRequestRideView.get(".request-ride-passenger-id").setValue(accountId);
	wrapperRequestRideView.get(".request-ride-from-lat").setValue(-27.584905257808835);
	wrapperRequestRideView.get(".request-ride-from-long").setValue(-48.545022195325124);
	wrapperRequestRideView.get(".request-ride-to-lat").setValue(-27.496887588317275);
	wrapperRequestRideView.get(".request-ride-to-long").setValue(-48.522234807851476);
	await wrapperRequestRideView.get(".request-ride-submit").trigger("click");
	await sleep(200);
	expect(wrapperRequestRideView.get(".request-ride-ride-id").text()).toHaveLength(36);
	const rideId = wrapperRequestRideView.get(".request-ride-ride-id").text();
	const wrapperGetRideView = mount(GetRideView, {
		global: {
			provide: {
				rideGateway: new RideGatewayHttp(new AxiosAdapter())
			}
		}
	});
	wrapperGetRideView.get(".get-ride-ride-id").setValue(rideId);
	await wrapperGetRideView.get(".get-ride-submit").trigger("click");
	await sleep(200);
	expect(wrapperGetRideView.get(".get-ride-passenger-name").text()).toBe("John Doe");
	expect(wrapperGetRideView.get(".get-ride-status").text()).toBe("requested");
	console.log("rideId", rideId);
});