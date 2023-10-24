export default interface Connection {
	query (statement: string, data: any, transactional: boolean): Promise<any>;
	close (): Promise<void>;
}
