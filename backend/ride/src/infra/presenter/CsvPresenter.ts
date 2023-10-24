import Presenter from "../../application/presenter/Presenter";

export default class CsvPresenter implements Presenter {

	present(data: any) {
		const lines = [];
		const [firstElement] = data;
		const header = [];
		for (const key in firstElement) {
			header.push(key);
		}
		lines.push(header.join(";"));
		for (const element of data) {
			const line = [];
			for (const key in element) {
				line.push(element[key]);
			}
			lines.push(line.join(";"));
		}
		return lines;
	}

}