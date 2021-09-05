import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testPDFLocalStorage } from './testPDFLocalStorage.js';

export function testPDF(logger) {
	testPDFLocalStorage(prefixWrapper('testPDFLocalStorage', logger));
};