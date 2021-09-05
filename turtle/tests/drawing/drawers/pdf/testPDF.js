import { testFindFont } from './testFindFont.js';
import { testGetBestOrientation } from './testGetBestOrientation.js';
import { testGetJSPDFFormat } from './testGetJSPDFFormat.js';
import { testIsDrawableToPDF } from './testIsDrawableToPDF.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPDF(logger) {
	wrapAndCall([
		testFindFont,
		testGetBestOrientation,
		testGetJSPDFFormat,
		testIsDrawableToPDF
	], logger);
};