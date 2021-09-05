import { PDFLocalStorage } from '../../../../modules/drawing-menu/download/pdf/PDFLocalStorage.js';

export function testPDFLocalStorage(logger) {
	const select = document.createElement('select');
	const checkbox = document.createElement('input');
	checkbox.setAttribute('type', 'checkbox');
	PDFLocalStorage.load(select, checkbox);
	PDFLocalStorage.save(select, checkbox);
	try {
		JSON.parse(localStorage.getItem('pdf-download'));
	}
	catch (e) {
		logger(`Expected to parse JSON but got error: ${e} while parsing "${localStorage.getItem('pdf-download')}"`);
	}
};