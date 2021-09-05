import { Drawing2DLocalStorage } from './Drawing2DLocalStorage.js';
import { FileExtensions } from '../FileExtensions.js';

const selectID = 'drawing-previewer-file-format';

function getSelect() {
	return document.getElementById(selectID);
}

function getDefaultMime() {
	const imageFormats = FileExtensions.getAll().filter(isImageFormat);
	const preferred = imageFormats.filter(f => f.mime.indexOf('jpeg') !== -1);
	if (preferred.length !== 0)
		return preferred[0].mime;
	return imageFormats[0].mime;
}

export function getMime() {
	const selectElement = getSelect();
	return selectElement.value;
};

function isImageFormat(fileFormat) {
	return fileFormat.mime.startsWith('image');
}

export function bindFileFormats(mimeListener) {
	const selectElement = getSelect();
	let initialFormatMime = Drawing2DLocalStorage.getFileFormatMime();
	FileExtensions.addOptionsToSelect(selectElement, isImageFormat);
	if (initialFormatMime === null)
		initialFormatMime = getDefaultMime();
	if (initialFormatMime !== null) {
		selectElement.value = initialFormatMime;
	}
	selectElement.addEventListener('change', function() {
		mimeListener(selectElement.value);
		Drawing2DLocalStorage.saveFileFormatMime(selectElement.value);
	});
};