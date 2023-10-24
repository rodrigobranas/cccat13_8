export default interface Queue {
	publish (exchange: string, input: any): Promise<void>;
	consume (exhange: string, queue: string, callback: Function): Promise<void>;
}
