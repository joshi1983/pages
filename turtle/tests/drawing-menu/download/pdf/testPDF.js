import { testPDFLocalStorage } from './testPDFLocalStorage.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPDF(logger) {
	wrapAndCall([
		testPDFLocalStorage
	], logger);
};