import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testDrawingToSVGText } from './testDrawingToSVGText.js';
import { testGetPostScriptDataURL } from './testGetPostScriptDataURL.js';
import { testResolutionsJSON } from './testResolutionsJSON.js';

export function testDrawingDownload(logger) {
	testDrawingToSVGText(prefixWrapper('testDrawingToSVGText', logger));
	testGetPostScriptDataURL(prefixWrapper(' testGetPostScriptDataURL', logger));
	testResolutionsJSON(prefixWrapper('testResolutionsJSON', logger));
};