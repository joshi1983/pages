import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testDrawing2DLocalStorage } from './testDrawing2DLocalStorage.js';
import { testDrawingToSVGText } from './testDrawingToSVGText.js';
import { testGetPostScriptDataURL } from './testGetPostScriptDataURL.js';
import { testResolutionsJSON } from './testResolutionsJSON.js';

export function testDrawingDownload(logger) {
	testDrawing2DLocalStorage(prefixWrapper('testDrawing2DLocalStorage', logger));
	testDrawingToSVGText(prefixWrapper('testDrawingToSVGText', logger));
	testGetPostScriptDataURL(prefixWrapper(' testGetPostScriptDataURL', logger));
	testResolutionsJSON(prefixWrapper('testResolutionsJSON', logger));
};