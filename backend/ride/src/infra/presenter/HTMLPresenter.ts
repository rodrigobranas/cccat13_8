import Presenter from "../../application/presenter/Presenter";

export default class HTMLPresenter implements Presenter {

	present(data: any) {
		let html = `<table><thead><tr>`;
		const [firstElement] = data;
		for (const key in firstElement) {
			html += `<td>${key}</td>`;
		}
		html += `</tr></thead><tbody>`;
		for (const element of data) {
			html += `<tr>`;
			for (const key in element) {
				html += `<td>${element[key]}</td>`;
			}
			html += `</tr>`;
		}
		html += `</tbody></table>`;
		return html;
	}

}