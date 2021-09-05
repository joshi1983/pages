import { testDrawing2DLocalStorage } from './testDrawing2DLocalStorage.js';
import { testDrawingToSVGText } from './testDrawingToSVGText.js';
import { testGetPostScriptDataURL } from './testGetPostScriptDataURL.js';
import { testResolutionsJSON } from './testResolutionsJSON.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testDrawingDownload(logger) {
	wrapAndCall([
		testDrawing2DLocalStorage,
		testDrawingToSVGText,
		testGetPostScriptDataURL,
		testResolutionsJSON
	], logger);
};