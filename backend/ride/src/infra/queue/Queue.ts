export default interface Queue {
	publish (queue: string, input: any): Promise<void>;
	consume (queue: string, callback: Function): Promise<void>;
}
