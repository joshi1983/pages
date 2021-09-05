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
	FileExtensions.addOptionsToSelect(selectElement, function(fileFormat) {
		return fileFormat.mime.startsWith('image');
	});
	selectElement.addEventListener('change', function() {
		mimeListener(selectElement.value);
	});
};