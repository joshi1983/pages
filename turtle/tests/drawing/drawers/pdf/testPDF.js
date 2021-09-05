import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testFindFont } from './testFindFont.js';
import { testGetBestOrientation } from './testGetBestOrientation.js';
import { testGetJSPDFFormat } from './testGetJSPDFFormat.js';
import { testIsDrawableToPDF } from './testIsDrawableToPDF.js';

export function testPDF(logger) {
	testFindFont(prefixWrapper('testFindFont', logger));
	testGetBestOrientation(prefixWrapper('testGetBestOrientation', logger));
	testGetJSPDFFormat(prefixWrapper('testGetJSPDFFormat', logger));
	testIsDrawableToPDF(prefixWrapper('testIsDrawableToPDF', logger));
};