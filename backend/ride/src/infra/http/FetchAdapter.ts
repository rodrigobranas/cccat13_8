import HttpClient from "./HttpClient";
import fetch from "node-fetch";

export default class FetchAdapter implements HttpClient {

	async get(url: string): Promise<any> {
		// if (url.includes("localhost")) throw new Error("only in production");
		const response = await fetch(url);
		return response.json();
	}

	async post(url: string, data: any): Promise<any> {
		// if (url.includes("localhost")) throw new Error("only in production");
		const response = await fetch(url, {
			method: "post",
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json'}
		});
		return response.json();
	}

}
