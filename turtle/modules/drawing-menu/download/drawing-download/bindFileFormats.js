import { Drawing2DLocalStorage } from './Drawing2DLocalStorage.js';
import { FileExtensions } from '../FileExtensions.js';

const selectID = 'drawing-previewer-file-format';

function getSelect() {
	return document.getElementById(selectID);
}

export function getMime() {
	const selectElement = getSelect();
	return selectElement.value;
};

export function bindFileFormats(mimeListener) {
	const selectElement = getSelect();
	const initialFormatMime = Drawing2DLocalStorage.getFileFormatMime();
	FileExtensions.addOptionsToSelect(selectElement, function(fileFormat) {
		return fileFormat.mime.startsWith('image');
	});
	if (initialFormatMime !== null) {
		selectElement.value = initialFormatMime;
	}
	selectElement.addEventListener('change', function() {
		mimeListener(selectElement.value);
		Drawing2DLocalStorage.saveFileFormatMime(selectElement.value);
	});
};