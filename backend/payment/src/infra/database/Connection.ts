export default interface Connection {
	query (statement: string, data: any): Promise<any>;
	close (): Promise<void>;
}
