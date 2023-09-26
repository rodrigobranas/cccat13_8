import { mount } from "@vue/test-utils";
import SignupView from "../../src/view/SignupView.vue";
import RideGateway from "../../src/infra/gateway/RideGateway";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import RideGatewayHttp from "../../src/infra/gateway/RideGatewayHttp";

function sleep (time: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
}

test("Deve criar um passeiro", async function () {
	const wrapper = mount(SignupView, {
		global: {
			provide: {
				rideGateway: new RideGatewayHttp(new AxiosAdapter())
			}
		}
	});
	expect(wrapper.get(".signup-title").text()).toBe("Signup");
	wrapper.get(".signup-name").setValue("John Doe");
	wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
	wrapper.get(".signup-cpf").setValue("95818705552");
	wrapper.get(".signup-is-passenger").setValue(true);
	await wrapper.get(".signup-submit").trigger("click");
	await sleep(200);
	expect(wrapper.get(".signup-account-id").text()).toHaveLength(36);
	console.log("accountId-signup", wrapper.get(".signup-account-id").text());
});

test("Não deve criar um passeiro se o cpf estiver inválido", async function () {
	const wrapper = mount(SignupView, {
		global: {
			provide: {
				rideGateway: new RideGatewayHttp(new AxiosAdapter())
			}
		}
	});
	expect(wrapper.get(".signup-title").text()).toBe("Signup");
	wrapper.get(".signup-name").setValue("John Doe");
	wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
	wrapper.get(".signup-cpf").setValue("95818705553");
	wrapper.get(".signup-is-passenger").setValue(true);
	await wrapper.get(".signup-submit").trigger("click");
	await sleep(200);
	expect(wrapper.get(".signup-error").text()).toBe("Invalid cpf");
});

test("Não deve criar um passeiro se o nome estiver inválido", async function () {
	const wrapper = mount(SignupView, {
		global: {
			provide: {
				rideGateway: new RideGatewayHttp(new AxiosAdapter())
			}
		}
	});
	expect(wrapper.get(".signup-title").text()).toBe("Signup");
	wrapper.get(".signup-name").setValue("John");
	wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
	wrapper.get(".signup-cpf").setValue("95818705552");
	wrapper.get(".signup-is-passenger").setValue(true);
	await wrapper.get(".signup-submit").trigger("click");
	await sleep(200);
	expect(wrapper.get(".signup-error").text()).toBe("Invalid name");
});

test("Não deve criar um passeiro se o nome estiver inválido", async function () {
	const wrapper = mount(SignupView, {
		global: {
			provide: {
				rideGateway: new RideGatewayHttp(new AxiosAdapter())
			}
		}
	});
	expect(wrapper.get(".signup-title").text()).toBe("Signup");
	wrapper.get(".signup-name").setValue("John Doe");
	wrapper.get(".signup-email").setValue(`john.doe${Math.random()}`);
	wrapper.get(".signup-cpf").setValue("95818705552");
	wrapper.get(".signup-is-passenger").setValue(true);
	await wrapper.get(".signup-submit").trigger("click");
	await sleep(200);
	expect(wrapper.get(".signup-error").text()).toBe("Invalid email");
});

test("Não deve criar um passeiro se o email estiver duplicado", async function () {
	const wrapper = mount(SignupView, {
		global: {
			provide: {
				rideGateway: new RideGatewayHttp(new AxiosAdapter())
			}
		}
	});
	expect(wrapper.get(".signup-title").text()).toBe("Signup");
	wrapper.get(".signup-name").setValue("John Doe");
	wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
	wrapper.get(".signup-cpf").setValue("95818705552");
	wrapper.get(".signup-is-passenger").setValue(true);
	await wrapper.get(".signup-submit").trigger("click");
	await sleep(200);
	await wrapper.get(".signup-submit").trigger("click");
	await sleep(200);
	expect(wrapper.get(".signup-error").text()).toBe("Account already exists");
});

test("Deve criar um passeiro usando fake", async function () {
	const rideGateway: RideGateway = {
		async signup(input: any): Promise<any> {
			return { accountId: "2ee3d42b-0b9a-4acb-afcd-7ee16f5ab6b8" };
		},
		requestRide: function (input: any): Promise<any> {
			throw new Error("Function not implemented.");
		},
		getRide: function (rideId: string): Promise<any> {
			throw new Error("Function not implemented.");
		}
	}
	const wrapper = mount(SignupView, {
		global: {
			provide: {
				rideGateway
			}
		}
	});
	expect(wrapper.get(".signup-title").text()).toBe("Signup");
	wrapper.get(".signup-name").setValue("John Doe");
	wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
	wrapper.get(".signup-cpf").setValue("95818705552");
	wrapper.get(".signup-is-passenger").setValue(true);
	await wrapper.get(".signup-submit").trigger("click");
	// await sleep(200);
	expect(wrapper.get(".signup-account-id").text()).toHaveLength(36);
});

test("Não deve criar um passeiro com nome inválido usando fake", async function () {
	const rideGateway: RideGateway = {
		async signup(input: any): Promise<any> {
			throw new Error("Invalid name");
		},
		requestRide: function (input: any): Promise<any> {
			throw new Error("Function not implemented.");
		},
		getRide: function (rideId: string): Promise<any> {
			throw new Error("Function not implemented.");
		}
	}
	const wrapper = mount(SignupView, {
		global: {
			provide: {
				rideGateway
			}
		}
	});
	expect(wrapper.get(".signup-title").text()).toBe("Signup");
	wrapper.get(".signup-name").setValue("John Doe");
	wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
	wrapper.get(".signup-cpf").setValue("95818705552");
	wrapper.get(".signup-is-passenger").setValue(true);
	await wrapper.get(".signup-submit").trigger("click");
	// await sleep(200);
	expect(wrapper.get(".signup-error").text()).toBe("Invalid name");	
});

test("Deve criar um motorista", async function () {
	const wrapper = mount(SignupView, {
		global: {
			provide: {
				rideGateway: new RideGatewayHttp(new AxiosAdapter())
			}
		}
	});
	expect(wrapper.get(".signup-title").text()).toBe("Signup");
	wrapper.get(".signup-name").setValue("John Doe");
	wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
	wrapper.get(".signup-cpf").setValue("95818705552");
	wrapper.get(".signup-car-plate").setValue("AAA9999");
	wrapper.get(".signup-is-passenger").setValue(false);
	wrapper.get(".signup-is-driver").setValue(true);
	await wrapper.get(".signup-submit").trigger("click");
	await sleep(200);
	expect(wrapper.get(".signup-account-id").text()).toHaveLength(36);
});
