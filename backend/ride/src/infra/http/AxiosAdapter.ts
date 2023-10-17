import axios from "axios";
import HttpClient from "./HttpClient";

export default class AxiosAdapter implements HttpClient {
	
	async get(url: string): Promise<any> {
		try {
			const response = await axios.get(url);
			return response.data;
		} catch (e: any) {
			throw new Error(e.response.data.message);
		}
	}

	async post(url: string, data: any): Promise<any> {
		try {
			const response = await axios.post(url, data);
			return response.data;
		} catch (e: any) {
			throw new Error(e.response.data.message);
		}
	}

}