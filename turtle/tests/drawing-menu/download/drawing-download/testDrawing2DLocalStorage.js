import { Drawing2DLocalStorage } from '../../../../modules/drawing-menu/download/drawing-download/Drawing2DLocalStorage.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testGetFileFormatMime(logger) {
	let result = Drawing2DLocalStorage.getFileFormatMime();
	if (result !== null && typeof result !== 'string')
		logger(`Expected a string or null but got ${result}`);
	if (result === null)
		result = 'image/xml+svg';
	Drawing2DLocalStorage.saveFileFormatMime(result);
}

export function testDrawing2DLocalStorage(logger) {
	wrapAndCall([
		testGetFileFormatMime
	], logger);
};